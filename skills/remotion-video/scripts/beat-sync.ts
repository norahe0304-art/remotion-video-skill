/**
 * [INPUT]: BGM audio file (mp3/wav), ffmpeg on PATH
 * [OUTPUT]: beat-map.json with BPM, beat timestamps, suggested scene cuts
 * [POS]: Standalone CLI script for BGM beat detection + TransitionSeries alignment
 * [PROTOCOL]: Update this header on changes, then check CLAUDE.md
 */

// ================================================================
//  BEAT-SYNC — BGM Beat Detection & Scene Alignment
//  Run: npx tsx scripts/beat-sync.ts <audio-file> [--fps 30]
//
//  Outputs: public/brand/beat-map.json
//  {
//    bpm: number,
//    beatInterval: number,       // frames between beats
//    beats: number[],            // frame numbers of each beat
//    suggestedCuts: number[],    // recommended scene transition frames
//    totalFrames: number,        // at given fps
//  }
// ================================================================

import { execSync } from "child_process";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join, resolve } from "path";

// ----------------------------------------------------------------
//  Config
// ----------------------------------------------------------------

const DEFAULT_FPS = 30;
const TOTAL_DURATION = 40; // seconds
const MIN_SCENE_FRAMES = 90; // 3s minimum per scene
const MAX_SCENE_FRAMES = 300; // 10s maximum per scene

// ----------------------------------------------------------------
//  CLI Args
// ----------------------------------------------------------------

function parseArgs(): { audioPath: string; fps: number } {
  const args = process.argv.slice(2);
  let audioPath = "";
  let fps = DEFAULT_FPS;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--fps" && args[i + 1]) {
      fps = Number(args[i + 1]);
      i++;
    } else if (!args[i].startsWith("--")) {
      audioPath = resolve(args[i]);
    }
  }

  if (!audioPath) {
    console.error("Usage: npx tsx scripts/beat-sync.ts <audio-file> [--fps 30]");
    console.error("Example: npx tsx scripts/beat-sync.ts public/brand/bgm.mp3");
    process.exit(2);
  }

  return { audioPath, fps };
}

// ----------------------------------------------------------------
//  Audio Analysis via ffmpeg
// ----------------------------------------------------------------

function getAudioDuration(audioPath: string): number {
  const result = execSync(
    `ffprobe -v quiet -show_entries format=duration -of csv=p=0 "${audioPath}"`,
    { encoding: "utf-8" },
  ).trim();
  return parseFloat(result);
}

function detectOnsets(audioPath: string): number[] {
  // 使用 ffmpeg 的 silencedetect 反向推断节拍
  // 更准确的方法: 提取音频能量峰值
  try {
    // 方法 1: 使用 astats 获取能量包络, 找峰值
    const result = execSync(
      `ffmpeg -i "${audioPath}" -af "aresample=8000,asplit[a][b];[a]aformat=channel_layouts=mono,showwavespic=s=2000x1:colors=white[wave];[b]anullsink" -frames:v 1 -f rawvideo -pix_fmt gray - 2>/dev/null | od -An -tu1 -w1 -v`,
      { encoding: "utf-8", maxBuffer: 10 * 1024 * 1024 },
    ).trim();

    const values = result.split("\n").map(v => parseInt(v.trim())).filter(v => !isNaN(v));

    if (values.length < 100) {
      return [];
    }

    // 找能量峰值 — 简化的 onset detection
    const windowSize = 20;
    const peaks: number[] = [];
    const duration = getAudioDuration(audioPath);
    const samplesPerSecond = values.length / duration;

    for (let i = windowSize; i < values.length - windowSize; i++) {
      const current = values[i];
      const prevAvg = values.slice(i - windowSize, i).reduce((a, b) => a + b, 0) / windowSize;
      const nextAvg = values.slice(i + 1, i + windowSize + 1).reduce((a, b) => a + b, 0) / windowSize;

      // 峰值: 比前后窗口平均值都高
      if (current > prevAvg * 1.3 && current > nextAvg * 1.1 && current > 100) {
        const timeSeconds = i / samplesPerSecond;
        // 避免过密的峰值 (最少 0.3s 间隔)
        if (peaks.length === 0 || timeSeconds - peaks[peaks.length - 1] > 0.3) {
          peaks.push(timeSeconds);
        }
      }
    }

    return peaks;
  } catch {
    return [];
  }
}

// ----------------------------------------------------------------
//  BPM Estimation
// ----------------------------------------------------------------

function estimateBPM(onsets: number[]): number {
  if (onsets.length < 4) {
    // 回退: 常见 BGM BPM 范围
    return 120;
  }

  // 计算相邻 onset 间隔
  const intervals: number[] = [];
  for (let i = 1; i < onsets.length; i++) {
    intervals.push(onsets[i] - onsets[i - 1]);
  }

  // 找最常见的间隔 (量化到 0.02s 精度)
  const buckets = new Map<number, number>();
  for (const interval of intervals) {
    const quantized = Math.round(interval / 0.02) * 0.02;
    if (quantized >= 0.3 && quantized <= 1.5) { // 40-200 BPM 范围
      buckets.set(quantized, (buckets.get(quantized) || 0) + 1);
    }
  }

  if (buckets.size === 0) return 120;

  // 找最高频间隔
  let bestInterval = 0.5;
  let bestCount = 0;
  for (const [interval, count] of buckets) {
    if (count > bestCount) {
      bestCount = count;
      bestInterval = interval;
    }
  }

  const bpm = Math.round(60 / bestInterval);
  // 限制在合理范围
  return Math.max(60, Math.min(200, bpm));
}

