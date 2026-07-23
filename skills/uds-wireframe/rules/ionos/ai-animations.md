---
name: ionos-wireframe-ai-animations
description: Ready-to-use Remotion templates for IONOS AI feature moments — CTA pill button, text-generation area, image-generation area. Copy directly into Composition.tsx. Preview at http://localhost:4200/ai-templates
motion: [animation]
metadata:
  tags: ionos, ai, animation, remotion, loading, neumorphism, template
---

# IONOS AI Animation Templates

**Live preview:** http://localhost:4200/ai-templates

---

## Shared constants

```tsx
import { svgData as sparklesSvg }   from '@ionos-web-design-system/icon/system/filled-sparkles';
import { svgData as wandSvg }        from '@ionos-web-design-system/icon/system/filled-generative-wand';
import { svgData as writeSvg }       from '@ionos-web-design-system/icon/system/filled-generative-write';
import { svgData as chatAiSvg }      from '@ionos-web-design-system/icon/system/filled-chat-ai';
import { svgData as envelopeAiSvg }  from '@ionos-web-design-system/icon/system/filled-envelope-ai';
// ✗ star / filled-star are NOT AI icons   ✗ filled-ai-phone not yet in package

const AI_GRADIENT    = 'linear-gradient(45deg, #095BB1, #D746F5)'; // CTA — static 45°, NEVER rotate. #095BB1 = var(--color-ai-primary-start), #D746F5 = var(--color-ai-primary-end) — hardcode in Remotion (CSS custom properties may not resolve in a render); see uds-style-guide/rules/ionos-ai-features.md
const AI_PRIMARY_END = '#D746F5';  // var(--color-ai-primary-end) — text/image bars (hardcode in Remotion; see uds-style-guide/rules/ionos-ai-features.md)
const AI_LABEL_COLOR = '#8212C2';  // purple-600 — AI "generating" text colour; see uds-style-guide/rules/ionos-ai-features.md (transient; revert to var(--text-base)/var(--text-subtle) once generation completes)

// Gradient-filled AI icon — background:gradient + maskImage
function aiIconStyle(svgData: string, size: number): React.CSSProperties {
  return {
    width: size, height: size, flexShrink: 0,
    background: AI_GRADIENT,
    maskImage: `url(${svgData})`, WebkitMaskImage: `url(${svgData})`,
    maskSize: 'contain', maskRepeat: 'no-repeat',
    WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat',
  };
}

// Generation area — glass fill + inset neumorphism, no border
// Outer shadow is a plain dim drop (no AI gradient glow); inset layers are static
const AI_AREA_INSET = 'inset 0 2px 3px rgba(255,255,255,0.60), inset 0 -2px 3px rgba(255,255,255,0.70)';
const AI_AREA_SHADOW = `0 2px 12px rgba(0,0,0,0.10), ${AI_AREA_INSET}`;

const AI_AREA_BASE: React.CSSProperties = {
  borderRadius: 16,
  overflow: 'hidden',
  position: 'relative',
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
};
```

---

## Template 1 — AI CTA Pill Button

Full pill, static 45° gradient, glow pulse. `filled-sparkles` is the default icon.
`loadingLabel` swaps text between `triggerFrame` and `loadingEndFrame`.

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

export const AIPillButton: React.FC<{
  fps: number;
  label?: string;
  loadingLabel?: string;
  triggerFrame?: number;
  loadingEndFrame?: number;
}> = ({ fps, label = 'Improve with AI', loadingLabel = 'Generating…', triggerFrame = 0, loadingEndFrame }) => {
  const frame = useCurrentFrame();
  const isLoading    = triggerFrame > 0 && frame >= triggerFrame
    && (loadingEndFrame === undefined || frame < loadingEndFrame);
  const displayLabel = isLoading ? loadingLabel : label;

  const p          = Math.sin((frame % 72) / 72 * Math.PI * 2);
  const outerAlpha = (0.18 + p * 0.10).toFixed(2);
  const press      = spring({ frame: frame - triggerFrame, fps, config: { damping: 18, stiffness: 180 } });
  const scale      = triggerFrame > 0 ? interpolate(press, [0, 0.45, 1], [1, 0.93, 1]) : 1;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 9,
      height: 44, paddingInline: 24, borderRadius: 999,
      background: AI_GRADIENT, color: '#fff',
      fontFamily: '"Open Sans", sans-serif', fontWeight: 600, fontSize: 14,
      // State (idle ↔ loading) is conveyed by the glow pulse + press scale ONLY.
      // Never dim or recolor between states — gradient + opacity stay constant.
      transform: `scale(${scale})`,
      boxShadow: [
        `0 4px ${16 + p * 6}px rgba(9,91,177,0.30)`,
        `0 2px 10px rgba(215,70,245,${outerAlpha})`,
        p > 0 ? `0 0 0 ${(p * 3).toFixed(1)}px rgba(215,70,245,0.06)` : '',
      ].filter(Boolean).join(', '),
    }}>
      <div style={{ ...aiIconStyle(sparklesSvg, 17), background: '#fff' }} />
      {displayLabel}
    </div>
  );
};
```

---

## Floating Highlight Card

Static card chrome (surface, shadow, anatomy): see `shared/floating-card.md`.

Animated Remotion template — spring fly-in entrance, settle-and-snap, typing cursor. Based on
Figma node 64:320.

```tsx
import { useCurrentFrame, spring, interpolate } from 'remotion';

