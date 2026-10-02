---
name: remotion-best-practices
description: Best practices for Remotion - Video creation in React
metadata:
  tags: remotion, video, react, animation, composition
---

## When to use

Use this skill whenever you are dealing with Remotion code to obtain the domain-specific knowledge.

`rules/shared-uds-icons.md` and `rules/shared-motion-text.md` are always in effect. Other
`rules/*.md` (audio, video, captions, 3D, maps, …) are out of scope for silent interface
illustrations — load one only if a brief genuinely needs it (index at the bottom).

## Required file structure

The pipeline's preview and debug endpoints require these exact filenames:

- **`src/Composition.tsx`** — the main composition component (MUST use this name)
- **`src/Root.tsx`** — registers the composition via `<Composition>` from remotion

Helper components may live in additional files (e.g. `src/PopOut.tsx`, `src/icons.ts`),
but the root component that `Root.tsx` imports MUST be `./Composition`. Never name it
`MyComposition.tsx`, `AppAnimation.tsx`, or any other name.

## Fonts — pre-loaded by the template

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
`var(--brand-ionos-blue-600)`, `var(--neutral/white)` do not exist: the `/` is a parse error, the
declaration is dropped (the hex fallback is NOT applied) and the element renders unstyled. The
`/`-paths in `uds-style-guide` are Figma reference notation only.

Two correct options:

1. **Semantic core tokens** (valid CSS custom properties — resolve per brand/scheme). Use a
   `--surface-*` background WITH its matching `--text-*` foreground — the pair is contrast-checked:

   | Role | Background token | Foreground (text/icon) token |
   |---|---|---|
   | Default card / panel | `var(--surface-base)` | `var(--text-base)` |
   | Inverted (dark) decorative plate / drawn panel | `var(--surface-base-invert)` | `var(--text-base-invert)` |
   | Subtle / subtlest backdrop | `var(--surface-subtle)` / `var(--surface-subtlest)` | `var(--text-base)` |
   | AI accent surface | `var(--surface-semantic-ai)` | `var(--text-semantic-ai)` |
   | Success / danger / promo / caution | `var(--surface-semantic-<role>)` | `var(--text-semantic-<role>)` |

2. **Literal brand hex** from `uds-style-guide` for a brand-scale colour (no core var exists):
   `background: '#003D8F'` (IONOS Blue), `color: '#fff'` — set the foreground explicitly too.

**Accessibility rule:** a drawn icon's or text's colour must contrast against what actually
paints behind it. Pick the surface and its foreground together. (Kit components pair their own.)

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

## Preview

`npx remotion studio`; one frame: `npx remotion still [composition-id] --scale=0.25 --frame=30`
(`--frame` is zero-based).

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
