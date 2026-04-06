# Remotion Video Skill

Generate premium 40-second product launch videos with Claude Code + Remotion. Give it a brand URL, get a video that looks like a $50k agency produced it.

## Installation

```bash
npx skills add norahe0304-art/remotion-video-skill -g
```

Or project-level:

```bash
npx skills add norahe0304-art/remotion-video-skill
```

## Usage

Just tell Claude Code:

> "Make a launch video for linear.app"

The skill will scrape the brand, ask for your storyline, build animated UI mockups, add BGM, and render to MP4.

## What's Inside

**3,200+ lines of rules** across 13 files, **4,100+ lines of bundled Remotion API reference**, **1,900+ lines of scaffold code**, and **5 reference files** with copy-paste components.

### Design System (rules/)
| File | What it covers |
|------|---------------|
| `layout.md` | Grid system, safe zones, nowrap rules, card padding minimums, SplitText flex-column fix |
| `typography.md` | Font weights (max 600), size hierarchy (min 28px), text safety |
| `color.md` | Brand polarity detection, neutral tinting, 60-30-10 rule |
| `ui-mockups.md` | Product UI construction, density, title bars, syntax coloring |
| `cards.md` | Staggered card grids, interior fill, animated card bodies |
| `data-viz.md` | SVG charts, animated metrics, tabular-nums, status badges |

### Motion & Production (rules/)
| File | What it covers |
|------|---------------|
| `motion.md` | Spring physics, easeOutExpo, per-character stagger, timing standards |
| `transitions.md` | TransitionSeries, light leaks, fluid backgrounds, parallax |
| `cinematic.md` | Film grain, vignette, shimmer sweep, color grading, render settings |

### Strategy & Quality (rules/)
| File | What it covers |
|------|---------------|
| `taste.md` | 23-item AI slop blacklist, cognitive UX laws, self-review checklist |
| `narrative.md` | 6-act structure, headline/UI rhythm, story arc |
| `narrative-templates.md` | 7 industry templates (AI SaaS, FinTech, DevTool, E-Commerce, etc.) |
| `workflow.md` | Brand scraping, yt-dlp video download, staticFile() enforcement, BGM sourcing, asset relevance checks |

### Code Patterns (references/)
| File | Components |
|------|-----------|
| `animations.md` | FadeIn, ScaleIn, SplitText, Typewriter, CountUp, AnimatedPath |
| `components.md` | GradientMesh, GlassPanel, FilmGrain, ProductFrame, BrandIcon |
| `audio.md` | Beat sync, voiceover ducking, audio layers |
| `visual-effects.md` | ShimmerSweep, PulseGlow, PathDraw, ParticleField |
| `lottie.md` | @remotion/lottie integration |

### Bundled Remotion API Reference (remotion-best-practices/)
37 Remotion-specific rule files covering videos, audio, timing, transitions, compositions, fonts, images, charts, captions, 3D, maps, and more. No external dependency needed.

### Scaffold (scaffold/)
11-file ready-to-run Remotion project template with pre-wired TransitionSeries, animation components, background effects, and theme tokens.

## Battle-Tested

Built and validated across 8 real brand videos: Google Gemini, Linear, Mercury, Shopify, 1Password, Notion, Cursor, and Anthropic. Every rule comes from a real bug or a real design review — not theory.

## License

MIT
