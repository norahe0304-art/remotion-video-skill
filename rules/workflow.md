# Workflow & Assets

Scraping, logo sourcing, video embedding, icon system, and file organization.

## Step 0: Scrape the Brand (MANDATORY First Step)

ALWAYS fetch the brand's real site before writing any code. This is NON-NEGOTIABLE.

### How to Scrape

Use `bb-browser` (or curl/fetch) to open the brand's landing page and extract:

```bash
# 1. Open the brand site
bb-browser open https://brand-site.com
bb-browser snapshot -i

# 2. Extract CSS variables and computed styles
bb-browser eval "JSON.stringify(getComputedStyle(document.documentElement))"

# 3. Extract all colors, fonts, spacing from CSS custom properties
bb-browser eval "[...document.styleSheets].flatMap(s => [...s.cssRules]).filter(r => r.style).map(r => r.cssText).join('\n')"

# 4. Download the favicon/logo SVG
bb-browser eval "document.querySelector('link[rel*=icon]')?.href"
# Then: curl -o public/brand/logo.svg <URL>

# 5. Extract hero section copy
bb-browser eval "document.querySelector('h1')?.textContent"
bb-browser eval "document.querySelector('[class*=hero] p, [class*=subtitle]')?.textContent"

# 6. Screenshot for visual reference (secondary, not primary)
bb-browser screenshot public/brand/homepage.png
bb-browser close
```

### What to Extract (Checklist)

| Category | What | How |
|----------|------|-----|
| **Colors** | primary, accent, bg, text (exact hex) | CSS variables, computed styles |
| **Typography** | heading font + weight, body font | @font-face rules, Google Fonts link |
| **Logo** | SVG verbatim from favicon or header | Download file directly, NEVER hand-write paths |
| **Hero Copy** | headline, subheadline, CTA text | DOM extraction |
| **Product** | primary interface type (chat? dashboard? editor?) | Visual analysis |
| **Features** | product capabilities, feature names | Page content |
| **Visual Style** | border-radius, spacing, gradient patterns, shadows | CSS inspection |
| **Video Assets** | Vimeo/YouTube embeds, `<video>` tags, CDN URLs | DOM scan |

### Video Asset Extraction

```bash
# Vimeo: extract HLS from config endpoint
curl -H "Referer: https://brand-site.com" \
  "https://player.vimeo.com/video/{id}/config" | jq '.request.files.hls'
# Then trim: ffmpeg -i {hls_url} -t 8 -c copy public/brand/clip.mp4

# Direct CDN mp4: download and trim (keep clips ≤8s)
curl -o public/brand/demo.mp4 "https://cdn.brand.com/video.mp4"
ffmpeg -i public/brand/demo.mp4 -t 8 -c copy public/brand/demo-trimmed.mp4
```

### Logo Safety Rules

- **NEVER hand-write or approximate SVG path data** — it WILL render broken
- Fetch the exact file: `favicon.svg`, header `<svg>`, or `og:image`
- Replace CSS variables (`var(--color)`) with solid hex for Remotion compatibility
- Test render the logo at target size before building scenes around it

### Output

Save everything to `public/brand/`:
```
public/brand/
  logo.svg          — brand icon (verbatim SVG)
  wordmark.svg      — brand wordmark if separate
  homepage.png      — reference screenshot
  demo.mp4          — trimmed video clips (≤8s each)
  hero-image.png    — downloaded hero/product images
```

Build `theme.ts` from scraped values. Never guess colors or fonts.

## staticFile() Workaround (Dev Mode)

Remotion's `staticFile()` may fail to serve images from `public/` in dev mode (returns HTML instead of image data). When this happens:

1. Start a local HTTP server for assets:
```bash
cd public && python3 -m http.server 8888 &
```

2. Use the local URL in components during development:
```tsx
// Dev workaround — use local HTTP server
<Img src="http://localhost:8888/brand/claude-login.png" />

// For production render, switch back to staticFile:
// <Img src={staticFile("brand/claude-login.png")} />
```

3. Before final render (`npm run render`), switch all URLs back to `staticFile()` for portability.

**Why:** The Remotion Studio dev server sometimes intercepts all HTTP paths as SPA routes, returning HTML instead of image binary data. The `<Img>` component then fails silently (blank frame). A separate HTTP server bypasses this.

## BGM / Background Music (MANDATORY)

Every video MUST have background music. Music makes the difference between amateur and premium.

### How to Source BGM (AUTO — never ask user)

BGM sourcing is AUTOMATIC. Do NOT ask the user to provide music. Search and download a free royalty-free track yourself:

```bash
# Step 1: Search Pixabay for a suitable track
# Use keywords based on brand tone: "corporate ambient", "tech cinematic", "minimal electronic"
bb-browser open "https://pixabay.com/music/search/?q=corporate+ambient&duration=30-60"
bb-browser screenshot public/brand/pixabay-search.png

# Step 2: Find a track, get the download URL
# Look for tracks 30-60s, matching the brand tone
# Pixabay tracks are royalty-free, no attribution required

# Step 3: Download and trim
curl -L -o public/brand/bgm-raw.mp3 "<pixabay-download-url>"
ffmpeg -i public/brand/bgm-raw.mp3 -t 45 -af "afade=in:0:d=2,afade=out:st=42:d=3" public/brand/bgm.mp3

# Step 4: Detect BPM for beat sync
ffmpeg -i public/brand/bgm.mp3 -af "atempo=1" -f null - 2>&1 | grep -i bpm
```

