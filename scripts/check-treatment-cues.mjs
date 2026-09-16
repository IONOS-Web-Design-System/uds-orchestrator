#!/usr/bin/env node
/**
 * Guard — the request-cue lexicon must stay a NARROW gate.
 *
 * `shared-request-treatment-cues.md` decides whether the moderator's planner is offered a
 * camera/lighting preset menu for a given request at all. It is the whole mechanism keeping the
 * planner from pinning both photographic axes on every brief — measured before it existed: both
 * axes named in 21 of 21 stored plans, and lighting one preset of 14 in 18 of 18 end-to-end runs.
 *
 * The failure mode this guards is DECAY, not breakage. Every dangerous edit here leaves a
 * perfectly valid file and a pipeline that still renders every image:
 *   - a generic mood adjective added as a cue ("bright", "clean", "modern") re-opens the menu for
 *     nearly every brief, which puts the pinning back with no error anywhere;
 *   - a cue listed under BOTH axes lets one phrase open both, collapsing the two-axis separation
 *     the design rests on;
 *   - a cue written in non-normalised form still matches, so it is invisible to a reader and to
 *     the duplicate check while behaving differently from how it reads;
 *   - an EMPTY section fails closed and silently stops honouring real request intent.
 *
 * WHY A SEPARATE SCRIPT. `check-minimal-conflict.mjs` derives its corpus from image-svc's
 * `minimalRules` — what the `minimal` profile INLINES. This file is never inlined by anything: it
 * is read as DATA by uds-moderator's `buildPlanPrompt`. Same discipline as
 * `check-brightness-tags.mjs`, separate subject, separate script:
 *   - three exit codes: 0 green, 1 violation, 2 cannot-determine. "I did not read the corpus"
 *     must never look like "the corpus is clean";
 *   - matched against the DELIVERED body with HTML comments stripped. This file's own header
 *     explains the scope rule by NAMING the adjectives it forbids, and a guard satisfied (or
 *     tripped) by a file's own explanation of its rule has happened in this workstream before;
 *   - every extractor asserts it found something: 0 violations over 0 cues read is not a pass;
 *   - the prod-brief canary is the end-to-end half — the two real production requests the defect
 *     was measured on must score ZERO on both axes, with a positive control on the same lexicon
 *     so a zero can never come from having read nothing.
 *
 * Usage:
 *   node scripts/check-treatment-cues.mjs            # 0 = green, 1 = violation, 2 = cannot determine
 *   node scripts/check-treatment-cues.mjs --verbose
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERBOSE = process.argv.includes('--verbose');
const HERE = dirname(fileURLToPath(import.meta.url));
const RULES = join(HERE, '..', 'skills', 'uds-image', 'rules');
const FILE = 'shared-request-treatment-cues.md';

/** exit 2 — the guard could not read its subject. Never conflate with a pass. */
function cannotDetermine(why) {
  console.error(`CANNOT DETERMINE — ${why}`);
  process.exit(2);
}

// ─────────────────────────────────────────────────────────────────────────────
// The axes, DERIVED from uds-moderator rather than restated, so an axis added there cannot
// escape this guard. Falls back to the documented pair when the sibling checkout is absent,
// which is reported rather than silent — the fallback is a weaker guard, not an equal one.
// ─────────────────────────────────────────────────────────────────────────────
const MODERATOR_CANDIDATES = ['uds-moderator-ctx', 'uds-moderator'];
let axes = null;
let axesFrom = null;
for (const repo of MODERATOR_CANDIDATES) {
  const p = join(HERE, '..', '..', repo, 'src', 'plan', 'prompt.ts');
  let src;
  try { src = readFileSync(p, 'utf8'); } catch { continue; }
  const m = /const TREATMENT_AXES = \[([^\]]*)\] as const;/.exec(src);
  if (!m) continue;
  const parsed = m[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean);
  if (parsed.length === 0) cannotDetermine(`TREATMENT_AXES in ${p} matched but parsed to nothing`);
  axes = parsed;
  axesFrom = p;
  break;
}
if (!axes) {
  axes = ['camera', 'lighting'];
  axesFrom = '(no moderator checkout found — using the documented pair)';
}

