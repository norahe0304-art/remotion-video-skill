# Product UI Mockups

The #1 rule: build REAL product interfaces in code, not abstract graphics.

## Core Principle

Every showcase scene constructs a REAL product interface — sidebars, navigation, data cards, charts, input fields, buttons — then animates it. The UI mockup IS the animation.

Examples:
- ChatGPT-style conversation UI with typing animation and thinking indicators
- Full dashboard with sidebar nav, data cards, SVG line charts
- IDE/code editor with syntax-highlighted code typing + terminal output
- Video generation grid with progress spinners and completion states
- Data table with sortable columns and animated row entrance

**NEVER use abstract floating shapes as primary visual.**

## Density Is Polish

Every UI panel must be PACKED with sub-elements:
- **Cards:** icon + label + large number + colored ▲/▼ badge + SVG chart + footer text
- **Dashboards:** sidebar (280px) + brand selector + nav items + breadcrumb + filter bar + card grid + tables/charts
- **Tables:** column headers + rows with colored dot indicators + border-bottom dividers
- **Every panel:** header row (icon + title + dropdown/button right) + body + footer

Fill EVERY pixel. Empty space → add a data row, status badge, filter chip, or sub-panel.

## Title Bar Details

- Code editors: macOS traffic lights (red/yellow/green 12px dots) + filename
- Dashboards: breadcrumbs + nav headers
- These tiny details signal "real product" not "mockup"

## Syntax-Colored Code

Different colors for keywords, strings, comments, function names. Dark editor (#1E1E1E). Monospace font. Line numbers in muted gray. Blinking cursor.

## Interactive Animations

Every scene needs at least one "living" element:
- Typing cursor in search/chat box (~2 frames per char)
- Mouse pointer moving to interactive element
- Progress bar filling
- Code lines appearing
- Spinner rotating
- Chart drawing

## Button and Dropdown Details

Real apps have filter buttons and dropdowns. Add: "Monthly ▾", "3 LLMs ▾", "Optimization Hub" CTA. These fill header/filter bars and create visual density.

## Animated Cursor

`MousePointer2` from lucide-react:
- White circle (12px), 50% opacity trailing shadow
- Spring bezier movement — NEVER teleport
- Click ripple: circle 0→40px fading over 8 frames
- Button depression: `scale(0.95)` on click, `scale(1)` after 4 frames
- Loading spinner (0.5s) before results after click

## Typing Effect: Pre-Render, Never Slice

**NEVER** use `text.slice(0, charCount)` for typing animations. Slicing causes the container to reflow (width/height changes as characters appear) — the visual result is text "sliding in from the right", not typing.

**CORRECT:** Render ALL characters upfront, set untyped chars to `color: transparent`:

```tsx
// Container size is fixed from frame 0 — no reflow, true typing
{text.split("").map((char, i) => (
  <span key={i} style={{
    color: i < charCount ? visibleColor : "transparent",
  }}>
    {char}
  </span>
))}
{showCursor && (
  <span style={{ color: visibleColor, opacity: 0.6, marginLeft: -2 }}>|</span>
)}
```

**WRONG:**
```tsx
// slice = container resizes every frame = fake typing
{text.slice(0, charCount)}
```

This applies everywhere: chat bubbles, code editors, terminal output, search boxes.

## UI Mockup Patterns

**Chat UI:**
```tsx
// sidebar (280px) | main chat area
// Header + messages (user right, AI left with avatar) + input box
const typedChars = Math.floor((frame - 35) / 1.5);
const showCursor = frame > 35 && frame % 16 < 10;
// Use transparent-char technique above, NEVER slice
```

**IDE:**
```tsx
// macOS title bar (3 dots + filename) | dark code area | terminal
const visibleLines = Math.min(codeLines.length, Math.floor((frame - 20) / 4));
```

**Dashboard:**
```tsx
// stat cards row (3 cards) + chart panel below
const barWidth = interpolate(barEntrance, [0, 1], [0, data.value]);
```
