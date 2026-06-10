---
name: remotion-best-practices
description: Best practices for Remotion - Video creation in React
metadata:
  tags: remotion, video, react, animation, composition
---

## When to use

Use this skills whenever you are dealing with Remotion code to obtain the domain-specific knowledge.

## New project setup

When in an empty folder or workspace with no existing Remotion project, scaffold one using:

```bash
npx create-video@latest --yes --blank --no-tailwind my-video
```

Replace `my-video` with a suitable project name.

## Required file structure

The pipeline's preview and debug endpoints require these exact filenames:

- **`src/Composition.tsx`** — the main composition component (MUST use this name)
- **`src/Root.tsx`** — registers the composition via `<Composition>` from remotion

Helper components may live in additional files (e.g. `src/PopOut.tsx`, `src/icons.ts`),
but the root component that `Root.tsx` imports MUST be `./Composition`. Never name it
`MyComposition.tsx`, `AppAnimation.tsx`, or any other name.

## Font loading — REQUIRED before first frame

Fonts must be fully loaded before Remotion renders any frame. Without this, headless Chrome
falls back to a system font for the first frames and then switches — causing a visible flash
or jitter in the output video.

The remotion-starter template pre-bundles **all UDS brand fonts** in `public/fonts/`. Font loading is handled by `src/fonts.ts`, called unconditionally from **`src/index.ts`** (the bundle entry point — never rewritten by the agent). You do not need to write font loading code. Use font-family names directly in inline styles:

```tsx
// src/Composition.tsx — just use font-family names; loading is handled by index.ts.
//   fontFamily: 'Open Sans'     → IONOS body
//   fontFamily: 'Overpass'      → IONOS heading
//   fontFamily: 'Poppins'       → Strato
//   fontFamily: 'AntennaCond'   → Fasthosts
//   fontFamily: 'Azo Sans'      → home.pl
//   fontFamily: 'Montserrat'    → Strefa
//   fontFamily: 'Inter'         → UDAG / World4You body
//   fontFamily: 'Satoshi'       → World4You heading
//   fontFamily: 'FS Blake'      → Arsys heading
```

**Do NOT modify `src/index.ts`** — it is the bundle entry point and must not be changed.

If you need to load additional fonts in a one-off composition outside the template, use the same `delayRender` + `FontFace` pattern:

```tsx
import { continueRender, delayRender, staticFile } from 'remotion';

const fontHandle = delayRender('Loading fonts');
const _fontSafety = setTimeout(() => continueRender(fontHandle), 8000);

new FontFace('MyFont', `url(${staticFile('fonts/MyFont-Regular.woff2')}) format('woff2')`)
  .load()
  .then((face) => {
    clearTimeout(_fontSafety);
    document.fonts.add(face);
    continueRender(fontHandle);
  })
  .catch(() => { clearTimeout(_fontSafety); continueRender(fontHandle); });
```

Bundled fonts by brand — all loaded automatically via `loadBrandFonts()`:

| Brand | Body font | Heading font | Font source |
|---|---|---|---|
| IONOS | Open Sans | Overpass | Google Fonts |
| Strato | Poppins | Poppins | Google Fonts |
| Fasthosts | AntennaCond | AntennaCond | ⚠ Proprietary (.woff) |
| home.pl | Azo Sans | Azo Sans | ⚠ Commercial |
| Strefa | Montserrat | Montserrat | Google Fonts |
| UDAG | Inter | Inter | Google Fonts |
| World4You | Inter | Satoshi | Google Fonts / Fontshare |
| Arsys | Open Sans | FS Blake | Open Sans: GF; FS Blake: ⚠ Proprietary |

Do not use `@remotion/google-fonts` or CDN links — network calls are unreliable in the headless renderer. All fonts are already bundled locally. See [rules/local-fonts.md](rules/local-fonts.md) for the manual pattern if needed.

## All motion is frame-driven — NEVER use CSS transitions or animations

Remotion renders each frame as an independent, static snapshot in headless Chrome. CSS
`transition` and `@keyframes`/`animation` never run during a render — they depend on
wall-clock time the renderer doesn't advance. The ONLY way to animate is to read
`useCurrentFrame()` and compute values with `interpolate()` / `spring()`.

