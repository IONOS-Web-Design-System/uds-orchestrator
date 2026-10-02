---
styles: [background-full]
---

## Style: image-backdrop full-bleed

Story: the imagery is persona/ambience back-story; the floating UI cluster IS the product
feature. **No connector lines into the imagery.**

Layer order:

1. **Root** — `<AbsoluteFill>` with an explicit opaque `backgroundColor` (a brand dark or a
   tone sampled from the image).
2. **Backdrop** — the catalog image as the full-bleed background:

   ```tsx
   <AbsoluteFill>
     <Img src={staticFile('<slug>.png')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
   </AbsoluteFill>
   ```

3. **Floating UI cluster** — 1-3 fragments over the imagery's negative space, together
   occupying roughly **40-60% of canvas width**, never covering the focal subject. Fragments
   slightly overlap each other and may overlap the photo subject's edge. Hand-built fragments
   share the same surface anatomy: white/light background, rounded corners (16-20px), soft
   shadow (`0 24px 64px rgba(0,0,0,0.3)`). A `KitCard` fragment is the exception per
   `shared/floating-card.md`: its wrapper carries position, that shadow and
   `borderRadius: 'var(--protected-container-rounded)'`, no background; KitCard's own surface and
   1px border are accepted.

   - **Primary card (always):** a compact functional UI card (`KitCard`) with status/label
     elements (`KitPill`, `KitText`), a CTA (`KitButton`), and optional media slots. No marketing headline/subline — only functional
     labels and UI chrome. The same catalog image may be reused INSIDE the card's media
     slots (`<Img src={staticFile('<slug>.png')} style={{ objectFit: 'cover' }} />` in a
     small rounded container) — that reuse is intentional, not a bug.
   - **Mini-toolbar (optional):** a small horizontal strip of kit icon actions, the last one
     the AI action. The strip is a drawn backdrop (layout + surface + shadow); every icon in it
     is a `KitIconButton`:

     ```tsx
     import pen from '@ionos-web-design-system/icon/system/pen';
     import upload from '@ionos-web-design-system/icon/system/upload';
     import sparkles from '@ionos-web-design-system/icon/system/filled-sparkles';
     import { KitIconButton } from './kit';

     <div style={{
       position: 'absolute', /* near the primary card */
       display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
       background: 'var(--surface-base)', borderRadius: 24, boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
     }}>
       <KitIconButton icon={pen} title={texts.edit ?? ''} size="small" />
       <KitIconButton icon={upload} title={texts.upload ?? ''} size="small" />
       <KitIconButton ai icon={sparkles} title={texts.aiAction ?? ''} size="small" />
     </div>
     ```

   - **Prompt bubble (optional):** a prompt surface follows `ionos-ai-features` — prompt
     bubbles use `var(--surface-base)`; reserve `ai-subtle` for the AI 'thinking'
     indicator only — borderless, soft shadow — **never a dashed or bordered outline
     (retired styles)** — with a tiny drawn AI accent sparkle (an svgData mask filled with
     `var(--private-ai-primary-end)`, the AI accent — a drawn shape, like every non-kit AI accent), a muted caption
     (`KitText tone="subtle"`, e.g. "Anforderung KI Website-Generator"), and a short bold
     request line (`KitText weight="bold"`):

     ```tsx
     import { svgData as sparklesSvg } from '@ionos-web-design-system/icon/system/filled-sparkles';
     import { KitText } from './kit';

     <div style={{
       position: 'absolute', /* offset from the cluster */ maxWidth: 300,
       background: 'var(--surface-base)', // prompt bubble surface
       borderRadius: 14, padding: 16,
       boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
     }}>
       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
         <div style={{
           width: 16, height: 16, flexShrink: 0, backgroundColor: 'var(--private-ai-primary-end)',
           WebkitMaskImage: `url(${sparklesSvg})`, maskImage: `url(${sparklesSvg})`,
           WebkitMaskSize: 'contain', maskSize: 'contain',
         }} />
         <KitText variant="bodySm" tone="subtle">{texts.promptCaption ?? ''}</KitText>
       </div>
       <KitText weight="bold">{texts.promptRequest ?? ''}</KitText>
     </div>
     ```

Animation hooks: stagger the cluster in with **Pattern 5 — Element Fly-In** (primary card
first, toolbar and bubble at +9-15 frame offsets); at most one non-text fragment may idle with
**Pattern 4 — Float / Gentle Bob**. The backdrop image is **ALWAYS static** —
even when the contract includes a `Backdrop motion:` line, the image itself never moves (no
zoom, fade, pan, parallax, or drift). Only the floating fragments/annotations animate over
the still backdrop.

