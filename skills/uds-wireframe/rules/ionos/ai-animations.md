---
name: ionos-wireframe-ai-animations
description: Ready-to-use Remotion templates for IONOS AI feature moments (AI CTA button, floating highlight, text-generation area, image-generation area), built on the UDS kit (import from './kit'). Copy directly into Composition.tsx.
motion: [animation]
metadata:
  tags: ionos, ai, animation, remotion, loading, template
---

# IONOS AI Animation Templates (UDS kit)

Every AI moment is built from the UDS kit (`./kit`, see the prompt section "# UDS kit"). The brand AI concept
(gradient, label color, AI surface) comes from the tokens. **Never hand-build an AI button,
gradient, glow or thinking surface, and never hardcode AI hex values.**

```tsx
import { interpolate, spring, useCurrentFrame } from 'remotion';
import sparkles from '@ionos-web-design-system/icon/system/filled-sparkles';
import { KitButton, KitCard, KitIcon, KitSkeleton, KitText } from './kit';
```

## Template 1 — AI CTA button

`glow` pulses from the frame. `loading` covers the generating moment. Press feedback is a
transform on the parent, never on the button.

```tsx
export const AIPillButton: React.FC<{
  fps: number; label?: string; loadingLabel?: string; triggerFrame?: number; loadingEndFrame?: number;
}> = ({ fps, label = '', loadingLabel, triggerFrame = 0, loadingEndFrame }) => {
  const frame = useCurrentFrame();
  const loading = triggerFrame > 0 && frame >= triggerFrame && (loadingEndFrame === undefined || frame < loadingEndFrame);
  const glow = 0.55 + 0.45 * Math.sin(((frame % 72) / 72) * Math.PI * 2);
  const raw = spring({ frame: frame - triggerFrame, fps, config: { damping: 18, stiffness: 180, overshootClamping: true } });
  const press = raw > 0.995 ? 1 : raw;
  const scale = triggerFrame > 0 ? interpolate(press, [0, 0.45, 1], [1, 0.93, 1]) : 1;
  return (
    <div style={{ display: 'inline-flex', transform: `scale(${scale})` }}>
      <KitButton label={label} loadingLabel={loadingLabel} concept="ai" icon={sparkles} loading={loading} glow={glow} />
    </div>
  );
};
```

## Floating highlight card

The card surface is a `KitCard`; placement, size and elevation follow `shared/floating-card.md`
(elevation lives on the parent wrapper — the kit has no style props). The prompt types into a
drawn prompt field, and the AI CTA is a `KitButton`. The entrance is a spring on the parent, snapped once
settled. Typing starts only after the card has settled — never animate text inside a moving parent.
The typed prompt is at most 32 characters: the single-line field clips longer text at this
320px card width. Feed it from `texts.*` (`text={texts.prompt ?? ''}`); longer copy goes in a
`KitText` below the input.

```tsx
export const AIFloatingHighlight: React.FC<{
  fps: number; enterFrame?: number; text?: string; productLabel?: string; ctaLabel?: string;
}> = ({ fps, enterFrame = 20, text = '', productLabel, ctaLabel = '' }) => {
  const frame = useCurrentFrame();
  const raw = spring({ frame: frame - enterFrame, fps, config: { damping: 18, stiffness: 120 } });
  const enter = raw > 0.995 ? 1 : raw;
  const opacity = interpolate(frame, [enterFrame, enterFrame + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const typeEnd = enterFrame + 30 + text.length * 2;
  const typed = Math.floor(interpolate(frame, [enterFrame + 30, typeEnd], [0, text.length], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  return (
    <div style={{ width: 320, opacity, transform: `translateX(${interpolate(enter, [0, 1], [-120, 0])}px)`, boxShadow: '0 16px 48px rgba(0,0,0,0.35)', borderRadius: 'var(--protected-container-rounded)' }}>
      <KitCard footer={<KitButton label={ctaLabel} concept="ai" icon={sparkles} glow={interpolate(frame, [typeEnd, typeEnd + 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })} />}>
        {productLabel ? <KitText variant="bodySm" tone="subtle">{productLabel}</KitText> : null}
        <div style={{ border: '1px solid var(--border-input-default, #718095)', borderRadius: 8, padding: 'var(--space-2) var(--space-3)', background: 'var(--surface-input-default)' }}><KitText>{text.slice(0, typed)}</KitText></div>
      </KitCard>
    </div>
  );
};
```

## Template 2 — Text generation area

`KitSkeleton` lines stand for "thinking" until `endFrame`, then the generated copy is revealed in
`KitText`. A hidden ghost copy of the text reserves the height, so long copy never overflows; the
skeleton and the visible text overlay it and crossfade by opacity on parent divs.

```tsx
export const AITextGenerationArea: React.FC<{
  startFrame?: number; endFrame?: number; productLabel?: string; generatedText?: string;
}> = ({ startFrame = 0, endFrame = 60, productLabel = '', generatedText = '' }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [endFrame, endFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const visible = frame >= startFrame;
  return (
    <div style={{ width: 420, opacity: visible ? 1 : 0 }}>
      <KitCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KitIcon icon={sparkles} size="small" />
          <KitText variant="bodySm" tone="subtle" weight="bold">{productLabel}</KitText>
        </div>
        <div style={{ position: 'relative', minHeight: 72 }}>
          <div style={{ visibility: 'hidden' }}><KitText>{generatedText}</KitText></div>
          <div style={{ position: 'absolute', inset: 0, opacity: 1 - reveal }}><KitSkeleton shape="text" lines={3} /></div>
          <div style={{ position: 'absolute', inset: 0, opacity: reveal }}><KitText>{generatedText}</KitText></div>
        </div>
      </KitCard>
    </div>
  );
};
```

## Template 3 — Image generation area

A `KitSkeleton` rectangle holds the image slot while generating. The finished image (a Remotion
`<Img>` of the asset slug, when one exists) crossfades in on a parent div. `width` is the whole card width; `height` is the image slot height.

```tsx
export const AIImageGenerationArea: React.FC<{
  width?: number; height?: number; startFrame?: number; endFrame?: number; productLabel?: string; image?: React.ReactNode;
}> = ({ width = 400, height = 200, startFrame = 0, endFrame = 60, productLabel = '', image }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [endFrame, endFrame + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ width, opacity: frame >= startFrame ? 1 : 0 }}>
      <KitCard>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <KitIcon icon={sparkles} size="small" />
          <KitText variant="bodySm" tone="subtle" weight="bold">{productLabel}</KitText>
        </div>
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

Place templates inside the composition's `data-brand` root and pass every label from `texts.*`
(`label={texts.aiCta ?? ''}`). Use exactly one AI CTA per moment.
The AI concept appears only when the feature is a genuine AI feature (see the AI-feature gate in
uds-style-guide).
