<!-- THE GROUNDING RULE — the decision about the spec's `grounding` and `groundingQuery`
     fields, and how to author a prompt once grounding is on.

     POSITION: image-svc appends this directly after the output contract, so it is the LAST voice
     in the craft prompt. That is deliberate — its closing sentence re-authorises the skills' own
     camera and lighting guidance for the ungrounded case, and it has to outrank the rules above
     it to do that. It is also why the file is read by name at that point rather than selected
     into the rules section, which is inlined at the TOP.

     ITS CLOSING SENTENCE IS UNTERMINATED. It ends "...including their camera and lighting
     guidance" with no full stop, because the call site finishes it: a bare "." normally, and
     craft-grounding-rule-reference-exception.md when a `condition` reference image is supplied
     and owns those two axes. Do not add a full stop here.

     DELIVERED VERBATIM: the LINE BREAKS ARE SEMANTIC — the paragraph breaks below are real, and
     everything inside a paragraph is one long line, as the TypeScript template literal this
     replaced produced. This comment is stripped before delivery on every profile, so it is
     author-only and must never carry instruction.

     THE QUERY-SHAPE FORENSICS LIVE HERE, not in the prose below, since 2026-09-15 (Task 7 Step 6).
     They were 334 delivered chars quoting the two BAD query shapes verbatim, in a file whose own
     comment says a banned phrase quoted as an example is a phrase the craft model can copy back.

     What they said: "this compact axis-loaded form fired the image-search tool 4/4, a broad
     '<Brand> marketing photography style, lighting, mood, color' only 2/4, and dropping the brand
     anchor ('photography camera angle, lighting direction, atmosphere') 0/4", and that "an
     elaborated multi-axis directive collapsed the fire rate to 1/7".

     RE-MEASURED 2026-09-15 on gemini-3.1-flash-image with response_modalities ['image','text'],
     one crafted prompt body reused so only the query string varied: CANONICAL 7/7, BROAD 8/8,
     NO-BRAND-ANCHOR 7/8. The shape no longer governs the fire rate — 2/4 and 0/4 do not
     reproduce, and the earlier figures were almost certainly taken while the tool was being
     silently suppressed by response_modalities ['image'] alone.

     What removing them from the prose DID cost, measured at n=60 per arm on
     gemini-3.1-flash-lite: non-canonical query shapes went 0/53 grounded runs to 4/51 (p = 0.054,
     Fisher two-tailed), all four being the broad form. grounding=true itself was unchanged
     (53/59 vs 51/58, p = 0.78). So the INSTRUCTION sentences below carry nearly all of the work
     and the examples carried a little — but what they bought, a shape the fire rate no longer
     depends on, is no longer worth 334 chars in the prompt. Revert this block into the prose if a
     later measurement shows shape mattering again. -->

# Grounding rule

If the brief NAMES a REAL, identifiable external brand/company/product/website — INCLUDING when it is named only as a STYLE or QUALITY reference ("GoDaddy-like", "like GoDaddy", "GoDaddy style", "in the style of Wix", etc.) — set grounding=true. Grounding references the IMAGE's visual style ONLY — lighting, colour, mood, composition, and overall marketing aesthetic — NEVER the brand's UI, app screens, dashboards, or interface (out of scope for the image; the composite owns any interface). Do NOT design or render a branded UI, and never put the brand name or logo in the image. Otherwise grounding=false and groundingQuery="". Only ground on REAL external brands — never for generic scenes or IONOS's own products.

**groundingQuery format — keep it to ONE SHORT LINE in exactly this shape:**
  "<Brand> marketing photography — camera angle, framing, lighting direction, atmosphere"
Do NOT expand it into multiple numbered queries or several lines. Always keep the brand name in the query; always keep it one line.

**When grounding=true, write `prompt` as SCENARIO + GOAL ONLY.** The retrieved photographs are the source of the photographic treatment, so the prompt must NOT compete with them. State: who the subject is and what they are doing, the setting, and what the asset must communicate. OMIT entirely — do not write these words at all — camera angle, shot type, lens, framing/crop, eye level, three-quarter, over-the-shoulder, lighting direction or quality, time of day, colour grade, film-like grade, depth of field, bokeh, foreground blur, motion blur, and any "documentary/editorial photography style" label. Those axes are DELIBERATELY left to the image search. Ignore any instruction ABOVE that tells you to state the camera shot, the lighting, or a foreground bokeh plane — this rule overrides them for the grounded case only. Keep the brand palette and the subject/scene requirements. (Face-visibility for portrait and the cutout framing rules still apply — they are matting constraints, not style. `avatar` imposes no face requirement, so there is nothing to carry over there.)
When grounding=false, author `prompt` exactly as the skills above direct, including their camera and lighting guidance
