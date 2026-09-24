#!/usr/bin/env node
/**
 * Guard — THE ABSTRACT-REQUEST SITUATION. The corpus half of the abstractness cue, so that a
 * CORPUS-ONLY edit (this repo alone, no image-svc checkout in the loop) cannot reintroduce the
 * thing the fragment exists to stop.
 *
 * WHAT IT ASSERTS
 *   A. `craft-abstract-situation.md` exists and its DELIVERED body is non-trivial.
 *   B. That body states no CAMERA, LIGHTING or ENVIRONMENT construct. It stands in place of the
 *      `- Where:`/`- When:` rows, so a photographic fact in it is a fourth voice on an axis a
 *      preset already owns.
 *   C. That body names no TRADE and no OCCUPATION — the defect being fixed. Word-boundary
 *      anchored: an unanchored search for `tailor` matched `tailored` in an earlier audit of this
 *      workstream and reported a trade nobody had named.
 *   D. That body supplies no QUOTED PHRASE. A supplied sentence gets reproduced (measured three
 *      times here; one literal example of a tradesperson at a counter accounted for seven of
 *      eight invented trades), so the file must state the property and the axes and quote nothing.
 *   E. Cross-repo: the SUPPRESSED MEMBER SET is the same four in all three places that decide it
 *      — the moderator's prose, the moderator's coercer, and image-svc's conditional Scene rows.
 *   F. Cross-repo: `abstract` exists on the moderator's `SceneContext` AND on image-svc's
 *      `SceneContextSchema`, or the cue is stated on one side of the wire only.
 *
 * DELIVERED, NOT RAW, for B/C/D — and that is licensed rather than assumed. `loadCraftContext`
 * strips HTML comments UNCONDITIONALLY (unlike `stripComments`, which is gated on
 * `craftProfile === 'minimal'` for rule files), so a `craft-*` fragment's comment never reaches
 * any model on any profile and may carry the measurement vocabulary the body is forbidden. That
 * property is ASSERTED (check G) rather than trusted, because the whole comment-safety argument
 * rests on it.
 *
 * EXPECTATIONS ARE DERIVED, NEVER HARDCODED, except the trade list — which is a scoring
 * vocabulary shared with the render measurement and image-svc's own guard, and is declared here
 * in full so a reader can see exactly what is and is not being looked for.
 *
 * Every extractor asserts it found something. A parser that silently matches nothing reports a
 * clean bill of health on input it never read, which has happened in this repo more than once.
 *
 * Usage:
 *   node scripts/check-abstract-situation.mjs             # 0 green, 1 violation, 2 cannot determine
 *   node scripts/check-abstract-situation.mjs --verbose
 * Env:
 *   IMAGE_SVC_DIR   where to read src/craft/sceneMetrics.ts, src/craft/prompt.ts, src/craft/skills.ts, src/validate.ts
 *   MODERATOR_DIR   where to read src/plan/prompt.ts, src/plan/planner.ts, src/interface.ts
 *   RULES_DIR       override the rules directory — for red-proving against a mutated copy
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const VERBOSE = process.argv.includes('--verbose');
const RULES_DIR = process.env.RULES_DIR ?? join(HERE, '..', 'skills', 'uds-image', 'rules');
const FRAGMENT = 'craft-abstract-situation.md';
const IMAGE_SVC_DIR = process.env.IMAGE_SVC_DIR ?? resolve(HERE, '..', '..', 'image-svc');
const MODERATOR_DIR = process.env.MODERATOR_DIR ?? resolve(HERE, '..', '..', 'uds-moderator-ctx');

/** The suppressed members, as the NAME of the set only — every value below is derived. */
const SUPPRESSED = ['place', 'timeOfDay', 'activity', 'who'];

/** The trade / occupation scoring vocabulary. Shared verbatim with image-svc's
 *  `prompt.abstractScene.test.ts` and with this change's render measurement, so the three agree on
 *  what "a trade was invented" means. Nouns only, and each is a JOB or a job-defining object. */
const TRADES = [
  'florist', 'baker', 'butcher', 'barista', 'potter', 'ceramicist', 'jeweller', 'jeweler',
  'woodworker', 'carpenter', 'joiner', 'leatherworker', 'cobbler', 'tailor', 'seamstress',
  'blacksmith', 'weaver', 'artisan', 'craftsperson', 'craftsman', 'mechanic', 'watchmaker',
  'bookbinder', 'upholsterer', 'glassblower', 'luthier', 'ceramics', 'pottery', 'workbench',
  'apron', 'kiln', 'loom', 'anvil', 'forge',
];

const problems = [];
const undetermined = [];
const notes = [];
const fail = (id, msg) => problems.push(`${id}: ${msg}`);
const cannot = (id, msg) => undetermined.push(`${id}: ${msg}`);
const note = (m) => { notes.push(m); if (VERBOSE) console.log(`  ${m}`); };

