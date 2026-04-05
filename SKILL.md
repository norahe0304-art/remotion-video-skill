---
name: remotion-beautiful-videos
description: |
  Generate premium 40s product launch videos using Remotion. Scrapes the brand's real landing page
  for colors/fonts/assets. Builds ANIMATED PRODUCT UI MOCKUPS — full dashboards, code editors,
  conversation UIs, data charts — not floating text on backgrounds. Uses lucide-react icons (never emoji),
  spring physics, SVG chart animations, TransitionSeries with fade/light-leak transitions.
  Follows the Stripe/Linear/Vercel 5-act structure. Integrates remotion-best-practices patterns.
---

# Remotion Beautiful Videos

Create 40-second product launch videos that look like a $50k agency produced them. The secret: build **animated product UI mockups** — real dashboards, conversation interfaces, code editors, data visualizations — all constructed in code and spring-animated.

## When to Use

User names a brand or gives a URL and wants a product launch / marketing / demo video.

## Tech Stack

Remotion 4.x + React 19 + TypeScript + Zod + lucide-react + @remotion/transitions + @remotion/google-fonts + @remotion/paths + @remotion/light-leaks + @remotion/media

## Core Philosophy

1. **Build product UI mockups, not abstract graphics.** The UI IS the animation.
2. **Scrape first, design second.** Every color, font, logo comes from the real brand site.
3. **Pacing is luxury.** 40 seconds lets content breathe. Never rush features.
4. **Taste over templates.** If it looks like "AI made this," redesign.
5. **One font family, weight hierarchy.** 300-600 range only, never bold (700+).

## Rules

Read individual rule files for detailed explanations and code examples:

### Design System
- [rules/typography.md](rules/typography.md) - Font weights (max 600), size hierarchy (min 24px), text safety
- [rules/color.md](rules/color.md) - Brand polarity, neutral tinting, 60-30-10 rule, accent opacity levels
- [rules/layout.md](rules/layout.md) - Grid system, 4px spacing scale, safe zones, border-radius hierarchy, anti-overlap

### Visual Content
- [rules/ui-mockups.md](rules/ui-mockups.md) - Product UI construction, density, title bars, syntax coloring, cursor simulation
- [rules/cards.md](rules/cards.md) - Staggered card grids, interior fill techniques, animated card bodies, no duplicates
- [rules/data-viz.md](rules/data-viz.md) - SVG charts, animated metrics, tabular-nums, status badges, anti-hero-metric

### Motion & Production
- [rules/motion.md](rules/motion.md) - Springs, easeOutExpo, per-character stagger, timing standards, hold-then-snap
- [rules/transitions.md](rules/transitions.md) - TransitionSeries, light leaks, fluid backgrounds, noise textures, parallax
- [rules/cinematic.md](rules/cinematic.md) - Film grain, vignette, shimmer sweep, color grading, glassmorphism, render settings

### Strategy & Quality
- [rules/taste.md](rules/taste.md) - AI slop blacklist, design principles, UX laws, self-review checklist, pacing
- [rules/narrative.md](rules/narrative.md) - 5-act structure, headline/UI rhythm, story arc, logo constellation
- [rules/workflow.md](rules/workflow.md) - Brand scraping, icon system, asset strategy, video embedding, file organization

## Reference Files (Code Patterns)

- [references/animations.md](references/animations.md) - FadeIn, ScaleIn, SplitText, Typewriter, CountUp, AnimatedPath
- [references/audio.md](references/audio.md) - Audio sync, beat detection, voiceover ducking
- [references/components.md](references/components.md) - GradientMesh, GlassPanel, FilmGrain, ProductFrame, BrandIcon
- [references/lottie.md](references/lottie.md) - @remotion/lottie integration, recommended sources

## Workflow (MUST follow in order)

### Step 0: Scaffold Project (30 seconds, not 30 minutes)

Copy the built-in scaffold to create a ready-to-run Remotion project:

```bash
# Copy scaffold to new project directory
cp -r /path/to/skills/remotion-video/scaffold/ <brand-name>-launch-video/

# Replace project name in package.json
sed -i '' 's/{{PROJECT_NAME}}/<brand-name>-launch-video/' <brand-name>-launch-video/package.json

# Install dependencies
cd <brand-name>-launch-video && npm install
```

