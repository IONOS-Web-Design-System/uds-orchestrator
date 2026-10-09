---
styles: [device-mockup]
---

## Style: device-mockup

Story: the product feature lives inside a device — a tablet or browser window — and (when a
character is supplied) a character stands in front of it, integrated with the device rather
than floating beside it. Like `product-pop-out`, this composite has no opaque backdrop of its
own — it composites onto whatever host background it's placed on.

Layer order:

1. **Root** — `<AbsoluteFill>` background: **TRANSPARENT**. If the contract carries a
   `SAFE AREA:` line, reserve that transparent margin the same way as `product-pop-out`
   (right/bottom stays empty; any pop-out extends past the TOP edge only).
2. **Device mockup** — a tablet OR browser-window mockup (with window chrome, e.g. the
   three-dot traffic-light row) containing the brand product UI as a UDS wireframe inside its
   screen area. The interface content BLEEDS slightly UNDER the bezel — there is no white gap
   between the mockup frame and the screen content. Use `staticFile()` for any in-screen media
   slot the supplied catalog image belongs in — never a generated image there.
3. **Character (if supplied)** — the cutout as `staticFile('<slug>.<format>')`, ONE INTACT
   portrait — a single whole person, never split or fragmented — standing IN FRONT of the
   device and INTEGRATED with it: the head and upper body rise ABOVE the device's top edge,
   and the torso overlaps the device's lower/front so the device floats BEHIND the character's
   upper part. The full figure is visible — never cropped at the top or sides — and it is
   never a separate, detached element floating apart from the device.

   Use the supplied cutout metrics: `cutout.headTopFrac` gives where the head begins (must
   clear the device's top edge); `cutout.subjectHeightFrac` gives the subject's height within
   the cutout. The character is DOMINANT (roughly 100-110% of canvas height); the device
   mockup is smaller (roughly 55-65% of canvas height) and floats behind the character.
4. **No character** — the device itself is the hero: centre it prominently, full-frame.
5. **Optional highlight** — a prompt bubble/card at the TOP z-index that INTERSECTS the
   mockup, floating partially outside its frame (extending past the TOP edge only when a safe
   area is reserved), stating the highlight text.

Everything around the device (and character, if present) stays transparent. No connector
lines. Use the standard AI-styling rule from `product-pop-out` step 5 for CTAs/highlights when
this is an AI feature.

**Still gate**: frame 0 shows the device fully rendered with its screen content already
composed, the character (if present) already integrated in front of it with the head clear of
the device's top edge, and any highlight already settled at its intersecting position.

