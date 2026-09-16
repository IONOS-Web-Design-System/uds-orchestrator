#!/usr/bin/env node
/**
 * Guard — the CAMERA axis catalogs stay on their own axis, stay fully reachable, and stay
 * consistent with the references they were authored from.
 *
 * One camera line is selected in code per run (`image-svc/src/craft/treatment.ts`,
 * `resolveCamera`) and injected as `Photographic camera: <text>`. These catalogs are NEVER
 * inlined — `skills.coverage.test.ts` lists all four in INTENTIONALLY_UNSELECTED against
 * treatment.ts — so their headers cost the prompt nothing and only the ONE drawn line is ever
 * sent. Two consequences shape this guard:
 *   - a catalog can carry as much author-facing forensics as it likes, so the check must match
 *     against the DELIVERED body with HTML comments stripped. A guard satisfied by a file's own
 *     explanation of the thing it forbids has already happened twice in this workstream;
 *   - there is no `restrictTo` on the camera axis, so every preset in a catalog is in play on
 *     every run of its imageType. A preset that the selector can never reach is dead
 *     configuration (`overhead-glazing` sat documented-but-unreachable for three places), and a
 *     preset that says something the axis does not own reaches the model on ~1/n of all runs of
 *     that type.
 *
 * WHY A SEPARATE SCRIPT. `check-minimal-conflict.mjs` derives its corpus from image-svc's
 * `minimalRules`, because its subject is what `minimal` INLINES; `check-brightness-tags.mjs`
 * derives its corpus from `ENVIRONMENT_BY_PLACE` + `LIGHTING_RULE`. Neither corpus contains a
 * camera catalog. Same discipline, separate subject, separate script:
 *   - three exit codes: 0 green, 1 violation, 2 cannot-determine. "I did not read the corpus"
 *     must never look like "the corpus is clean";
 *   - the catalog LIST, the SELECTOR and the forbidden LIGHTING vocabulary are all DERIVED from
 *     image-svc and never restated here, so an imageType added or a marker added on that side
 *     cannot escape this guard;
 *   - the author-declared vocabularies (mood, legibility, props, brand marks) carry their
 *     provenance in the comment above each one, because they cannot be derived from anywhere —
 *     they come from what is physically in the reference photographs;
 *   - every extractor asserts it found something. 0 violations over 0 presets read is not a pass.
 *
 * Usage:
 *   node scripts/check-camera-axis.mjs            # 0 = green, 1 = violation, 2 = cannot determine
 *   node scripts/check-camera-axis.mjs --verbose
 * Env:
 *   IMAGE_SVC_DIR   where to read `src/validate.ts`, `src/craft/treatment.ts` and
 *                   `src/craft/sceneMetrics.ts` from (default ../image-svc)
 *   RULES_DIR       override the rules directory — for red-proving against a mutated copy
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const VERBOSE = process.argv.includes('--verbose');
const IMAGE_SVC = process.env.IMAGE_SVC_DIR ?? resolve(REPO, '..', 'image-svc');
const RULES_DIR = process.env.RULES_DIR ?? join(REPO, 'skills', 'uds-image', 'rules');

/** exit 2 — the guard could not be evaluated. Distinct from a violation on purpose. */
function undetermined(msg) {
  console.error(`CANNOT DETERMINE: ${msg}`);
  process.exit(2);
}