**Scaffold provides:** Remotion 4.x + Tailwind v4 + TransitionSeries + light-leaks + noise + paths + Google Fonts + lucide-react + Zod. Plus pre-built: `MainVideo.tsx` (5-act TransitionSeries), `Animations.tsx` (FadeIn/ScaleIn/SplitText/Typewriter/CountUp), `Background.tsx` (GradientMesh/FilmGrain/Vignette/ColorGrade), `UI.tsx` (GlassPanel/BrandIcon/GradientText), `theme.ts` (token 占位).

**Only proceed to Step 1 after `npm run dev` works.**

### Step 1: Scrape Brand Data (BLOCKING — nothing starts before this)

Use `bb-browser` to open the brand's site and extract everything. See [rules/workflow.md](rules/workflow.md) for the full scraping protocol.

```bash
# Open brand site, extract design DNA
bb-browser open https://brand-site.com
bb-browser snapshot -i

# Extract CSS variables, hero copy, logo URL
bb-browser eval "getComputedStyle(document.documentElement).cssText"
bb-browser eval "document.querySelector('h1')?.textContent"
bb-browser eval "document.querySelector('link[rel*=icon]')?.href"
bb-browser screenshot public/brand/homepage.png
bb-browser close

# Download logo SVG (NEVER hand-write SVG paths)
curl -o public/brand/logo.svg <favicon-url>

# Download video assets if available
ffmpeg -i <video-url> -t 8 -c copy public/brand/clip.mp4
```

**Output:** `public/brand/` populated with logo.svg, screenshots, video clips.
**Extract:** exact hex colors, font families, hero copy, product features, visual style.
**Only proceed to Step 2 after scraping is complete.**

### Step 1.5: Ask User for Storyline (BLOCKING — never assume narrative)

After scraping, STOP and ask the user:

> I've scraped [brand] and extracted: [colors, fonts, product type, features list].
> 
> Before I build scenes, I need your storyline:
> 1. **What story do you want to tell?** (product launch? feature highlight? brand intro? problem→solution?)
> 2. **Which features to showcase?** (I found: [list from scrape]. Pick 2-4, or tell me others)
> 3. **What's the key message / tagline?** (or I can use: "[hero copy from scrape]")
> 4. **Any proof points?** (metrics, benchmarks, user count, testimonials — or skip Act 4)
> 5. **Tone?** (hype launch? calm authority? playful? technical?)

**Why this step exists:** Every user's video must be DIFFERENT. The 5-act structure is a FRAMEWORK, not a script. ACT 1 (Hook) is always a product UI — but WHICH UI, showing WHAT interaction, depends on the user's story. ACT 3 (Showcase) could be 2 features or 4. ACT 4 could be data or testimonials or cut entirely for a longer showcase.

**NEVER auto-generate storyline.** "It reasons. It codes. It creates." is lazy template output. Ask, listen, then build.

### Step 2: Build Theme from Scraped Data

Update `theme.ts` using ONLY scraped values. Replace all `#REPLACE_ME` tokens. Update `lib/fonts.ts` to load the brand's actual fonts. Update `index.css` @theme vars to match.

### Step 3: Build 6-Act Scenes (from user's storyline)

The structure is a framework. Adapt content to the user's story. **ACT 0 (Logo) is MANDATORY.**

| Act | Structure (fixed) | Content (from user) |
|-----|-------------------|---------------------|
| **ACT 0 Logo** | **MANDATORY. Brand logo/wordmark spring entrance + shimmer sweep. 4s.** | Real SVG logo downloaded from site |
| ACT 1 Hook | Product UI mockup, spring entrance | Which product screen? What interaction to animate? |
| ACT 2 Reveal | Capability icons + tagline | Which capabilities? What intro text? |
| ACT 3 Showcase | Headline → UI alternating rhythm | Which features? What headlines? What UIs? |
| ACT 4 Proof | Data visualization / social proof (optional) | What metrics? Or skip for longer showcase? |
| ACT 5 Close | CTA lockup + brand logo again | What tagline? What CTA? What URL? |

Create files in `src/scenes/`: `LogoScene.tsx`, `HookScene.tsx`, `RevealScene.tsx`, `ShowcaseScene.tsx`, `ProofScene.tsx`, `CloseScene.tsx`. Import into `MainVideo.tsx`.

