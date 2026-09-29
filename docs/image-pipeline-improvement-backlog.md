# Image pipeline — improvement backlog

A durable record of improvement points raised while auditing the image-generation pipeline
(2026-09-24 → 2026-09-28). Nothing here is scheduled; it exists so that no point is lost when a
session ends. Each item states the EVIDENCE, because several earlier assumptions in this
workstream turned out to be false and the measurements are what survived.

Status key: **OPEN** · **IN PROGRESS** · **DONE** · **HELD** (deliberately parked) ·
**REFUTED** (investigated, found not to be true)

---

## A. Scenario vocabulary — the planner cannot reach whole families

Three DIFFERENT failure modes. Treating them as one problem is the mistake to avoid.

### A1 · Missing enum values — OPEN
| gap | today | note |
|---|---|---|
| multi-person interaction | `CASTS = ['hero','background','none']` | no value for two people together; a handover, consultation or team moment is unstateable |
| macro / detail | `shotSize = close-up \| medium \| wide` | stops at close-up; hands-on-a-tool has no level |
| data-centre / infrastructure | `PLACES` (9 values) | no value exists at all |

### A2 · Values that exist but are never chosen — OPEN
`outdoors` **0**, `open-plan-office` **0**, `meeting-room` **0** across production plans.

**Likely cause, and the thing to fix FIRST:** choosing them does nothing. `ENVIRONMENT_BY_PLACE`
maps only 3 of 9 places, so six resolve to no environment, no lighting narrowing, no reward. *An
enum value with no downstream consumer is not a choice the planner has any reason to make.*
Adding `data-centre` without a catalog lands in the same dead zone.

### A3 · Reached but conceptually monotone — OPEN
87 briefs do produce data-centre imagery. All 87 first-8-word openings are **distinct**, so this
is NOT the verbatim-paste homogeniser. It is one mental image: `server rack` 70%, `corridor` 37%,
`high-tech` 34%, `aisle` 32%, `symmetrical` 31%, `polished` 31%.

**A new homogeniser class — narrow concept, varied wording — invisible to any verbatim-paste
detector.** Any future diversity check must measure concepts, not strings.

### A4 · The location-abstract family — OPEN
311 data-protection / sovereignty requests; 189 mention a location. They claim **jurisdiction and
trust, not a situation**: "your data stays in Germany" is not a moment anyone can be photographed
having. 87% still depict a person (vs 82% of everything else) — the `abstract` cue suppresses the
5W but nothing supplies a location-claim vocabulary in its place.

Measured: *"Vertrauen Sie auf europäische Infrastruktur"* became *"standing in a bright, airy
modern architectural space that suggests high-end European infrastructure"*.

**User direction:** treat these as **abstract** scenarios, expressible as *multi-person
interaction* or *outdoor*, carrying user confidence and a positive expression, **with less
restriction**. Where the mode is not restricted to `image` and the request contains a location,
prefer **map elements** (see section D).

---

## B. Storytelling fidelity — the planner reframes the request away

### B1 · Abstract briefs silently become product shots — OPEN
Reference case `c69a67cc-a462-4758-a735-4b1ca9506590`: the request was an **abstract** brief whose
point was an expression — attracting the audience to try a live demo. The planner reframed it to
*"A modern smartphone resting on a clean desk surface. The screen displays a minimal call
interface featuring simple wave lines and a calendar icon…"* — a product still with no story.

**Two legitimate readings, either acceptable, both better than what shipped:**
1. **device-focused**, character omitted or background, physically realistic — only partial hands
   visible, screen content carrying the demo. Reference: Figma `479-3857` (device-focused-01).
2. **pure expression** — multi-person interaction (Figma `498-29`) or a single character
   interacting with people behind them, positive expression (Figma `479-15032`).

### B2 · The brief outranks the framing axis — OPEN (measured)
0/8 close-up frames while the brief demanded a prop held at chest height, against 6/8 with that
clause removed (Fisher p = 0.0070). A frame cropped at the shoulders cannot show a laptop on a
desk, and the image model resolves the contradiction in favour of content every time. The remedy
named in the corpus is an **arbiter** between content demand and framing axis
(`craft-plausibility.md`), not more forceful camera wording — rewording was measured at p = 1.0.

---

## C. Screen content — split by whether a person is present

### C1 · Two distinct cases — OPEN
| case | requirement |
|---|---|
| **no person** | camera preset must honour the Figma `device-focused-*` references and deliver a real close-up |
| **person involved** | the gate must ensure screen content appears **only at a viewing angle that can show it** |

### C2 · Hard rules for the person case — OPEN
- If the camera shows the character's face and only the **back** of the device, screen content
  must **never** appear on that back.
