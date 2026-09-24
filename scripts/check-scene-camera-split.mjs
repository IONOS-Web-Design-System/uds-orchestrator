#!/usr/bin/env node
/**
 * Guard — THE SCENE CAMERA SPLIT. `shared-image-type-scene.md` spent 7,196 of its 16,287 chars on
 * `## Camera angle patterns` (four named patterns, each with its own angle, height, shot size and
 * lens, each ending in a worked example prompt) while the catalog that actually delivers the axis
 * per run — `shared-camera-scene.md`, 1,468 chars for ten presets — puts 78-100 chars into a
 * prompt. The rule now owns the CONSTRAINT, the preset lines own the FRAMING, and the camera half
 * is `craft-scene-camera.md`, gated on the camera AXIS in image-svc prompt.ts.
 *
 * WHY THIS LIVES HERE AND NOT ONLY IN image-svc. image-svc's `sceneCameraSplit.test.ts` asserts
 * the same properties from the other side, and it is the stronger of the two because it can build
 * a real prompt. But the CORPUS can be edited with no image-svc change at all — that is the whole
 * point of the read-only plugin mount — so a corpus-only edit that puts a camera fact back into
 * the rule, or drops a preset's `Pattern:` tag, must be catchable in this repo. What cannot be
 * checked without image-svc is reported as CANNOT DETERMINE, never as clean.
 *
 * Usage:
 *   node scripts/check-scene-camera-split.mjs            # 0 = green, 1 = violation, 2 = cannot determine
 *   node scripts/check-scene-camera-split.mjs --verbose
 * Env:
 *   IMAGE_SVC_DIR   where to read src/craft/{sceneMetrics,prompt,profiles}.ts from (default ../image-svc)
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

/** exit 2 — the guard could not be evaluated. Distinct from a violation on purpose: "I did not
 *  read the corpus" must never look like "the corpus is clean". */
function undetermined(msg) {
  console.error(`CANNOT DETERMINE: ${msg}`);
  process.exit(2);
}

