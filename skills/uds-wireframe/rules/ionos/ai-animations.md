---
name: ionos-wireframe-ai-animations
description: Ready-to-use Remotion templates for IONOS AI feature moments — CTA pill button, text-generation area, image-generation area. Copy directly into Composition.tsx.
motion: [animation]
metadata:
  tags: ionos, ai, animation, remotion, loading, neumorphism, template
---

# IONOS AI Animation Templates (UDS kit)

Every AI moment is built from the UDS kit (`./kit`, see "# UDS kit"). The brand AI concept
(gradient, label color, AI surface) comes from the tokens. **Never hand-build an AI button,
gradient, glow or thinking surface, and never hardcode AI hex values.**

```tsx
import { interpolate, spring, useCurrentFrame } from 'remotion';
import sparkles from '@ionos-web-design-system/icon/system/filled-sparkles';
import { KitButton, KitCard, KitInput, KitSkeleton, KitText } from './kit';
```

## Template 1 — AI CTA button

`glow` pulses from the frame. `loading` covers the generating moment. Press feedback is a
transform on the parent, never on the button.

```tsx
export const AIPillButton: React.FC<{
  fps: number; label?: string; loadingLabel?: string; triggerFrame?: number; loadingEndFrame?: number;
}> = ({ fps, label = 'Improve with AI', loadingLabel = 'Generating…', triggerFrame = 0, loadingEndFrame }) => {
  const frame = useCurrentFrame();
  const loading = triggerFrame > 0 && frame >= triggerFrame && (loadingEndFrame === undefined || frame < loadingEndFrame);
  const glow = 0.55 + 0.45 * Math.sin(((frame % 72) / 72) * Math.PI * 2);
  const press = spring({ frame: frame - triggerFrame, fps, config: { damping: 18, stiffness: 180 } });
  const scale = triggerFrame > 0 ? interpolate(press, [0, 0.45, 1], [1, 0.93, 1]) : 1;
  return (
    <div style={{ display: 'inline-flex', transform: `scale(${scale})` }}>
      <KitButton label={label} loadingLabel={loadingLabel} concept="ai" icon={sparkles} loading={loading} glow={glow} />
    </div>
  );
};
```

## Floating highlight card

The card surface is a `KitCard`. The prompt types into a `KitInput`, and the AI CTA is a
`KitButton`. Chrome placement and size follow `shared/floating-card.md`; the entrance is a spring
on the parent, snapped once settled.

```tsx
export const AIFloatingHighlight: React.FC<{
  fps: number; enterFrame?: number; text?: string; productLabel?: string; ctaLabel?: string;
}> = ({ fps, enterFrame = 20, text = '', productLabel, ctaLabel = 'Improve with AI' }) => {
  const frame = useCurrentFrame();
  const raw = spring({ frame: frame - enterFrame, fps, config: { damping: 18, stiffness: 120 } });
  const enter = raw > 0.995 ? 1 : raw;
  const opacity = interpolate(frame, [enterFrame, enterFrame + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const typed = Math.floor(interpolate(frame, [enterFrame + 10, enterFrame + 10 + text.length * 2], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <div style={{ width: 420, opacity, transform: `translateX(${interpolate(enter, [0, 1], [-120, 0])}px)` }}>
      <KitCard footer={<KitButton label={ctaLabel} concept="ai" icon={sparkles} glow={typed >= text.length ? 1 : 0} />}>
        {productLabel ? <KitText variant="bodySm" tone="subtle">{productLabel}</KitText> : null}
        <KitInput value={text.slice(0, typed)} caret={typed < text.length && Math.floor(frame / 16) % 2 === 0} />
      </KitCard>
    </div>
  );
};
```

## Template 2 — Text generation area

`KitSkeleton` lines stand for "thinking" until `endFrame`, then the generated copy is revealed in
`KitText`. The reveal is an opacity crossfade on parent divs.

```tsx
export const AITextGenerationArea: React.FC<{
  startFrame?: number; endFrame?: number; productLabel?: string; generatedText?: string;
}> = ({ startFrame = 0, endFrame = 60, productLabel = 'AI text generation', generatedText = '' }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [endFrame, endFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visible = frame >= startFrame;
  return (
    <div style={{ width: 420, opacity: visible ? 1 : 0 }}>
      <KitCard>
        <KitText variant="bodySm" tone="subtle" weight="bold">{productLabel}</KitText>
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: 1 - reveal }}><KitSkeleton shape="text" lines={3} /></div>
          <div style={{ position: 'absolute', inset: 0, opacity: reveal }}><KitText>{generatedText}</KitText></div>
        </div>
      </KitCard>
    </div>
  );
};
```

## Template 3 — Image generation area

A `KitSkeleton` rectangle holds the image slot while generating. The finished image (a Remotion
`<Img>` of the asset slug, when one exists) crossfades in on a parent div.

```tsx
export const AIImageGenerationArea: React.FC<{
  width?: number; height?: number; startFrame?: number; endFrame?: number; productLabel?: string; image?: React.ReactNode;
}> = ({ width = 400, height = 200, startFrame = 0, endFrame = 60, productLabel = 'AI Image Generator', image }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [endFrame, endFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ width, opacity: frame >= startFrame ? 1 : 0 }}>
      <KitCard>
        <KitText variant="bodySm" tone="subtle" weight="bold">{productLabel}</KitText>
        <div style={{ position: 'relative', width: '100%', height }}>
          <div style={{ opacity: 1 - reveal }}><KitSkeleton shape="rectangle" height={height} /></div>
          {image ? <div style={{ position: 'absolute', inset: 0, opacity: reveal }}>{image}</div> : null}
        </div>
      </KitCard>
    </div>
  );
};
```

## Usage

Place templates inside the composition's `data-brand` root. Use exactly one AI CTA per moment.
The AI concept appears only when the feature is a genuine AI feature (see the AI-feature gate in
uds-style-guide).
