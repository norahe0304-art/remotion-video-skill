# Multi-Resolution Video Guide

> Design for 16:9 first, then adapt. Never design three versions — design one responsive system.

## Registered Compositions

| ID | Dimensions | Aspect | Use Case |
|----|-----------|--------|----------|
| `LaunchVideo` | 1920 x 1080 | 16:9 | YouTube, website, presentations |
| `LaunchVideo-Vertical` | 1080 x 1920 | 9:16 | TikTok, Instagram Reels, YouTube Shorts |
| `LaunchVideo-Square` | 1080 x 1080 | 1:1 | Instagram feed, LinkedIn feed, Twitter/X |

## Responsive Layout Pattern

Every scene should read dimensions from `useVideoConfig()` and derive layout from them:

```tsx
const { width, height } = useVideoConfig();
const isVertical = height > width;
const isSquare = Math.abs(height - width) < 100;
const isLandscape = width > height;

// Derive padding as percentage of smaller dimension
const basePad = Math.min(width, height) * 0.06;
```

**Rules:**
- Never hardcode `1920` or `1080` — always use `width` / `height`
- Use `%` or viewport-relative values for padding and margins
- Use `flex` with `flexDirection: isVertical ? 'column' : 'row'` to reflow content
- Absolute-positioned elements should use `%` offsets, not `px`

## Safe Zones

Different platforms crop or overlay UI (profile icons, like buttons, captions).

### 16:9 (1920 x 1080)
- Safe: 80px inset on all sides
- Critical text: keep within center 1760 x 920

### 9:16 (1080 x 1920)
- **Top 150px:** platform status bar, back buttons — avoid text
- **Bottom 300px:** TikTok captions, Reels UI, engagement buttons — avoid critical content
- **Right 100px:** like/comment/share buttons on TikTok/Reels
- Safe text zone: 100px left, 180px right, 200px top, 350px bottom
- Effective safe area: roughly 800 x 1370 centered

### 1:1 (1080 x 1080)
- Safe: 60px inset on all sides
- Instagram may letterbox slightly — keep content within center 960 x 960

## Font Size Scaling

Base sizes are designed for 1920x1080. Scale proportionally:

```tsx
const { width } = useVideoConfig();
const scale = width / 1920;

// Apply to font sizes
const heroSize = Math.round(72 * scale);    // 72 → 72 (16:9), 40 (9:16), 40 (1:1)
const headlineSize = Math.round(48 * scale); // 48 → 48 (16:9), 27 (9:16), 27 (1:1)
const bodySize = Math.round(28 * scale);     // 28 → 28 (16:9), 16 (9:16), 16 (1:1)
```

**Problem:** Scaling by width alone makes 9:16 text too small (1080/1920 = 0.56x).

**Better approach — scale by the smaller dimension ratio:**

```tsx
const { width, height } = useVideoConfig();
const refShort = 1080; // shorter side of 1920x1080
const currentShort = Math.min(width, height);
const fontScale = currentShort / refShort;

// Now all formats get scale = 1.0 since their short side is 1080
// Only if you register a 720p variant would it shrink
```

This keeps text the same physical size across all three formats (since all share 1080 as their shorter dimension). For the current registered sizes, `fontScale` will always be `1.0`.

**Minimum sizes (after scaling):** 28px body, 36px subheadline, 48px headline. See SKILL.md rules.

## Scene Adaptation Guide

### Scenes that work well across all formats
- **Logo scenes** — centered content, scales naturally
- **Headline + icon grid** — flex-wrap reflows automatically
- **Metric / counter scenes** — stack vertically on 9:16, grid on 16:9
- **CTA / close scenes** — centered lockup

### Scenes that need adaptation for 9:16
- **Wide product UI mockups** (dashboards, code editors) — landscape screenshots don't fit in portrait
  - Strategy: crop to a key section, or scale down with a phone-frame chrome
  - Or: show a vertical slice of the UI instead of the full width
- **Side-by-side comparisons** — must stack vertically
- **Horizontal card grids** — reflow to single column
- **Data tables** — too wide; switch to vertical metric cards

### Scenes that need adaptation for 1:1
- **Wide mockups** — slightly less problematic than 9:16, but still need cropping
- **Tall vertical stacks** — may overflow; reduce items or shrink spacing

## Implementation Checklist

When building scenes, verify:

- [ ] `useVideoConfig()` used for all dimension-dependent layout
- [ ] No hardcoded pixel values for positioning (use `%` or derived values)
- [ ] Text stays within safe zones for all three formats
- [ ] Font sizes remain readable (min 28px) after scaling
- [ ] UI mockups have a vertical-friendly fallback (crop, reframe, or phone chrome)
- [ ] Flex direction flips for vertical when content is side-by-side
- [ ] Preview in Remotion Studio for all three Compositions before rendering

[PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
