# Motion & Animation

Springs, easing curves, timing, and stagger patterns for premium Remotion video.

## Exponential Easing (Apple Keynote Feel)

Use exponential deceleration instead of cubic — objects arrive FAST, settle SLOWLY:

```tsx
const easeOutExpo = (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

// Usage in interpolate
const entrance = interpolate(frame, [0, 15], [0, 1], {
  extrapolateLeft: "clamp", extrapolateRight: "clamp",
  easing: easeOutExpo,
});
```

## Per-Character Text Stagger

Headlines NEVER fade in as a block. Split into characters with 40-80ms stagger:

```tsx
{text.split("").map((char, i) => {
  const delay = startFrame + i * 1.2;
  const prog = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: easeOutExpo,
  });
  return (
    <span key={i} style={{
      display: "inline-block", opacity: prog,
      transform: `translateY(${interpolate(prog, [0, 1], [25, 0])}px)`,
      whiteSpace: "pre",
    }}>{char}</span>
  );
})}
```

## Spring Config Presets

| Use case | Config | Behavior |
|----------|--------|----------|
| Professional default | `{ damping: 14-16, stiffness: 60-80 }` | Minimal bounce |
| Smooth reveal | `{ damping: 200 }` | No bounce, subtle |
| Snappy UI | `{ damping: 20, stiffness: 200 }` | Responsive |
| Heavy settle | `{ damping: 15, stiffness: 80, mass: 2 }` | Slow, weighty |

## Timing Standards

- **Entrance:** 15-20 frames (spring scale 0.95→1 + opacity 0→1)
- **Hold:** 60-90 frames minimum per scene state
- **Exit:** 10-15 frames (opacity fade only, ~75% of entrance duration)
- **Stagger:** 4-8 frames between siblings. Cap total: 10 items × 4f = 40f max
- **First 3 seconds:** must animate immediately — no slow fade from black
- **Static limit:** never hold still >4 seconds — add glow pulse, float drift, cursor

## Scene Entrance/Exit Uniformity

All scenes must:
- Enter with spring scale (0.95→1) + opacity (0→1) in first 15 frames
- Exit with opacity fade in last 18-22 frames
- Use `overflow: "hidden"` on ALL containers

## Hold-Then-Snap

Premium videos alternate STILLNESS and MOTION. Content holds still 60-90 frames, then snaps to next state in 8-12 frames. The contrast creates drama. Constant motion = screensaver, not launch video.

## Easing Rules

- **ease-out** for entrances (elements arriving)
- **ease-in** for exits (elements leaving)
- **spring** for interactive/gesture-like motion
- **NEVER linear** (except progress bars)
- **NEVER bounce/elastic** — tacky since 2015. Spring with damping 14-16 gives the right feel

## One Focal Animation at a Time

If cards stagger in AND a chart draws AND text types simultaneously, the eye has nowhere to go. Sequence them: cards first → chart draws → text types.

## Transform Only

Never animate `width`, `height`, `top`, `left`. Animate only `transform` and `opacity` — smoother rendering.
