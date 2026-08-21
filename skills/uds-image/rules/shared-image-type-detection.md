# Image type detection

Before writing the prompt, identify which image type the brief describes and apply the
matching rule file.

**Tie-breaker rules:**
- Brief names a person doing something in their environment (action is the story) → `scene`
- Brief asks for the person to face the camera with their character and identity as the story → `portrait`
- Brief focuses on a product, device, or interaction (person is secondary) → `scenario`
- Brief needs a face-visible square crop for profile/card use → `avatar`

When ambiguous between `scene` and `portrait`: ask whether the person's face and identity
are the primary message (→ `portrait`) or whether the activity and setting are (→ `scene`).

| Type | Rule file | Use when | Face guaranteed? |
|------|-----------|----------|-----------------|
| **avatar** | `shared-image-type-avatar` | Face-focused square crop; face clearly visible at any angle; can show occupation context; 1:1 aspect ratio | Yes — always |
| **scene** | `shared-image-type-scene` | Subject mid-action in their environment; setting and action are the story; character fits in naturally | No — optional |
| **portrait** | `shared-image-type-portrait` | Subject faces camera; person's character, posture, and accessories are the story | Yes — always |
| **scenario** | `shared-image-type-scenario` | Product/interaction is focal point; people are secondary or partial | No |
