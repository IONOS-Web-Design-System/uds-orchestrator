# Post-Build Verification

Complete verification checklist and Playwright MCP snippets for ensuring
pixel-accurate implementations. Referenced from SKILL.md section 11.

## Verification Checklist

After implementing the full design, **TRIPLE-CHECK against the original Figma
design**:

1. **Custom components** — compare side-by-side; must be 1:1 pixel-accurate
2. **Typography** — variant, weight, color all match (use exact `Text` props)
   - If the app is running locally, use **Playwright MCP** `browser_evaluate`
     with `getComputedStyle()` to extract `fontSize`, `fontWeight`,
     `lineHeight`, `fontFamily` and compare against the Figma design's
     typography specs (see "Playwright MCP Verification — Typography" below).
3. **SUPER CRITICAL: Spacing pixel accuracy** — audit EVERY padding, margin, and
   gap value:
   - For each element, read the Figma spacing value (token name or px)
   - Look up the correct Tailwind class in `rules/core-spacing-tokens.md`
   - Verify the class resolves to the exact pixel value from the Figma design
   - Watch for space vs gap token confusion (`gap-2` = 8px != `gap-gap-2` = 2px)
   - Watch for token-number vs pixel-value confusion (`p-4` = 24px, NOT 4px)
   - If the app is running locally, use **Playwright MCP** as the final check:
     navigate with `browser_navigate`, snapshot with `browser_snapshot`, then
     extract computed spacing via `browser_evaluate` + `getComputedStyle()` and
     compare px values against Figma (see "Playwright MCP Verification —
     Spacing" below). If Playwright MCP is not configured, suggest the user set
     it up.
4. **Corner radius** — cards/containers use the correct radius level
5. **Theme inversion** — all dark sections use `ThemeInverter`, not manual dark
   classes
6. **Icons** — correct icon name, size, and group
7. **Colors** — only UDS tokens; no hardcoded hex values
   - If the app is running locally, use **Playwright MCP** `browser_evaluate`
     with `getComputedStyle()` to extract `color`, `backgroundColor`,
     `borderColor` and compare the resolved RGB/RGBA values against the Figma
     design's color values (see "Playwright MCP Verification — Colors" below).
8. **SUPER CRITICAL: Asset handling by category** — verify every non-text asset
   from Figma uses the correct approach (see `rules/workflow-figma-to-code.md`):
   - **Raster images** (photos, PNGs, JPGs): uses `Picture` (never raw `<img>`;
     `AspectRatio` only when a fixed ratio, video, or `decorative`/`fallback` is
     required); `width`/`height` match the Figma frame (prevents CLS); AVIF/WebP
     `<source>` tags present when those formats were exported; LCP hero images
     have `fetchPriority="high"` and `hasLazyLoading={false}`; when a fixed
     ratio is required, `Picture` is composed inside an aspect-ratio wrapper
     with the correct `objectFit`
   - **Vector SVGs** (illustrations, graphics NOT in icon package): uses `<div>`
     wrapper with Figma `width`/`height`; `<img>`/`<svg>` fills container with
     `h-full w-full`; NOT wrapped in `AspectRatio`
   - **Icon instances** (UDS icon groups): uses `Icon` component with inject
     function; correct group and icon name; correct `size` prop
   - **Brand logos** (`brandmark` group): uses `<div>` wrapper with exact Figma
     `width`/`height`; `<img>` fills container with `h-full w-full`; does NOT
     use the `Icon` component; correct Light/Dark variant for color scheme
   - If the app is running locally, use **Playwright MCP** `browser_evaluate`
     with `getBoundingClientRect()` to verify rendered asset dimensions
     (width/height) and aspect ratios match the Figma design (see "Playwright
     MCP Verification — Asset Dimensions" below).

Use the Figma MCP `get_screenshot` tool to compare side-by-side when in doubt.

## Playwright MCP Verification

Use Playwright MCP to programmatically verify that the implementation matches
the Figma design pixel-for-pixel. This is the most reliable verification method
because it checks actual rendered values in a real browser.

**Prerequisite:** Playwright MCP must be configured. If `browser_navigate` is
not available, suggest the user add the Playwright MCP server to their
configuration.

**Common setup (steps 1-2 shared across all checks):**

1. **Navigate** — open the running app:

   ```
   browser_navigate -> http://localhost:5173 (or the app's dev server URL)
   ```

2. **Snapshot** — capture the accessibility tree to identify element refs:
   ```
   browser_snapshot -> returns element refs like [ref="e1"], [ref="e2"], etc.
   ```

### Spacing

3. **Extract spacing** — use `browser_evaluate` on target elements to read
   computed spacing values. Pass the element ref and this function:

   ```javascript
   (el) => {
     const s = getComputedStyle(el);
     return {
       paddingTop: s.paddingTop,
       paddingRight: s.paddingRight,
       paddingBottom: s.paddingBottom,
       paddingLeft: s.paddingLeft,
       marginTop: s.marginTop,
       marginRight: s.marginRight,
       marginBottom: s.marginBottom,
       marginLeft: s.marginLeft,
       gap: s.gap,
       rowGap: s.rowGap,
       columnGap: s.columnGap,
     };
   };
   ```

4. **Compare** — the returned values are in **px** (browsers resolve rem -> px
   for computed values), so compare directly against Figma px values:
   - `paddingTop: "24px"` should match Figma `space/4` (24px comfortable)
   - `gap: "8px"` should match Figma `space/2` (8px comfortable)
   - Any mismatch indicates a wrong token mapping — refer back to the tables in
     `rules/core-spacing-tokens.md`

**Example output and interpretation:**

```
{ paddingTop: "24px", paddingRight: "24px", paddingBottom: "24px",
  paddingLeft: "24px", gap: "16px" }
```

-> Padding is `space/4` (24px) -- Tailwind class should be `p-4` -> Gap is
`space/3` (16px) -- Tailwind class should be `gap-3`

If you see `gap: "64px"` but Figma shows 8px, you likely used `gap-8`
(`--space-8` = 64px) instead of `gap-2` (`--space-2` = 8px) or `gap-gap-8`
(`--gap-8` = 8px).

### Colors

3. **Extract colors** — use `browser_evaluate` on target elements:

   ```javascript
   (el) => {
     const s = getComputedStyle(el);
     return {
       color: s.color,
       backgroundColor: s.backgroundColor,
       borderColor: s.borderColor,
     };
   };
   ```

4. **Compare** — browsers return colors in `rgb()` or `rgba()` format. To
   compare against Figma hex values:
   - `rgb(0, 0, 0)` = `#000000`
   - `rgb(255, 255, 255)` = `#FFFFFF`
   - `rgba(0, 102, 255, 1)` = `#0066FF`
   - Convert Figma hex to RGB for comparison, or convert the browser RGB to hex.
   - If colors don't match, check that the correct UDS token is being used and
     that the right theme/color-scheme `data-*` attributes are applied.

**Example output and interpretation:**

```
{ color: "rgb(255, 255, 255)", backgroundColor: "rgb(0, 102, 255)",
  borderColor: "rgb(0, 102, 255)" }
```

-> Text is white on a blue background — verify these match the Figma design's
fill and text color values for the active brand and color scheme.

### Typography

3. **Extract typography** — use `browser_evaluate` on text elements:

   ```javascript
   (el) => {
     const s = getComputedStyle(el);
     return {
       fontSize: s.fontSize,
       fontWeight: s.fontWeight,
       lineHeight: s.lineHeight,
       fontFamily: s.fontFamily,
     };
   };
   ```

4. **Compare** — browsers return resolved values:
   - `fontSize` is in **px** — compare directly against Figma type specs (e.g.,
     `"16px"` for body text, `"24px"` for headings)
   - `fontWeight` is numeric — `"400"` = regular, `"700"` = bold
   - `lineHeight` is in **px** — compare against Figma's line-height value
   - `fontFamily` — verify it includes the expected UDS font stack
   - Any mismatch indicates a wrong `Text` variant or overridden style

**Example output and interpretation:**

```
{ fontSize: "16px", fontWeight: "400", lineHeight: "24px",
  fontFamily: "\"Inter\", sans-serif" }
```

-> 16px/24px regular Inter — verify this matches the Figma text style (e.g.,
Body/Medium at 400 weight with 1.5 line-height ratio).

### Asset Dimensions

3. **Extract dimensions** — use `browser_evaluate` on image/asset elements:

   ```javascript
   (el) => {
     const rect = el.getBoundingClientRect();
     return {
       width: Math.round(rect.width),
       height: Math.round(rect.height),
       aspectRatio: +(rect.width / rect.height).toFixed(3),
     };
   };
   ```

4. **Compare** — the returned pixel dimensions should match the Figma frame:
   - `width` and `height` should match the Figma design's asset frame dimensions
   - `aspectRatio` should match the Figma frame's width/height ratio (e.g., a
     16:9 image -> `1.778`, a 4:3 image -> `1.333`, a square -> `1.0`)
   - For `AspectRatio` components, verify the rendered ratio matches the `ratio`
     prop value
   - For SVG/logo wrappers, verify the rendered size matches the explicit
     `width`/`height` set on the container `<div>`

**Example output and interpretation:**

```
{ width: 640, height: 360, aspectRatio: 1.778 }
```

-> 640x360 with 16:9 ratio — verify the Figma frame is also 16:9 and the
`AspectRatio` component uses `ratio={16/9}`.
