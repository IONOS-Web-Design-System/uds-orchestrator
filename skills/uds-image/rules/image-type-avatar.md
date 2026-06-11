# Image type: avatar

Use when the output will be used as a profile picture, team member card, or small square
thumbnail (typically 96×96 – 512×512 px). The face is always visible and identifiable, but
the shot distance, camera angle, and background vary to create natural diversity across a set.

## When to apply
Brief signals: "avatar", "profile photo", "team photo", "headshot for card", "96×96",
"square format", any square crop intended to identify a specific person at small sizes.

## Aspect ratio
Always 1:1. The face must read clearly at thumbnail scale.

## Face rule (non-negotiable)
The main character's face must be 100% visible in every avatar — full forehead to chin, no
cropping. This is the single hard constraint; everything else is intentionally varied.

## Shot distance — choose one per generation
Do not default to the same distance every time. Rotate across distances to create variety:

| Distance | What's visible | Feel |
|----------|---------------|------|
| Close-up | Face, neck, hint of shoulder | Editorial, intimate |
| Medium close-up | Head, neck, chest, shoulder | Approachable, personal |
| Medium shot | Head to waist, hands may be visible | Contextual, grounded |

At medium shot distance the person may hold a relevant prop (tool, notebook, coffee cup,
device) — this adds story without making the image feel like a scenario shot.

## Camera angle — vary per generation
- **Front view:** subject looks directly into the lens — warm, engaging, direct
- **3/4 view:** body slightly turned 30–45° while face remains readable — natural, candid
- **Slight side:** head turned to ~60°, face still clearly readable — editorial, confident

Avoid symmetrical dead-centre framing on every shot. Rule of thirds placement (face on
one vertical third) reads more naturally than dead-centre.

## Background — three valid modes
Pick the mode that best fits the character's context. Vary across a variant set.

**A. Studio / plain**
Neutral grey, soft white, or warm beige seamless backdrop. Clean, minimal, no distractions.
Works for any persona.

**B. Architectural / environmental**
Glass wall, concrete corridor, office window, or building exterior in soft focus behind the
subject. Creates depth and a real-world professional feel without showing a specific room.

**C. Real work environment (fitting-in)**
The character's actual workspace — shop, studio, office — visible but 1–2 stops under-
exposed and softly blurred. The person integrates naturally into the space; their attire and
optional prop should harmonise with the background. The background tells who they are,
the face tells who they are to you.

## Lighting — do not specify, let the model decide
Do NOT prescribe a lighting setup in the prompt or the SPEC. The model should choose
freely from its full photographic repertoire based on the character and background:

Examples of valid choices (non-exhaustive):
- Classic three-point softbox studio lighting
- Chiaroscuro — strong single light source, deep shadow on one side
- Rembrandt lighting — angled key light with the characteristic cheek triangle
- Natural window daylight — diffuse or direct depending on time of day
- Overcast outdoor light — soft, even, no harsh shadows
- Golden hour — warm directional backlight or sidelight
- Practical ambient — light from the environment itself (workshop lamp, office overhead)

Instructing the model to pick lighting defeats the purpose — omitting it produces more
authentic, varied, and photorealistic results. The prompt should describe the PERSON and
SETTING; the model fills in the photographic craft.

## Camera — do not specify, let the model decide
Do NOT name a specific camera, lens, or film stock in the prompt. The model will select
appropriate photographic qualities — sensor rendering, depth of field, colour science,
grain — that fit the character and background mode. Valid choices range from:
- Medium format studio camera — rich tones, sharp detail, commercial feel
- 35mm film SLR — natural grain, classic colour rendering
- Disposable / point-and-shoot — casual, intimate, lo-fi authenticity
- Modern mirrorless — clean, neutral, versatile

As with lighting: describe the person, not the gear. Authentic photographic diversity
comes from the model's creative judgment, not from prompting a specific camera.

## Negative prompt additions (avatar-specific)
Add to negativePrompt: "long shot, wide shot, full body, environment dominant,
background in focus, multiple people, group shot, face cropped, face cut off".
