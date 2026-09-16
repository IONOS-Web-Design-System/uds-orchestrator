#!/usr/bin/env node
/**
 * Guard — the BRIGHTNESS tag pair must be complete and covered on BOTH sides.
 *
 * `shared-lighting.md` declares, per preset, the room tone its own words require; each environment
 * catalog declares, per room, the tone that room provides; `image-svc/src/craft/sceneLighting.ts`
 * intersects the two. The failure this guards is the one a green test suite cannot show you: a tag
 * that is MISSING or a vocabulary value with no PRODUCER both fail OPEN by design — the filter
 * quietly stops constraining, every image still renders, and the only trace is a log line. A
 * near-white surround asked of a dark room is exactly what that silence shipped before.
 *
 * WHY A SEPARATE SCRIPT AND NOT A CHECK INSIDE `check-minimal-conflict.mjs`. That guard derives
 * its file list from image-svc's `minimalRules`, because its subject is what the `minimal` profile
 * INLINES. These three catalogs are never inlined at all — `skills.coverage.test.ts` lists them as
 * INTENTIONALLY_UNSELECTED against `src/craft/treatment.ts`, which reads them in code — so they
 * are not in that guard's corpus and adding them would mean adding a second, contradictory way of
 * deriving its file list. Same discipline, separate subject, separate script:
 *   - three exit codes: 0 green, 1 violation, 2 cannot-determine. "I did not read the corpus" must
 *     never look like "the corpus is clean";
 *   - the vocabulary and the catalog list are DERIVED from image-svc, never restated here, so a
 *     value added on one side cannot escape this guard;
 *   - matched against the DELIVERED body with HTML comments stripped — both headers explain the
 *     tag vocabulary at length, and a guard satisfied by a file's own explanation of a tag has
 *     happened in this workstream before;
 *   - whitespace normalised, and every extractor asserts it found something: 0 violations over 0
 *     presets read is not a pass.
 *
 * Usage:
 *   node scripts/check-brightness-tags.mjs            # 0 = green, 1 = violation, 2 = cannot determine
 *   node scripts/check-brightness-tags.mjs --verbose
 * Env:
 *   IMAGE_SVC_DIR   where to read `src/craft/sceneLighting.ts` + `src/craft/treatment.ts` from
 *                   (default ../image-svc)
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. Derive both vocabularies and the catalog list from image-svc. Never restate them: the whole
//    point of a file-resident tag is that the two sides can be edited without a deploy, and a
//    guard carrying its own copy of the vocabulary would go green on a file the running code
//    rejects.
// ─────────────────────────────────────────────────────────────────────────────
function readSource(rel) {
  const p = join(IMAGE_SVC, rel);
  if (!existsSync(p)) undetermined(`image-svc ${rel} not found at ${p} — set IMAGE_SVC_DIR`);
  return readFileSync(p, 'utf8');
}

function vocabularies() {
  const src = readSource(join('src', 'craft', 'sceneLighting.ts'));
  const grab = (name) => {
    // `export const NAME = ['a', 'b'] as const;` — the spread forms used by the DAYLIGHT
    // constants are deliberately NOT accepted: a spread would be parsed as an empty list and the
    // guard would then pass vacuously, so an unparseable shape is a 2 rather than a [].
    const m = src.match(new RegExp(`export const ${name} = \\[([^\\]]*)\\] as const;`));
    if (!m) undetermined(`export const ${name} not found in sceneLighting.ts — renamed, or its shape changed`);
    if (m[1].includes('...')) undetermined(`${name} is defined by spreading another constant; this guard cannot resolve it without evaluating the module`);
    const vals = [...m[1].matchAll(/'([a-z-]+)'/g)].map((x) => x[1]);
    if (vals.length === 0) undetermined(`${name} parsed to ZERO values — the parser read nothing`);
    return vals;
  };
  const room = grab('ROOM_TONE');
  const lighting = grab('LIGHTING_TONE');
  // The asymmetry is the design, and it is asserted rather than assumed: a room cannot claim an
  // unspecified tone, and the lighting side has no `dim` producer so must not offer the value.
  if (room.includes('any')) return { room, lighting, fatal: 'ROOM_TONE admits `any`, which lets a room satisfy every requirement while providing none' };
  if (lighting.includes('dim')) return { room, lighting, fatal: 'LIGHTING_TONE admits `dim`, a value no preset in the catalog produces — a documented-but-unreachable tag' };
  return { room, lighting };
}

/** The environment catalogs, from `ENVIRONMENT_BY_PLACE` in treatment.ts — the single place a
 *  place->catalog edit happens, so a fourth catalogued place is covered with no edit here. */
