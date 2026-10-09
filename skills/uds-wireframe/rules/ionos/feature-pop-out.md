## Feature-highlight composition — the IONOS pop-out

**Canonical reference**: the "AI App-Builder" composition in the
`Assets-for-AI` Figma file (`fileKey: StkUOHcGRMDXOZWT0E2nft`,
`nodeId: 9:183`, "Tab 2"). A white chat-prompt bubble on the LEFT pops
out from a dark browser-editor mockup on the right. The bubble's right
edge overlaps the main frame's left edge by roughly 25-40% of the
bubble's width. The bubble is the INPUT; the editor is the OUTPUT.

**Triggering language in the brief:** when the prompt mentions *highlight*,
*spotlight*, *showcase*, *demonstrate*, *show how X works*, or describes
a feature with a clear user-action → result relationship (e.g. *AI prompt
generates an app*, *one click deploys*, *type to search*, *speak to
control*).

### The pattern — INPUT pops out from OUTPUT

1. **Main frame = the OUTPUT.** What the feature PRODUCES — the generated
   app, the populated dashboard, the deployed page, the finished card.
   Typically a browser / editor / app-shell mockup. Dense, content-rich,
   the "magic result." Place center-right of the canvas. The base surface
   theme follows `uds-ui-core/rules/shared/surface-theme.md` — light by default,
   dark ONLY when `colorScheme === 'dark'` or the brief is explicitly
   decorative. AI accents (gradient, sparkle) apply on either base.

2. **Pop-out = the INPUT / affordance.** What the user TYPED, CLICKED,
   DRAGGED, or SAID to trigger the result. The pop-out is ALWAYS the
   user-side of the interaction, never a zoomed-in detail of the output.
   Common shapes:
   - A chat input with typed prompt text (canonical IONOS form for AI
     features — Tab 2 reference); in code a drawn prompt field with a frame-driven
     `caret`, beside a `KitButton concept="ai"`.
   - A small control panel with one highlighted button mid-click (`KitButton`,
     press feedback as a transform on its parent).
   - A toggle / switch mid-action (`KitSwitch`), or a drawn slider.
   - A voice-command bubble with a soundwave glyph.

3. **Intersection — non-negotiable.** The pop-out's bounding box overlaps
   the main frame's left (canonical) or right edge. Roughly 25-40% of the
   pop-out's width sits inside the main frame's bounding box; the rest
   sits outside. A pop-out floating clear of the main frame is the wrong
   pattern. A pop-out fully inside reads as a modal — also wrong.

4. **Contrast carries the elevation, not borders.** The pop-out uses surface
   tokens that contrast with the main frame's base theme: on a light main
   frame (the default), use a lighter pop-out; on a dark main frame
   (when `colorScheme === 'dark'` or decorative), use a white/bright pop-out.
   Soft drop shadow, no border — let the value contrast do the layering
   work, not outlines or harsh strokes.

5. **Placement and aspect:**
   - **Position:** left-edge intersection, vertically centered or slightly
     above center (Tab 2 canonical). Right-edge intersection is also
     valid but secondary. Avoid top corners (reads as notification toast)
     and bottom corners (reads as footer popover).
   - **Pop-out width:** ~50-60% of the main frame's width.
   - **Pop-out height:** ~25-40% of the main frame's height — the pop-out
     is short and wide for chat-input shape, square for button-action shape.

6. **What lives inside the pop-out:**
   - The typed/spoken content verbatim (the actual prompt the user wrote
     — pull from the brief when it includes example user input).
   - Up to 3 small affordance icons below or beside the content (send,
     attach, microphone). These are affordances, so they are `system/` tier —
     `@ionos-web-design-system/icon/system/<name>`; see *Icon usage* above.
   - No extensive chrome. The pop-out is one focused affordance, not a
     mini-screen.

### For animations

The pop-out is the FIRST thing visible — it represents the user's action
that drives the rest. Sequence:

1. **Pop-out enters first** — slide up + fade in + subtle scale; the
   typed/spoken text reveals character-by-character if applicable.
2. **Main frame materializes second** — the result manifests behind /
   around the pop-out, with staggered springs on its inner elements.

The pop-out should feel fixed in place once present — it IS the user —
while the result manifests behind it. Loop behavior (closing back to the
start frame versus holding on the final result) is governed by the
`loop` payload field and the prompt's hard constraints, not by this
rule.

### Counter-patterns — NOT this style

- **Reversed semantic:** OUTPUT in the pop-out and INPUT in the main frame.
  The pop-out is always the affordance; never the result. A small browser
  mockup popping out from a large prompt bubble is wrong.
- **Magnifying-glass overlay** drawn on top of the main frame — reads as
  "search" or "inspect tool", not the IONOS input→output trope.
- **Annotation with arrow line + label** pointing at part of the main
  frame — reads as a tutorial diagram or callout, not an integrated
  affordance.
- **Side-by-side panels** with no overlap — reads as "before/after",
  not "highlight."
- **Multiple pop-outs** at once — dilutes focus; one pop-out per highlight.
- **Floating tooltip** far from the main frame with a leader line —
  reads as annotation, not affordance.
- **Pop-out as a smaller version of the main frame** (a thumbnail) —
  reads as a preview, not an input.

**When the brief doesn't ask for a highlight:** don't force this pattern.
A single-frame composition is correct when there's nothing to spotlight.

---

