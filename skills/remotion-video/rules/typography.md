# Typography

Font selection, weight hierarchy, sizes, and text safety for 1920×1080 video.

## Weight Hierarchy (MAX 600)

Never use `bold` / `700` / `800` / `900`. Premium typography uses 300-600:

| Weight | Role | Example |
|--------|------|---------|
| 300 light | Muted meta, timestamps | Sidebar labels |
| 400 regular | Body text | Descriptions, paragraphs |
| 500 medium | Labels, sections | Card titles, nav items |
| 600 semi-bold | Heroes, headlines | Scene titles, hero metrics |

Heavy bold looks cheap. The Stripe/Linear look comes from SIZE contrast + letter-spacing, not weight.

## Font Count: Maximum 2 Families

Often ONE family in multiple weights creates cleaner hierarchy than two competing typefaces. Weight contrast > font variety.

Good choices: Outfit, Instrument Sans, Plus Jakarta Sans, Onest, Figtree, DM Sans.
Premium/editorial: Fraunces, Newsreader, Lora.

## Size Hierarchy (1920×1080)

| Element | Size | Notes |
|---------|------|-------|
| Hero headline | 72-96px | Semi-bold (600), letterSpacing: -2 to -3 |
| Hero metric | 52-64px | tabular-nums, lineHeight: 1 |
| Section title | 32-36px | Semi-bold (600) |
| Body / label | 28px | Medium (500), standard |
| Secondary / muted | 24px | **ABSOLUTE MINIMUM** — tested at viewing distance |

**NEVER below 24px.** At 1-3 meters viewing distance, 14-20px is microscopic.

## Text Safety

ALL text elements in constrained containers:
```tsx
{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
```

Unless explicitly multi-line. Max text width: headlines 70%, body within card bounds.

## Spacing

- `letterSpacing: -0.5` to `-3` on headlines (larger = more negative)
- `letterSpacing: 0` on body text
- `letterSpacing: 1-2` on uppercase labels only
- `lineHeight: 1` on large numbers
- `lineHeight: 1.3` on labels/headings
- `lineHeight: 1.5` on body text
- Dark backgrounds: increase lineHeight by 0.05-0.1 (lighter perceived weight needs more room)

## Never Pair Similar Fonts

Two geometric sans-serifs create tension without hierarchy. If pairing, contrast on multiple axes: serif+sans, geometric+humanist, condensed+wide.
