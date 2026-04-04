# Cinematic Post-Production

Film grain, glassmorphism, vignette, shimmer sweep, color grading, and render settings.

## Film Grain Overlay (Every Video)

2-4% noise texture for premium non-digital feel:

```tsx
const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.03 }) => {
  const frame = useCurrentFrame();
  const seed = frame * 1.7;
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `url("data:image/svg+xml,...")`, // feTurbulence SVG
      opacity, mixBlendMode: "overlay",
    }} />
  );
};
```

Light themes: 1-2% opacity, `mixBlendMode: "multiply"`.

## Cinematic Vignette

Radial gradient edge darkening — the single most impactful cinematic effect:

```tsx
<div style={{
  position: 'absolute', inset: 0, pointerEvents: 'none',
  background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.4) 100%)',
  zIndex: 100,
}} />
```

- Dark themes: intensity 0.3-0.5
- Light themes: intensity 0.15-0.25
- Add AFTER film grain, as last layer

## Shimmer Sweep

Moving light band on logos, CTAs, glass panels at reveal moments:

```tsx
<div style={{
  position: "absolute", top: 0, bottom: 0, width: 60-80,
  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15-0.25), transparent)",
  transform: `translateX(${interpolate(frame, [start, end], [-80, 320], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  })}px)`,
}} />
```

Max 2-3 shimmers per video. Apply to: logo reveal (Act 2), CTA button (Act 5).

## Color Grading via SVG Filter

Subtle desaturation (0.85-0.9) for cinematic feel. Apply to root AbsoluteFill:

```tsx
<svg style={{ position: 'absolute', width: 0, height: 0 }}>
  <defs><filter id="grade">
    <feColorMatrix type="saturate" values="0.88" />
  </filter></defs>
</svg>

// Root: style={{ filter: "url(#color-grade)" }}
```

## Glassmorphism Standard

Consistent glass panel styling:

| Property | Dark Theme | Light Theme |
|----------|-----------|-------------|
| Background | `rgba(255,255,255,0.05)` | `rgba(0,0,0,0.03)` |
| Border | `1px solid rgba(255,255,255,0.1)` | `1px solid rgba(0,0,0,0.08)` |
| Blur | `backdropFilter: "blur(12-20px)"` | same |
| Shadow | `0 8px 32px rgba(0,0,0,0.4)` | `0 4px 20px rgba(0,0,0,0.08)` |

## Ken Burns Effect

Static images must NEVER be static:
- Slow zoom: scale 1.0 → 1.08 over display duration
- Slow pan: translateX drift 20-40px
- `Easing.out(Easing.quad)` for natural decel

## Render at Maximum Quality

```bash
npx remotion render --codec h264 --crf 16 --color-space bt709 --image-format png
```

CRF 16-18 (not default 28). `--image-format png` for lossless frames. `--scale 2` for Retina text.
