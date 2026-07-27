---
styles: [product-pop-out]
---

## Style: product-pop-out — layers 4-5, the optional highlight and AI styling

Layers 1-2 (root, interface) are in `product-pop-out/composition.md`; layer 3 (the character
hero) is in `product-pop-out/character.md`.

4. **Optional highlight** — if the contract supplies highlight text, a floating prompt bubble at
   `layout.highlight` (e.g. `{x:0.0,y:0.62,w:0.42,h:0.16}`, `side:'bottom-left'`,
   `popOutside:'left'`): anchored bottom-left, popping outside the interface's LEFT edge —
   never on top of the frame center, never over the character or its face-safe box. Chrome
   follows the Floating Highlight Card template (see `shared/floating-card.md` for the surface
   rule): borderless, plain neutral shadow — no AI glow on the chrome itself.
5. **AI styling (when this is an AI feature)** — the brand AI gradient on the CTA/Publish
   action and the prompt bubble, a soft AI glow on the highlight only, and a filled-sparkles
   icon. Not an AI feature → standard brand blue/sky, no AI gradient or glow anywhere.
