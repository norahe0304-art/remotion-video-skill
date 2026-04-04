/**
 * [INPUT]: 品牌抓取数据 (颜色/字体/视觉风格)
 * [OUTPUT]: theme 对象 — 全局设计 token
 * [POS]: 设计系统核心, 被所有 scene/component 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

// ================================================================
// STEP 2: 用品牌抓取的真实数据替换以下占位值
// NEVER guess — 所有值必须来自 scrape
// ================================================================
export const theme = {
  color: {
    // 60% — 主背景
    bg: "#0A0A0C",
    panel: "#111114",
    card: "#18181B",
    surface: "#1F1F23",

    // 30% — 文字层级
    text: "#FFFFFF",
    textBody: "#E2E8E6",
    textMuted: "rgba(226, 232, 230, 0.38)",

    // 10% — 品牌强调色
    primary: "#REPLACE_ME",
    accent: "#REPLACE_ME",

    // 边框
    border: "rgba(255, 255, 255, 0.06)",
    borderActive: "rgba(255, 255, 255, 0.12)",
  },

  font: {
    // 从 @remotion/google-fonts 加载, 见 lib/fonts.ts
    heading: "Outfit",
    body: "Outfit",
    mono: "JetBrains Mono",
  },

  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;
