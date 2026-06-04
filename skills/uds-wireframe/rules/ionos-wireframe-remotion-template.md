---
name: ionos-wireframe-remotion-template
description: Remotion template contract for IONOS wireframe compositions — VariantProps schema, Root.tsx usage, and TypeScript typing rules. Read before writing any Remotion composition.
metadata:
  tags: ionos, wireframe, remotion, typescript, template, root, props
---

# Remotion Template Contract

## VariantProps — The Only Props Interface

The template ships with a fixed `VariantSchema` in `src/schema.ts`. Your `MyComposition` component **must use `VariantProps` as its props type** — do not invent custom prop types or add fields to the schema.

```tsx
import { type VariantProps } from './schema';

// ✅ CORRECT — use the template's type directly
export const MyComposition: React.FC<VariantProps> = ({
  brand, platform, colorScheme, headline, subline, imageSlug, variantId,
}) => {
  // ...
};
```

**❌ NEVER do this — custom prop types break the Root.tsx `<Composition>` typing:**
```tsx
// ❌ Inventing props not in VariantSchema:
type MyCompositionProps = { tone: string; generatedText: string };
export const MyComposition: React.FC<MyCompositionProps> = ({ tone, generatedText }) => { ... };

// ❌ Extending or partially redefining VariantProps:
type MyCompositionProps = { textToType: string };
```

## Available Props

| Prop | Type | Purpose |
|---|---|---|
| `variantId` | `string` | Variant identifier ("v1", "v2", ...) — use to vary layout/content per variant |
| `brand` | `enum` | Active brand (ionos, strato, fasthosts, ...) |
| `platform` | `"comfortable" \| "compact"` | UDS spacing scale |
| `colorScheme` | `"light" \| "dark"` | Root colour mode |
| `headline` | `string` (max 120) | Primary text slot — the main message |
| `subline` | `string` (optional, max 200) | Secondary text slot |
| `imageSlug` | `string` (optional) | Asset filename slug — resolves via `staticFile(imageSlug + '.png')` |

Use `headline` and `subline` for the animation's readable text content. Use `variantId` to differentiate layout or motion between variants. Do not use `subline` for AI-generated text — that is the `headline` content.

## Root.tsx — Do Not Modify

The template's `Root.tsx` is pre-wired. You only need to write `src/Composition.tsx`. The `<Composition>` component already uses `schema={VariantSchema}` so TypeScript knows the props:

```tsx
// Root.tsx (do not edit) — for reference only:
<Composition
  id="MyComposition"
  component={MyComposition}
  durationInFrames={150}
  fps={30}
  width={1280}
  height={720}
  defaultProps={DEFAULT_PROPS}   // all fields pre-populated
  schema={VariantSchema}          // provides type-safety
/>
```

The `schema` prop is what makes `component={MyComposition}` type-safe. If you define `MyComposition` with a props type other than `VariantProps`, TypeScript will error at the `component=` assignment in Root.tsx. **The fix is always to change your component's props type back to `VariantProps`** — never to add a type cast or `// @ts-ignore` in Root.tsx.

## TypeScript Error Triage

| Error | Cause | Fix |
|---|---|---|
| `Type 'FC<X>' is not assignable to type 'LooseComponentType<Record<string, unknown>>'` | Component props type is not `VariantProps` | Change component to `React.FC<VariantProps>` |
| `Object literal may only specify known properties, and 'X' does not exist in type 'VariantProps'` | Added unknown prop to `defaultProps` in Root.tsx | Remove the prop; only standard `VariantProps` fields allowed |
| `Expected 2 type arguments, but got 1` | Tried to use `Composition<SomeType>` generic | Don't use generics on `<Composition>`; use `schema=` instead |

## Variant Differentiation

Use `variantId` ("v1", "v2", "v3") to vary content or layout between variants — not custom props:

```tsx
export const MyComposition: React.FC<VariantProps> = ({ variantId, headline, subline, imageSlug }) => {
  const isV2 = variantId === 'v2';
  const isV3 = variantId === 'v3';
  // ...
};
```

## Duration Override

Override composition duration via `calculateMetadata` if the brief specifies a non-default length:

```tsx
import { type CalculateMetadataFunction } from 'remotion';
import { type VariantProps } from './schema';

export const calculateMetadata: CalculateMetadataFunction<VariantProps> = ({ props }) => {
  return { durationInFrames: 90 }; // e.g. 3s at 30fps
};
```

Export it from `Composition.tsx` — agent-svc picks it up automatically.
