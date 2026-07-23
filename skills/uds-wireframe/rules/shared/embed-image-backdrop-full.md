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
   slightly overlap each other and may overlap the photo subject's edge. All share the same
   surface anatomy: white/light background, rounded corners (16-20px), soft shadow
   (`0 24px 64px rgba(0,0,0,0.3)`).

   - **Primary card (always):** a compact functional UI card with status/label elements, a
     CTA button, and optional media slots. No marketing headline/subline — only functional
     labels and UI chrome. The same catalog image may be reused INSIDE the card's media
     slots (`<Img src={staticFile('<slug>.png')} style={{ objectFit: 'cover' }} />` in a
     small rounded container) — that reuse is intentional, not a bug.
   - **Mini-toolbar (optional):** a small horizontal pill of icon buttons with one prominent
     accent/gradient button:

     ```tsx
     <div style={{
       position: 'absolute', /* near the primary card */
       display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
       background: '#fff', borderRadius: 999, boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
     }}>
       {/* 3-4 small system icons, then: */}
       <div style={{
         width: 32, height: 32, borderRadius: '50%', display: 'flex',
         alignItems: 'center', justifyContent: 'center', color: '#fff',
         background: 'linear-gradient(45deg, var(--color-ai-primary-start), var(--color-ai-primary-end))',
       }}>
         <Icon group="system" name="sparkles" size={16} />
       </div>
     </div>
     ```

   - **Prompt bubble (optional):** a prompt surface follows `ionos-ai-features` — prompt
     bubbles use `var(--surface-base)`; reserve `ai-subtle` for the AI 'thinking'
     indicator only — borderless, soft shadow — **never a dashed or bordered outline
     (retired styles)** — with a tiny accent sparkle icon (`var(--color-ai-primary-end)`),
     a muted caption (e.g. "Anforderung KI Website-Generator"), and a short bold request
     line:

     ```tsx
     <div style={{
       position: 'absolute', /* offset from the cluster */ maxWidth: 300,
       background: 'var(--surface-base)', // prompt bubble surface
       borderRadius: 14, padding: 16,
       boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
     }}>
       {/* icon + caption row, then bold navy request text */}
     </div>
     ```

Animation hooks: stagger the cluster in with **Pattern 5 — Element Fly-In** (primary card
first, toolbar and bubble at +0.3-0.5s offsets); at most one fragment may idle with
**Pattern 4 — Float / Gentle Bob** (`floatBob`). The backdrop image is **ALWAYS static** —
even when the contract includes a `Backdrop motion:` line, the image itself never moves (no
zoom, fade, pan, parallax, or drift). Only the floating fragments/annotations animate over
the still backdrop.

