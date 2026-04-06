/**
 * [INPUT]: remotion Sequence/Audio, 5 幕场景组件, Background
 * [OUTPUT]: MainVideo — 40s 5-act 产品发布视频
 * [POS]: 视频主编排器, 控制所有场景时序
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { AbsoluteFill, Sequence } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { theme } from "./theme";
import { FilmGrain, Vignette, ColorGrade } from "./components/Background";

// ================================================================
// 5-ACT STRUCTURE @ 30fps = 1200 frames (40s)
//
// ACT 1 — HOOK:     0-180    (6s)  产品 UI mockup, 制造好奇
// ACT 2 — REVEAL:   180-360  (6s)  Logo 星座 + "Introducing X"
// ACT 3 — SHOWCASE: 360-840  (16s) 3-4 feature vignettes
// ACT 4 — PROOF:    840-1020 (6s)  数据仪表盘
// ACT 5 — CLOSE:    1020-1200(6s)  CTA + Logo lockup
//
// 每幕之间 12 帧 fade 过渡 (TransitionSeries 自动重叠)
// ================================================================

export const MainVideo: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.color.bg,
        color: theme.color.text,
        fontFamily: theme.font.heading,
        overflow: "hidden",
      }}
    >
      {/* ── 后期叠加层 ── */}
      <ColorGrade />
      <FilmGrain opacity={0.03} />
      <Vignette intensity={0.4} />

      {/* ── 5 幕场景 ── */}
      <TransitionSeries>
        {/* ACT 1 — HOOK */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* TODO: <HookScene /> */}
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* ACT 2 — REVEAL */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* TODO: <RevealScene /> */}
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* ACT 3 — SHOWCASE (3-4 vignettes, 各自内部再 Sequence) */}
        <TransitionSeries.Sequence durationInFrames={480}>
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* TODO: <ShowcaseScene /> */}
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* ACT 4 — PROOF */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* TODO: <ProofScene /> */}
          </AbsoluteFill>
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 12 })}
        />

        {/* ACT 5 — CLOSE */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <AbsoluteFill style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* TODO: <CloseScene /> */}
          </AbsoluteFill>
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