function readSource(rel) {
  const p = join(IMAGE_SVC, rel);
  if (!existsSync(p)) undetermined(`image-svc ${rel} not found at ${p} — set IMAGE_SVC_DIR`);
  return readFileSync(p, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Derive the catalog list. `resolveCamera` builds the filename from the treatment class, and
//    the class is exactly `IMAGE_TYPES`, so a fifth imageType is covered here with no edit.
// ─────────────────────────────────────────────────────────────────────────────
function cameraCatalogs() {
  const validate = readSource(join('src', 'validate.ts'));
  const m = validate.match(/export const IMAGE_TYPES = \[([^\]]*)\] as const;/);
  if (!m) undetermined('export const IMAGE_TYPES not found in validate.ts — renamed, or its shape changed');
  if (m[1].includes('...')) undetermined('IMAGE_TYPES is defined by spreading another constant; this guard cannot resolve it without evaluating the module');
  const types = [...m[1].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]);
  if (types.length === 0) undetermined('IMAGE_TYPES parsed to ZERO values — the parser read nothing');

  // The filename template lives in resolveCamera. Read it rather than assuming it, so a rename
  // of the file family is a 2 and not a silent pass over an empty corpus.
  const treatment = readSource(join('src', 'craft', 'treatment.ts'));
  const tpl = treatment.match(/file: `(shared-camera-)\$\{cls\}(\.md)`/);
  if (!tpl) undetermined('the `shared-camera-${cls}.md` template was not found in treatment.ts resolveCamera — renamed, or its shape changed');
  return { types, files: types.map((t) => `${tpl[1]}${t}${tpl[2]}`) };
}

/**
 * Derive the SELECTOR so reachability can be proved rather than assumed: FNV-1a with a MurmurHash3
 * fmix32 avalanche, indexed `% presets.length`, salted per axis. Every constant and shift is
 * parsed out of treatment.ts. Re-implementing the hash here is only safe BECAUSE the constants are
 * read from the source — a hardcoded copy would go on proving reachability for a selector the
 * running code no longer uses.
 */
function selector() {
  const src = readSource(join('src', 'craft', 'treatment.ts'));
  const num = (re, what) => {
    const m = src.match(re);
    if (!m) undetermined(`${what} not found in treatment.ts stableHash — the selector cannot be reproduced, so reachability cannot be proved`);
    return Number(m[1]);
  };
  const basis = num(/let hash = (0x[0-9a-f]+);/i, 'the FNV offset basis');
  const prime = num(/hash = Math\.imul\(hash, (0x0*1000193)\);/i, 'the FNV prime');
  const shifts = [...src.matchAll(/hash \^= hash >>> (\d+);/g)].map((m) => Number(m[1]));
  const muls = [...src.matchAll(/hash = Math\.imul\(hash, (0x[0-9a-f]+)\);/gi)].map((m) => Number(m[1]));
  if (shifts.length !== 3) undetermined(`the fmix32 avalanche has ${shifts.length} shift steps in treatment.ts, not 3 — the selector cannot be reproduced`);
  if (muls.length !== 3) undetermined(`stableHash has ${muls.length} multiply steps in treatment.ts, not 3 — the selector cannot be reproduced`);
  const salt = src.match(/salt: '(:camera)'/);
  if (!salt) undetermined("the camera axis salt `:camera` was not found in resolveCamera — the selector cannot be reproduced");
  const mod = src.match(/presets\[stableHash\(brief\.requestId \+ o\.salt\) % presets\.length\]/);
  if (!mod) undetermined('the `stableHash(requestId + salt) % presets.length` index expression was not found in resolveAxis — the selection shape may have changed');

  const hash = (input) => {
    let h = basis;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, prime);
    }
    h ^= h >>> shifts[0]; h = Math.imul(h, muls[1]);
    h ^= h >>> shifts[1]; h = Math.imul(h, muls[2]);
    h ^= h >>> shifts[2];
    return h >>> 0;
  };
  return { hash, salt: salt[1] };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Vocabularies.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * FORBIDDEN LIGHTING VOCABULARY — derived, not restated. `MARKERS.lighting` in
 * `image-svc/src/craft/sceneMetrics.ts` is the single definition of what counts as a lighting
 * statement anywhere in this pipeline; the metric that uses it is what measures axis collision in
 * a brief, so a camera preset matching one of those patterns is a collision by the pipeline's own
 * definition. A marker added on that side is picked up here with no edit.
 */