**Tone matching guide:**
| Brand Tone | Search Keywords |
|------------|----------------|
| Tech/SaaS | "corporate ambient", "tech minimal", "digital innovation" |
| Creative/Design | "inspiring cinematic", "modern elegant" |
| Startup/Hype | "upbeat technology", "energetic corporate" |
| Enterprise/Serious | "ambient corporate", "calm business" |
| Playful/Consumer | "happy upbeat", "positive modern" |

**Free sources (no attribution needed):**
- Pixabay Music (pixabay.com/music) — best for quick auto-download
- Mixkit (mixkit.co/free-stock-music)
- Uppbeat (uppbeat.io/browse/music)

**NEVER ask the user for music.** Pick a track that matches the brand tone from scraping, download it, trim it, and add it to the video automatically.

### Beat Sync Pattern

Align scene transitions to beat timestamps for rhythmic flow:

```tsx
// beats.ts — generate from BPM
const BPM = 120;
const BEAT_INTERVAL = 60 / BPM; // 0.5s per beat
export const BEATS = Array.from({ length: 80 }, (_, i) => i * BEAT_INTERVAL);

export const isOnBeat = (sec: number, tolerance = 0.05) =>
  BEATS.some(b => Math.abs(sec - b) <= tolerance);
```

### Audio Layer in MainVideo

```tsx
// BGM with fade in/out
const BGM: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const volume = Math.min(
    interpolate(frame, [0, 2 * fps], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [durationInFrames - 3 * fps, durationInFrames], [0.3, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return <Audio src="http://localhost:8888/brand/bgm.mp3" volume={volume} />;
};
```

**Volume levels:** BGM 0.2-0.3 (subtle), SFX 0.3-0.5 (noticeable), VO 0.9-1.0 (dominant).

## Icons: lucide-react Only

Never emoji. Import from `lucide-react`, render with `size`, `color`, `strokeWidth={1.5}`:

```tsx
import { Brain, Zap, Shield, Eye, Code2, Globe } from "lucide-react";
<Brain size={32} color={theme.color.accent} strokeWidth={1.5} />
```

Mappings: AI→Brain, Speed→Zap, Security→Shield, Vision→Eye, Code→Code2, Global→Globe

## Asset Strategy: MANDATORY Real Assets (Enforced)

**RULE: Every video MUST use real brand assets. No exceptions.**

Priority order for visual content:
1. **Dynamic assets** (video clips from site, `<Video>` component) — ALWAYS preferred
2. **Static assets** (product screenshots, hero images, `<Img>` component) — fallback if no video
3. **Code-built UI mockups** — supplement assets, never replace them entirely

Real assets go INSIDE code-built UI chrome:
- Video/image fills the CONTENT area of a browser frame, product frame, or device mockup
- UI chrome (title bar, sidebar, nav, buttons) stays code-built around the asset
- This is the Apple keynote approach: footage plays INSIDE device frames

**At minimum, the video MUST include:**
- At least ONE scene with a real product screenshot/video inside UI chrome
- The brand's REAL logo/wordmark SVG (downloaded, NEVER hand-written)
- At least ONE downloaded hero image or product image from the site

**NEVER:**
- Build an entire video with ZERO real assets (pure code-built UIs only)
- Create standalone "video showcase" scenes (slideshow, not launch video)
- Blur a screenshot to 8% opacity as "atmospheric texture"
- Use a hand-written letter/shape as logo substitute
- Use `<Img>` for content that could be `<Video>`

**Logo is SACRED:**
- Download the exact SVG from the site's favicon, header, or Lottie animation
- NEVER approximate with a styled `<span>` letter (e.g., "C" for Claude)
- NEVER hand-write SVG `<path>` data — it WILL render broken
- Test the logo renders correctly before building scenes around it

## Video Embedding

Prefer `@remotion/media`'s `Video` — auto-falls back to OffthreadVideo in production:

```tsx
import { Video } from "@remotion/media";
<Video src={staticFile("brand/demo.mp4")} />
```

If using core `remotion`, import `OffthreadVideo` directly (NOT from `@remotion/media`).

## Asset Download > Screenshots

- Scrape `<img>`, `og:image`, hero images from brand site
- Downloaded assets > screenshots (higher quality, brand-approved)
- Display at near-full width (900px+), borderRadius 16px, drop shadow
- Screenshots are FALLBACK only

## File Organization

```
src/
  Root.tsx              — Composition registration + Zod schema
  MainVideo.tsx         — 5-act sequencer + audio + grain
  theme.ts              — Brand tokens from scraped site
  fonts.ts              — @remotion/google-fonts setup
  scenes/
    HookScene.tsx        — Act 1: product UI hook
    RevealScene.tsx      — Act 2: logo constellation
    ShowcaseScene.tsx     — Act 3: feature vignettes
    ProofScene.tsx       — Act 4: data dashboard
    CloseScene.tsx       — Act 5: CTA close
  components/
    Background.tsx       — GradientMesh, FilmGrain, Vignette, ColorGrade
    Animations.tsx       — FadeIn, ScaleIn, SplitText, CountUp
public/
  brand/                 — Scraped: logo, images, video clips
```