- Abstract 2D elements floating in a photoreal scene are **forbidden** — compositing abstract
  elements into a photorealistic frame does not honour physical reality.
- References: Figma `498-36`, `535-28`.

### C3 · Why this matters — measured
Screen content is demanded in ~44% of production briefs and garbled screen text is the single
largest gate-failure reason. The craft prompt is usually clean (it asks for a blank lid and
carries a negative prompt); the **image model** adds the text, and the negative prompt is sent as
prose (`"Avoid: …"`), not as real negative conditioning.

---

## D. Map elements for location requests — IN PROGRESS

See `docs/` companion work and the `remotion-maps` skill. Prerequisites measured against
production, not assumed:

| prerequisite | status |
|---|---|
| GPU on the render host | **none** (`/dev/dri` absent) — not a blocker, `swangle` is the no-GPU renderer |
| Remotion version | **4.x**; npm `latest` is 4.0.529 and **there is no 5.x** — so `gl` must be set explicitly |
| `gl` / `chromiumOptions` in agent-svc | **not set anywhere today** |
| outbound egress to tile hosts | **works** — `demotiles.maplibre.org` 200, `tiles.openfreemap.org` 200 |
| `maplibre-gl`, `@turf/turf` | **not installed** in the remotion-starter template |
| tile/style source | **decision needed** — demotiles is a demo; OpenFreeMap is open; MapTiler/Stadia need a key + licence |
| stills | already supported (`renderStill` vs `renderMedia` are already split) |

**Opportunity size:** 191 of 311 sovereignty requests (61%) already resolve to `illustration` or
`hybrid`, and 35 of 123 themed illustration briefs (28%) **already hand-draw a map** in the
codegen model. A real map component substitutes into something the pipeline already attempts.

---

## E. Gate — factors and mechanics

### E1 · Confirmed factor list — OPEN (to implement)
Content · rendered text and marks · geometry and plausibility · framing · cutout-specific · brand.

**Brand is judged on ATMOSPHERE and CHARACTERS, not a hardcoded colour palette.** A palette-only
arm was measured non-shippable (hex leaked into prompts, gate scores fell), and the brand rule
states outright that what separates a brand is "who is in the frame and how the room reads, not
the exposure". Hex adherence and exposure-as-brand-marker are OUT.

### E2 · Cutouts run the photoreal rubric — OPEN
137 production runs are matted — background is discarded by construction — yet the gate still
judges background, environment and composition on them. Silhouette matte-ability and edge
cleanliness are what matter and are not checked.

### E3 · Set-level factors are structurally unreachable — OPEN
The gate sees one image at a time, and production requests `variants: 1` on **all 1101 runs**, so
variant diversity cannot be judged and multi-variant behaviour is entirely unexercised in
production.

### E4 · Object cutouts are mis-typed — OPEN
135 of 137 cutouts are pinned `imageType: portrait`, including a 3D server-icon object. The
taxonomy has no object type.

---

## F. Held deliberately

### F1 · 3D abstract object generation — HELD
Awaiting a consistent brand definition. Stays free-form; do not systematise it yet.

---

## G. Done in this workstream

| item | where |
|---|---|
| verdict parser reads delimited / fenced / bare JSON; flags instead of passing an unreadable reply; keeps the raw text | `image-svc fix/gate-verdict-parser` |
| recraft is a bounded LOOP and every retry receives EVERY reason seen so far | `image-svc fix/gate-verdict-parser` |
| `ShotSize:` tags on all four camera catalogs; `RequiresOperator:` on device; two unattended close presets | `uds-orchestrator feat/closeup-and-unattended-cameras` |
| character rule files and the candid-pose rule suppressed when nobody is in frame | `image-svc feat/closeup-and-person-gating` |
| `sceneContext.shotSize` cue | `uds-moderator feat/shot-size-cue` |

---

## H. Refuted — do not re-derive

- **The full-vs-minimal gate gap.** 17/32 vs 18/32, Fisher p = 1.0 at n=32/arm; the earlier
  effect (3/36 vs 17/36) would have shown at p = 1.7e-03. The old study ran when production sent
  no `sceneContext`, so minimal's axes were dead. The NO-GO recommendation is void.
- **Camera preset wording as the shot-size lever.** Magnitude vs geometry wording: 0/8 both,
  p = 1.0.
- **`low-angle-hero` as a fixable rule problem.** The instruction reaches the image prompt 8/8 and
  produces 0/8 low-angle frames at three wordings, even with content demands removed. Camera
  HEIGHT is not honoured by the image model on a portrait facing the lens.