function lightingMarkers() {
  const src = readSource(join('src', 'craft', 'sceneMetrics.ts'));
  const block = src.match(/\n {2}lighting: \[([\s\S]*?)\n {2}\],/);
  if (!block) undetermined('MARKERS.lighting not found in sceneMetrics.ts — renamed, or its shape changed');
  const pats = [...block[1].matchAll(/\/((?:\\.|[^/\\])+)\/([a-z]*)/g)].map((m) => new RegExp(m[1], m[2].includes('i') ? 'i' : ''));
  if (pats.length === 0) undetermined('MARKERS.lighting parsed to ZERO patterns — the parser read nothing');
  return pats;
}

/**
 * MOOD vocabulary — AUTHOR-DECLARED, and it has to be. Provenance: every `device-focused-*` Figma
 * component description ends in a mood clause ("analytical warm-office mood", "cosy browsing
 * mood", "relaxed domestic mood", "quiet personal mood", "productive mood"), and the previous
 * eleven presets were lifted from those same strings. The mood clause is the part of a reference
 * description that belongs to no axis at all, so it is the contamination most likely to arrive
 * when a catalog is authored from descriptions. `moody` is already in MARKERS.lighting; these are
 * the ones it does not cover. NOT derivable from image-svc: nothing there enumerates mood words.
 */
const MOOD_WORDS = [
  /\bmood\b/i, /\batmosphere\b/i, /\batmospheric\b/i, /\bcos[yi]\b/i, /\bcozy\b/i,
  /\bhomely\b/i, /\bserene\b/i, /\bcalm\b/i, /\bquiet\b/i, /\bcheerful\b/i, /\bupbeat\b/i,
  /\banalytical\b/i, /\bproductive\b/i, /\brelaxed\b/i,
];

/**
 * LEGIBILITY claims about a SCREEN — AUTHOR-DECLARED. Provenance: all twelve device-focused
 * references are photographs of real product UI, so every screen in the source set is covered in
 * lettering, and `device-focused` is the one imageType whose subject IS a screen. A framed picture
 * described by its typographic GENRE produced legible invented lettering in 6 of 8 draws in the
 * home-office catalog and gate-passed, against a hard no-rendered-text rule; the fix was dropping
 * the noun, because naming the thing is how the word reaches the prompt. A camera preset asserting
 * that a display is readable is the same instruction in the same family.
 *
 * TWO checks, because one rule cannot cover both shapes:
 *   (a) clause-local, on EVERY camera catalog — a legibility word in the same comma-clause as a
 *       screen noun. This is what "the display squarely readable" and "the screen legible past the
 *       subject" were. Clause-local on purpose: the portrait and scene catalogs legitimately say
 *       "readable background" and "most of the room legible", which are depth claims about a ROOM
 *       and have no lettered surface to letter;
 *   (b) catalog-wide, on the device-focused catalog ONLY — any legibility word at all. The third
 *       old wording, "the full desk setup legible", names no screen noun and so slips past (a)
 *       entirely, while meaning exactly the same thing in a catalog where the subject is always a
 *       device. The narrower scope is what makes the wider rule safe.
 */
const LEGIBILITY = /\b(readable|readably|legible|legibly|readability|legibility)\b/i;
const SCREEN_NOUN = /\b(screen|display|monitor|device|interface|ui)s?\b/i;

/**
 * PROP nouns — AUTHOR-DECLARED. Provenance: each of these is physically present in at least one
 * device-focused reference (01 a tumbler; 04 a cereal bowl, a juice glass, a plate of toast, a pen,
 * an open notebook; 05 a ring-bound notebook, scissors, a stylus; 08 a mug, two pen pots, a
 * stapler, stacked notebooks; 09 a camera with a leather strap, a saucer, a spoon, a held
 * bowl-cup; 11 an open notebook, a water bottle; 12 a framed photograph, a pen pot, a desk lamp;
 * 02 a large banana-plant leaf). `shared-scenario-props.md` owns these, keyed on place x who, so a
 * camera preset naming one puts that object into EVERY brief that draws the preset regardless of
 * who is in it or what they are doing — the unkeyed-prop defect arriving by way of the camera
 * axis, and invisible to the props guard, which scans the INJECTED rules while these catalogs are
 * read in code. A mug was removed from a home-office preset for exactly this reason.
 *
 * `frame` is deliberately NOT a pattern: every camera catalog says "in frame", "frame edge",
 * "upper frame". Nor is bare `framed`, which red-proving caught as a real false positive —
 * `shared-camera-scene.md`'s "wide establishing view framed through a doorway" uses it as the
 * verb for the framing the camera axis OWNS. Only the explicit picture nouns are matched, and
 * `framed` only when one of them follows it.
 */