export const AIFloatingHighlight: React.FC<{
  fps: number;
  enterFrame?: number;       // frame when card flies in
  text?: string;             // prompt text or generated headline
  productLabel?: string;
  ctaLabel?: string;
}> = ({ fps, enterFrame = 20, text = '', productLabel, ctaLabel = 'Improve with AI' }) => {
  const frame = useCurrentFrame();

  // Fly in from right with spring overshoot.
  // Snap to 1 once visually settled — springs asymptote and never reach their rest
  // value; an unsettled spring keeps the card's text re-rasterizing every frame
  // (sub-pixel scale/translate changes), which reads as typography shimmer.
  const rawEnter = spring({ frame: frame - enterFrame, fps, config: { damping: 18, stiffness: 120 } });
  const enter  = rawEnter > 0.995 ? 1 : rawEnter;
  const slideX = interpolate(enter, [0, 1], [120, 0]);
  const scale  = interpolate(enter, [0, 0.6, 1], [0.88, 1.04, 1]);
  const opacity = interpolate(frame, [enterFrame, enterFrame + 8], [0, 1], { extrapolateRight: 'clamp' });

  const cursorOn = Math.floor(frame / 16) % 2 === 0 ? 1 : 0;

  return (
    <div style={{
      borderRadius: 40,
      background: 'var(--surface-subtle)',   // opaque surface token — the card is solid, not glass
      padding: '28px 24px 20px',
      boxShadow: '0 16px 48px rgba(0,0,0,0.35)',
      transform: `translateX(${slideX}px) scale(${scale})`,
      opacity,
      display: 'flex', flexDirection: 'column', gap: 16,
      minWidth: 260, maxWidth: 320,
    }}>
      {productLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingInline: 8 }}>
          <div style={aiIconStyle(writeSvg, 22)} />
          <span style={{ font: '700 12px "Overpass", sans-serif', color: AI_LABEL_COLOR }}>
            {productLabel}
          </span>
        </div>
      )}
      {/* Ghost+overlay: ghost reserves height, overlay renders .slice() — no container-height jitter */}
      <div style={{ position: 'relative', paddingInline: 8 }}>
        <div style={{ visibility: 'hidden', pointerEvents: 'none',
                      font: '600 18px/1.35 "Overpass", sans-serif',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {text}
        </div>
        <div style={{ position: 'absolute', inset: 0,
                      font: '600 18px/1.35 "Overpass", sans-serif', color: '#001B41', // Dark Midnight — see ionos/product-frame-color.md
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'hidden' }}>
          {text}
          <span style={{ opacity: cursorOn }}>&#x258C;</span>
        </div>
      </div>
      {/* CTA button — full width, same pill radius. The AI glow lives on the CTA (the card has none). */}
      <div style={{
        borderRadius: 40, background: AI_GRADIENT, color: '#fff',
        height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
        fontFamily: '"Open Sans", sans-serif', fontWeight: 600, fontSize: 15,
        boxShadow: '0 4px 16px rgba(9,91,177,0.30), 0 2px 10px rgba(215,70,245,0.18)', // AI glow — CTA only
      }}>
        <div style={{ ...aiIconStyle(sparklesSvg, 18), background: '#fff' }} />
        {ctaLabel}
      </div>
    </div>
  );
};
```

---

## Template 2 — Text Generation Area

Glass fill + inset neumorphism, no border. Gradient AI icon header + open headline content.

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const AITextGenerationArea: React.FC<{
  startFrame?: number;
  endFrame?: number;
  productLabel?: string;
  generatedText?: string;
}> = ({ startFrame = 0, endFrame = 60, productLabel = 'AI text generation', generatedText = '' }) => {
  const frame = useCurrentFrame();

  const CHAR_FRAMES = 2;
  const BLINK_FRAMES = 16;
  const charCount = Math.min(generatedText.length, Math.floor(
    interpolate(frame, [startFrame, endFrame], [0, generatedText.length / CHAR_FRAMES], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    }) * CHAR_FRAMES
  ));
  const typedText = generatedText.slice(0, charCount);
  const cursorOpacity = interpolate(
    frame % BLINK_FRAMES,
    [0, BLINK_FRAMES / 2, BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <div style={{ ...AI_AREA_BASE, padding: '20px 20px 24px', boxShadow: AI_AREA_SHADOW }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={aiIconStyle(writeSvg, 24)} />
        <span style={{ font: '700 12px "Overpass", sans-serif', color: AI_LABEL_COLOR }}>
          {productLabel}
        </span>
      </div>
      {/* Ghost reserves final height; overlay renders slice — prevents container-height jitter */}
      <div style={{ position: 'relative' }}>
        <div style={{ visibility: 'hidden', pointerEvents: 'none',
                      font: '600 20px/1.35 "Overpass", sans-serif',
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {generatedText}
        </div>
        <div style={{ position: 'absolute', inset: 0,
                      font: '600 20px/1.35 "Overpass", sans-serif', color: '#001B41', // Dark Midnight — see ionos/product-frame-color.md
                      whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflow: 'hidden' }}>
          {typedText}
          <span style={{ opacity: cursorOpacity }}>&#x258C;</span>
        </div>
      </div>
    </div>
  );
};
```

