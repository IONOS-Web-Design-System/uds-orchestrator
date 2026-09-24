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
 *   - the author-declared vocabularies (mood, legibility, props, brand marks, shot-size bands,
 *     frame aspect) carry their provenance in the comment above each one, because they cannot be
 *     derived from anywhere — they come from what is physically in the reference photographs, or
 *     from a defect this pipeline already measured;
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
  // Matched as an ASSIGNMENT to any name, not as the literal `file:` property it used to be: the
  // template moved to `const file = \`shared-camera-${cls}.md\`;` when the camera axis gained a
  // restriction, and pinning the old spelling took this guard to exit 2 for a change inside the
  // shape it verifies. A genuine rename still returns 2, which is the property worth keeping.
  const tpl = treatment.match(/(?:file:|file\s*=)\s*`(shared-camera-)\$\{cls\}(\.md)`/);
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

  // THE INDEX EXPRESSION, read as its ARGUMENT LIST rather than as one fixed string. The previous
  // form of this check pinned the literal `stableHash(brief.requestId + o.salt)`, and when a
  // per-variant salt term was added in front of it the guard went to exit 2 — correct behaviour
  // (it could no longer reproduce the selector) but it took the whole guard down for a change that
  // is INSIDE the shape it means to verify. So: match the concatenation, then classify each term.
  // An unrecognised term still returns 2, because a selector this script cannot reproduce cannot
  // be used to prove reachability — that is the property worth keeping, not the literal.
  const mod = src.match(/presets\[stableHash\(([^)]*?(?:\([^)]*\))?[^)]*?)\)\s*%\s*presets\.length\]/);
  if (!mod) undetermined('the `stableHash(...) % presets.length` index expression was not found in resolveAxis — the selection shape may have changed');
  const terms = mod[1].split('+').map((t) => t.trim());
  if (!terms.includes('brief.requestId')) undetermined(`the index expression does not hash brief.requestId (terms: ${terms.join(' + ')}) — the rotation is no longer keyed on the request`);
  if (!terms.includes('o.salt')) undetermined(`the index expression does not hash the axis salt (terms: ${terms.join(' + ')}) — the axes may no longer be decorrelated`);
  const variantTerm = terms.find((t) => /variantSalt/.test(t));
  const unknown = terms.filter((t) => t !== 'brief.requestId' && t !== 'o.salt' && t !== variantTerm);
  if (unknown.length) undetermined(`the index expression hashes term(s) this guard cannot reproduce: ${unknown.join(', ')} — reachability cannot be proved against a selector it does not model`);

  // The VARIANT dimension, derived the same way. `variantSalt(0)` is the empty string by contract,
  // so a single-variant run hashes exactly what it hashed before the term existed — which is why
  // reachability must be measured at variant 0 AND above it, not only at 0.
  let variantSalt = () => '';
  if (variantTerm) {
    const vs = src.match(/export function variantSalt\(variantIndex: number\): string \{\s*return variantIndex > 0 \? `([a-z]*)\$\{variantIndex\}([^`]*)` : '';/);
    if (!vs) undetermined('the index expression uses variantSalt() but its body could not be parsed out of treatment.ts — the per-variant dimension cannot be reproduced');
    variantSalt = (i) => (i > 0 ? `${vs[1]}${i}${vs[2]}` : '');
    if (variantSalt(0) !== '') undetermined('variantSalt(0) does not reproduce as the empty string — the single-variant no-op contract this guard relies on no longer holds');
  }

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
  // The hash INPUT is assembled in the source's own term order, so a reordering of the
  // concatenation (which changes every draw, FNV being a rolling hash) is reproduced rather than
  // silently ignored.
  const index = (requestId, variantIndex) => hash(terms.map((t) => (
    t === 'brief.requestId' ? requestId : t === 'o.salt' ? salt[1] : variantSalt(variantIndex)
  )).join(''));
  return { hash, index, salt: salt[1], hasVariantDimension: Boolean(variantTerm) };
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

/**
 * Comment-resident rosters. Read from the RAW file — they are author metadata by design.
 *
 * GENERALISED past `device-focused-NN`: the portrait catalog cites `portrait-NN` AND one
 * `avatar-NN` cross-set reference, so a hardcoded family prefix would silently read zero names out
 * of it and the roster contract would go unchecked on the very catalogs this check was extended
 * for. Names are matched as `<family>-NN`; the caller decides which families it expects.
 *
 * `(none)` is a FIRST-CLASS value and returns `[]`, distinct from `null` for "no such line". An
 * empty set has to be written out, because "no line" and "nothing in this class" are different
 * claims and only one of them is auditable.
 */
function roster(raw, key) {
  const m = raw.match(new RegExp(`${key}:\\s*([\\s\\S]*?)(?:\\n\\s*\\n|\\n\\s{5}[A-Z][a-z]|-->)`));
  if (!m) return null;
  if (/\(none\)/i.test(m[1])) return [];
  const names = [...m[1].matchAll(/\b([a-z][a-z0-9]*(?:-[a-z0-9]+)*?)-(\d{2})\b/g)].map((x) => ({ family: x[1], n: x[2], name: `${x[1]}-${x[2]}` }));
  return names.length ? names : null;
}

/** Slug rosters (not reference names): the retained-without-a-reference class. Same `(none)`
 *  contract, same reason. */
function slugRoster(raw, key) {
  const m = raw.match(new RegExp(`${key}:\\s*([\\s\\S]*?)(?:\\n\\s*\\n|\\n\\s{5}[A-Z][a-z]|-->)`));
  if (!m) return null;
  if (/\(none\)/i.test(m[1])) return [];
  const slugs = [...m[1].matchAll(/\b[a-z][a-z0-9]*(?:-[a-z0-9]+)+\b/g)].map((x) => x[0]);
  return slugs.length ? slugs : null;
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
// THE CANDIDATE SET THIS PROVES OVER. The camera axis gained a `restrictTo` —
// `screenVisibleCandidates`, which narrows a catalog to its `ScreenVisible: yes` presets when an
// operator is in frame. It returns `null` (no opinion) for an UNTAGGED catalog, so whole-catalog
// reachability is the correct model only for catalogs carrying no tag. That is asserted rather
// than assumed: a tagged catalog measured as if it were untagged would report a preset reachable
// that the runtime filter removes, which is the mirror of the dead-configuration fault below.
{
  const restricted = readSource(join('src', 'craft', 'treatment.ts')).includes('restrictTo: screenVisibleCandidates(');
  const tagged = [...byFile].filter(([, v]) => /^ScreenVisible:/m.test(delivered('x', v.raw))).map(([f]) => f);
  console.log(`\ncamera restrictTo present in resolveCamera: ${restricted}; catalogs carrying ScreenVisible tags: ${tagged.length ? tagged.join(', ') : 'none'}`);
  if (restricted && tagged.length) {
    // Prove reachability over the NARROWED set too, for the tagged catalogs, or the claim below is
    // only about the no-operator path.
    for (const file of tagged) {
      const { raw, presets } = byFile.get(file);
      const body = delivered(file, raw);
      const yes = new Set();
      let cur = null;
      for (const ln of body.split('\n')) {
        const h = /^## ([a-z0-9-]+)\s*$/.exec(ln);
        if (h) { cur = h[1]; continue; }
        const t = /^ScreenVisible:\s*(\S+)\s*$/.exec(ln.trim());
        if (t && cur && t[1] === 'yes') yes.add(cur);
      }
      if (yes.size === 0) {
        undetermined(`${file} carries ScreenVisible tags but none parsed to \`yes\` — the narrowed candidate set cannot be derived, so reachability under an operator cannot be proved`);
      }
      const narrowed = presets.filter((p) => yes.has(p.slug));
      const hits = new Array(narrowed.length).fill(0);
      for (let i = 0; i < 4000; i++) hits[sel.index(`run-${i}`, 0) % narrowed.length]++;
      const dead = narrowed.filter((_, i) => hits[i] === 0).map((p) => p.slug);
      if (dead.length) violations.push(`${file}: inside the ScreenVisible=yes candidate set (${narrowed.length} of ${presets.length}), preset(s) [${dead.join(', ')}] were never drawn — dead configuration on the operator-in-frame path`);
      console.log(`  · ${file}: ScreenVisible=yes narrows ${presets.length} -> ${narrowed.length}; all drawable: ${dead.length === 0}`);
    }
  }
}

