---
name: remotion-best-practices
description: Best practices for Remotion - Video creation in React
metadata:
  tags: remotion, video, react, animation, composition
---

## When to use

Use this skill whenever you are dealing with Remotion code to obtain the domain-specific knowledge.

> **Note on structure:** detailed UDS icon recipes (`rules/shared-uds-icons.md`) and the
> motion / text-rendering rules (`rules/shared-motion-text.md`) are split into rule files but
> are **always in effect** (auto-included). Other Remotion features (audio, video, captions,
> transitions, 3D, maps, voiceover, …) live in `rules/*.md` and are out of scope for the
> silent interface illustrations this pipeline produces — load them on demand only if a brief
> genuinely needs one. See the reference index at the bottom.

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
expressed as `interpolate(frame, ...)`. Detailed fade / typing / text-stability rules are in
`rules/shared-motion-text.md` (always in effect).

## Colors & design tokens — use `@ionos-web-design-system/core`, never Figma token paths

The template bundles `@ionos-web-design-system/core` brand CSS, and the composition renders
inside `<ThemeProvider>` under a `data-brand` root, so the brand's **semantic CSS custom
properties resolve live**. Color UI with those real tokens or with a literal brand hex.

**NEVER write a Figma token path as a CSS variable.** `var(--brand/ionos-blue-600)`,
`var(--brand-ionos-blue-600)`, `var(--neutral/white)` — none of these exist as CSS custom
properties. The `/` makes the `var()` a **parse error** (and the hyphenated `--brand-*` form
isn't defined either), so the whole declaration is **dropped** — and the hex fallback is NOT
applied, because a malformed/undefined-name `var()` fails before the fallback is reached. The
element ends up transparent/unstyled, which silently destroys contrast (e.g. white icons on a
pill whose background vanished → invisible). The `/`-paths in `uds-style-guide` are **Figma
hierarchy notation for reference only — never valid CSS.**

Two correct options:

1. **Semantic core tokens** (valid CSS custom properties — resolve per brand/scheme). Use a
   `--surface-*` background WITH its matching `--text-*` foreground — the pair is contrast-checked:

   | Role | Background token | Foreground (text/icon) token |
   |---|---|---|
   | Default card / panel | `var(--surface-base)` | `var(--text-base)` |
   | Inverted (dark) chip / pill / toolbar | `var(--surface-base-invert)` | `var(--text-base-invert)` |
   | Subtle / subtlest backdrop | `var(--surface-subtle)` / `var(--surface-subtlest)` | `var(--text-base)` |
   | AI accent surface | `var(--surface-semantic-ai)` | `var(--text-semantic-ai)` |
   | Success / danger / promo / caution | `var(--surface-semantic-<role>)` | `var(--text-semantic-<role>)` |

   ```tsx
   // ✓ dark pill, accessible icons — surface + its paired text token
   <div style={{ background: 'var(--surface-base-invert)', borderRadius: 999, padding: '12px 20px' }}>
     <Icon color="var(--text-base-invert)" />
   </div>
   ```

2. **Literal brand hex** from `uds-style-guide` for a specific brand-scale colour (there is no
   core CSS var for the brand colour scale): `background: '#003D8F'` (IONOS Blue),
   `color: '#fff'`. If you give a container a hex background, set the icon/text colour explicitly
   so the pair is legible — never rely on a `var()` that might not resolve.

**Accessibility rule:** an icon's or text's colour must contrast against the colour that
actually paints behind it. Pick the surface and its foreground together; never pair an
unverified `var()` background with a hardcoded light foreground.

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

## Images & assets

Place assets in the `public/` folder and reference them with `staticFile()` via the `<Img>` component:

```tsx
import { Img, staticFile } from "remotion";

export const MyScene = () => {
  return <Img src={staticFile("logo.png")} style={{ width: 100, height: 100 }} />;
};
```

For UDS icons (system, brandmark, brand product, social), see `rules/shared-uds-icons.md`
(always in effect). For catalog assets, see the `# Available assets` block in the brief.

## Sequencing & timing

To delay content, wrap it in `<Sequence>` and use `from`. To limit duration, use
`durationInFrames`. `<Sequence>` is an absolute fill by default — for inline content use `layout="none"`.

```tsx
import { Sequence } from "remotion";

const Main = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <Sequence><Background /></Sequence>
      <Sequence from={1 * fps} durationInFrames={2 * fps} layout="none"><Title /></Sequence>
      <Sequence from={2 * fps} durationInFrames={2 * fps} layout="none"><Subtitle /></Sequence>
    </AbsoluteFill>
  );
};
```

## Composition metadata — `src/Root.tsx`

Width, height, fps and duration are defined in `src/Root.tsx`. Set `width`/`height` from the
brief's dimensions and `durationInFrames` from `durationSec * fps`:

```tsx
import { Composition } from "remotion";
import { MyComposition } from "./Composition";

export const RemotionRoot = () => (
  <Composition id="MyComposition" component={MyComposition}
    durationInFrames={100} fps={30} width={1080} height={1080} />
);
```

For data-driven or dynamically sized compositions, use `calculateMetadata` — see
[rules/calculate-metadata.md](rules/calculate-metadata.md).

## Starting preview

```bash
npx remotion studio
```

## Optional: one-frame render check

Render a single frame to sanity-check layout, colors, or timing. Skip it for trivial edits.

```bash
npx remotion still [composition-id] --scale=0.25 --frame=30
```

At 30 fps, `--frame=30` is the one-second mark (`--frame` is zero-based).

## Reference rules (load on demand)

Always in effect (auto-included): `shared-uds-icons.md`, `shared-motion-text.md`.

Relevant to interface illustrations — load the file when a brief needs it:
[timing.md](rules/timing.md) (advanced interpolate/Bézier/springs) ·
[transitions.md](rules/transitions.md) · [text-animations.md](rules/text-animations.md) ·
[sequencing.md](rules/sequencing.md) · [tailwind.md](rules/tailwind.md) ·
[images.md](rules/images.md) (sizing/positioning) · [transparent-videos.md](rules/transparent-videos.md) ·
[calculate-metadata.md](rules/calculate-metadata.md) · [compositions.md](rules/compositions.md) ·
[parameters.md](rules/parameters.md) · [measuring-text.md](rules/measuring-text.md) ·
[local-fonts.md](rules/local-fonts.md).

Out of scope for silent interface illustrations (present in `rules/` but normally unused):
audio, video, captions/subtitles, ffmpeg, silence-detection, audio-visualization, sfx, 3d,
gifs, lottie, light-leaks, maps, voiceover, html-in-canvas, measuring-dom-nodes,
get-audio/video-duration, get-video-dimensions, google-fonts.
