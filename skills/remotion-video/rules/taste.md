# Design Taste & Anti-AI-Slop

Design principles, cognitive psychology, quality gates, and the patterns to NEVER use.

## AI Slop Blacklist

These patterns instantly signal "AI-generated." Never use:

- Purple/violet gradient backgrounds or blue-to-purple color schemes
- 3-column feature grid: icon-in-circle + title + 2-line description × 3
- Icons in colored circles as section decoration
- Center-aligned everything (real design uses left-align in most contexts)
- Uniform border-radius on every element (use radius HIERARCHY)
- Decorative blobs, floating circles, wavy SVG dividers
- Emoji as design elements
- Colored left-border on cards (`border-left: 3px solid`)
- Generic hero copy: "Unlock the power of...", "Your all-in-one solution"
- Gradient text for "impact" on metrics/headings
- Hero metric template: big number + small label + gradient accent
- Default dark mode with glowing accents
- Sparklines as decoration conveying nothing
- Large icons with rounded corners above every heading

**The test:** Show this video and say "AI made this." Would they believe immediately? If yes, redesign.

## Design Cognitive Principles

- **One focal point per frame.** Supporting elements recede. Eye travels: hero → detail → ambient.
- **Subtraction default.** When wrong, REMOVE before adding. Fight the "add more" instinct.
- **Constraint worship.** Fixed grid. Consistent spacing. Limited palette. No "feels about right."
- **Specificity over vibes.** "Clean, modern" is NOT a design decision. Name the font, spacing, radius, shadow.
- **Empathy as simulation.** Watch at 1x as a VIEWER. Note every moment you lose focus — those are bugs.

## UX Laws for Video

- **Von Restorff:** The ONE different element gets noticed. In a grid, make the hero card slightly larger/different.
- **Proximity = grouping:** 8px gap = related. 24px gap = separate. Uniform spacing = no relationships.
- **Peak-End Rule:** Viewers remember Act 3 peak + Act 5 ending most. Invest disproportionate polish there.
- **Serial Position:** First and last items remembered best. Strongest feature first, best stat first.
- **Miller's Chunking:** Don't show 12 stats — group into 3 cards of 4. Chunked data is scannable.

## The Squint Test

Blur your eyes at each frame. Can you identify: the most important element? The second? Clear groupings? If everything looks same weight, hierarchy is broken. Build through size + weight + color + position simultaneously.

## Scene Self-Review Checklist

Before finalizing ANY scene:
1. **Squint test:** Blur eyes. Is #1 focal point obvious?
2. **First impression:** Look 1 second, look away. Can you name the hero element?
3. **AI slop test:** Would someone believe "AI made this" immediately?
4. **Remove test:** Cover each element. Does the scene improve? If yes, delete it.
5. **3-second test:** Can a viewer understand in 3 seconds?
6. **Font size test:** Render at 1080p, step back 1 meter. Can you read everything?
7. **Motion test:** Does every animation have purpose? If it just "looks cool," cut it.

## Coherence Checks

- **Aesthetic + Motion:** Minimal aesthetic → subtle motion. Playful → springy.
- **Color + Content:** Dashboards = cool/functional. Brand scenes = warmer.
- **Density + Pacing:** Dense UI → longer hold (90+ frames). Sparse lockup → shorter (60-80).
- **Typography + Hierarchy:** Most important text = largest AND highest contrast.

## Negative Space Is Luxury

Premium videos are 40% empty space. Headlines: 80%+ empty. UI demos: generous padding (60-80px). Filling every pixel signals desperation. If you squint and see noise, remove until you see calm.

## Pacing: Let Content Breathe

40 seconds is better than 30 seconds of rushing. Each scene needs:
- **Entrance:** 15-20 frames for spring animation
- **Hold:** 80-120 frames to absorb the content
- **Exit:** 10-15 frames fade

If the viewer can't read the text before it transitions, the scene is too short. Better to cut a feature than rush four.

## Automatic Readability & Watchability Audit (MANDATORY Step 4.5)

After building all scenes and BEFORE final render, run this self-audit automatically. Do NOT skip.

### Reading Time Validation

For every text element in the video, calculate if it's on screen long enough to be read:

```
Reading time (frames) = word_count × 10 frames/word (at 30fps ≈ 0.33s/word)
Minimum visible frames = reading_time × 1.5 (breathing room)
```

**Audit each scene programmatically by reading the code:**

| Element Type | Minimum Hold (frames) | Minimum Hold (seconds) |
|---|---|---|
| Logo animation | 90f | 3s |
| Headline (3-5 words) | 60f | 2s |
| Subtitle (8-15 words) | 90f | 3s |
| UI mockup (dense) | 120f | 4s |
| Product screenshot | 90f | 3s |
| Data dashboard | 120f | 4s |
| CTA / close | 90f | 3s |
| Typing animation | text.length / speed + 30f buffer | varies |

### How to Audit

After writing all scenes, scan every `Sequence` `durationInFrames` and compare against the content inside:

```
AUDIT CHECKLIST (run mentally for each scene):
1. Count words in all visible text
2. Calculate minimum reading time
3. Compare against Sequence durationInFrames
4. If duration < minimum → EXTEND the sequence
5. Check typing animations finish before scene ends (charCount reaches text.length)
6. Verify no text appears in the last 15 frames (too late to read before transition)
```

### Auto-Fix Rules

- **Scene too short for text:** Extend `durationInFrames`, reduce total acts if needed
- **Typing doesn't finish:** Increase `speed` parameter or extend scene
- **Text appears too late:** Reduce `delay` parameter
- **Too many features rushed:** Cut the weakest feature, give remaining ones more time
- **UI mockup flashes by:** Minimum 4s (120f) for any dense UI
- **SplitText/stagger not done before fade:** `delay + charCount × staggerFrames + 45f < durationInFrames`
- **Animation still playing when scene cuts:** BLOCKING — extend scene or speed up animation

### Font Size Validation

- Minimum 28px for ANY text in the video (tested at 1080p)
- Headlines: 64-88px
- Body text: 24-28px
- Labels/captions: 24px minimum
- If text is smaller than 24px at 1920x1080, it WILL be unreadable on mobile

**NEVER ship a video without running this audit.** If any scene fails, fix it before rendering.