**Sequencing constraint — typing starts only after the parent settles.** Set `startFrame` to AFTER the parent card's entrance animation has fully terminated (snapped spring or clamped bezier at its rest value). While text is typing, every ancestor transform must be static — no drift, no unsettled spring, no fractional scale. A typing animation inside a moving/scaling container re-rasterizes glyphs every frame and shimmers. See remotion-best-practices "Text rendering stability".

---

## Template 3 — Image Generation Area

Same glass container. Bars build in with staggered delays simulating image regions rendering.

```tsx
import { useCurrentFrame, interpolate } from 'remotion';

export const AIImageGenerationArea: React.FC<{
  width?: number;
  height?: number;
  startFrame?: number;
  endFrame?: number;
  productLabel?: string;
}> = ({ width = 400, height = 200, startFrame = 0, endFrame = 60, productLabel = 'AI Image Generator' }) => {
  const frame = useCurrentFrame();

  function barScale(delayFraction: number): number {
    return interpolate(frame, [startFrame + delayFraction * endFrame, endFrame], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });
  }

  return (
    <div style={{ ...AI_AREA_BASE, width, height, padding: '20px 20px 24px',
                  display: 'flex', flexDirection: 'column', boxShadow: AI_AREA_SHADOW }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <div style={aiIconStyle(wandSvg, 24)} />
        <span style={{ font: '700 12px "Overpass", sans-serif', color: AI_LABEL_COLOR }}>
          {productLabel}
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
        <div style={{ height: 32, borderRadius: 6, background: AI_PRIMARY_END, opacity: 0.45,
                      transform: `scaleX(${barScale(0.0)})`, transformOrigin: 'left' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ height: 48, borderRadius: 6, background: AI_PRIMARY_END, opacity: 0.35, flex: 2,
                        transform: `scaleX(${barScale(0.25)})`, transformOrigin: 'left' }} />
          <div style={{ height: 48, borderRadius: 6, background: '#095BB1', opacity: 0.25, flex: 1, // var(--color-ai-primary-start) — hardcode in Remotion; see uds-style-guide/rules/ionos-ai-features.md
                        transform: `scaleX(${barScale(0.40)})`, transformOrigin: 'left' }} />
        </div>
        <div style={{ height: 14, borderRadius: 6, background: AI_PRIMARY_END, opacity: 0.25, width: '60%',
                      transform: `scaleX(${barScale(0.55)})`, transformOrigin: 'left' }} />
      </div>
    </div>
  );
};
```

---

## Usage

```tsx
import { AbsoluteFill } from 'remotion';
import { type VariantProps } from './schema';

export const MyComposition: React.FC<VariantProps> = ({ fps = 30, headline }) => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', background: '#F4F7FA' }}>  {/* var(--surface-subtle) — hardcode in Remotion; see uds-style-guide/rules/ionos-ai-features.md */}
    <div style={{ width: 560, display: 'flex', flexDirection: 'column', gap: 20, padding: 32 }}>
      <AITextGenerationArea startFrame={15} endFrame={65}
        productLabel="AI Website-Generator" generatedText={headline} />
      <AIPillButton fps={fps} label="Generate with AI"
        loadingLabel="Generating text…" triggerFrame={10} loadingEndFrame={65} />
    </div>
  </AbsoluteFill>
);
// Over photo/video: AI_AREA_BASE has backdropFilter — place over any <Img>/<Video>, no changes needed.
```
