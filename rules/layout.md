# Layout & Spacing

Grid system, safe zones, spacing scale, border-radius hierarchy, and overlap prevention.

## Full-Bleed UI Frames

UI mockups fill 80-95% of the frame — like your screen IS the product. Add thin borders, rounded corners (16-24px), and box-shadow for depth.

## Layout Grid System

Every scene uses a fixed grid:

```
┌─────────────────────────────────────────┐
│ Header: 44-52px, border-bottom          │
│ ┌──────────┬────────────────────────────┤
│ │ Sidebar  │ Main content               │
│ │ 200-260px│ flex: 1, overflow: hidden   │
│ │ flexShrink:0│                         │
│ ├──────────┴────────────────────────────┤
│ │ Bottom bar: 36-44px, border-top       │
└─────────────────────────────────────────┘
```

- Grid gaps: 12-16px between cards, 16-24px padding on main area
- Cards: `flex: 1` inside grids to fill available space
- NEVER set fixed heights that leave empty space below

## 4px Spacing Scale

| Context | Size |
|---------|------|
| Icon to text | 6-8px |
| Badge padding | 2-4px V, 6-10px H |
| Card interior | 16-20px |
| Card gap | 12-16px |
| Section padding | 24-32px H, 16-24px V |
| Header/footer | 36-52px (fixed, flexShrink: 0) |

## Safe Zones (1920×1080)

- **Action safe:** 64px inset from all edges
- **Title safe:** 96px inset — ALL headlines, CTAs, key UI inside this
- **Content zone:** 1728 × 888px
- **Optical center:** place primary content at ~45% from top (slightly above math center)
- **Bottom 15%** (below 918px): overlays/captions only, never primary content
- Full-bleed UI CAN touch edges, but key text within respects safe zones

## Border-Radius Hierarchy

NOT the same radius on everything:

| Element | Radius |
|---------|--------|
| Inputs / badges | 4-6px |
| Cards / panels | 12-16px |
| Modals / large containers | 20-24px |
| Pills / tags | 100px |

**Inner radius = outer radius - gap.** If outer card is 16px with 12px padding, inner element is 4px (16-12=4).

## Anti-Blank-Space Rules

Empty space = amateur:
- Chat UIs: messages start from TOP (justify: flex-start), add 2-3 faded previous messages
- Card grids: `flex-direction: column; justify-content: space-between` inside each card
- Video previews: gradient bg + filmstrip + resolution badge + progress indicator
- Sidebars: fill top-to-bottom — title → active → history → bottom selector. No gaps

## No Layout Overlap

- Every container: `overflow: "hidden"`
- Fixed elements: `flexShrink: 0`
- Absolute overlays: `pointerEvents: "none"`, stay within safe zones
- Sidebar: fixed width + `flexShrink: 0`, main: `flex: 1` + `overflow: hidden`
- Card grids: use `gap` not `margin`
- **Orbiting elements:** Calculate total center bounding box. Orbit must clear by ≥80px every side
- **Test at fully-animated frame**, not just frame 0
