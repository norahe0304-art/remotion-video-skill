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

**Priority: video > PNG. Always attempt video download first.**

```bash
# 1. YouTube / Vimeo / most video platforms — USE yt-dlp (PREFERRED)
yt-dlp -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" \
  -o public/brand/demo-full.mp4 "https://youtube.com/watch?v=XXXX"
ffmpeg -i public/brand/demo-full.mp4 -ss 0 -t 8 -c copy public/brand/demo.mp4

# 2. Search YouTube when no direct URL available
yt-dlp "ytsearch1:BrandName official product demo 2024" \
  -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" \
  -o public/brand/demo-full.mp4
ffmpeg -i public/brand/demo-full.mp4 -ss 0 -t 8 -c copy public/brand/demo.mp4

# 3. Direct CDN mp4: download and trim (keep clips ≤8s)
curl -o public/brand/demo.mp4 "https://cdn.brand.com/video.mp4"
ffmpeg -i public/brand/demo.mp4 -t 8 -c copy public/brand/demo-trimmed.mp4

# 4. Vimeo fallback: extract HLS from config endpoint
curl -H "Referer: https://brand-site.com" \
  "https://player.vimeo.com/video/{id}/config" | jq '.request.files.hls'
ffmpeg -i {hls_url} -t 8 -c copy public/brand/clip.mp4
```

**NEVER say "video not downloadable" if yt-dlp is available.** Most brand sites embed YouTube/Vimeo videos that yt-dlp handles. Search YouTube as fallback.

### Logo Safety Rules

- **NEVER hand-write or approximate SVG path data** — it WILL render broken
- Fetch the exact file: `favicon.svg`, header `<svg>`, or `og:image`
- Replace CSS variables (`var(--color)`) with solid hex for Remotion compatibility
- Test render the logo at target size before building scenes around it
- **`fill="currentColor"` SVGs on dark backgrounds:** Many brand SVGs use `fill="currentColor"` which inherits text color. On dark backgrounds, the logo may be invisible (dark fill on dark bg). Fix: add `filter: brightness(0) invert(1)` on the `<Img>` style to force white, AND set `color: '#EDEDF3'` on the parent div as a `currentColor` override. Always check the SVG source for `currentColor` before using.

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

## staticFile() is the ONLY Way to Reference Assets

**ALWAYS use `staticFile()` for ALL asset references. No exceptions.**

```tsx
// ✅ CORRECT — always use staticFile()
<Img src={staticFile("brand/wordmark.svg")} />
<Audio src={staticFile("brand/bgm.mp3")} />
<OffthreadVideo src={staticFile("brand/demo.mp4")} />
backgroundImage: `url(${staticFile("brand/logo.svg")})`

// ❌ FATAL — hardcoded localhost URLs WILL break in production/other machines
<Img src="http://localhost:8888/brand/wordmark.svg" />
<Audio src="http://localhost:8888/brand/bgm.mp3" />
```

**NEVER use `http://localhost:8888/` URLs in committed code.** This was a dev workaround that caused production breakage across multiple projects. If `staticFile()` fails in dev mode, debug the Remotion config — don't bypass it with localhost hacks.

After any code generation, `grep -r "localhost:8888" src/` and fix ALL matches before considering the task done.

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
  return <Audio src={staticFile("brand/bgm.mp3")} volume={volume} />;
};
```

**Volume levels:** BGM 0.2-0.3 (subtle), SFX 0.3-0.5 (noticeable), VO 0.9-1.0 (dominant).

## Critical API Gotcha: evolvePath

`evolvePath(progress, path)` from `@remotion/paths` returns `{ strokeDasharray: string, strokeDashoffset: string }` — NOT a path string. **Never assign the return value to a `d` attribute.** Use destructuring:

```tsx
// CORRECT
const { strokeDasharray, strokeDashoffset } = evolvePath(progress, originalPath);
<path d={originalPath} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />

// WRONG — will render "[object Object]" as path data
const evolved = evolvePath(progress, originalPath);
<path d={evolved} />  // ← BROKEN
```

The scaffold's `PathDraw` and `MorphTransition` components already handle this correctly.

## BGM Wiring Checklist (MainVideo.tsx)

Every MainVideo.tsx MUST include Audio import and volume envelope. This is easy to forget when scaffold `MainVideo.tsx` only has the TransitionSeries template:

```tsx
import { AbsoluteFill, Audio, staticFile, interpolate, useCurrentFrame } from "remotion";

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const bgmVolume = interpolate(frame, [0, 30, 1170, 1200], [0, 0.4, 0.4, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill>
      <Audio src={staticFile("brand/bgm.mp3")} volume={bgmVolume} />
      {/* ... TransitionSeries ... */}
    </AbsoluteFill>
  );
};
```

**Common miss:** Building agents copy the scaffold but never add the `<Audio>` line because the scaffold template omits it. Always wire BGM as soon as the file exists in `public/brand/bgm.mp3`.

## Icons: lucide-react Only

Never emoji. Import from `lucide-react`, render with `size`, `color`, `strokeWidth={1.5}`:

```tsx
import { Brain, Zap, Shield, Eye, Code2, Globe } from "lucide-react";
<Brain size={32} color={theme.color.accent} strokeWidth={1.5} />
```

Mappings: AI→Brain, Speed→Zap, Security→Shield, Vision→Eye, Code→Code2, Global→Globe

## Screenshot & Image Cropping Safety (MANDATORY)

Downloaded screenshots and product images MUST display with ALL text and UI elements fully visible. Cropped text = broken video.

### Rules

1. **NEVER use `objectFit: "cover"` on product screenshots** — it crops content. Use `objectFit: "contain"` to guarantee nothing is cut off.
2. **If the image is taller than the container:** Use `objectPosition: "top center"` ONLY when the bottom is decorative (footer, empty space). If the bottom has important text or UI, scale the image down to fit instead of cropping.
3. **Before using ANY downloaded image in a scene:** Check the image dimensions. If the aspect ratio doesn't fit the container, adjust the container height to match — do NOT crop the image.
4. **Test every screenshot at render resolution (1920x1080):** If any text is cut off at the edges, the image container is too small. Increase container size or reduce image scale.
5. **Safe zone: 40px padding inside browser chrome / UI frames.** No screenshot content should touch the edge of the frame.

### Anti-Patterns

```tsx
// BAD — crops bottom text
<Img src={screenshot} style={{ width: "100%", height: 500, objectFit: "cover" }} />

// GOOD — shows everything, scales to fit
<Img src={screenshot} style={{ width: "100%", height: "auto", maxHeight: 600, objectFit: "contain" }} />

// GOOD — if you must constrain height, show from top
<Img src={screenshot} style={{ width: "100%", height: 560, objectFit: "cover", objectPosition: "top center" }} />
// ↑ Only acceptable when bottom of image is non-essential
```

### Validation

After placing any image in a scene, mentally check:
- Can I read ALL text in the image at 1080p?
- Is any UI element (button, label, badge) cut off at any edge?
- If the image has a caption or footer, is it fully visible?

If ANY text is cropped → fix the container dimensions before moving on.

## Asset Strategy: MANDATORY Real Assets (Enforced)

**RULE: Every video MUST use real brand assets. No exceptions.**

Priority order for visual content:
1. **Dynamic assets** (video clips from site, `<Video>` component) — ALWAYS preferred
2. **Static assets** (product screenshots, hero images, `<Img>` component) — fallback if no video
3. **Code-built UI mockups** — supplement assets, never replace them entirely

Real assets can be displayed TWO ways:
1. **Inside UI chrome** — video/image fills the CONTENT area of a browser frame, product frame, or device mockup. UI chrome (title bar, sidebar, nav) stays code-built around the asset.
2. **Full-screen / full-bleed** — when the video asset IS the visual (e.g., a product demo reel, a cinematic brand clip, a hands-on interaction shot), let it fill the entire 1920×1080 frame. Don't force it into a browser window when it doesn't need one. Shopify's hands-on demo, Notion's hero reel — these work better full-bleed.

**Choose based on the asset content:**
- Product UI recording (dashboard, editor) → inside browser chrome
- Cinematic / lifestyle / hands-on footage → full-screen
- Marketing reel / sizzle clip → full-screen with optional vignette overlay

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
- Use a video asset that doesn't match the scene context (e.g., a login page video in a "features" scene)

## Asset Relevance Check (MANDATORY)

**Every downloaded video/image MUST make sense for its scene.** Before placing an asset:

1. **Watch the full clip** — does it show the product feature this scene is about?
2. **Match scene narrative** — HookScene asset should show the product's hero moment; ShowcaseScene assets should match specific features being highlighted
3. **Check visual quality** — no watermarks, no low-res upscales, no recording artifacts (mouse cursors, OS notifications)
4. **Brand alignment** — the asset should look like it came from the brand's own marketing, not a random YouTube tutorial

If the downloaded video doesn't match → search for a better one. Don't force a mismatched clip just to "have a real asset."

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