const stripComments = (t) => t.replace(/<!--[\s\S]*?-->/g, '');
const stripFrontmatter = (t) => t.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '');
function read(dir, ...p) {
  const f = join(dir, ...p);
  return existsSync(f) ? readFileSync(f, 'utf8') : null;
}

// ── A. the fragment, and its delivered body ───────────────────────────────────────────────────
const raw = read(RULES_DIR, FRAGMENT);
if (raw === null) {
  fail('A', `${FRAGMENT} is missing from ${RULES_DIR} — image-svc throws "craft context fragment not found" on every abstract run`);
} else {
  const body = stripComments(stripFrontmatter(raw)).trim();
  if (body.length < 600) fail('A', `the delivered body is ${body.length} chars — too short to be the real instruction`);
  else note(`delivered body: ${body.length} chars (raw ${raw.length})`);

  // ── B. no photographic construct. Vocabulary parsed out of image-svc, never retyped. ────────
  const metrics = read(IMAGE_SVC_DIR, 'src', 'craft', 'sceneMetrics.ts');
  if (metrics === null) {
    cannot('B', `cannot read sceneMetrics.ts under IMAGE_SVC_DIR=${IMAGE_SVC_DIR} — the axis vocabulary is not derivable, so the axis-silence check did NOT run`);
  } else {
    const block = /const MARKERS = \{([\s\S]*?)\n\} as const;/.exec(metrics);
    if (!block) cannot('B', 'MARKERS not found in sceneMetrics.ts — renamed, or its shape changed');
    else {
      let total = 0;
      for (const axis of ['camera', 'lighting', 'environment']) {
        const m = new RegExp(`${axis}: \\[([\\s\\S]*?)\\],\\n  (?:camera|lighting|environment):|${axis}: \\[([\\s\\S]*?)\\],\\n$`).exec(block[1] + '\n');
        const src = m ? (m[1] ?? m[2]) : null;
        if (!src) { cannot('B', `MARKERS.${axis} did not parse`); continue; }
        const pats = [...src.matchAll(/\/((?:[^/\\\n]|\\.)+)\/i/g)].map((x) => x[1]);
        if (pats.length < 10) { cannot('B', `MARKERS.${axis} parsed to ${pats.length} patterns — the parser read nothing`); continue; }
        total += pats.length;
        const hits = pats.filter((p) => new RegExp(p, 'i').test(body));
        if (hits.length) fail('B', `${FRAGMENT} states ${axis} constructs: ${hits.join(', ')}`);
      }
      if (total) note(`axis vocabulary: ${total} patterns checked, derived from image-svc sceneMetrics.ts`);
    }
  }

  // ── C. no trade, no occupation ──────────────────────────────────────────────────────────────
  const named = TRADES.filter((t) => new RegExp(`\\b${t}s?\\b`, 'i').test(body));
  if (named.length) fail('C', `${FRAGMENT} names a trade in its DELIVERED body: ${named.join(', ')}`);
  else note(`trade vocabulary: ${TRADES.length} anchored terms checked, none present`);

  // ── D. no supplied sentence ─────────────────────────────────────────────────────────────────
  for (const [kind, re] of [['backtick', /`[^`]{12,}`/g], ['double-quoted', /"[^"]{12,}"/g]]) {
    const q = body.match(re) ?? [];
    if (q.length) fail('D', `${FRAGMENT} supplies ${q.length} ${kind} phrase(s) — a supplied sentence gets reproduced: ${q.slice(0, 3).join(' | ')}`);
  }

  // ── G. the licence for checking DELIVERED only ──────────────────────────────────────────────
  const skills = read(IMAGE_SVC_DIR, 'src', 'craft', 'skills.ts');
  if (skills === null) {
    cannot('G', 'cannot read image-svc src/craft/skills.ts — the "comments are always stripped from a craft-* fragment" licence is unverified, so C and D were checked on the delivered body without proof that the comment is safe');
  } else {
    const fn = /export function loadCraftContext\(([\s\S]*?)\n\}/.exec(skills);
    if (!fn) cannot('G', 'loadCraftContext not found in skills.ts — renamed, or its shape changed');
    else if (!/stripHtmlComments\(/.test(fn[1])) {
      fail('G', 'loadCraftContext no longer strips HTML comments unconditionally — the author comment now REACHES the model, so C and D must be re-scoped to the raw file');
    } else if (/craftProfile/.test(fn[1])) {
      fail('G', 'loadCraftContext has become profile-aware — the unconditional-strip licence no longer holds');
    } else note('loadCraftContext strips comments unconditionally — delivered-only checking is licensed');
  }
}

// ── E/F. cross-repo agreement ─────────────────────────────────────────────────────────────────
const modPrompt = read(MODERATOR_DIR, 'src', 'plan', 'prompt.ts');
const modPlanner = read(MODERATOR_DIR, 'src', 'plan', 'planner.ts');
const modIface = read(MODERATOR_DIR, 'src', 'interface.ts');
const isvcPrompt = read(IMAGE_SVC_DIR, 'src', 'craft', 'prompt.ts');
const isvcValidate = read(IMAGE_SVC_DIR, 'src', 'validate.ts');

if (!modPrompt || !modPlanner || !modIface) {
  cannot('E/F', `cannot read the moderator under MODERATOR_DIR=${MODERATOR_DIR} — the cross-repo agreement checks did NOT run`);
} else if (!isvcPrompt || !isvcValidate) {
  cannot('E/F', `cannot read image-svc under IMAGE_SVC_DIR=${IMAGE_SVC_DIR} — the cross-repo agreement checks did NOT run`);
} else {
  // E1 — the moderator PROSE names the four.
  const omit = /and OMIT ` \+\n\s*`([^`]*?) entirely/.exec(modPrompt);
  if (!omit) cannot('E', 'the omission instruction did not parse out of the moderator plan prompt');
  else {
    // The member names are plain `"`-quoted inside a backtick TEMPLATE LITERAL, so there is no
    // backslash to match. The first draft looked for `\\"` and parsed zero names — which the
    // assert-found branch below reported as CANNOT DETERMINE rather than as a pass, which is the
    // whole point of having it.
    const prose = [...omit[1].matchAll(/"([a-zA-Z]+)"/g)].map((m) => m[1]);
    if (prose.length === 0) cannot('E', 'the omission instruction parsed to zero member names — the parser read nothing');
    else if (prose.slice().sort().join(',') !== SUPPRESSED.slice().sort().join(','))
      fail('E', `the moderator prose omits [${prose.join(', ')}], the set is [${SUPPRESSED.join(', ')}]`);
    else note(`moderator prose omits exactly [${prose.join(', ')}]`);
  }
  // E2 — the moderator COERCER drops the four.
  const drop = /\(\[([^\]]*?)\] as const\)\.filter\(\(k\) => isEmitted/.exec(modPlanner);
  if (!drop) cannot('E', 'the coercer drop-list did not parse out of planner.ts');
  else {
    const code = [...drop[1].matchAll(/'([a-zA-Z]+)'/g)].map((m) => m[1]);
    if (code.slice().sort().join(',') !== SUPPRESSED.slice().sort().join(','))
      fail('E', `the coercer logs [${code.join(', ')}] as dropped, the set is [${SUPPRESSED.join(', ')}]`);
    else note(`moderator coercer drops exactly [${code.join(', ')}]`);
  }
  // E3 — image-svc renders Where/When CONDITIONALLY. An unconditional row would print the string
  //      `undefined` under a heading that claims to describe the situation.
  for (const [member, row] of [['place', 'Where'], ['timeOfDay', 'When']]) {
    const re = new RegExp(`if \\(scene\\.${member}\\) rows\\.push\\(\`- ${row}:`);
    if (!re.test(isvcPrompt)) fail('E', `image-svc renders "- ${row}:" unconditionally — an abstract brief would print undefined`);
  }
  // F — the cue is declared on both sides of the wire.
  if (!/abstract\?: true;/.test(modIface)) fail('F', 'the moderator SceneContext has no `abstract` member');
  if (!/abstract: z\.boolean\(\)\.optional\(\)/.test(isvcValidate)) fail('F', "image-svc's SceneContextSchema has no optional boolean `abstract`");
  if (!/place: z\.enum\(PLACES\)\.optional\(\)/.test(isvcValidate)) fail('F', "image-svc's `place` is still required — the cue cannot be sent alone");
  if (!/scene\?\.abstract === true/.test(isvcPrompt)) fail('F', 'image-svc does not gate on `scene?.abstract === true`');
  if (/craft-abstract-situation\.md/.test(isvcPrompt)) note('image-svc pushes the fragment by name');
  else fail('F', 'image-svc never loads craft-abstract-situation.md — the fragment is dead');
}

if (problems.length) {
  console.error('VIOLATIONS:'); for (const p of problems) console.error(`  ${p}`);
}
if (undetermined.length) {
  console.error('CANNOT DETERMINE:'); for (const u of undetermined) console.error(`  ${u}`);
}
if (!problems.length && !undetermined.length) {
  console.log(`check-abstract-situation: OK (${notes.length} derived checks)`);
  if (!VERBOSE) for (const n of notes) console.log(`  ${n}`);
}
process.exit(problems.length ? 1 : undetermined.length ? 2 : 0);
