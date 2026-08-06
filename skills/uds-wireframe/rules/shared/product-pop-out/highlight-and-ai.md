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
   four values as literals for the OUTER box, then build the inside from this skeleton — do not
   compose your own and do not hand-place anything within it. Flexbox does the alignment; every
   inner length is a ratio of the window's own box, so it stays correct at any `w`/`h`.

   ```jsx
   // OUTER: left/top/width/height are the contract's four literals. S = simple, F = full.
   <div style={{ position:'absolute', left:X, top:Y, width:W, height:H, boxSizing:'border-box',
     display:'flex', ...(S ? { alignItems:'center', gap:'4.4%', padding:'0 1.77% 0 5.76%',
                               borderRadius:9999 }
                          : { flexDirection:'column', gap:'3.71%', padding:'4.94%',
                               borderRadius:'3.09%' }) }}>
     <span style={{ flex:1, minWidth:0, overflow:'hidden', color:<brand on-surface text>,
       ...(S ? { whiteSpace:'nowrap', textOverflow:'ellipsis', fontFamily:<brand UI face>,
                 fontSize:H*0.236, lineHeight:`${H*0.306}px` }
             : { display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical',
                 fontFamily:<brand display face>, fontSize:W*0.0448, lineHeight:`${W*0.0556}px` })
     }}>{promptText}</span>
     {/* F only: two outlined round buttons (gradient ring, transparent centre), grouped left */}
     {/* send button — circle, AI-gradient fill, white glyph at 44% */}
   </div>
   ```

   `padding` is a SINGLE percentage on purpose: CSS resolves percentage padding against WIDTH on
   every side, so one value reproduces the design's uniform inset at any aspect. Deriving separate
   horizontal and vertical insets is what makes the card look skewed.

   | | `prompt-simple` | `prompt-full` |
   |---|---|---|
   | shape | pill bar, one line of text | rounded card, up to 3 lines |
   | controls | ONE send button, `height:80.6%`, `aspectRatio:1`, **fully inside the bar** (equal clearance above and below — it does NOT overhang any edge) | row `justifyContent:'space-between'`: two outlined buttons `W*0.0833` grouped left with `gap:'1.54%'`, send button `W*0.084` right |
   | surface | opaque, subtle blur | opaque, one step off white |

   The two surfaces, the text colour, the gradient and the type faces are brand values — take them
   from the brand's own AI rule, never invent them here.

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
