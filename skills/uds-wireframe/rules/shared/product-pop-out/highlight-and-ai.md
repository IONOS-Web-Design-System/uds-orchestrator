---
styles: [product-pop-out]
---

## Style: product-pop-out — layers 4-5, the optional highlight and AI styling

Layers 1-2 (root, interface) are in `product-pop-out/composition.md`; layer 3 (the character
hero) is in `product-pop-out/character.md`.

4. **Optional highlight — read the contract, it has three states.** The MUST-contract decides
   whether this composite has an accent element at all, and if so what governs its footprint.

   **(a) No highlight line, or an explicit "NO highlight element" line** — render NO floating
   accent: no prompt bubble, no callout, no chip, no floating card. The interface and the character
   are the whole composition. Do NOT add one to balance the canvas; its absence is deliberate.

   **(b) `designed` — a measured prompt window** (AI product showrooms). Transcribe the contract's
   four values as literals; the footprint is measured from the design source, so do not re-derive
   it. Two variants exist and the contract names which one:
   - `prompt-simple` — a full-bleed rounded bar holding ONE line of text, with a single circular
     `button-ai` at the trailing end that OVERHANGS the bar's bottom edge (the send button
     straddling the input's bottom-right corner). Text inset ~6% of width; no inner padding frame.
   - `prompt-full` — a padded card: inner inset **4.9% of its width / 12.7% of its height**, a
     text block of up to ~3 lines, and a row of `button-ai` controls beneath it (two grouped left,
     one right-aligned).

   **(c) `generic` — a content-shaped accent** (every non-AI showroom). The contract gives an
   anchor and a `maxBox` CEILING, not a footprint. Choose the element's own size from the content
   you are rendering: it must fit inside `maxBox` and **MUST NOT fill it**. A value callout, a
   two-word chip, a one-line status row and a compact card are all correct — whichever the content
   actually is. What is wrong is defaulting to a box-filling card regardless of content.

   In all present cases: anchored bottom-left, popping outside the interface's LEFT edge, never
   over the frame's center, never over the character's face-safe box. Chrome follows the
   Floating Highlight Card template (`shared/floating-card.md`): borderless, plain neutral
   shadow, no AI glow on the chrome itself.
5. **AI styling (when this is an AI feature)** — the brand AI gradient on the CTA/Publish
   action and the prompt bubble, a soft AI glow on the highlight only, and a filled-sparkles
   icon. Not an AI feature → standard brand blue/sky, no AI gradient or glow anywhere.