// ----------------------------------------------------------------
//  Scene Cut Suggestions
// ----------------------------------------------------------------

interface BeatMap {
  bpm: number;
  beatIntervalFrames: number;
  beats: number[];
  suggestedCuts: number[];
  totalFrames: number;
  fps: number;
}

function generateBeatMap(bpm: number, fps: number, onsets: number[]): BeatMap {
  const totalFrames = TOTAL_DURATION * fps;
  const beatIntervalSeconds = 60 / bpm;
  const beatIntervalFrames = Math.round(beatIntervalSeconds * fps);

  // ── 生成等间距 beat 网格 ──
  const beats: number[] = [];
  for (let frame = 0; frame < totalFrames; frame += beatIntervalFrames) {
    beats.push(frame);
  }

  // ── 基于 onset 峰值生成场景切换建议 ──
  // 策略: 从 onset 峰值中选取适合作为场景分界的时间点
  const suggestedCuts: number[] = [0]; // 从 0 开始
  let lastCut = 0;

  // 如果有 onset 数据, 用它来对齐
  if (onsets.length > 2) {
    for (const onset of onsets) {
      const frame = Math.round(onset * fps);
      const gap = frame - lastCut;

      if (gap >= MIN_SCENE_FRAMES && gap <= MAX_SCENE_FRAMES && frame < totalFrames - MIN_SCENE_FRAMES) {
        suggestedCuts.push(frame);
        lastCut = frame;
      }
    }
  }

  // 如果 onset 没产生足够的切点, 用 beat 网格补充
  if (suggestedCuts.length < 5) {
    // 6-act 结构的默认分配: Logo(4s) Hook(5s) Reveal(5s) Showcase(14s) Proof(5s) Close(7s)
    const defaultCuts = [0, 4, 9, 14, 28, 33].map(s => s * fps);

    // 对齐到最近的 beat
    const alignedCuts = defaultCuts.map(cut => {
      const nearestBeat = beats.reduce((best, b) =>
        Math.abs(b - cut) < Math.abs(best - cut) ? b : best, beats[0]);
      return nearestBeat;
    });

    return {
      bpm,
      beatIntervalFrames,
      beats,
      suggestedCuts: [...new Set(alignedCuts)].sort((a, b) => a - b),
      totalFrames,
      fps,
    };
  }

  return {
    bpm,
    beatIntervalFrames,
    beats,
    suggestedCuts: [...new Set(suggestedCuts)].sort((a, b) => a - b),
    totalFrames,
    fps,
  };
}

// ----------------------------------------------------------------
//  Main
// ----------------------------------------------------------------

function main(): void {
  const { audioPath, fps } = parseArgs();

  console.log(`BEAT-SYNC ANALYZER`);
  console.log(`Audio: ${audioPath}`);
  console.log(`FPS: ${fps}`);
  console.log("");

  // ── 获取时长 ──
  const duration = getAudioDuration(audioPath);
  console.log(`Duration: ${duration.toFixed(1)}s`);

  // ── Onset 检测 ──
  console.log("Detecting onsets...");
  const onsets = detectOnsets(audioPath);
  console.log(`Found ${onsets.length} onsets`);

  // ── BPM 估算 ──
  const bpm = estimateBPM(onsets);
  console.log(`Estimated BPM: ${bpm}`);

  // ── 生成 beat map ──
  const beatMap = generateBeatMap(bpm, fps, onsets);

  // ── 输出 ──
  const outDir = join(process.cwd(), "public", "brand");
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, "beat-map.json");
  writeFileSync(outPath, JSON.stringify(beatMap, null, 2));
  console.log(`\nWrote: ${outPath}`);

  // ── 场景切换建议 ──
  console.log("\nSuggested scene cuts (beat-aligned):");
  console.log("| Cut # | Frame | Time | Gap from prev |");
  console.log("|-------|-------|------|---------------|");

  for (let i = 0; i < beatMap.suggestedCuts.length; i++) {
    const frame = beatMap.suggestedCuts[i];
    const time = (frame / fps).toFixed(1);
    const gap = i > 0 ? beatMap.suggestedCuts[i] - beatMap.suggestedCuts[i - 1] : 0;
    const gapTime = (gap / fps).toFixed(1);
    console.log(`| ${i + 1} | ${frame}f | ${time}s | ${gap > 0 ? `${gap}f (${gapTime}s)` : "-"} |`);
  }

  console.log(`\nBeat interval: ${beatMap.beatIntervalFrames}f (${(beatMap.beatIntervalFrames / fps).toFixed(2)}s)`);
  console.log(`\nUsage in MainVideo.tsx:`);
  console.log(`  import beatMap from "../public/brand/beat-map.json";`);
  console.log(`  // Use beatMap.suggestedCuts for TransitionSeries durationInFrames`);
  console.log(`  // Use beatMap.beats for syncing animations to beats`);
}

main();