This is enforced by an eslint gate that **fails the build** on these inline-style properties:
`transition`, `transitionProperty`, `animation`, `animationName` — and on Tailwind
`transition-*` / `animate-*` classes.

```tsx
const frame = useCurrentFrame();

// ❌ WRONG — CSS transition: silently does nothing on render AND fails the eslint gate
<div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.3s ease' }} />
// ❌ WRONG — CSS keyframe animation: same
<div style={{ animation: 'fadeIn 0.5s ease forwards' }} />
// ❌ WRONG — Tailwind animation utilities
<div className="transition-opacity duration-300 animate-pulse" />

// ✓ CORRECT — compute the animated value from the current frame
const opacity = interpolate(frame, [0, 15], [0, 1], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
<div style={{ opacity }} />
```

There is no exception — hover/enter/exit effects, pulses, spinners, and easing must all be
expressed as `interpolate(frame, ...)`. If you catch yourself typing `transition:` or
`animation:` in a style object, replace it with a frame-driven value.

## Fade-in animations — always ease opacity, match duration to transform

Linear opacity looks like a flash. Always apply the same easing to `opacity` as to the
accompanying `transform`. Minimum fade duration for premium pacing: **20 frames** (0.67s at 30fps).

```tsx
// ❌ WRONG — linear opacity flashes; transform eases but opacity doesn't
const opacity   = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
const translateY = interpolate(frame, [0, 15], [20, 0], { easing: Easing.bezier(0.16, 1, 0.3, 1), extrapolateRight: 'clamp' });

// ✓ CORRECT — same easing on both, 20+ frame window
const progress  = interpolate(frame, [0, 25], [0, 1], {
  easing: Easing.bezier(0.16, 1, 0.3, 1),
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
const opacity    = progress;                                    // shares easing
const translateY = interpolate(progress, [0, 1], [20, 0]);     // driven by same value
```

Derive both `opacity` and `transform` from the **same eased progress variable** so they are
guaranteed to move in sync. Never interpolate opacity separately with different timing.

## Typing / text reveal animations — always use .slice(), never per-character opacity

Per the official Remotion text-animations skill: **always use string slicing for typewriter
effects. Never use per-character opacity** (per-word spans cause reflow and jitter).

```tsx
// ✓ CORRECT — single .slice() node, stable layout
const CHAR_FRAMES = 2;                     // frames per character
const BLINK_FRAMES = 16;                   // cursor cycle length

const charCount = Math.min(
  text.length,
  Math.floor(frame / CHAR_FRAMES),
);
const typedText = text.slice(0, charCount);

// Cursor blink — frame-driven opacity cycle
const cursorOpacity = interpolate(
  frame % BLINK_FRAMES,
  [0, BLINK_FRAMES / 2, BLINK_FRAMES],
  [1, 0, 1],
  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
);

// ⚠ Multi-line containers: reserve final height with a visibility:hidden ghost so the
// layout height never changes as lines wrap during the reveal.
<div style={{ position: 'relative' }}>
  {/* Ghost: reserves the full text's layout height — prevents container-height jitter */}
  <div style={{ visibility: 'hidden', pointerEvents: 'none',
                fontFamily: 'Overpass', fontSize: 20, lineHeight: 1.4,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
    {text}
  </div>
  {/* Overlay: renders the sliced text in the reserved space */}
  <div style={{ position: 'absolute', inset: 0,
                fontFamily: 'Overpass', fontSize: 20, lineHeight: 1.4,
                whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#001B41',
                overflow: 'hidden' }}>
    {typedText}
    <span style={{ opacity: cursorOpacity }}>&#x258C;</span>
  </div>
</div>

// ❌ WRONG — per-word span opacity causes reflow
// ❌ WRONG — clipPath wipe looks like a reveal, not typing
```

## Text rendering stability — no live transforms on text containers

Text glyphs re-rasterize whenever their ancestor transform changes — each sub-pixel offset
produces different antialiasing, which reads as **shimmer/jitter**. Images interpolate
smoothly at sub-pixel offsets; text does not. Three rules:

