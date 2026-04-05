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

## IRON LAW: Animation Must Complete Before Scene Ends

**Every animation (SplitText, Typewriter, stagger, CountUp, spring) MUST finish with breathing room BEFORE the scene transitions.** If text is still appearing when the fade starts, the video is broken.

### Completion Budget Formula

```
animation_finish_frame = delay + (char_count × staggerFrames)   // SplitText
animation_finish_frame = delay + (text.length / speed)           // Typewriter
animation_finish_frame = delay + (item_count × stagger_gap)     // staggered items

scene_transition_start = durationInFrames - 15                   // fade begins

REQUIRED: animation_finish_frame + 45 < scene_transition_start
          ↑ 45 frames (1.5s) minimum reading/breathing time
```

### How to Validate (Do This For EVERY Scene)

After writing a scene, calculate:
1. When does the LAST animation element finish appearing?
2. When does the scene transition/fade begin?
3. Is there at least **45 frames (1.5s)** between finish and transition?

If NOT → either:
- **Extend the scene** `durationInFrames`
- **Reduce delay** so animation starts earlier
- **Increase speed** so animation completes faster
- **Cut content** — fewer words, fewer items

### Common Traps

| Trap | Why It Breaks | Fix |
|------|--------------|-----|
| SplitText with 30 chars × 2f stagger = 60f finish, in a 80f scene | Only 5f to read before fade | Extend scene to 120f or reduce stagger to 1.5f |
| Typewriter with 60 chars at speed 1.5 = 40f, delay 30 = finishes at 70f, scene is 90f | Text finishes at 70f, fade at 75f, 5f to read | Start typing earlier (delay 10) or increase speed |
| 6 icons with 6f stagger, delay 40 = finishes at 76f, scene is 90f | Last icon appears 14f before scene ends | Reduce delay to 25 or increase durationInFrames |

**This is not a suggestion. This is a BLOCKING check. Fix before moving to the next scene.**

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
