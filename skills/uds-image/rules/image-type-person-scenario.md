# Image type: person-scenario

Use when the brief describes a person doing something in their environment — the subject
is the visual anchor but the *action* is the story.

## When to apply
Brief signals: "using", "working on", "cooking", "at their desk", "in their shop",
"gardening", "coding", any active verb + professional or personal context.

## Composition rules
- **Face rule (non-negotiable):** the main character's face must be 100% visible and fully
  in frame — no cropping at the forehead, chin, or sides. If the face is cut off, the image fails.
- **Shot distance:** long shot (full body head-to-floor in environment) is the recommended default —
  it shows the person, the action, and the world together. Reinforce with "full body visible from
  head to floor" in the prompt. Waist shot is acceptable only when the environment is still clearly
  readable. Never use medium shot or closer — it loses the scenario and risks cropping the face.
- **Prefer standing or upright actions** — crouching, bending over, or head-down poses naturally
  drive the image model to crop in and lose the face. When the brief describes a low-level task
  (repairing, gardening, working on the floor), reframe it as the person pausing mid-task and
  looking up, or choose an equivalent upright action (examining a component at workbench height,
  consulting a device while standing, leaning over something at table height).
- **Use a physical anchor at waist height** as a reliable face-safe composition: place the
  subject behind a counter, desk, or workbench — the barrier sits at waist level so the action
  (typing, handling a component, reviewing something) happens below chin height and the face
  remains naturally above it and fully in frame. This is the most reliable pattern for combining
  a visible face with visible hands-on activity. **For landscape targets (16:9, 4:3):** prose
  headroom instructions are ignored by the model — the desk/counter anchor is mandatory, not
  optional. Encode as: `"subject seated behind a waist-height desk, upper body well above the
  desk surface, clear open space above the head"` — this is the only reliable way to prevent the
  face from floating to the top edge and being cropped by the landscape center-crop.
- Subject must be mid-action — hands engaged, body oriented toward the task, NOT facing camera
- Framing can be off-center; subject does not need to be in the middle of the frame
- Camera angle: eye-level or slightly elevated; avoid straight-on symmetrical framing
- Include environmental context: tools, equipment, products relevant to their profession
- Shallow depth of field — background recognisable but soft

## Person direction
- DO NOT pose the subject facing the camera with a neutral expression
- Expression must match the activity: focused, engaged, absorbed, or naturally reacting
- Posture and body language harmonise with the environment (leaning over, reaching, sitting actively)
- If two or more people are present, show genuine social interaction — conversation mid-flow,
  shared laughter, collaborative gesture — not people standing side by side

## Lighting
- Natural or ambient practical light from the environment (window, workshop lamp, screen glow)
- Avoid studio-flash look; embrace slight asymmetry in lighting that reads as authentic

## Avoid
- Subject standing upright, arms at sides, staring at lens
- Artificially posed "smile and hold" headshot composition
- Background replaced with plain studio backdrop
- Symmetrical, magazine-cover framing
