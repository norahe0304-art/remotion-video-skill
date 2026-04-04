# Audio Integration Patterns

Audio sync, beat detection, voiceover ducking, and VO timeline systems for Remotion videos.

## Beat Sync System

Align scene transitions and animations to music beats for rhythmic, polished videos.

### beats.ts — Beat Timestamp Array

Generate beat timestamps from your track's BPM:

```tsx
// For 125 BPM: beat interval = 60/125 = 0.48s
export const BEATS: number[] = [
  0.48, 0.96, 1.44, 1.92, 2.40, 2.88, 3.36, 3.84,
  // ... generate full array for track duration
];

export const isOnBeat = (timeSec: number, toleranceSec = 0.05): boolean =>
  BEATS.some(b => Math.abs(timeSec - b) <= toleranceSec);

export const isOnStrongBeat = (timeSec: number, toleranceSec = 0.05): boolean =>
  BEATS.filter((_, i) => i % 4 === 0).some(b => Math.abs(timeSec - b) <= toleranceSec);

export const getBeatProgress = (timeSec: number): number => {
  const beatInterval = 60 / 125; // adjust to your BPM
  return (timeSec % beatInterval) / beatInterval;
};
```

### Using Beats in Components

```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();
const currentSec = frame / fps;

// Pulse on beat
const beatPulse = isOnBeat(currentSec)
  ? spring({ frame: frame % 15, fps, config: { damping: 8, stiffness: 200 } })
  : 0;

<div style={{ transform: `scale(${1 + beatPulse * 0.05})` }}>
  {children}
</div>
```

## BGM Auto-Duck

Lower background music volume when voiceover is playing.

```tsx
import { Audio, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface VoSegment {
  start: number;   // seconds
  duration: number; // seconds
  file: string;
}

const BGMWithDuck: React.FC<{
  musicFile: string;
  voSegments: VoSegment[];
  baseVolume?: number;
  duckVolume?: number;
  fadeDuration?: number; // frames for duck transition
}> = ({
  musicFile, voSegments,
  baseVolume = 0.7, duckVolume = 0.15, fadeDuration = 8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentSec = frame / fps;

  const isVoActive = voSegments.some(
    seg => currentSec >= seg.start && currentSec < seg.start + seg.duration
  );

  // Smooth transition between ducked and full volume
  const volume = isVoActive ? duckVolume : baseVolume;

  return <Audio src={staticFile(musicFile)} volume={volume} />;
};
```

### Advanced Duck with Edge Fade

Smoothly ramp volume at VO boundaries instead of hard cuts:

```tsx
const computeDuckedVolume = (
  frame: number, fps: number,
  voSegments: VoSegment[],
  baseVol: number, duckVol: number, fadeFrames: number,
): number => {
  const sec = frame / fps;

  for (const seg of voSegments) {
    const segEnd = seg.start + seg.duration;

    // Inside VO segment — check edge fade
    if (sec >= seg.start && sec < segEnd) {
      const fadeInProgress = interpolate(
        sec, [seg.start, seg.start + fadeFrames / fps], [baseVol, duckVol],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      const fadeOutProgress = interpolate(
        sec, [segEnd - fadeFrames / fps, segEnd], [duckVol, baseVol],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
      return Math.min(fadeInProgress, fadeOutProgress);
    }
  }

  return baseVol;
};
```

## Voiceover Timeline with Nudge Adjustment

Fine-tune VO segment timing without re-recording:

```tsx
type VoDefaults = Record<string, { start: number; duration: number; file: string }>;
type VoNudges = Record<string, number>; // seconds to shift each segment

const resolveVoSegments = (
  defaults: VoDefaults,
  nudges: VoNudges = {},
): VoSegment[] =>
  Object.entries(defaults).map(([key, seg]) => ({
    ...seg,
    start: Math.max(0, seg.start + (nudges[key] ?? 0)),
  }));

// Usage in Root.tsx schema:
const videoPropsSchema = z.object({
  voEnabled: z.boolean().default(true),
  voNudges: z.record(z.string(), z.number()).default({}),
  // ...
});

// Apply nudges
const voSegments = resolveVoSegments(VO_DEFAULTS, props.voNudges);
```

## Whisper Word-Level Sync

For transcript-driven videos with precise word highlighting:

```bash
# Generate word timestamps
whisper audio.wav --model medium --language en --word_timestamps True --output_format json
```

### Parse Whisper Output

```tsx
// Build per-segment word timing arrays
type WordTimes = Record<number, number[]>; // segmentId -> relative seconds per word

const WORD_TIMES: WordTimes = {
  0: [0.0, 0.28, 0.56, 0.89, ...],  // relative to segment start
  1: [0.0, 0.34, 0.72, ...],
  // ...
};

// Highlight current word in transcript
const getCurrentWordIndex = (
  segmentId: number, elapsedSec: number,
): number => {
  const times = WORD_TIMES[segmentId];
  if (!times) return -1;
  for (let i = times.length - 1; i >= 0; i--) {
    if (elapsedSec >= times[i]) return i;
  }
  return 0;
};
```

## Audio Layer Composition

Standard three-layer audio setup:

```tsx
<AbsoluteFill>
  {/* Layer 1: Background Music (always playing, auto-ducked) */}
  <Audio src={staticFile("bgm.mp3")} volume={bgmVolume} />

  {/* Layer 2: Voiceover segments (timed to scenes) */}
  {voSegments.map((seg, i) => (
    <Sequence key={i} from={Math.round(seg.start * fps)}
      durationInFrames={Math.round(seg.duration * fps)}>
      <Audio src={staticFile(seg.file)} volume={1.0} />
    </Sequence>
  ))}

  {/* Layer 3: SFX (whoosh on transitions, click on UI, etc.) */}
  <Sequence from={transitionFrame} durationInFrames={15}>
    <Audio src={staticFile("whoosh.mp3")} volume={0.4} />
  </Sequence>
</AbsoluteFill>
```

[PROTOCOL]: Update this file when audio patterns change, then check CLAUDE.md