**1. Never apply slow continuous drift to elements containing readable text.**
A drift of `interpolate(frame, [60, 180], [0, -15])` = 0.125px/frame re-rasterizes every
glyph every frame. Apply drift to image/shape layers only — or freeze it while text is
visible or typing:

```tsx
// ❌ WRONG — typed text inside a continuously drifting card → per-frame glyph shimmer
<div style={{ transform: `translateY(${frameDrift}px)` }}>{typedText}</div>

// ✓ CORRECT — drift the image-heavy product frame; keep the text card static
<div style={{ transform: `translateY(${frameDrift}px)` }}>{/* frame: images, bars */}</div>
<div style={{ /* no drift */ }}>{typedText}</div>
```

**2. Springs never settle — clamp them after the entrance.**
`spring()` asymptotes toward 1, emitting 0.9991 → 1.0003 → 0.9998… for dozens of frames
after the visible settle. Scale/translate driven by an unsettled spring keeps text
re-rasterizing. Either snap to the exact rest value, or use the bezier overshoot curve
(per the official timing guidance) which terminates exactly when clamped:

```tsx
// Option A — snap the spring once visually settled
const raw = spring({ frame: frame - 40, fps, config: { damping: 18, stiffness: 120 } });
const settled = raw > 0.995 ? 1 : raw;

// Option B (preferred for text-bearing cards) — bezier overshoot, exact terminal value
const enter = interpolate(frame, [40, 65], [0, 1], {
  easing: Easing.bezier(0.34, 1.56, 0.64, 1),   // spring-like overshoot, ends at exactly 1
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
```

**3. Scale must rest at exactly 1.0 while text renders.**
Glyph hinting at scale 0.97 differs from scale 1.0. An entrance may pass through fractional
scales, but the animation must end with `scale(1)` exactly — and typing must not start
until the container's transform has reached its terminal values.

**Sequencing rule:** complete all card transforms first (entrance, scale, settle), THEN
start the typing beat. Overlapping a typing animation with a moving/scaling ancestor is
the most common cause of typography jitter.

## Designing a video

Animate properties using `useCurrentFrame()` and `interpolate()`. Use Easing to customize the timing of the animation.

```tsx
import { useCurrentFrame, Easing } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return <div style={{ opacity }}>Hello World!</div>;
};
```

CSS transitions or animations are FORBIDDEN - they will not render correctly.  
Tailwind animation class names are FORBIDDEN - they will not render correctly.

## UDS icons in Remotion — use the svgData inline approach

**Do NOT use UDS icon inject functions or CSS class names in Remotion compositions.**
Both approaches depend on CSS being injected at runtime — inject functions call
`document.createStyleSheet()` per frame (causes jitter), and CSS file imports are
processed by loaders that may mangle the base64 `url("data:...")` mask-image values.
Neither is reliable in Remotion's headless renderer.

**Use the `svgData` inline approach instead.** Every UDS icon module exports a `svgData`
property (a `data:image/svg+xml;base64,…` URI). Import it directly and apply it via
React inline styles — no CSS, no loaders, deterministic on every frame.

Import from the individual module path (bypasses the barrel's inject-function-only exports):
```tsx
// @ts-ignore — deep import for svgData; exportsFields is disabled in the render pipeline
import { svgData as arrowTopSvg } from '@ionos-web-design-system/icon/dist/system/arrow-top';
// @ts-ignore
import { svgData as ionosLightSvg } from '@ionos-web-design-system/icon/dist/brandmark/ionos-light';
```

**System icons** — monochrome SVG mask; colour controlled via `backgroundColor`:
```tsx
<div style={{
  display: 'inline-block',
  width: 24,
  height: 24,
  backgroundColor: '#ffffff',            // icon colour
  WebkitMaskImage: `url(${arrowTopSvg})`,
  maskImage: `url(${arrowTopSvg})`,
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
}} />
```

**Brandmark logos** — full-colour SVG; no colour override needed:
```tsx
<div style={{
  display: 'inline-block',
  width: 80,
  height: 24,
  backgroundImage: `url(${ionosLightSvg})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'contain',
  backgroundPosition: 'left center',
}} />
```

**Module path convention** — camelCase inject-function name → kebab-case file name:
`arrowRight` → `/dist/system/arrow-right` | `plus` → `/dist/system/plus` |
`ionosDark` → `/dist/brandmark/ionos-dark` | `ionosLight` → `/dist/brandmark/ionos-light`

**Do NOT import the CSS files** (`system.css`, `brandmark.css`) — they are not needed
with this approach and will be ignored or mangled by the preview bundler.

Place assets in the `public/` folder at your project root.

Use `staticFile()` to reference files from the `public/` folder.

Add images using the `<Img>` component:

```tsx
import { Img, staticFile } from "remotion";

