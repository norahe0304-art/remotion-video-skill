# Remotion Video Skill for Claude Code

A Claude Code skill that generates premium 40-second product launch videos using Remotion. Give it a brand URL, and it builds animated product UI mockups — full dashboards, code editors, conversation UIs, data charts — not floating text on backgrounds.

## What It Does

1. **Scrapes** the brand's real website for colors, fonts, logos, assets
2. **Asks** the user for their storyline (never auto-generates cookie-cutter narratives)
3. **Builds** a 6-act video with animated product UI mockups
4. **Sources** royalty-free background music automatically
5. **Validates** readability and watchability before rendering

## 6-Act Structure

| Act | Duration | Content |
|-----|----------|---------|
| Logo | 4s | Brand logo/wordmark spring animation (mandatory) |
| Hook | 5s | Product UI mockup with interactive animation |
| Reveal | 5s | Capability icons + intro headline |
| Showcase | 14s | 2-4 feature vignettes (headline + UI alternating) |
| Proof | 5s | Data dashboard / social proof (optional) |
| Close | 7s | CTA lockup + brand logo |

## Tech Stack

Remotion 4.x + React 19 + TypeScript + Zod + lucide-react + @remotion/transitions + @remotion/google-fonts + @remotion/paths + @remotion/light-leaks + @remotion/media

## Installation

### As a Claude Code Skill

```bash
# Copy to your Claude Code skills directory
cp -r remotion-video-skill/ ~/.claude/skills/remotion-video/
```

Then add to your Claude Code settings:

```json
{
  "skills": {
    "remotion-video": {
      "path": "~/.claude/skills/remotion-video"
    }
  }
}
```

### Usage

Just tell Claude Code:
> "Make a launch video for [brand-url]"

The skill will:
1. Scaffold a Remotion project from the built-in template
2. Scrape the brand's site for design DNA
3. Ask you for the storyline
4. Build all scenes with real assets
5. Add background music
6. Validate readability
7. Render to MP4

## Rules & References

### Design System
- `rules/typography.md` - Font weights (max 600), size hierarchy (min 28px)
- `rules/color.md` - Brand polarity, neutral tinting, 60-30-10 rule
- `rules/layout.md` - Grid system, 4px spacing, safe zones

### Visual Content
- `rules/ui-mockups.md` - Product UI construction, typing effects, cursor simulation
- `rules/cards.md` - Staggered card grids, animated card bodies
- `rules/data-viz.md` - SVG charts, animated metrics, tabular-nums

### Motion & Production
- `rules/motion.md` - Springs, easeOutExpo, per-character stagger
- `rules/transitions.md` - TransitionSeries, light leaks, parallax
- `rules/cinematic.md` - Film grain, vignette, shimmer sweep, color grading

### Strategy & Quality
- `rules/taste.md` - AI slop blacklist, readability audit, pacing
- `rules/narrative.md` - 6-act framework, headline/UI rhythm
- `rules/workflow.md` - Brand scraping, asset strategy, BGM sourcing

### Code Patterns
- `references/animations.md` - FadeIn, ScaleIn, SplitText, Typewriter, CountUp
- `references/audio.md` - Beat sync, voiceover ducking, audio layers
- `references/components.md` - GradientMesh, GlassPanel, FilmGrain
- `references/lottie.md` - @remotion/lottie integration

## Premium vs Template

| Premium | Template (avoid) |
|---|---|
| Logo animation opens the video | No logo or text-only |
| BGM with beat-synced transitions | Silent video |
| Real brand assets inside UI chrome | Pure code mockups only |
| Per-character text stagger | Entire text block fades |
| Spring physics | Linear easing |
| Film grain + vignette + color grade | Perfectly clean digital |

## License

MIT
