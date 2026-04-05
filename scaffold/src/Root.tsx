/**
 * [INPUT]: remotion Composition, MainVideo, theme
 * [OUTPUT]: RemotionRoot — 多分辨率 Composition 注册 (16:9, 9:16, 1:1)
 * [POS]: Remotion 根组件, 定义所有 Composition
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import "./index.css";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// ================================================================
// 40s = 1200 frames @ 30fps
// 三种分辨率共享同一 MainVideo 组件
// 场景内部通过 useVideoConfig() 获取宽高, 自适应布局
// ================================================================

const DURATION = 1200;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ---- 16:9 Landscape (默认, YouTube / 官网) ---- */}
      <Composition
        id="LaunchVideo"
        component={MainVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* ---- 9:16 Vertical (TikTok / Reels / Shorts) ---- */}
      <Composition
        id="LaunchVideo-Vertical"
        component={MainVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* ---- 1:1 Square (Instagram / LinkedIn feed) ---- */}
      <Composition
        id="LaunchVideo-Square"
        component={MainVideo}
        durationInFrames={DURATION}
        fps={FPS}
        width={1080}
        height={1080}
      />
    </>
  );
};