const violations = [];
const checks = [];
function note(ok, what, detail) {
  checks.push({ ok, what, detail });
  if (!ok) violations.push(`${what} — ${detail}`);
  if (VERBOSE) console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}${detail ? ` (${detail})` : ''}`);
}

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const SCENE_RULE = 'shared-image-type-scene.md';
const CATALOG = 'shared-camera-scene.md';
const FRAGMENT = 'craft-scene-camera.md';
const TYPE_RULES = [
  'shared-image-type-scene.md', 'shared-image-type-portrait.md',
  'shared-image-type-avatar.md', 'shared-image-type-device-focused.md',
];

function readRule(name) {
  const p = join(RULES_DIR, name);
  if (!existsSync(p)) undetermined(`${name} not found under ${RULES_DIR}`);
  return readFileSync(p, 'utf8');
}
function readSource(rel) {
  const p = join(IMAGE_SVC, rel);
  if (!existsSync(p)) undetermined(`image-svc ${rel} not found at ${p} — set IMAGE_SVC_DIR`);
  return readFileSync(p, 'utf8');
}

if (!existsSync(RULES_DIR)) undetermined(`rules dir not found: ${RULES_DIR}`);
if (readdirSync(RULES_DIR).filter((f) => f.endsWith('.md')).length < 10) {
  undetermined(`${RULES_DIR} holds under 10 rule files — wrong directory`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. THE VOCABULARY, derived from image-svc. Never re-typed here: a marker added upstream must
//    reach this guard, and a guard carrying its own copy is the two-lists-drift failure.
//
//    MARKERS.camera is BROADER than the four facts this split assigns to the preset — it also
//    carries depth-of-field vocabulary and the bare word `framing`, which are composition
//    properties the rule legitimately keeps (the split's test is ANGLE / camera HEIGHT / SHOT SIZE
//    / LENS). So every pattern is classified, and an UNCLASSIFIED one exits 2 rather than falling
//    silently into the permitted half.
// ─────────────────────────────────────────────────────────────────────────────
const DOF_AND_COMPOSITION = [
  '\\bbokeh\\b', '\\bshallow depth of field\\b', '\\bdepth of field\\b',
  '\\bsoft[- ]focus\\b', '\\bsoft focus\\b', '\\bout of focus\\b', '\\bframing\\b',
];

function cameraFactPatterns() {
  const src = readSource(join('src', 'craft', 'sceneMetrics.ts'));
  const block = /MARKERS = \{\s*camera: \[([\s\S]*?)\],\s*lighting:/.exec(src);
  if (!block) undetermined('MARKERS.camera not found in sceneMetrics.ts — renamed, or its shape changed');
  const all = [...block[1].matchAll(/\/((?:[^/\\\n]|\\.)+)\/i/g)].map((m) => m[1]);
  if (all.length < 15) undetermined(`MARKERS.camera parsed to ${all.length} patterns — the parser read nothing`);
  const stale = DOF_AND_COMPOSITION.filter((p) => !all.includes(p));
  if (stale.length) {
    undetermined(`the DOF/composition exclusion(s) ${stale.join(', ')} are no longer in MARKERS.camera — reclassify them before this guard can run`);
  }
  const facts = all.filter((p) => !DOF_AND_COMPOSITION.includes(p));
  if (facts.length + DOF_AND_COMPOSITION.length !== all.length) {
    undetermined('the camera marker partition does not account for every pattern');
  }
  return { facts: facts.map((p) => new RegExp(p, 'i')), total: all.length };
}

const { facts: CAMERA_FACTS, total: MARKER_TOTAL } = cameraFactPatterns();
console.log(`camera-fact vocabulary derived from image-svc MARKERS.camera: ${CAMERA_FACTS.length} of ${MARKER_TOTAL} patterns (${DOF_AND_COMPOSITION.length} classified as depth-of-field/composition and kept for the rule)`);

// POSITIVE CONTROL — the vocabulary must be able to fire, or every absence below is vacuous.
{
  const catalogBody = readRule(CATALOG).replace(/<!--[\s\S]*?-->/g, '');
  const fires = CAMERA_FACTS.filter((re) => re.test(catalogBody)).length;
  if (fires === 0) undetermined(`no camera-fact pattern fires on ${CATALOG}'s own delivered body — the vocabulary cannot be matching anything`);
  note(true, 'positive control: the vocabulary fires on the camera catalog', `${fires} patterns match`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. THE RULE NAMES NO CAMERA FACT — and carries no comment, because `full` delivers comments.
// ─────────────────────────────────────────────────────────────────────────────
{
  const raw = readRule(SCENE_RULE);
  // The DELIVERED body on `full` is the RAW file: `stripComments` in image-svc prompt.ts is gated
  // on `craftProfile === 'minimal'`, so a comment here would be inlined verbatim — and a comment
  // explaining this split has to NAME the four camera facts, putting them straight back into the
  // prompt the split removed them from. That is checked as its own property below.
  if (norm(raw).length < 6000) undetermined(`${SCENE_RULE} is ${raw.length} chars — the guard is reading a stub, not a rule`);
  const body = norm(raw);
  const hits = CAMERA_FACTS.filter((re) => re.test(body)).map((re) => `/${re.source}/ -> "${norm(re.exec(body)[0])}"`);
  note(hits.length === 0, `${SCENE_RULE}'s delivered body names no camera fact`,
    hits.length ? hits.join('; ') : `${CAMERA_FACTS.length} patterns checked, 0 matched`);

  const degrees = [...body.matchAll(/\d+\s*(?:[–—-]\s*\d+\s*)?(?:°|degrees)\b/g)].map((m) => m[0]);
  note(degrees.length === 0, `${SCENE_RULE} states no explicit angle in degrees`,
    degrees.length ? degrees.join(', ') : 'none');

  for (const f of TYPE_RULES) {
    const t = readRule(f);
    note(!t.includes('<!--'), `${f} carries no HTML comment`,
      t.includes('<!--') ? 'a comment here is INLINED VERBATIM on `full` (stripComments is minimal-only)' : 'clean');
  }

  // THE FACE-SAFETY CONSTRAINT Pattern A was doing double duty on. Only the ANGLE moved.
  const KEEP = [
    'Physical anchor at waist height',
    'the barrier sits at waist level',
    'No hard face requirement',
    'Name the side',
  ];
  for (const k of KEEP) {
    note(body.includes(k), `${SCENE_RULE} keeps "${k}"`, body.includes(k) ? 'present' : 'GONE');
  }
  // `waist height` must NOT be a camera fact upstream, or the constraint above is unkeepable.
  // Tested by RUNNING the parsed patterns against the phrase — not by grepping the MARKERS block,
  // which carries a comment quoting "`waist height` is a physical dimension" verbatim and would
  // make this fire on the very documentation that establishes the property. That is the
  // aborted-on-its-own-documentation failure, and it happened here on the first run.
  const firesOnWaistHeight = CAMERA_FACTS.filter((re) => re.test('the barrier sits at waist height')).map((re) => re.source);
  note(firesOnWaistHeight.length === 0, '`waist height` is not a camera fact upstream',
    firesOnWaistHeight.length ? `matched by /${firesOnWaistHeight.join('/, /')}/` : 'so the physical anchor stays a staging fact, not an angle');
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EVERY PRESET CITES A FAMILY THAT EXISTS — provenance, not instruction.
// ─────────────────────────────────────────────────────────────────────────────
{
  const raw = readRule(CATALOG);
  const delivered = raw.replace(/<!--[\s\S]*?-->/g, '');
  if (/<!--|-->/.test(delivered)) undetermined(`${CATALOG} has an UNBALANCED HTML comment marker — the delivered body cannot be determined`);

  const roster = (key) => {
    const m = new RegExp(`^\\s*${key}:\\s*(.+)$`, 'm').exec(raw);
    return m ? m[1].split(',').map((s) => s.trim()).filter((s) => s.length > 0) : null;
  };
  const families = roster('Families');
  const emptyFamilies = roster('Families with no preset');
  const familylessPresets = roster('Presets with no family');
  if (families === null) undetermined(`${CATALOG} carries no \`Families:\` roster in its header — the per-preset citations cannot be checked against anything`);
  if (emptyFamilies === null) undetermined(`${CATALOG} carries no \`Families with no preset:\` roster — an empty class must be written out, because "no line" and "nothing in this class" are different claims`);
  if (familylessPresets === null) undetermined(`${CATALOG} carries no \`Presets with no family:\` roster — same reason`);
  note(families.length >= 3, 'the catalog declares a family roster', `${families.join(', ')}`);

  // Per-preset tags, read the way image-svc reads the file: a `## slug` heading, the FIRST
  // non-empty line as the injected text, tags below it.
  const presets = [];
  let cur = null;
  for (const [i, line] of delivered.split('\n').entries()) {
    const h = /^## ([a-z0-9-]+)\s*$/.exec(line);
    if (h) { cur = { slug: h[1], line: i + 1, text: null, pattern: null }; presets.push(cur); continue; }
    if (!cur) continue;
    const t = line.trim();
    if (t.length === 0) continue;
    if (cur.text === null) { cur.text = t; continue; }
    const p = /^Pattern:\s*(.+)$/.exec(t);
    if (p) cur.pattern = p[1].trim();
  }
  if (presets.length < 3) undetermined(`${CATALOG} yielded ${presets.length} presets from its delivered body — the extractor is not reading the catalog`);
  note(true, 'presets read from the delivered catalog body', `${presets.length}`);

  const cited = new Set();
  for (const p of presets) {
    const where = `${CATALOG}:${p.line} ${p.slug}`;
    if (p.text === null) { violations.push(`${where}: heading with nothing beneath it`); continue; }
    // A tag ABOVE the text would BE the injected line — measured once on the lighting catalog as
    // `Photographic lighting: Daylight: side`, with the whole suite green.
    note(!/^Pattern:/.test(p.text) && !p.text.includes('Pattern:'), `${p.slug}: the injected line is the viewpoint, not a tag`,
      /^Pattern:/.test(p.text) ? `"${p.text.slice(0, 40)}…" IS the tag` : 'clean');
    if (p.pattern === null) { violations.push(`${where}: no \`Pattern:\` tag — the provenance of this framing is unrecorded`); continue; }
    if (p.pattern === '(none)') {
      note(familylessPresets.includes(p.slug), `${p.slug}: its "(none)" family is a DECLARED gap`,
        familylessPresets.includes(p.slug) ? 'declared in the header' : 'NOT declared in `Presets with no family:`');
      continue;
    }
    for (const f of p.pattern.split(',').map((s) => s.trim())) {
      note(families.includes(f), `${p.slug}: cites family ${f}`,
        families.includes(f) ? 'declared' : `NOT in the \`Families:\` roster (${families.join(', ')})`);
      cited.add(f);
    }
  }
  // The two halves of the roster contract, in both directions.
  for (const f of emptyFamilies) {
    note(!cited.has(f), `family ${f} is declared as having no preset`, cited.has(f) ? 'but a preset cites it' : 'and none cites it');
  }
  for (const f of families.filter((x) => !emptyFamilies.includes(x))) {
    note(cited.has(f), `family ${f} is declared and cited`, cited.has(f) ? 'cited' : 'declared but NO preset cites it — the roster over-claims');
  }
  const undeclaredGaps = presets.filter((p) => p.pattern === null || p.pattern === '(none)').map((p) => p.slug)
    .filter((s) => !familylessPresets.includes(s));
  note(undeclaredGaps.length === 0, 'every familyless preset is declared as one',
    undeclaredGaps.length ? undeclaredGaps.join(', ') : 'none undeclared');
  const overDeclared = familylessPresets.filter((s) => !presets.some((p) => p.slug === s && p.pattern === '(none)'));
  note(overDeclared.length === 0, 'no preset is declared familyless while carrying a family',
    overDeclared.length ? overDeclared.join(', ') : 'none');

  // THE TRANSFER. Before the split the ten lines ran 77-108 chars; the patterns' camera content
  // was moved into them. A line back under that ceiling means a transfer was reverted.
  const short = presets.filter((p) => p.text && p.text.length <= 108).map((p) => `${p.slug} (${p.text.length})`);
  note(short.length === 0, 'every injected line is above the 108-char pre-split ceiling',
    short.length ? short.join(', ') : `min ${Math.min(...presets.map((p) => p.text.length))} chars`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. THE CAMERA HALF — present, substantial, and free of a supplied example sentence.
// ─────────────────────────────────────────────────────────────────────────────
{
  const raw = readRule(FRAGMENT);
  const body = raw.replace(/<!--[\s\S]*?-->/g, '').trim();
  note(body.length > 800, `${FRAGMENT} has a substantial delivered body`, `${body.length} chars`);
  note(CAMERA_FACTS.some((re) => re.test(body)), `${FRAGMENT} DOES name camera facts`,
    'it is the camera half — this is what keeps `full` from losing the axis');

  // A SUPPLIED SENTENCE GETS REPRODUCED — measured repeatedly in this workstream. The four
  // patterns' worked example prompts were exactly this shape, so the replacement must carry none.
  note(!/^\s*```/m.test(body), `${FRAGMENT} contains no fenced code block`,
    /^\s*```/m.test(body) ? 'a fenced prompt template is the homogeniser class' : 'none');
  const quoted = [...body.matchAll(/[`"]([^`"\n]{40,})[`"]/g)].map((m) => m[1]);
  note(quoted.length === 0, `${FRAGMENT} supplies no quoted sentence for the model to copy`,
    quoted.length ? quoted.map((q) => `"${q.slice(0, 60)}…"`).join('; ') : 'none');

  // INDEPENDENT DELIVERY — neither half may point at the other, or the pointer dangles on the
  // combination where the other half is absent.
  const ruleBody = readRule(SCENE_RULE);
  note(!ruleBody.includes(FRAGMENT), `${SCENE_RULE} does not point at ${FRAGMENT}`,
    'the camera half is suppressed on every run that injected a preset');
  note(!body.includes('shared-image-type-scene'), `${FRAGMENT}'s body does not point at ${SCENE_RULE}`,
    'the rule is absent on every profile that does not inline it');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE GATE, read out of image-svc. What this repo cannot prove is that the block is DELIVERED
//    on the right cells — that needs a built prompt, and image-svc's sceneCameraSplit.test.ts
//    owns it. What is checkable here is that the wiring exists and reads the axis.
// ─────────────────────────────────────────────────────────────────────────────
{
  const prompt = readSource(join('src', 'craft', 'prompt.ts'));
  const profiles = readSource(join('src', 'craft', 'profiles.ts'));

  note(prompt.includes(`'${FRAGMENT}'`), `image-svc prompt.ts loads ${FRAGMENT}`,
    prompt.includes(`'${FRAGMENT}'`) ? 'present' : 'the fragment ships but NOTHING reads it — the camera half is delivered nowhere');

  const shotIsFixed = /const shotIsFixed = camera !== null \|\| referenceIsCondition;/.test(prompt);
  note(shotIsFixed, 'the axis test is the existing `shotIsFixed` shape',
    shotIsFixed ? 'camera !== null || referenceIsCondition' : 'the shape changed — two independent tests on one fact is how two blocks come to disagree');

  // The gate expression itself, with the fragment's push inside it.
  const gate = /if \(brief\.imageType === 'scene' && deliversTypeRule\(brief\.craftProfile, brief\.imageType\) && !shotIsFixed\) \{\s*parts\.push\([^)]*craft-scene-camera\.md/.exec(prompt);
  note(!!gate, 'the gate is (scene AND the profile delivers the type rule AND the shot is not fixed)',
    gate ? 'matched' : 'the gate expression is not the audited one');

  note(/export function deliversTypeRule\(/.test(profiles), 'profiles.ts exports deliversTypeRule',
    'the SCOPE term — it is what keeps the camera half off the `none` floor');
  note(/if \(profile === 'none'\) return false;/.test(profiles), 'deliversTypeRule closes the `none` floor explicitly',
    '`none` injects no preset, so a PURE axis gate would have delivered camera prose onto the floor');
}

// ─────────────────────────────────────────────────────────────────────────────
console.log(`\nchecked ${checks.length} properties over 3 corpus files and 3 image-svc sources`);
if (violations.length) {
  for (const v of violations) console.error(`VIOLATION: ${v}`);
  process.exit(1);
}
console.log('green — the rule names no camera fact and carries no delivered comment; every preset cites a declared');
console.log('        family or a declared gap; the tags never reach an injected line; the camera half supplies no');
console.log('        example sentence and neither half points at the other; and the gate reads the axis, scoped off');
console.log('        the floor.');