// ─────────────────────────────────────────────────────────────────────────────
// Read the DELIVERED body: HTML comments stripped, exactly as the moderator's loader does not
// need to but this guard must, because the header names the forbidden adjectives.
// ─────────────────────────────────────────────────────────────────────────────
let raw;
try { raw = readFileSync(join(RULES, FILE), 'utf8'); } catch (err) {
  cannotDetermine(`could not read ${join(RULES, FILE)}: ${err.message}`);
}
const delivered = raw.replace(/<!--[\s\S]*?-->/g, '');
if (delivered.trim().length === 0) cannotDetermine(`${FILE} is empty once HTML comments are stripped`);

/** Same normalisation the moderator applies to both sides of a match. */
const normalise = (t) => ` ${t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;

/** Same parser shape as the moderator's: `## axis` sections, `- cue` items, a non-axis heading
 *  CLEARS scope rather than carrying the previous axis over. */
function parse(body) {
  const out = new Map();
  const problems = [];
  let axis = null;
  for (const line of body.split(/\r?\n/)) {
    const heading = /^##\s+([a-z-]+)\s*$/.exec(line);
    if (heading) {
      if (axes.includes(heading[1])) { axis = heading[1]; } else {
        problems.push(`heading "## ${heading[1]}" is not a known axis (scope cleared, not carried over)`);
        axis = null;
      }
      continue;
    }
    const item = /^-\s+(.+?)\s*$/.exec(line);
    if (!item) continue;
    if (axis === null) { problems.push(`list item with no axis in scope: "- ${item[1]}"`); continue; }
    out.set(axis, [...(out.get(axis) ?? []), item[1].trim()]);
  }
  return { cues: out, problems };
}

const { cues, problems } = parse(delivered);
const total = [...cues.values()].reduce((n, l) => n + l.length, 0);
if (total === 0) cannotDetermine(`${FILE} parsed to ZERO cues — the extractor read nothing, so nothing below was checked`);

const violations = [...problems];

// ─────────────────────────────────────────────────────────────────────────────
// COVERAGE — every axis present, and none of them token.
// A one-cue axis is a gate that opens for exactly one phrasing; it reads as working while
// honouring almost no real request intent. The floor is stated as a number because "non-empty"
// is the assertion that would let a section decay to a single entry unnoticed.
// ─────────────────────────────────────────────────────────────────────────────
const FLOOR = 10;
for (const axis of axes) {
  const list = cues.get(axis) ?? [];
  if (list.length === 0) violations.push(`axis "${axis}" has NO cues, so that axis is permanently closed and real request intent for it is silently lost`);
  else if (list.length < FLOOR) violations.push(`axis "${axis}" has only ${list.length} cues (floor ${FLOOR}) — a gate this narrow opens for almost no real phrasing`);
}
for (const axis of cues.keys()) {
  if (!axes.includes(axis)) violations.push(`section "## ${axis}" is not a treatment axis the moderator knows about`);
}

