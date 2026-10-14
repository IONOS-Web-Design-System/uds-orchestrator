---
name: strato-prompt-window
description: STRATO floating AI prompt window — the shipped PromptWindow template's strato design (glow + glass + text glow), when to use which variant, its props and how to animate it.
metadata:
  tags: strato, ai, prompt, floating, template, animation
---

# STRATO floating AI prompt window

A floating AI prompt on STRATO (a popover, bubble or window over or beside the frame, outside
the interface) is ALWAYS the shipped template, never a hand-built card:

```tsx
import { PromptWindow } from './uds/PromptWindow';

<PromptWindow variant="prompt-full" brand="strato"
  label="Anforderung KI Website-Generator"
  promptText={texts.promptText}
  width={497} left={64} bottom={72} />
```

A prompt typed INSIDE the interface (a field in the product UI) is not this window: it stays a
drawn field beside the AI button.

## The two variants (Figma Assets-for-AI, page "strato ref")

| Variant | Design | Use for |
|---|---|---|
| `prompt-full` (587:6893) | glass card: round gradient AI badge + a short UPPERCASE `label`, then the prompt in large type (≤ 3 lines) | a request over ~40 characters, or when a context line ("Anforderung KI · Website-Generator") helps |
| `prompt-simple` (587:6992) | glass pill: the prompt (≤ 2 lines) + a round gradient AI button on the right | a short request or an answer line ("Hier die Zusammenfassung deiner Anrufe") |

- `label`: `prompt-full` only — 2–5 words naming the AI tool or task, in the market's language.
  Omit it rather than invent one.
- `leadingIcon`: the glyph in the badge / button — `filled-sparkles` (default),
  `filled-generative-write`, `filled-generative-wand`, `filled-chat-ai`, `filled-envelope-ai`.
- `width` 420–520px for `prompt-full`, 380–480px for `prompt-simple` on a 1280px canvas;
  there is no `height` prop. No `actions`, no `sendGlyph` on STRATO — the design has none.
- `brand="strato"` is a LITERAL, never the composition's `brand` variable.

## What the component paints (do not rebuild it)

- A **glow**: the STRATO AI gradient (`#1FD7FF → #E498FF`) behind the card,
  `mix-blend-mode: hard-light` and heavily blurred, so it tints whatever lies under the window.
  Place the window over the brand canvas and the frame's edge, never inside a wrapper with its
  own `zIndex`, `opacity` or `transform` — that isolates the blend and kills the glow.
- **Glass**: white at 56% with a backdrop blur and a light rim.
- **Text glow**: a soft white halo behind the `#29294D` Poppins text (Figma linear dodge).

Placement: a direct child of the root, straddling the frame's left or bottom edge, mostly
outside it; never over the site's headline or the frame centre.

## Motion — only through props (the STRATO prompting animation)

Never wrap the window to animate it. The standard sequence, driven from `useCurrentFrame()`:

1. **Enter** (0–20f): spring `bottom` up ~36px; fade `glow` 0 → 1 (`interpolate(frame, [0, 20], [0, 1])`).
2. **Type** (from ~16f): `promptText={texts.promptText.slice(0, n)}` at ~1.4 chars/frame, with
   `caret={Math.floor(frame / 8) % 2 === 0}` while typing and for ~8 frames after.
3. **Send** (~18f after typing ends): `pulse={Math.sin(Math.PI * t)}` with `t` going 0 → 1 — the
   AI badge/button swells once and the glow flares.
4. **Thinking** (after the pulse, to the end): `glowAngleDeg={base + (frame - orbitStart) * 4}`
   (base 135 for `prompt-full`, 45 for `prompt-simple`) — only the blurred glow rotates; the
   badge/button gradient stays static.

| Prop | Meaning |
|---|---|
| `bottom` | px from the canvas bottom — the rise |
| `promptText` | the typed slice of `texts.promptText` |
| `glow` 0–1 | glow strength (1 = the design) |
| `caret` | show the typing caret |
| `pulse` 0–1 | send-beat intensity (drive up and back down) |
| `glowAngleDeg` | the glow's gradient angle — the thinking orbit |

Keep the text layer itself static once typed (text stability gate); motion lives in the glow,
the caret and the AI circle. A still render shows the final typed state with `glow` 1 and no
caret, pulse or orbit.