export const MyScene = () => {
  return <Img src={staticFile("logo.png")} style={{ width: 100, height: 100 }} />;
};
```

Add videos using the `<Video>` component from `@remotion/media`:

```tsx
import { Video } from "@remotion/media";
import { staticFile } from "remotion";

export const MyScene = () => {
  return <Video src={staticFile("video.mp4")} style={{ opacity: 0.5 }} />;
};
```

Add audio using the `<Audio>` component from `@remotion/media`:

```tsx
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";

export const MyScene = () => {
  return <Audio src={staticFile("audio.mp3")} />;
};
```

Assets can be also referenced as remote URLs:

```tsx
import { Video } from "@remotion/media";

export const MyScene = () => {
  return <Video src="https://remotion.media/video.mp4" />
};
```

To delay content wrap it in `<Sequence>` and use `from`.
To limit the duration of an element, use `durationInFrames` of `<Sequence>`.
`<Sequence>` by default is an absolute fill. For inline content, use `layout="none"`.

```tsx
import { Sequence } from "remotion";

export const Title = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  return <div style={{ opacity }}>Title</div>;
};

export const Subtitle = () => {
  return <div>Subtitle</div>;
};

const Main = () => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      <Sequence>
        <Background />
      </Sequence>
      <Sequence from={1 * fps} durationInFrames={2 * fps} layout="none">
        <Title />
      </Sequence>
      <Sequence from={2 * fps} durationInFrames={2 * fps} layout="none">
        <Subtitle />
      </Sequence>
    </AbsoluteFill>
  );
}
```

The width, height, fps, and duration of a video is defined in `src/Root.tsx`:

```tsx
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      durationInFrames={100}
      fps={30}
      width={1080}
      height={1080}
    />
  );
};
```

Metadata can also be calculated dynamically:

```tsx
import { Composition, CalculateMetadataFunction } from "remotion";
import { MyComposition, MyCompositionProps } from "./Composition";

const calculateMetadata: CalculateMetadataFunction<
  MyCompositionProps
> = async ({ props, abortSignal }) => {
  const data = await fetch(`https://api.example.com/video/${props.videoId}`, {
    signal: abortSignal,
  }).then((res) => res.json());

  return {
    durationInFrames: Math.ceil(data.duration * 30),
    props: {
      ...props,
      videoUrl: data.url,
    },
    width: 1080,
    height: 1080,
  };
};