const PROP_NOUNS = [
  /\bmugs?\b/i, /\bcups?\b/i, /\btumblers?\b/i, /\bglasses?\b/i, /\bbowls?\b/i, /\bplates?\b/i,
  /\bsaucers?\b/i, /\bspoons?\b/i, /\bjuice\b/i, /\btoast\b/i, /\bcereal\b/i, /\bbottles?\b/i,
  /\bnotebooks?\b/i, /\bnotepads?\b/i, /\bpens?\b/i, /\bpencils?\b/i, /\bstylus(?:es)?\b/i,
  /\bscissors\b/i, /\bstaplers?\b/i, /\bplants?\b/i, /\bleaf\b/i, /\bleaves\b/i, /\bflowers?\b/i,
  /\bkeys\b/i, /\bframed (?:photograph|picture|poster|print|art)\b/i,
  /\bphotographs?\b/i, /\bpictures?\b/i, /\bposters?\b/i,
];

/**
 * BRAND marks — AUTHOR-DECLARED. Provenance: every reference screen carries one (01 a
 * payments-brand wordmark and a device-maker engraving, 03 a social-network UI, 07 a
 * maker-identifiable all-in-one, 09 a hosting-brand dashboard, 10 a search-engine mark). Not
 * camera content, and the negative-prompt baseline forbids them in the output, so a preset naming
 * one would put a prohibited thing into the prompt on ~1/n of runs.
 */
