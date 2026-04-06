/**
 * [INPUT]: @remotion/google-fonts
 * [OUTPUT]: loadFonts() — 全局字体加载
 * [POS]: 字体加载器, 被 index.ts 调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ================================================================
// 替换为品牌抓取到的字体
// 默认 Outfit (现代几何无衬线) + JetBrains Mono (代码)
// ================================================================
import { loadFont } from "@remotion/google-fonts/Outfit";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const loadFonts = () => {
  loadFont();
  loadMono();
};
