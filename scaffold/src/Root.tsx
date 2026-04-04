/**
 * [INPUT]: remotion Composition, MainVideo, theme
 * [OUTPUT]: RemotionRoot — Composition 注册
 * [POS]: Remotion 根组件, 定义所有 Composition
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import "./index.css";
import { Composition } from "remotion";
import { MainVideo } from "./MainVideo";

// ================================================================
// 40s = 1200 frames @ 30fps
// 调整 durationInFrames 适配实际场景时长
// ================================================================
export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="LaunchVideo"
      component={MainVideo}
      durationInFrames={1200}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