const BRAND_NAMES = [
  /\bsumup\b/i, /\bgodaddy\b/i, /\bmacbook\b/i, /\biphone\b/i, /\bipad\b/i, /\bimac\b/i,
  /\bfacebook\b/i, /\binstagram\b/i, /\bgoogle\b/i, /\bapple\b/i, /\bmicrosoft\b/i, /\bandroid\b/i,
  /\bwindows\s+(?:10|11|12)\b/i,
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. Reading the files, image-svc's way.
// ─────────────────────────────────────────────────────────────────────────────
const norm = (s) => s.replace(/\s+/g, ' ').trim();

function delivered(name, raw) {
  if (/^\s*```/m.test(raw)) {
    undetermined(`${name} contains a fenced code block — this guard's comment strip is only exact for fence-free files`);
  }
  const out = raw.replace(/<!--[\s\S]*?-->/g, '');
  if (/<!--|-->/.test(out)) undetermined(`${name} has an UNBALANCED HTML comment marker after stripping — the delivered body cannot be determined`);
  return out;
}

/** `parseTreatmentPresets`: a `## slug` heading and the FIRST non-empty line beneath it. */
function parsePresets(name, body) {
  const presets = [];
  const problems = [];
  let cur = null;
  for (const [i, raw] of body.split('\n').entries()) {
    if (/^##(?!#)/.test(raw)) {
      const m = /^## ([a-z0-9-]+)\s*$/.exec(raw);
      if (!m) { problems.push(`${name}:${i + 1} malformed preset heading: "${norm(raw)}"`); cur = null; continue; }
      cur = { slug: m[1], line: i + 1, text: null };
      presets.push(cur);
      continue;
    }
    if (!cur) continue;
    const line = norm(raw);
    if (line.length === 0) continue;
    if (cur.text === null) cur.text = line;
  }
  return { presets, problems };
}

/** Comment-resident rosters. Read from the RAW file — they are author metadata by design. */
function roster(raw, key) {
  const m = raw.match(new RegExp(`${key}:\\s*([\\s\\S]*?)(?:\\n\\s*\\n|\\n\\s{5}[A-Z][a-z]|-->)`));
  if (!m) return null;
  const names = [...m[1].matchAll(/device-focused-(\d{2})/g)].map((x) => x[1]);
  return names.length ? names : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────
if (!existsSync(RULES_DIR)) undetermined(`rules dir not found: ${RULES_DIR}`);
if (readdirSync(RULES_DIR).filter((f) => f.endsWith('.md')).length < 10) {
  undetermined(`${RULES_DIR} holds under 10 rule files — wrong directory`);
}

const { types, files } = cameraCatalogs();
const LIGHTING = lightingMarkers();
const sel = selector();
const REFERENCE_CATALOG = 'shared-camera-device-focused.md';

console.log(`camera catalogs derived from image-svc IMAGE_TYPES + resolveCamera:`);
for (const f of files) console.log(`  ${f}`);
console.log(`forbidden lighting patterns derived from sceneMetrics.ts MARKERS.lighting: ${LIGHTING.length}`);

const violations = [];
let presetsRead = 0;
let legibilityClausesRead = 0;
const byFile = new Map();

for (const file of files) {
  const path = join(RULES_DIR, file);
  if (!existsSync(path)) undetermined(`${file} is named by image-svc IMAGE_TYPES but absent under ${RULES_DIR}`);
  const raw = readFileSync(path, 'utf8');
  if (raw.trim().length < 50) undetermined(`${file} is under 50 chars — the guard is reading a stub, not a catalog`);
  const { presets, problems } = parsePresets(file, delivered(file, raw));
  for (const p of problems) violations.push(p);
  // A camera catalog is at least three presets; fewer and the axis is a near-homogeniser anyway.
  if (presets.length < 3) undetermined(`${file} yielded ${presets.length} presets from its DELIVERED body — the extractor is not reading the catalog`);
  presetsRead += presets.length;
  byFile.set(file, { raw, presets });
  if (VERBOSE) console.log(`  · ${file}: ${presets.length} presets`);

  const seen = new Set();
  for (const p of presets) {
    const where = `${file}:${p.line} ${p.slug}`;
    if (p.text === null) { violations.push(`${where}: heading with nothing beneath it in the delivered body`); continue; }
    if (seen.has(p.slug)) violations.push(`${where}: duplicate slug — the later one is unreachable, since resolveAxis finds by first match`);
    seen.add(p.slug);
    if (p.text.length < 21) {
      violations.push(`${where}: injected text is ${p.text.length} chars ("${p.text}") — under the 20-char floor image-svc's own presetFiles test applies`);
    }
    // A tag line authored above the text becomes the INJECTED line; measured once as
    // `Photographic lighting: Daylight: side` with a whole suite green.
    if (/^[A-Za-z][A-Za-z ]{0,24}:/.test(p.text)) {
      violations.push(`${where}: the first line under the heading looks like a metadata tag ("${p.text.slice(0, 40)}…"), so THAT is what gets injected in place of the viewpoint`);
    }
    for (const re of LIGHTING) {
      if (re.test(p.text)) violations.push(`${where}: matches the lighting marker /${re.source}/ — "${p.text}". shared-lighting.md owns light, direction, quality and grade; two voices about one frame is the conflict this axis exists to remove`);
    }
    for (const re of MOOD_WORDS) {
      if (re.test(p.text)) violations.push(`${where}: matches the mood pattern /${re.source}/ — "${p.text}". A mood clause belongs to no axis and is the contamination a reference DESCRIPTION carries`);
    }
    for (const re of PROP_NOUNS) {
      if (re.test(p.text)) violations.push(`${where}: names the prop /${re.source}/ — "${p.text}". shared-scenario-props.md owns objects, keyed on place x who; a camera preset naming one puts it into every brief that draws the preset`);
    }
    for (const re of BRAND_NAMES) {
      if (re.test(p.text)) violations.push(`${where}: names the brand /${re.source}/ — "${p.text}". The negative-prompt baseline forbids brand marks in the output`);
    }
    // (a) clause-local legibility claim about a screen, on every catalog
    for (const clause of p.text.split(/[,;]/)) {
      if (!LEGIBILITY.test(clause)) continue;
      legibilityClausesRead++;
      if (SCREEN_NOUN.test(clause)) {
        violations.push(`${where}: claims a screen is readable ("${norm(clause)}"). The camera axis owns the screen's PLANE — position, angle, crop — never what can be read on it; a legibility claim about a lettered surface is an instruction to letter it`);
      }
    }
    // (b) catalog-wide legibility ban, device-focused only
    if (file === REFERENCE_CATALOG && LEGIBILITY.test(p.text)) {
      violations.push(`${where}: uses legibility vocabulary in the one catalog whose subject is always a device ("${p.text}") — no clause-local exception applies here`);
    }
  }
}

if (presetsRead < 20) undetermined(`only ${presetsRead} presets read across ${files.length} catalogs — the extractor cannot have cleared them`);

// ─────────────────────────────────────────────────────────────────────────────
// REACHABILITY — prove every preset is drawable, with the selector read out of image-svc.
//
// This is the `overhead-glazing` rule applied to the camera axis: a documented preset the
// selector can never reach is dead configuration that reads as choice. There is no restrictTo on
// this axis, so unreachability can only come from the hash's image over Z_n — which is measured
// here rather than assumed, across four requestId SHAPES, because a real requestId is not a
// uniform random string.
// ─────────────────────────────────────────────────────────────────────────────
const SHAPES = [
  (i) => `run-${i}`,
  (i) => `nm2-ionos-${i}`,
  (i) => `${i}`,
  (i) => `0193a${i.toString(16).padStart(6, '0')}-7c3e-4a1b-9f2d-${(i * 7919).toString(16)}`,
];
const N_PER_SHAPE = 4000;
for (const [file, { presets }] of byFile) {
  const hits = new Array(presets.length).fill(0);
  let drawn = 0;
  for (const shape of SHAPES) {
    for (let i = 0; i < N_PER_SHAPE; i++) {
      hits[sel.hash(shape(i) + sel.salt) % presets.length]++;
      drawn++;
    }
  }
  if (drawn === 0) undetermined('the reachability loop drew ZERO presets — it cannot have cleared any catalog');
  const dead = presets.filter((_, i) => hits[i] === 0).map((p) => p.slug);
  if (dead.length) {
    violations.push(`${file}: preset(s) [${dead.join(', ')}] were drawn 0 times over ${drawn} requestIds across ${SHAPES.length} id shapes — dead configuration that reads as choice`);
  }
  if (VERBOSE) {
    const pct = hits.map((h) => ((h / drawn) * 100).toFixed(1));
    console.log(`  · ${file} draw share %: ${pct.join(' ')}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// REFERENCE ROSTER — the device-focused catalog records which Figma references it was authored
// from, and which were excluded. The count must match the presets, because the contract is one
// preset per reference: padding to keep a number, or dropping a distinct viewpoint to tidy, are
// both invisible without this.
//
// The roster lives in the header COMMENT, which is the right place — it is author metadata, it is
// never delivered, and the two halves of the file are then independently editable, which is what
// makes this a check and not a tautology.
// ─────────────────────────────────────────────────────────────────────────────
{
  const entry = byFile.get(REFERENCE_CATALOG);
  if (!entry) undetermined(`${REFERENCE_CATALOG} is not among the derived catalogs — device-focused is no longer an imageType, or the template changed`);
  const refs = roster(entry.raw, 'References');
  const excluded = roster(entry.raw, 'Excluded');
  if (!refs) undetermined(`${REFERENCE_CATALOG} carries no \`References:\` roster in its header comment — the one-preset-per-reference contract cannot be checked`);
  if (!excluded) undetermined(`${REFERENCE_CATALOG} carries no \`Excluded:\` roster — an empty exclusion must be written out as such, because "no line" and "nothing excluded" are not the same claim`);

  const dupRefs = refs.filter((r, i) => refs.indexOf(r) !== i);
  if (dupRefs.length) violations.push(`${REFERENCE_CATALOG}: reference(s) [${[...new Set(dupRefs)].join(', ')}] listed twice in the References roster`);
  const both = refs.filter((r) => excluded.includes(r));
  if (both.length) violations.push(`${REFERENCE_CATALOG}: reference(s) [${both.join(', ')}] are in BOTH the References and Excluded rosters`);

  if (entry.presets.length !== refs.length) {
    violations.push(`${REFERENCE_CATALOG}: ${entry.presets.length} presets against ${refs.length} references in the roster — the contract is one preset per reference, so this is either a padded count or a dropped viewpoint`);
  }
  // The roster must account for a CONTIGUOUS reference set. A reference that exists in Figma but
  // appears in neither roster is the `device-focused-10` failure repeating silently: the previous
  // catalog simply had no row for it and nothing said so.
  const all = [...refs, ...excluded].map(Number).sort((a, b) => a - b);
  for (let i = 0; i < all.length; i++) {
    if (all[i] !== i + 1) {
      violations.push(`${REFERENCE_CATALOG}: References + Excluded = [${all.join(', ')}], which is not contiguous from 01 — reference ${String(i + 1).padStart(2, '0')} is accounted for in neither roster`);
      break;
    }
  }
  console.log(`\n${REFERENCE_CATALOG}: ${entry.presets.length} presets, ${refs.length} references authored, ${excluded.length} excluded (${excluded.map((e) => `device-focused-${e}`).join(', ')})`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN-VISIBILITY DECLARATION <-> TEXT consistency.
//
// THE GAP THIS CLOSES. A roster check is coverage, and coverage cannot see a MIS-declaration — in
// the brightness work, retagging both near-white presets permissively left the coverage guard
// green because the value survived elsewhere in the catalog. The same hole is here: the two
// visibility lists could name every slug exactly once, in the wrong lists, and every check above
// would still pass while the catalog pushed the model at the one frame that failed in pixels.
//
// So the declaration is read back against each preset's own INJECTED text, both ways:
//   - a preset declared self-consistent only with NO operator must SAY so in the text it injects,
//     by closing the plane behind the device. That sentence is the whole fix; a declaration
//     without it is a claim the prompt never makes;
//   - a preset declared screen-see-able with an operator must NOT close that plane, or the
//     declaration and the text disagree about whether anyone can be there;
//   - and any preset whose text asserts the lens is SQUARE to the display must either be declared
//     no-operator or state the shared-side position in its own text — otherwise it is exactly the
//     `frontal-elevated-device-hero` geometry (operator behind the device, screen facing the lens
//     and away from them) with nothing anywhere saying so.
// Anchored to the injected line, never the document, so a phrase in a neighbouring preset or in
// the header's own explanation cannot satisfy it.
// ─────────────────────────────────────────────────────────────────────────────
const UNATTENDED_MARK = /\b(?:table|desk|surface)\s+behind\b[^,]*\bempty\b|\bnothing\b[^,]*\bbehind\b/i;
const SQUARE_CLAIM = /\bfrontal\b|\bsquare to the lens\b|\bscreen[- ]forward\b/i;
const SHARED_SIDE = /\bover the shoulder\b|\bbehind and above\b|\babove and behind\b|\bfrom behind\b|\bown side\b/i;
{
  const entry = byFile.get(REFERENCE_CATALOG);
  const raw = entry.raw;
  const list = (label) => {
    const m = raw.match(new RegExp(`${label}:\\s*([\\s\\S]*?)\\.\\s*\\n`));
    if (!m) return null;
    const slugs = [...m[1].matchAll(/[a-z][a-z0-9]*(?:-[a-z0-9]+)+/g)].map((x) => x[0]);
    return slugs.length ? slugs : null;
  };
  const seeable = list('Screen-see-able with an operator present');
  const unattended = list('Self-consistent only with NO operator');
  if (!seeable) undetermined(`${REFERENCE_CATALOG}: no \`Screen-see-able with an operator present:\` list in the header — the visibility declaration cannot be checked`);
  if (!unattended) undetermined(`${REFERENCE_CATALOG}: no \`Self-consistent only with NO operator:\` list in the header — an empty set must be written out, because "no line" and "no such preset" are not the same claim`);

  const slugs = entry.presets.map((p) => p.slug);
  const declared = [...seeable, ...unattended];
  const overlap = seeable.filter((s) => unattended.includes(s));
  if (overlap.length) violations.push(`${REFERENCE_CATALOG}: [${overlap.join(', ')}] declared in BOTH visibility lists`);
  const undeclared = slugs.filter((s) => !declared.includes(s));
  if (undeclared.length) violations.push(`${REFERENCE_CATALOG}: preset(s) [${undeclared.join(', ')}] appear in neither visibility list — an undeclared preset fails open and silently, which is the failure this pair exists for`);
  const ghosts = declared.filter((s) => !slugs.includes(s));
  if (ghosts.length) violations.push(`${REFERENCE_CATALOG}: visibility list(s) name [${ghosts.join(', ')}], which is not a preset in the body — the declaration and the catalog have drifted apart`);

  let squareChecked = 0;
  for (const p of entry.presets) {
    if (p.text === null) continue;
    const isUnattended = unattended.includes(p.slug);
    const closes = UNATTENDED_MARK.test(p.text);
    if (isUnattended && !closes) {
      violations.push(`${REFERENCE_CATALOG}:${p.line} ${p.slug}: declared self-consistent only with NO operator, but its injected text does not close the plane behind the device ("${p.text}") — the declaration is a claim the prompt never makes`);
    }
    if (!isUnattended && closes) {
      violations.push(`${REFERENCE_CATALOG}:${p.line} ${p.slug}: declared screen-see-able WITH an operator, but its injected text closes the plane behind the device ("${p.text}") — the two disagree about whether anyone can stand there`);
    }
    if (SQUARE_CLAIM.test(p.text)) {
      squareChecked++;
      if (!isUnattended && !SHARED_SIDE.test(p.text)) {
        violations.push(`${REFERENCE_CATALOG}:${p.line} ${p.slug}: asserts the lens is square to the display ("${p.text}") while declared screen-see-able with an operator, and its text never puts the lens on the display's own side — that is the frontal-elevated-device-hero geometry, the 1-in-9 frame that failed in pixels`);
      }
    }
  }
  // Assert both extractors found something: 0 flagged out of 0 read is not a pass, and the
  // square-claim check is the one most easily satisfied by a reworded catalog.
  if (unattended.length === 0) undetermined(`${REFERENCE_CATALOG}: the no-operator list parsed to zero slugs`);
  if (squareChecked === 0) {
    undetermined(`${REFERENCE_CATALOG}: no preset asserts a square-to-the-display view in its injected text, so that check read nothing — either the catalog was reworded or the extractor is not reading the injected lines`);
  }
  console.log(`visibility declaration: ${seeable.length} screen-see-able, ${unattended.length} no-operator; ` +
    `square-to-display claims checked: ${squareChecked}`);
}

if (legibilityClausesRead === 0 && VERBOSE) {
  console.log('note: no clause anywhere in the four catalogs uses legibility vocabulary — the clause-local\n' +
    '      check is currently vacuous by construction, which is the desired end state, not a fault.');
}

const lens = [...byFile].map(([f, v]) => `${f.replace(/^shared-camera-|\.md$/g, '')} ${v.presets.length}`).join(', ');
console.log(`\npresets read: ${presetsRead} (${lens}); legibility clauses examined: ${legibilityClausesRead}`);

if (violations.length) {
  console.error(`\nFAIL — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}
console.log('PASS — every camera preset is reachable and on its own axis (no lighting marker, mood clause,\n' +
  '       prop noun, brand mark or screen-legibility claim); the device-focused catalog accounts for\n' +
  '       every Figma reference exactly once; and its screen-visibility declaration agrees with the\n' +
  '       text each preset actually injects.');