const SHAPES = [
  (i) => `run-${i}`,
  (i) => `nm2-ionos-${i}`,
  (i) => `${i}`,
  (i) => `0193a${i.toString(16).padStart(6, '0')}-7c3e-4a1b-9f2d-${(i * 7919).toString(16)}`,
];
const N_PER_SHAPE = 4000;
// Variant indices swept, not just 0. A per-variant salt term means each variant of a set draws
// INDEPENDENTLY, so "reachable" is a claim about every variant slot and not only the first — and
// variant 0 is the one that reproduces the pre-variant draw exactly, so measuring it alone would
// miss a dead preset introduced by the new dimension. `hasVariantDimension` is derived; when the
// term is absent every index collapses onto variant 0's and the sweep is harmlessly redundant.
const VARIANTS = sel.hasVariantDimension ? [0, 1, 2] : [0];
for (const [file, { presets }] of byFile) {
  const perVariant = new Map();
  let drawn = 0;
  for (const v of VARIANTS) {
    const hits = new Array(presets.length).fill(0);
    for (const shape of SHAPES) {
      for (let i = 0; i < N_PER_SHAPE; i++) {
        hits[sel.index(shape(i), v) % presets.length]++;
        drawn++;
      }
    }
    perVariant.set(v, hits);
  }
  if (drawn === 0) undetermined('the reachability loop drew ZERO presets — it cannot have cleared any catalog');
  for (const [v, hits] of perVariant) {
    const dead = presets.filter((_, i) => hits[i] === 0).map((p) => p.slug);
    if (dead.length) {
      violations.push(`${file}: at variantIndex ${v}, preset(s) [${dead.join(', ')}] were drawn 0 times over ${N_PER_SHAPE * SHAPES.length} requestIds across ${SHAPES.length} id shapes — dead configuration that reads as choice`);
    }
    if (VERBOSE) {
      const per = N_PER_SHAPE * SHAPES.length;
      console.log(`  · ${file} v${v} draw share %: ${hits.map((h) => ((h / per) * 100).toFixed(1)).join(' ')}`);
    }
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
  const refs = (roster(entry.raw, 'References') ?? []).map((r) => r.n);
  const excludedRaw = roster(entry.raw, 'Excluded');
  const excluded = (excludedRaw ?? []).map((r) => r.n);
  if (refs.length === 0) undetermined(`${REFERENCE_CATALOG} carries no \`References:\` roster in its header comment — the one-preset-per-reference contract cannot be checked`);
  if (excludedRaw === null) undetermined(`${REFERENCE_CATALOG} carries no \`Excluded:\` roster — an empty exclusion must be written out as such, because "no line" and "nothing excluded" are not the same claim`);

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

// ─────────────────────────────────────────────────────────────────────────────
// HUMAN EXTENT — every device-focused preset must state HOW MUCH OF A PERSON its frame keeps.
//
// PROVENANCE, from a user review of the reference set on 2026-09-24. `device-focused-03` is a
// laptop screen filling the frame whose entire human presence is two cropped forearms at the
// bottom edge — no face, no head, no torso — and the preset written from it said only "a forearm
// below", which records a framing landmark and buries the defining fact. Re-read from the pixels,
// TEN of the twelve references carry no face at all and only two (07, 11) contain a figure with
// one; meanwhile the axis was measuring an operator in frame in 6 of 6 frames on a live device
// variant set and a medium-or-larger figure dominating 11 of 12 on an earlier grid, against a
// type contract that says the device is the hero. The extent clause is the fix, and this is what
// stops it being quietly dropped in the next rewrite of a line.
//
// SCOPED TO THE REFERENCE CATALOG, and biconditional against the visibility declaration, which is
// the one place the requirement inverts:
//   - a preset declared screen-see-able WITH an operator must name at least one human landmark,
//     because an operator is in its frame by declaration and the line is the only per-preset voice
//     that can say how much of them;
//   - the `unattended-only` preset must name NONE. Naming a person there is exactly what invites
//     the operator-behind-the-display contradiction that preset was rewritten to avoid, so the
//     absence is a requirement and not an omission.
// Anchored to the INJECTED line with comments stripped, like every other check here: the header's
// own HUMAN EXTENT section names every one of these landmarks, and a guard a file's explanation
// can satisfy has already happened twice in this workstream.
//
// THE PATTERN IS A SUBJECT PLUS A LANDMARK, NOT A LANDMARK ALONE, and the first draft of this
// check got that wrong in a way red-proving caught: a bare body-part vocabulary is satisfied by
// every CAMERA-POSITION idiom in the catalog. "close over the shoulder at screen height" contains
// `shoulder`, "from behind and above the hands" contains `hands`, "held in both hands" contains
// `hands` — so deleting the whole extent clause from `close-frontal-screen` left the guard green.
// The clause therefore has to be recognised by its SUBJECT: a comma-clause that says what of THE
// PERSON / THE OPERATOR / THE NEAR PERSON the frame keeps. That is a form requirement on the
// author, which is the trade a guard on prose always makes — the alternative is a check that
// cannot fail.
//
// The landmark vocabulary is AUTHOR-DECLARED and cannot be derived: it is the set of body
// landmarks physically present in the twelve reference photographs. It deliberately does NOT
// include the shot-size bands (`BANDS` above) — those are the character catalogs' vocabulary and a
// device preset stating one would trip that table instead.
// ─────────────────────────────────────────────────────────────────────────────
const HUMAN_EXTENT_CLAUSE =
  /\bthe (?:near person|person|operator|holder)\b[^,]*\b(?:hands?|forearms?|shoulders?|sleeves?|heads?|torso|lap|figure|profile|frame)\b/i;
const HUMAN_LANDMARK = /\bthe (?:near person|person|operator|holder)\b/i;
{
  const entry = byFile.get(REFERENCE_CATALOG);
  const unattended = new Set();
  // The tag is read the same way the tag<->declaration check below does: from the DELIVERED body,
  // per preset heading. Duplicated deliberately rather than shared — this check must not silently
  // inherit a parse bug from that one, and both assert they read something.
  const delivered_ = delivered(REFERENCE_CATALOG, entry.raw);
  let slug = null;
  for (const raw of delivered_.split('\n')) {
    const h = /^##\s+(\S+)\s*$/.exec(raw.trim());
    if (h) { slug = h[1]; continue; }
    const t = /^ScreenVisible:\s*(\S+)\s*$/.exec(raw.trim());
    if (t && slug && t[1] === 'unattended-only') unattended.add(slug);
  }
  if (unattended.size === 0) {
    undetermined(`${REFERENCE_CATALOG}: the human-extent check read ZERO \`unattended-only\` presets, so its inverted half read nothing — either the tags moved or this extractor is not reading them`);
  }
  let extentRead = 0;
  for (const p of entry.presets) {
    if (p.text === null) continue;
    extentRead++;
    const names = HUMAN_EXTENT_CLAUSE.test(p.text) || HUMAN_LANDMARK.test(p.text);
    if (unattended.has(p.slug)) {
      if (names) {
        violations.push(`${REFERENCE_CATALOG}:${p.line} ${p.slug}: declared \`ScreenVisible: unattended-only\` but its injected text names a human landmark ("${p.text}") — naming a person in the frame that is self-consistent only WITHOUT one is the contradiction that preset was rewritten to remove`);
      }
      continue;
    }
    if (!HUMAN_EXTENT_CLAUSE.test(p.text)) {
      violations.push(`${REFERENCE_CATALOG}:${p.line} ${p.slug}: its injected text states no HUMAN EXTENT ("${p.text}") — no clause of the form "the person/operator ... <landmark>". Every reference but 07 and 11 carries no face, and this line is the only per-preset voice that can say so; a preset that records only the camera position is the \`device-focused-03\` defect the user found. A body part inside a camera-position idiom ("over the shoulder", "held in both hands") does NOT count`);
    }
  }
  if (extentRead === 0) undetermined(`${REFERENCE_CATALOG}: the human-extent check read ZERO preset lines — 0 violations over 0 lines is not a pass`);
  console.log(`human extent: ${extentRead} preset lines checked, ${unattended.size} exempt as unattended-only`);
}

// ─────────────────────────────────────────────────────────────────────────────
// The inline `ScreenVisible:` tag is the form CODE can read; the two header lists above are the
// author-facing form. A comment is stripped by the loader, which is why the declaration needed a
// form outside one — and why there are now two forms of the same fact. Two forms are only safe if
// something pins them together, so that is what this does: the tag set must reproduce the lists
// exactly, in both directions.
//
// The tag must also NOT be the first non-empty line under its heading. `parseTreatmentPresets`
// takes that line as the preset's injectable TEXT, so a tag placed first would be sent to the model
// as the camera instruction. `p.text` is that first line, so comparing against it is the check.
// ─────────────────────────────────────────────────────────────────────────────
const SCREEN_VISIBLE_VALUES = new Set(['yes', 'unattended-only']);
{
  const entry = byFile.get(REFERENCE_CATALOG);
  const raw = entry.raw;
  // Re-derived locally rather than reaching into the block above: the two checks must be able to
  // fail independently, and a shared binding would make this one silently inherit that one's
  // parse failure.
  const headerList = (label) => {
    const m = raw.match(new RegExp(`${label}:\\s*([\\s\\S]*?)\\.\\s*\\n`));
    if (!m) return [];
    return [...m[1].matchAll(/[a-z][a-z0-9]*(?:-[a-z0-9]+)+/g)].map((x) => x[0]);
  };
  const unattendedDeclared = headerList('Self-consistent only with NO operator');
  if (unattendedDeclared.length === 0) {
    undetermined(`${REFERENCE_CATALOG}: the no-operator header list parsed to zero slugs here, so the tag<->declaration pin cannot be checked`);
  }
  const tags = new Map();
  let malformed = 0;
  // Line scan, not a lookahead regex: `(?=\n## |\n*$)` under /m ends the body at the FIRST line
  // end, so it captured the text line and stopped short of the tag — and this extractor's own
  // anti-vacuity assertion is what caught that, by reporting zero tags read instead of passing.
  const blocks = [];
  for (const line of raw.split('\n')) {
    const h = line.match(/^## (\S+)\s*$/);
    if (h) blocks.push({ slug: h[1], body: [] });
    else if (blocks.length) blocks[blocks.length - 1].body.push(line);
  }
  for (const b of blocks) {
    const slug = b.slug;
    const hits = b.body
      .map((l) => l.match(/^ScreenVisible:[ \t]*(\S+)[ \t]*$/))
      .filter(Boolean)
      .map((x) => x[1]);
    if (hits.length > 1) {
      violations.push(`${REFERENCE_CATALOG}: ${slug} carries ${hits.length} \`ScreenVisible:\` lines — one fact, one line, or the parser silently takes whichever it reads first`);
      malformed++;
      continue;
    }
    if (hits.length === 1) tags.set(slug, hits[0]);
  }

  if (tags.size === 0) {
    undetermined(`${REFERENCE_CATALOG}: read zero \`ScreenVisible:\` tags, so the tag<->declaration check read nothing — either the tags were removed or this extractor is not reading them`);
  } else {
    for (const pre of entry.presets) {
      const tag = tags.get(pre.slug);
      if (tag === undefined) {
        violations.push(`${REFERENCE_CATALOG}:${pre.line} ${pre.slug}: no \`ScreenVisible:\` tag. The runtime candidate filter reads the tag, not the header lists, so an untagged preset is invisible to it and falls open`);
        continue;
      }
      if (!SCREEN_VISIBLE_VALUES.has(tag)) {
        violations.push(`${REFERENCE_CATALOG}:${pre.line} ${pre.slug}: \`ScreenVisible: ${tag}\` is outside the closed vocabulary [${[...SCREEN_VISIBLE_VALUES].join(', ')}] — an unknown value makes the filter fail open without saying so`);
        continue;
      }
      // The tag must not have become the injectable line.
      if (pre.text !== null && /^ScreenVisible:/.test(pre.text)) {
        violations.push(`${REFERENCE_CATALOG}:${pre.line} ${pre.slug}: the \`ScreenVisible:\` tag is the FIRST line under the heading, so parseTreatmentPresets will take it as the camera text and ship it to the model. Put the text first and the tag below it`);
      }
      const declaredUnattended = unattendedDeclared.includes(pre.slug);
      const taggedUnattended = tag === 'unattended-only';
      if (declaredUnattended !== taggedUnattended) {
        violations.push(`${REFERENCE_CATALOG}:${pre.line} ${pre.slug}: the header declares it ${declaredUnattended ? 'self-consistent only with NO operator' : 'screen-see-able with an operator'} but the tag says \`${tag}\` — the author-facing declaration and the machine-readable one have drifted, and code follows the tag`);
      }
    }
    const ghostTags = [...tags.keys()].filter((s) => !entry.presets.some((pre) => pre.slug === s));
    if (ghostTags.length) {
      violations.push(`${REFERENCE_CATALOG}: \`ScreenVisible:\` tag(s) on [${ghostTags.join(', ')}], which are not presets in the body`);
    }
    // Count each value, never `size - other`: a subtraction reports an INVALID value as a valid
    // one, which is the mis-tag blindness this file already guards for elsewhere.
    const tally = new Map();
    for (const v of tags.values()) tally.set(v, (tally.get(v) ?? 0) + 1);
    const taggedUnattendedCount = tally.get('unattended-only') ?? 0;
    const shown = [...tally.entries()].map(([v, n]) => `${n} ${v}`).join(', ');
    console.log(`ScreenVisible tags read: ${tags.size} (${shown})` +
      `${malformed ? `, ${malformed} malformed` : ''}; pinned against the header lists`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// THE CHARACTER CATALOGS — portrait and avatar. Same discipline as the device-focused rosters,
// with two things device-focused does not need.
//
//  1. A THIRD roster class. `low-angle-hero` and `profile-side-on` correspond to no reference and
//     cannot be deleted: they are asserted as real, prompt-present slugs by five uds-moderator-ctx
//     test files and by four image-svc files, neither of which this axis owns. So the count is
//     `References + Cross-set + Retained`, and a preset in no class at all is the
//     `device-focused-10` failure arriving from the other direction — a preset with no provenance
//     rather than a reference with no preset.
//  2. A SHOT-SIZE BAND declaration, checked BOTH WAYS against each preset's own injected text.
//     This is the mis-declaration hole the brightness work fell into: a roster is coverage, and
//     coverage cannot see a preset declared in the wrong band. The bands are mutually exclusive
//     vocabulary, so the check is exact in both directions rather than a presence test.
//
// Which catalogs are subject to this is DERIVED from the files, not listed: any camera catalog
// whose header declares itself authored from the Figma references must carry the rosters and the
// band table. `shared-camera-scene.md` never claimed that and is left alone rather than being made
// to invent a declaration — but it cannot opt out silently either, because the claim is what pulls
// it in and the claim is printed below.
// ─────────────────────────────────────────────────────────────────────────────
const AUTHORED_CLAIM = /AUTHORED FROM THE FIGMA REFERENCES/i;

/** Band -> the vocabulary the injected line must use to state that band. Mutually exclusive by
 *  construction; the exclusivity is what makes the reverse direction checkable. NOT derivable from
 *  image-svc — nothing there enumerates shot sizes; `MARKERS.camera` carries some of these words
 *  but as a collision detector, with no mapping to a band. */
const BANDS = {
  'close-up': /\bclose-up\b/i,
  'head-and-shoulders': /\bhead-and-shoulders\b/i,
  'chest-up': /\bchest-up\b/i,
  'waist-up': /\bwaist-up\b/i,
  'knee-up': /\bknee-up\b/i,
  'full-body': /\bwhole figure\b|\bfull body\b|\bhead to foot\b/i,
};

/**
 * FRAME OCCUPANCY — the mechanism this rewrite ships, expressed as a guard.
 *
 * Measured: shot size barely lands from the camera line, because "close"/"tight" are relative
 * MAGNITUDES and the image model's portrait prior is chest-to-waist whatever adjective precedes
 * it. The wording that lands states what OCCUPIES the frame and where the edges cut. So a preset
 * declared `close-up` must carry an occupancy clause and not rest on the adjective alone —
 * otherwise the catalog has a close-up slug and no close-up, which is exactly the state the
 * previous `close-shallow-offgaze` ("close waist-up") was in.
 */
const OCCUPANCY = /\bfill(?:s|ing)\b[^,]*\bframe\b|\bcropped by the (?:top|bottom|left|right|near|far) edge\b|\boccupying\b|\bentering the bottom corners\b|\bfilling the upper\b/i;

/**
 * FRAME ASPECT — forbidden on every camera catalog, this one derived from a recorded defect rather
 * than from taste. `top-down-in-hands` was authored "tall crop" from a 1579x2369 reference;
 * `brief.dimensions` is the CALLER's, the measurement brief asked 1280x720, and the clause was
 * UNSATISFIABLE on the run that drew it — honoured 1/5 with the clause and 4/5 with it removed. A
 * reference's own aspect describes the reference, never the output. Note the avatar reference set
 * is uniformly square and `shared-image-type-avatar.md` says "Always 1:1", which is precisely the
 * case where stating it would feel safe and would still be the caller's call, not this axis's.
 */
const FRAME_ASPECT = /\btall (?:crop|frame|format)\b|\bwide crop\b|\bportrait (?:crop|frame|format|orientation|aspect)\b|\blandscape (?:crop|frame|format|orientation|aspect)\b|\bsquare (?:crop|frame|format|aspect)\b|\bvertical frame\b|\bhorizontal frame\b|\baspect ratio\b|\b\d{1,2}:\d{1,2}\b/i;

let aspectPresetsRead = 0;
for (const [file, { presets }] of byFile) {
  for (const p of presets) {
    if (p.text === null) continue;
    aspectPresetsRead++;
    if (FRAME_ASPECT.test(p.text)) {
      violations.push(`${file}:${p.line} ${p.slug}: asserts a FRAME ASPECT ("${p.text}") — brief.dimensions is the caller's, so an aspect clause is unsatisfiable on any request that asked for a different one; a reference's own aspect describes the reference, never the output`);
    }
  }
}
if (aspectPresetsRead === 0) undetermined('the frame-aspect check read ZERO preset lines — 0 violations over 0 lines is not a pass');

const authored = [...byFile].filter(([, v]) => AUTHORED_CLAIM.test(v.raw)).map(([f]) => f);
if (authored.length === 0) {
  undetermined('no camera catalog claims to be authored from the Figma references — the roster and band checks read nothing, which cannot clear them');
}
console.log(`\ncatalogs claiming Figma-reference authorship: ${authored.join(', ')}`);

let bandPresetsChecked = 0;
let closeUpPresetsChecked = 0;
let bandExemptCatalogs = 0;
let bandCheckedCatalogs = 0;
for (const file of authored) {
  const { raw, presets } = byFile.get(file);
  const slugs = presets.map((p) => p.slug);
  const own = file.replace(/^shared-camera-|\.md$/g, '');

  const refs = roster(raw, 'References');
  const excluded = roster(raw, 'Excluded');
  if (refs === null) undetermined(`${file} claims Figma-reference authorship but carries no \`References:\` roster — the provenance contract cannot be checked`);
  if (excluded === null) undetermined(`${file} carries no \`Excluded:\` roster — an empty exclusion must be written out as such, because "no line" and "nothing excluded" are not the same claim`);

  // The device-focused catalog predates the two extra classes and legitimately has neither line;
  // treat a missing class as empty ONLY there, and require the declaration everywhere else, so a
  // new catalog cannot skip it by omission.
  const isLegacy = file === REFERENCE_CATALOG;
  const cross = roster(raw, 'Cross-set references');
  const retained = slugRoster(raw, 'Retained without a reference');
  if (!isLegacy && cross === null) undetermined(`${file} carries no \`Cross-set references:\` roster — write \`(none)\`; "no line" and "no cross-set reference" are not the same claim`);
  if (!isLegacy && retained === null) undetermined(`${file} carries no \`Retained without a reference:\` roster — write \`(none)\`; a preset with no provenance is the device-focused-10 failure from the other direction`);
  const crossList = cross ?? [];
  const retainedList = retained ?? [];

  // Provenance accounts for EVERY preset exactly once.
  const accounted = refs.length + crossList.length + retainedList.length;
  if (accounted !== presets.length) {
    violations.push(`${file}: ${presets.length} presets against ${refs.length} references + ${crossList.length} cross-set + ${retainedList.length} retained = ${accounted} accounted for — either a padded count or a preset with no provenance`);
  }
  // A retained slug must be a real preset, and a cross-set reference must not be from this
  // catalog's own family (that would be an ordinary reference misfiled as a cross-set one).
  for (const sl of retainedList) {
    if (!slugs.includes(sl)) violations.push(`${file}: \`Retained without a reference\` names [${sl}], which is not a preset in the body — the roster and the catalog have drifted apart`);
  }
  for (const c of crossList) {
    if (c.family === own) violations.push(`${file}: \`Cross-set references\` names [${c.name}], which is this catalog's OWN family — an own-family reference belongs in the References roster, where the contiguity check can see it`);
  }
  // Own-family references + exclusions must be contiguous from 01: a component that exists in
  // Figma but appears in neither roster is the device-focused-10 failure repeating silently.
  const ownRefs = refs.filter((r) => r.family === own).map((r) => Number(r.n));
  const ownExcl = excluded.filter((r) => r.family === own).map((r) => Number(r.n));
  if (ownRefs.length === 0) {
    violations.push(`${file}: the References roster names no \`${own}-NN\` component at all — a catalog authored from the ${own} references must cite them`);
  }
  const both = ownRefs.filter((r) => ownExcl.includes(r));
  if (both.length) violations.push(`${file}: reference(s) [${both.join(', ')}] are in BOTH the References and Excluded rosters`);
  const dup = ownRefs.filter((r, i) => ownRefs.indexOf(r) !== i);
  if (dup.length) violations.push(`${file}: reference(s) [${[...new Set(dup)].join(', ')}] listed twice in the References roster`);
  const all = [...ownRefs, ...ownExcl].sort((a, b) => a - b);
  for (let i = 0; i < all.length; i++) {
    if (all[i] !== i + 1) {
      violations.push(`${file}: References + Excluded = [${all.join(', ')}] for family ${own}, which is not contiguous from 01 — ${own}-${String(i + 1).padStart(2, '0')} is accounted for in neither roster`);
      break;
    }
  }

  // ── SHOT-SIZE BAND declaration <-> injected text, BICONDITIONAL ──
  // WHICH catalogs are subject to this is derived from the bodies, not listed. A catalog whose
  // presets state a human shot-size band must declare the bands; a catalog that declares bands
  // must state them. `device-focused` and `scene` state none — their subject is a device and a
  // room, and neither has a waist — so they are excluded by the data rather than by a name in this
  // script, and an opt-out by rewording is visible as a drop in the printed count below.
  const usesBands = presets.some((x) => x.text !== null && Object.values(BANDS).some((re) => re.test(x.text)));
  const blk = raw.match(/SHOT-SIZE BAND, per preset\.[\s\S]*?\n((?:\s{7}[a-z-]+:[\s\S]*?)+?)\n\s*\n/);
  if (usesBands && !blk) {
    undetermined(`${file}: its presets state human shot-size bands but the header carries no \`SHOT-SIZE BAND, per preset.\` table — the declaration cannot be read back against the text`);
  }
  if (!usesBands && blk) {
    violations.push(`${file}: the header declares a SHOT-SIZE BAND table but no preset in the body states any band — the table is a claim the prompt never makes`);
  }
  if (!usesBands) { console.log(`  · ${file}: ${presets.length} presets = ${refs.length} refs + ${crossList.length} cross-set + ${retainedList.length} retained; states no human shot-size band, so the band table does not apply`); bandExemptCatalogs++; continue; }
  const declared = new Map();
  // The terminator is END-OF-BLOCK, not end-of-line: a band whose slug list WRAPS onto a second,
  // more-deeply-indented line had its continuation silently dropped by a `$` under /m, which
  // reported exactly the wrapped slugs as undeclared. `(?![\s\S])` is true end of input.
  for (const m of blk[1].matchAll(/^ {7}([a-z-]+):([\s\S]*?)(?=\n {7}[a-z-]+:|(?![\s\S]))/gm)) {
    const band = m[1];
    if (!(band in BANDS)) { violations.push(`${file}: the band table names \`${band}\`, which is not one of [${Object.keys(BANDS).join(', ')}] — an unknown band cannot be checked against any text`); continue; }
    declared.set(band, [...m[2].matchAll(/\b[a-z][a-z0-9]*(?:-[a-z0-9]+)+\b/g)].map((x) => x[0]));
  }
  if (declared.size === 0) undetermined(`${file}: the band table parsed to ZERO bands — the extractor read nothing`);

  const declaredSlugs = [...declared.values()].flat();
  const dupDecl = declaredSlugs.filter((x, i) => declaredSlugs.indexOf(x) !== i);
  if (dupDecl.length) violations.push(`${file}: preset(s) [${[...new Set(dupDecl)].join(', ')}] declared in more than one shot-size band`);
  const undeclared = slugs.filter((x) => !declaredSlugs.includes(x));
  if (undeclared.length) violations.push(`${file}: preset(s) [${undeclared.join(', ')}] appear in NO shot-size band — an undeclared preset fails open and silently, which is the failure this table exists for`);
  const ghost = declaredSlugs.filter((x) => !slugs.includes(x));
  if (ghost.length) violations.push(`${file}: the band table names [${ghost.join(', ')}], which is not a preset in the body — the declaration and the catalog have drifted apart`);

  for (const [band, list] of declared) {
    for (const sl of list) {
      const pr = presets.find((x) => x.slug === sl);
      if (!pr || pr.text === null) continue;
      bandPresetsChecked++;
      if (!BANDS[band].test(pr.text)) {
        violations.push(`${file}:${pr.line} ${sl}: declared in the \`${band}\` band, but its injected text never states that band ("${pr.text}") — the declaration is a claim the prompt never makes`);
      }
      for (const [other, re] of Object.entries(BANDS)) {
        if (other === band) continue;
        if (re.test(pr.text)) {
          violations.push(`${file}:${pr.line} ${sl}: declared \`${band}\` but its injected text also states \`${other}\` ("${pr.text}") — two shot sizes in one line is the contradiction the single-voice axis exists to remove`);
        }
      }
      if (band === 'close-up') {
        closeUpPresetsChecked++;
        if (!OCCUPANCY.test(pr.text)) {
          violations.push(`${file}:${pr.line} ${sl}: declared \`close-up\` but its injected text states no FRAME OCCUPANCY ("${pr.text}") — "close" and "tight" are relative magnitudes the image model drops; the line has to say what fills the frame and where the edges cut`);
        }
      }
    }
  }
  if (!declared.has('close-up')) {
    violations.push(`${file}: no preset is declared in the \`close-up\` band — the close-up range is the one this axis was measured to be missing, and a character catalog without it leaves shot size at the model's chest-to-waist prior`);
  }
  if (declared.size < 3) {
    violations.push(`${file}: only ${declared.size} shot-size band(s) across ${presets.length} presets — a near-homogeniser on the one dimension this axis most obviously owns`);
  }
  bandCheckedCatalogs++;
  console.log(`  · ${file}: ${presets.length} presets = ${refs.length} refs + ${crossList.length} cross-set + ${retainedList.length} retained; ${declared.size} shot-size bands` +
    (ownExcl.length ? `; excluded ${ownExcl.map((n) => `${own}-${String(n).padStart(2, '0')}`).join(', ')}` : '; nothing excluded'));
}
// Both new extractors must have read something. `bandPresetsChecked` guards the whole table and
// `closeUpPresetsChecked` guards the one check that is the point of this rewrite; a rewording that
// removed every close-up would otherwise clear it by reading nothing.
if (bandPresetsChecked === 0) undetermined('the shot-size band check read ZERO presets — 0 violations over 0 presets is not a pass');
if (closeUpPresetsChecked === 0) undetermined('the frame-occupancy check read ZERO close-up presets — the check that carries this rewrite cannot clear itself by having no subject');
// TWO character catalogs state shot-size bands (portrait, avatar). A floor rather than an equality
// so a fifth imageType can arrive without editing this script — but not zero and not one, because
// the whole band check could otherwise be evaded by rewording one catalog out of its own subject.
if (bandCheckedCatalogs < 2) {
  undetermined(`only ${bandCheckedCatalogs} catalog(s) were found to state a human shot-size band (${bandExemptCatalogs} exempt) — the band check has lost its subject, which is not the same as clearing it`);
}
console.log(`band declarations checked: ${bandPresetsChecked} presets across ${bandCheckedCatalogs} catalogs (${bandExemptCatalogs} state no band and are exempt), of which ${closeUpPresetsChecked} close-up; frame-aspect lines checked: ${aspectPresetsRead}`);

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
console.log('PASS — every camera preset is reachable at every variant index and on its own axis (no\n' +
  '       lighting marker, mood clause, prop noun, brand mark, screen-legibility claim or frame\n' +
  '       aspect); every reference-authored catalog accounts for each of its presets exactly once as\n' +
  '       referenced, cross-set or retained, and for each of its Figma components exactly once as\n' +
  '       referenced or excluded; the device-focused screen-visibility declaration agrees with the\n' +
  '       text each preset injects; and every character catalog declares a shot-size band per preset\n' +
  '       that the preset text states, occupies the close-up band, and words its close-up as frame\n' +
  '       occupancy rather than as a size adjective.');