// ─────────────────────────────────────────────────────────────────────────────
// SCOPE — the rule that decides whether this gate works at all. A cue must name a CONCRETE
// viewpoint or light condition a preset can match; a bare mood or tonal adjective is not a
// request for a camera position or a light source, and admitting one re-opens the menu for
// nearly every brief. Checked against WHOLE normalised cues, so the same word inside a longer
// concrete phrase is fine.
// ─────────────────────────────────────────────────────────────────────────────
const GENERIC = [
  'bright', 'dark', 'clean', 'airy', 'moody', 'warm', 'cool', 'modern', 'professional',
  'cinematic', 'dramatic', 'soft', 'shadows', 'light', 'lighting', 'camera', 'photo',
  'beautiful', 'premium', 'vibrant', 'minimal', 'stylish', 'crisp', 'sleek',
];
for (const [axis, list] of cues) {
  for (const cue of list) {
    if (GENERIC.includes(cue.toLowerCase())) {
      violations.push(`${axis}: "${cue}" is a bare generic adjective, not a viewpoint or light CONDITION — it would open this axis for almost every brief`);
    }
    if (normalise(cue) !== ` ${cue} `) {
      violations.push(`${axis}: "${cue}" is not in normalised form (lowercase, single spaces, no punctuation) — it still matches, which makes it invisible to the duplicate checks and different from how it reads`);
    }
    if (cue.length < 3) violations.push(`${axis}: "${cue}" is too short to be a cue`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SEPARATION — one phrase must never open both axes, and no axis may repeat itself.
// ─────────────────────────────────────────────────────────────────────────────
const seen = new Map();
for (const [axis, list] of cues) {
  const within = list.filter((x, i) => list.indexOf(x) !== i);
  for (const d of new Set(within)) violations.push(`${axis}: "${d}" is listed twice`);
  for (const cue of list) {
    const prior = seen.get(cue);
    if (prior !== undefined && prior !== axis) {
      violations.push(`"${cue}" appears on BOTH "${prior}" and "${axis}" — one phrase must never open both axes`);
    }
    seen.set(cue, axis);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// THE CANARY, end to end. The two real production requests the defect was measured on must score
// ZERO on both axes; a cue-bearing request must score both. Without the positive control a zero
// is indistinguishable from a lexicon that read nothing.
// ─────────────────────────────────────────────────────────────────────────────
const PROD_BRIEFS = [
  'A cluttered desk with scattered papers, folders, and documents in disarray, symbolizing chaos and inefficiency in document management',
  'A clean, modern workspace with a laptop displaying an organized digital document management interface with AI-powered search results, symbolizing efficiency and clarity',
];
const POSITIVE = 'An over-the-shoulder shot of a designer at golden hour';

const score = (text) => {
  const hay = normalise(text);
  const hit = {};
  for (const [axis, list] of cues) {
    const found = list.find((cue) => hay.includes(normalise(cue)));
    if (found !== undefined) hit[axis] = found;
  }
  return hit;
};

for (const text of PROD_BRIEFS) {
  const hit = score(text);
  const opened = Object.keys(hit);
  if (opened.length > 0) {
    violations.push(
      `a real production brief opens ${opened.join(' + ')} via ${opened.map((a) => `"${hit[a]}"`).join(', ')} — ` +
      `that brief names no viewpoint and no light condition, so the cue is too broad: "${text.slice(0, 70)}…"`,
    );
  }
}
const positiveHit = score(POSITIVE);
for (const axis of axes) {
  if (positiveHit[axis] === undefined) {
    violations.push(`POSITIVE CONTROL failed: "${POSITIVE}" opened no "${axis}" cue, so the zeros above may mean the lexicon matched nothing at all rather than being correctly narrow`);
  }
}

if (VERBOSE) {
  for (const [axis, list] of cues) console.log(`  ${axis}: ${list.length} cues — ${list.join(' | ')}`);
}
console.log(`\naxes derived from: ${axesFrom}`);
console.log(`cues read: ${total} across ${cues.size} axes (${axes.map((a) => `${a}=${(cues.get(a) ?? []).length}`).join(', ')})`);
console.log(`canary: ${PROD_BRIEFS.length} prod briefs scored, positive control opened ${Object.keys(positiveHit).sort().join('+') || 'NOTHING'}`);

if (violations.length) {
  console.error(`\nFAIL — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}
console.log('PASS — both axes are covered above the floor, every cue names a concrete viewpoint or light\n' +
  '       condition in normalised form, no phrase opens both axes, and the two real production\n' +
  '       briefs open neither while the positive control opens both.');