export const RemotionRoot = () => {
  return (
    <Composition
      id="MyComposition"
      component={MyComposition}
      fps={30}
      width={1080}
      height={1080}
      defaultProps={{ videoId: "abc123" }}
      calculateMetadata={calculateMetadata}
    />
  );
};
```

## Starting preview

Start the Remotion Studio to preview a video:

```bash
npx remotion studio
```

## Optional: one-frame render check

You can render a single frame with the CLI to sanity-check layout, colors, or timing.  
Skip it for trivial edits, pure refactors, or when you already have enough confidence from Studio or prior renders.

```bash
npx remotion still [composition-id] --scale=0.25 --frame=30
```

At 30 fps, `--frame=30` is the one-second mark (`--frame` is zero-based).

## Captions

When dealing with captions or subtitles, load the [./rules/subtitles.md](./rules/subtitles.md) file for more information.

## Using FFmpeg

For some video operations, such as trimming videos or detecting silence, FFmpeg should be used. Load the [./rules/ffmpeg.md](./rules/ffmpeg.md) file for more information.

## Silence detection

When needing to detect and trim silent segments from video or audio files, load the [./rules/silence-detection.md](./rules/silence-detection.md) file.

## Audio visualization

When needing to visualize audio (spectrum bars, waveforms, bass-reactive effects), load the [./rules/audio-visualization.md](./rules/audio-visualization.md) file for more information.

## Sound effects

When needing to use sound effects, load the [./rules/sfx.md](./rules/sfx.md) file for more information.

## 3D content

See [rules/3d.md](rules/3d.md) for 3D content in Remotion using Three.js and React Three Fiber.

## Advanced audio

See [rules/audio.md](rules/audio.md) for advanced audio features like trimming, volume, speed, pitch.

## Dynamic duration, dimensions and data

See [rules/calculate-metadata.md](rules/calculate-metadata.md) for dynamically set composition duration, dimensions, and props.

## Advanced compositions

See [rules/compositions.md](rules/compositions.md) for how to define stills, folders, default props and for how to nest compositions.

## Google Fonts

The recommended way to load fonts in standard Remotion projects. See [rules/google-fonts.md](rules/google-fonts.md) for how to load Google Fonts. Note: not suitable for headless renderers with restricted network access — use the preloaded local font approach described in the font loading section above.

## Local fonts

See [rules/local-fonts.md](rules/local-fonts.md) for how to load local fonts.

## Getting audio duration

See [rules/get-audio-duration.md](rules/get-audio-duration.md) for getting the duration of an audio file in seconds with Mediabunny.

## Getting video dimensions

See [rules/get-video-dimensions.md](rules/get-video-dimensions.md) for getting the width and height of a video file with Mediabunny.

## Getting video duration

See [rules/get-video-duration.md](rules/get-video-duration.md) for getting the duration of a video file in seconds with Mediabunny.

## GIFs

See [rules/gifs.md](rules/gifs.md) for how to display GIFs synchronized with Remotion's timeline.

## Advanced Images

See [rules/images.md](rules/images.md) for sizing and positioning images, dynamic image paths, and getting image dimensions.

## Light leaks

See [rules/light-leaks.md](rules/light-leaks.md) for light leak overlay effects using `@remotion/light-leaks`.

## Lottie animations

See [rules/lottie.md](rules/lottie.md) for embedding Lottie animations in Remotion.

## HTML in canvas

See [rules/html-in-canvas.md](rules/html-in-canvas.md) if you need to render HTML into a `<canvas>` to apply 2D or WebGL effects via `<HtmlInCanvas>`.

## Measuring DOM nodes

See [rules/measuring-dom-nodes.md](rules/measuring-dom-nodes.md) for measuring DOM element dimensions in Remotion.

## Measuring text

See [rules/measuring-text.md](rules/measuring-text.md) for measuring text dimensions, fitting text to containers, and checking overflow.

## Advanced sequencing

See [rules/sequencing.md](rules/sequencing.md) for more sequencing patterns - delay, trim, limit duration of items.

## TailwindCSS

See [rules/tailwind.md](rules/tailwind.md) for using TailwindCSS in Remotion.

## Text animations

See [rules/text-animations.md](rules/text-animations.md) for typography and text animation patterns.

## Advanced timing

See [rules/timing.md](rules/timing.md) for advanced timing with `interpolate` and Bézier easing, and springs.

## Transitions

See [rules/transitions.md](rules/transitions.md) for scene transition patterns.

## Transparent videos

See [rules/transparent-videos.md](rules/transparent-videos.md) for rendering out a video with transparency.

## Trimming

See [rules/trimming.md](rules/trimming.md) for trimming patterns - cutting the beginning or end of animations.

## Advanced Videos

See [rules/videos.md](rules/videos.md) for advanced knowledge about embedding videos - trimming, volume, speed, looping, pitch.

## Parameterized videos

See [rules/parameters.md](rules/parameters.md) for making a composition parametrizable by adding a Zod schema.

## Maps

For simple maps with little flyovers, consider using static map images.
For complex maps with animated routes or flyovers, load the maps rule: [rules/maplibre.md](rules/maplibre.md)

## Voiceover

See [rules/voiceover.md](rules/voiceover.md) for adding AI-generated voiceover to Remotion compositions using ElevenLabs TTS.