**ACT 0 Logo Animation Requirements:**
- Real brand SVG wordmark/logo — downloaded, NEVER hand-written
- Spring scale entrance (0→1, damping 16, stiffness 50)
- Shimmer sweep across logo (frame 40-80)
- **NO text under the logo** — logo stands alone, pure and confident
- **Premium background required** — NEVER plain white/black. Add: GradientMesh (brand colors, low opacity 0.05-0.08), center glow pulse (radial-gradient breathing), subtle conic-gradient radial lines. The background sells luxury.
- Logo appears ONLY in ACT 0 and ACT 5 — NOT in middle acts

**Use REAL scraped assets.** Logo SVG from the site (NEVER hand-write). Product screenshots INSIDE UI chrome. Downloaded images at near-full width. See [rules/workflow.md](rules/workflow.md) Asset Strategy.

### Step 3.5: Add BGM (AUTOMATIC — never ask user)

Every video MUST have background music. **Auto-source it, don't ask the user.**

1. Match brand tone from scraping (tech→ambient, startup→upbeat, etc.)
2. Search Pixabay Music for a free royalty-free track (30-60s)
3. Download + trim to ~45s with ffmpeg fade in/out
4. Detect BPM for beat sync
5. Add `<Audio>` component in MainVideo with volume envelope (fade in 2s, sustain 0.2-0.3, fade out 3s)
6. Align scene transitions to beat timestamps when possible

See [rules/workflow.md](rules/workflow.md) BGM section for full sourcing protocol.

```tsx
// BGM with fade envelope
const BGM: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const volume = Math.min(
    interpolate(frame, [0, 2 * fps], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [durationInFrames - 3 * fps, durationInFrames], [0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <Audio src={staticFile("brand/bgm.mp3")} volume={volume} />;
};
```

### Step 4: Polish

Film grain + vignette + color grade + shimmer sweeps. See [rules/cinematic.md](rules/cinematic.md).

### Step 4.5: Readability & Watchability Audit (MANDATORY)

Before rendering, automatically validate every scene's timing:
- Every text element must be on screen long enough to READ (word_count × 10 frames minimum)
- Headlines hold 60+ frames (2s), UI mockups hold 120+ frames (4s)
- Typing animations MUST complete before scene transitions
- No text smaller than 28px at 1920x1080
- If any scene fails → fix duration/speed BEFORE rendering

See [rules/taste.md](rules/taste.md) "Automatic Readability & Watchability Audit" for full checklist.

**MANDATORY: Print Timing Audit Table after writing EVERY scene.** Do NOT proceed to the next scene without outputting this:

```
TIMING AUDIT — [SceneName] (durationInFrames: XXXf)
| Element | Type | delay | chars/items | finish frame | breathing (scene end - finish) | PASS/FAIL |
|---------|------|-------|-------------|-------------|-------------------------------|-----------|
| "text"  | SplitText | 10 | 24 chars × 2f stagger | 58f | 92f | ✓ PASS |
```

If ANY row shows breathing < 45f → STOP and fix before continuing. This is not optional.

### Step 5: Open Remotion Studio for User Preview (BLOCKING — never skip)

**NEVER render directly. ALWAYS open Remotion Studio first and let the user preview.**

```bash
# Start studio on an available port
npx remotion studio --port <available-port>
# Then open in browser for the user
open http://localhost:<port>
```

Tell the user the URL and WAIT for their feedback. Only proceed to render after the user confirms the video looks good. The user may request changes — iterate until approved.

**Why this step exists:** Rendering takes time. If the video has visual bugs (cropped images, animations cut off, bad pacing), the user discovers them AFTER waiting for a render. Studio preview catches issues in seconds.

### Step 6: Render (only after user approval)

```bash
npm run render
# or manually: npx remotion render --codec h264 --crf 16 --color-space bt709 --image-format png
```

## Premium vs Template

| Premium ($50k) | Template (avoid) |
|---|---|
| Logo animation opens the video | No logo or text-only logo |
| BGM with beat-synced transitions | Silent or stock music slapped on |
| Full product UI mockups | Text on gradient background |
| Real brand assets inside UI chrome | Pure code mockups, no screenshots |
| Per-character text stagger | Entire text block fades in |
| SVG chart path-drawing | Big numbers with no visualization |
| Spring physics (overshoot + settle) | Linear or basic ease |
| easeOutExpo (Apple keynote feel) | Cubic or bounce easing |
| 40s with breathing room | 30s of rushing through features |
| Film grain + vignette + color grade | Perfectly clean digital |
| One typeface, weight contrast 300-600 | Multiple fonts or bold 700+ |
