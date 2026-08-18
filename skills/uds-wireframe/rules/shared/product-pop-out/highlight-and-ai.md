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

   **(b) `designed` — a measured prompt window** (AI product showrooms). The MUST-contract
   tells you which of two ways to build it, and you MUST follow the one it names.

   **When the contract says to IMPORT THE TEMPLATE** — the window is a real component that
   ships with the design system, already carrying the measured geometry. Import it and pass
   content. Do NOT re-implement it, do not wrap it in your own padded container, and do not
   pass it a `style`:

   ```tsx
   import { PromptWindow } from './uds/PromptWindow';

   <PromptWindow
     variant="prompt-full"                  // the contract's variant, verbatim
     brand={brand}
     promptText={texts.promptText}          // ALL copy flows through `texts`
     actions={['edit', 'regenerate']}       // prompt-full only; 2 entries
     leadingIcon="filled-sparkles"          // or the contract's AI icon
     sendGlyph="arrow"
     width={W} left={X} bottom={B}          // from the contract rect
   />
   ```

   | Prop | Type | Notes |
   |---|---|---|
   | `variant` | `'prompt-simple' \| 'prompt-full'` | Take the contract's value; never re-decide it |
   | `brand` | the run's brand | |
   | `promptText` | `string` | Put the contract's copy into `texts.promptText` and pass that — never a literal |
   | `actions` | 2 of `'edit' \| 'regenerate' \| 'attach' \| 'voice'` | `prompt-full` only |
   | `leadingIcon` | one of `filled-sparkles`, `filled-generative-write`, `filled-generative-wand`, `filled-chat-ai`, `filled-envelope-ai`, or `'none'` | Gradient-filled AI marker |
   | `sendGlyph` | `'arrow' \| 'paper-plane'` | |
   | `width` `left` `bottom` | px | From the contract rect. There is deliberately **no `height`** — the component derives it, and `prompt-full` grows from its own line count |

   The component owns padding, gaps, the type ramp, button sizes, radii, surfaces, shadows
   and the AI gradient. None of those are props, so there is nothing to tune and nothing to
   get wrong.

   **FALLBACK — only when the contract does NOT name the template.** Build the window from
   the skeleton below. Transcribe the contract's four values as literals for the OUTER box;
   every inner length is a ratio of the window's own box, so it stays correct at any `w`/`h`.
   Flexbox does the alignment — do not hand-place anything inside.

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

   For the fallback only: the two surfaces, the text colour, the gradient and the type faces are
   brand values — take them from the brand's own AI rule (`ionos/product-pop-out/prompt-window.md`),
   never invent them here. On the import path the component applies them for you.

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
