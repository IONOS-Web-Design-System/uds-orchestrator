# Module-specific generation bias

When the brief carries a `Consumer module:` line, it names the **downstream component**
the asset will live in. Use it to bias the asset's **scale/framing** and, where stated, its
**default type** so the result drops cleanly into that component.

**Module fills defaults and shapes composition — it never overrides the brief.** If the brief
explicitly sets `assetType` or `dimensions`, those win; module only resolves what the brief
leaves open and guides how the subject is framed. "Size" here is *compositional scale* (how
much of the frame the subject fills and how much breathing room it leaves), not pixel
dimensions — those come from the brief's `dimensions` and are enforced downstream by the crop.

| Module | Default asset type | Scale / framing | Image-type & composition |
|---|---|---|---|
| `columns` | none — follow the brief (photoreal or cutout) | **medium** | The asset sits in one card among several side-by-side columns. Compose it **self-contained and medium-scale** — a clear single subject, balanced, with even margins; not a full-bleed hero and not a tight macro. It must read at a glance next to its siblings. |
| `customer_testimonial` | **photoreal** (opaque scene) by default | **full-bleed background** | A single customer success story. Treat as a **full-size background image**: an environmental `scene` or `scenario`, the customer in their real setting. Leave a calm region of **negative space** (and keep the dead-center clear) so an overlaid quote/name card stays legible. Do NOT make it a tight face close-up. |
| `textmedia` | none — follow the brief | **medium to full** | An editorial text-with-media block. No type constraint; compose flexibly and lean on the brief's `dimensions` for scale. Works either as a contained medium asset or a larger feature image — keep the subject coherent at both. |
| `testimonial_slider` | **photoreal**, image-type **avatar** | **small, square 512×512** | One person per slide as a **head-and-shoulders avatar** — apply `image-type-avatar`, face the clear focal point, neutral/soft backdrop, square crop. Optionally a **companion asset** accompanies the avatar in the testimonial card; when *this* brief is the companion, compose it as a small, clean **supporting asset** that sits beside the avatar: a product as a `cutout`, or a `scenario`/`scene` photoreal vignette (illustrations are produced by agent-svc, not here). |

## Rules
- **Unknown or absent module** → apply no module bias; follow the brief and normal
  `shared-image-principles` image-type detection.
- A module's **default asset type** applies only when the brief does not already pin one.
- The **crop-safety** guidance still applies on top of the module framing: a full-bleed
  `customer_testimonial` on a landscape target still loses its top/bottom, so keep the
  subject and any reserved text space inside the surviving central band.