function environmentCatalogs() {
  const src = readSource(join('src', 'craft', 'treatment.ts'));
  const m = src.match(/const ENVIRONMENT_BY_PLACE[^=]*= \{([\s\S]*?)\n\};/);
  if (!m) undetermined('ENVIRONMENT_BY_PLACE not found in treatment.ts — renamed, or its shape changed');
  const files = [...new Set([...m[1].matchAll(/'([A-Za-z0-9._-]+\.md)'/g)].map((x) => x[1]))].sort();
  if (files.length === 0) undetermined('ENVIRONMENT_BY_PLACE parsed to ZERO catalogs — the parser read nothing');
  return files;
}

/** The lighting catalog file name, from the constant the code reads it by. */
function lightingCatalogFile() {
  const src = readSource(join('src', 'craft', 'sceneLighting.ts'));
  const m = src.match(/const LIGHTING_RULE = '([A-Za-z0-9._-]+\.md)';/);
  if (!m) undetermined('LIGHTING_RULE not found in sceneLighting.ts');
  return m[1];
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Reading the files. Comments stripped first: both headers spell the vocabulary out in prose,
//    including lines like "`dim`, `mid` or `bright`, exactly one per room", and a tag assertion
//    satisfied by a file's own explanation of the tag is a guard that cannot fail.
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

/**
 * Parse `## slug` blocks the way image-svc does, and separately: the INJECTED line
 * (`parseTreatmentPresets`: the first non-empty line under the heading) and each tag line
 * (`parsePresetTag`: any `Key:` line anywhere under the heading).
 *
 * Reading both is the point. A tag authored ABOVE the preset text parses perfectly as a tag AND
 * becomes the line injected into the prompt — measured once as `Photographic lighting: Daylight:
 * side` with a whole suite green — so the guard has to know which line would be injected, not
 * only that a tag exists somewhere.
 */
function parsePresets(name, body) {
  const presets = [];
  const problems = [];
  let cur = null;
  for (const [i, raw] of body.split('\n').entries()) {
    if (/^##(?!#)/.test(raw)) {
      const m = /^## ([a-z0-9-]+)\s*$/.exec(raw);
      if (!m) { problems.push(`${name}:${i + 1} malformed preset heading: "${norm(raw)}"`); cur = null; continue; }
      cur = { slug: m[1], line: i + 1, injected: null, tags: {} };
      presets.push(cur);
      continue;
    }
    if (!cur) continue;
    const line = norm(raw);
    if (line.length === 0) continue;
    const tag = /^([A-Za-z][A-Za-z ]*?)\s*:\s*(.*)$/.exec(line);
    const isTag = tag !== null && /^(daylight|brightness|light openings)$/i.test(tag[1]);
    if (cur.injected === null) cur.injected = { text: line, isTag, key: isTag ? tag[1] : null };
    if (isTag) {
      const key = tag[1];
      (cur.tags[key] ??= []).push(tag[2].split(',').map((s) => s.trim()).filter(Boolean));
    }
  }
  return { presets, problems };
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────
if (!existsSync(RULES_DIR)) undetermined(`rules dir not found: ${RULES_DIR}`);
if (readdirSync(RULES_DIR).filter((f) => f.endsWith('.md')).length < 10) {
  undetermined(`${RULES_DIR} holds under 10 rule files — wrong directory`);
}

const vocab = vocabularies();
const violations = [];
if (vocab.fatal) violations.push(`sceneLighting.ts: ${vocab.fatal}`);

const LIGHTING_FILE = lightingCatalogFile();
const ENV_FILES = environmentCatalogs();
console.log(`vocabularies derived from image-svc sceneLighting.ts:`);
console.log(`  ROOM_TONE      ${vocab.room.join(' / ')}`);
console.log(`  LIGHTING_TONE  ${vocab.lighting.join(' / ')}`);
console.log(`catalogs derived from image-svc treatment.ts + sceneLighting.ts:`);
for (const f of [LIGHTING_FILE, ...ENV_FILES]) console.log(`  ${f}`);

/** side -> the set of values actually PRODUCED by a preset in a real file */
const produced = { room: new Set(), lighting: new Set() };
let presetsRead = 0;
let tagsRead = 0;

for (const [file, side] of [[LIGHTING_FILE, 'lighting'], ...ENV_FILES.map((f) => [f, 'room'])]) {
  const path = join(RULES_DIR, file);
  if (!existsSync(path)) undetermined(`${file} is named by image-svc but absent under ${RULES_DIR}`);
  const raw = readFileSync(path, 'utf8');
  if (raw.trim().length < 50) undetermined(`${file} is under 50 chars — the guard is reading a stub, not a catalog`);
  const body = delivered(file, raw);
  const { presets, problems } = parsePresets(file, body);
  for (const p of problems) violations.push(p);
  // A catalog is at least three presets; anything less and the extractor is not reading the file.
  if (presets.length < 3) undetermined(`${file} yielded ${presets.length} presets from its DELIVERED body — the extractor is not reading the catalog`);
  presetsRead += presets.length;
  if (VERBOSE) console.log(`  · ${file}: ${presets.length} presets`);

  const allow = side === 'room' ? vocab.room : vocab.lighting;
  for (const p of presets) {
    const where = `${file}:${p.line} ${p.slug}`;
    // (a) the injected line must be the preset TEXT, never a tag line
    if (p.injected === null) {
      violations.push(`${where}: heading with nothing beneath it in the delivered body`);
      continue;
    }
    if (p.injected.isTag) {
      violations.push(`${where}: the FIRST line under the heading is a "${p.injected.key}:" tag, so THAT is what gets injected into the prompt in place of the room — tags must sit BELOW the text`);
    }
    // (b) exactly one Brightness line
    const lines = p.tags['Brightness'] ?? [];
    if (lines.length === 0) {
      violations.push(`${where}: NO \`Brightness:\` tag. An untagged preset applies no constraint and reports a data fault on every run — it fails open, silently, which is the failure this guard exists for`);
      continue;
    }
    if (lines.length > 1) {
      violations.push(`${where}: ${lines.length} \`Brightness:\` tag lines; only the first is honoured`);
    }
    const vals = lines[0];
    tagsRead++;
    if (vals.length === 0) {
      violations.push(`${where}: \`Brightness:\` is empty`);
      continue;
    }
    const unknown = vals.filter((v) => !allow.includes(v));
    if (unknown.length) {
      violations.push(`${where}: \`Brightness: ${vals.join(', ')}\` uses [${unknown.join(', ')}], outside this side's vocabulary (${allow.join('/')})`);
      continue;
    }
    // (c) a ROOM declares exactly one tone — its tone is a scalar fact about its surfaces
    if (side === 'room' && vals.length !== 1) {
      violations.push(`${where}: a room declares exactly ONE brightness value, not ${vals.length} (\`${vals.join(', ')}\`)`);
    }
    // (d) `any` is a whole-set claim and cannot be combined
    if (vals.includes('any') && vals.length > 1) {
      violations.push(`${where}: \`any\` combined with [${vals.filter((v) => v !== 'any').join(', ')}] contradicts itself and is dropped as UNCONSTRAINED`);
    }
    for (const v of vals) produced[side].add(v);
  }
}

// Standing rule: assert the extractors found something. 0 violations over 0 tags read is not a pass.
if (presetsRead < 10) undetermined(`only ${presetsRead} presets read across ${1 + ENV_FILES.length} catalogs`);
if (tagsRead === 0) undetermined(`the \`Brightness:\` extractor read ZERO tags across ${presetsRead} presets — it cannot have cleared them`);

// ─────────────────────────────────────────────────────────────────────────────
// TEXT <-> TAG CONSISTENCY on the lighting side.
//
// THE GAP THIS CLOSES, found by red-proving the checks above. Retagging every near-white preset
// to `Brightness: any` left this guard GREEN: `bright` is still produced as a member of
// `mid, bright` on four other presets, and the dim room still refuses those, so both the coverage
// and the discrimination checks passed — while `high-key-diffused` was back in the dark room,
// which is the entire defect. Coverage cannot see a MIS-tag, only a missing one.
//
// So the surround claim is read out of the preset's own injected TEXT. `high-key` and `near-white`
// are the two phrases in this catalog that assert the surround rather than the light, and a preset
// saying either must require `bright` — no `any`, and no `mid` in the set, because a mid room
// cannot supply a near-white surround either. Anchored to the INJECTED line (the text the model
// actually receives), not the document, so a phrase in a neighbouring preset cannot satisfy it.
// ─────────────────────────────────────────────────────────────────────────────
const SURROUND_CLAIM = /\b(high[- ]key|near[- ]white)\b/i;
{
  const raw = readFileSync(join(RULES_DIR, LIGHTING_FILE), 'utf8');
  const { presets } = parsePresets(LIGHTING_FILE, delivered(LIGHTING_FILE, raw));
  const claiming = presets.filter((p) => p.injected && !p.injected.isTag && SURROUND_CLAIM.test(p.injected.text));
  // Assert the extractor found something: 0 flagged out of 0 claiming presets is not a pass, and
  // this is the check most easily satisfied by a reworded catalog.
  if (claiming.length === 0) {
    undetermined(`no preset in ${LIGHTING_FILE} makes a near-white surround claim in its injected text, so this check read nothing — either the catalog was reworded, or the extractor is not reading the injected lines`);
  }
  for (const p of claiming) {
    const vals = (p.tags['Brightness'] ?? [[]])[0];
    if (vals.includes('any') || vals.includes('mid') || !vals.includes('bright')) {
      violations.push(`${LIGHTING_FILE}:${p.line} ${p.slug}: its injected text asserts a near-white surround ("${p.injected.text.slice(0, 70)}…") but its requirement is \`Brightness: ${vals.join(', ') || '(none)'}\` — a surround claim the architecture is never asked to supply is how a near-white line reached a green-black room`);
    }
  }
  console.log(`\nsurround-claiming lighting presets checked against their tags: ${claiming.length} (${claiming.map((p) => p.slug).join(', ')})`);
}

// ─────────────────────────────────────────────────────────────────────────────
// COVERAGE — every value in each side's vocabulary must have a PRODUCER in a real file.
//
// This is the `overhead-glazing` rule, applied before the fact rather than after: that value was
// documented for three places and produced by no room for three tasks, so a cell listing it was a
// dead entry that silently shrank below its own floor. A brightness value with no producer is the
// same defect — a filter branch that can never be taken, reading as coverage.
// ─────────────────────────────────────────────────────────────────────────────
for (const [side, allow] of [['room', vocab.room], ['lighting', vocab.lighting]]) {
  const missing = allow.filter((v) => !produced[side].has(v));
  if (missing.length) {
    violations.push(`${side} side: vocabulary value(s) [${missing.join(', ')}] have NO PRODUCER in any catalog — a filter branch that can never be taken, which reads as coverage`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DISCRIMINATION — the filter must be able to exclude something. With no `dim` room nothing is
// ever refused; with no surround-asserting preset there is nothing for a dim room to refuse; with
// no `any` preset a dim room has nothing left to draw. All three are vacuity, not violations of
// the vocabulary, and all three would leave every assertion above green.
// ─────────────────────────────────────────────────────────────────────────────
if (!produced.room.has('dim')) violations.push('no catalog contains a `dim` room, so the brightness filter never excludes anything');
if (!produced.lighting.has('bright')) violations.push('no lighting preset asserts a `bright` surround, so a dim room has nothing to refuse');
if (!produced.lighting.has('any')) violations.push('no lighting preset is surround-silent (`any`), so a dim room would have nothing left to draw');

console.log(`\npresets read: ${presetsRead}; brightness tags read: ${tagsRead}; ` +
  `room tones produced: ${[...produced.room].sort().join('/')}; ` +
  `lighting tones produced: ${[...produced.lighting].sort().join('/')}`);

if (violations.length) {
  console.error(`\nFAIL — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}
console.log('PASS — every preset in every catalog carries one `Brightness:` tag from its own side of the\n' +
  '       vocabulary, below its injected text; both vocabularies are fully produced; and the filter\n' +
  '       can actually discriminate.');
