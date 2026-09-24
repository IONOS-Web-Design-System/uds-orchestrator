#!/usr/bin/env node
/**
 * Guard — EXACTLY ONE VOICE OWNS THE CAMERA in the planner corpus.
 *
 * WHY THIS SCRIPT EXISTS. `shared-brief-enrichment.md` carries one sentence that decides who
 * authors the photograph:
 *
 *   "**Camera and lighting are NOT yours.** image-svc decides camera angle, framing, shot length,
 *    lens, lighting direction and quality, colour grade, depth of field and atmosphere ..."
 *
 * It is the most consequential sentence in this corpus and, until this file, NOTHING protected it.
 * Measured: inverting it to "Camera and lighting are YOURS to decide" left all ten other guards
 * green. That is not hypothetical drift — an unmerged branch (`fix/image-type-taxonomy-four`)
 * DELETED this rule and replaced it with the opposite, "**Where the camera is** — MANDATORY, never
 * omitted, and never implied. Decide and state all three of ...", and merging it would have put two
 * contradictory camera statements into one delivered plan prompt. That is the precise defect this
 * whole workstream kept re-fixing: two stages authoring the same axis produces framing instructions
 * the generator is separately told to ignore.
 *
 * WHY DEFERRAL IS THE CORRECT VOICE, on every profile — so that this guard is not merely pinning a
 * preference. Camera vocabulary in the DELIVERED craft prompt, one representative `scene` brief,
 * attributed by source file: `full` 116 hits, authored by the inlined type rule
 * (`shared-image-type-scene.md`, 23 lines) plus `shared-natural-moment.md` and
 * `shared-image-principles.md`, with ZERO camera preset catalogs inlined; `minimal` 36 hits from
 * the rotating presets; `none` 21 from scaffolding. The camera is decided downstream in image-svc
 * on every profile — only WHICH downstream author decides changes. So the planner is never the
 * right author, and this is not conditional on `craftProfile`.
 *
 * THE ONE PROPERTY, in two halves, because either half alone is satisfiable while the defect is
 * present: the deferral must BE THERE, and nothing delivered alongside it may re-claim the axis.
 * A corpus that kept the deferral and also grew a mandate elsewhere is exactly the two-voice state,
 * and a scan for the mandate alone would pass on a corpus that had simply deleted the deferral.
 *
 * SCOPE. `skills/uds-asset-moderator/rules/` — the planner corpus, all of which is inlined into the
 * plan prompt. Camera prose in `skills/uds-image/` is image-svc's own craft-stage direction and is
 * the intended downstream author, so it is deliberately NOT scanned; scanning it would make this
 * guard red on the correct configuration.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const RULES = process.env.RULES_DIR_ASSET_MODERATOR ?? join(REPO, 'skills', 'uds-asset-moderator', 'rules');
const VERBOSE = process.argv.includes('--verbose');

const checks = [];
const problems = [];
const note = (ok, label, detail) => {
  checks.push({ ok, label, detail });
  if (!ok) problems.push(`${label} — ${detail}`);
};

if (!existsSync(RULES)) {
  console.error(`CANNOT DETERMINE: no uds-asset-moderator rules at ${RULES} (set RULES_DIR_ASSET_MODERATOR)`);
  process.exit(2);
}

/** HTML comments are stripped: an author note explaining the rule legitimately quotes the wording
 *  it replaced, and must neither satisfy the presence check nor trip the mandate scan. */
const strip = (md) => md.replace(/<!--[\s\S]*?-->/g, '');
const files = readdirSync(RULES).filter((f) => f.endsWith('.md')).sort();
if (files.length < 3) {
  console.error(`CANNOT DETERMINE: only ${files.length} rule files under ${RULES} — the scan would read nothing`);
  process.exit(2);
}
const bodies = files.map((f) => ({ file: f, text: strip(readFileSync(join(RULES, f), 'utf8')) }));

// ── HALF 1: the deferral is present, and says image-svc decides. ────────────────────────────────
const DEFERRAL = /camera and lighting are \*{0,2}not yours/i;
const carriers = bodies.filter((b) => DEFERRAL.test(b.text));
note(carriers.length === 1, 'the camera deferral is present exactly once',
  carriers.length === 1
    ? `${carriers[0].file} states "Camera and lighting are NOT yours"`
    : `found in ${carriers.length} files [${carriers.map((c) => c.file).join(', ') || 'none'}] — expected exactly 1`);

if (carriers.length === 1) {
  const t = carriers[0].text;
  note(/image-svc decides/i.test(t), 'the deferral names image-svc as the author',
    /image-svc decides/i.test(t) ? 'says "image-svc decides"' : `${carriers[0].file} no longer says who decides`);
  note(/do not write them into the\s+`?feature`?/i.test(t), 'the deferral tells the planner what NOT to do',
    /do not write them into the\s+`?feature`?/i.test(t)
      ? 'says "Do NOT write them into the `feature`"'
      : `${carriers[0].file} states the ownership but gives no instruction, so nothing follows from it`);
}

// ── HALF 2: nothing in the same delivered corpus re-claims the axis. ────────────────────────────
// Each pattern is a phrasing that ORDERS the planner to decide the camera. Deliberately not a bare
// "camera" scan: the corpus must stay free to say the camera is someone else's, to describe device
// physics, and to explain why a viewpoint the brief itself requested is passed through.
const MANDATES = [
  [/where the camera is\b[^.\n]{0,40}\bmandatory/i, '"Where the camera is — MANDATORY"'],
  [/\bdecide and state\b[^.\n]{0,60}\bcamera\b/i, '"Decide and state ... camera"'],
  [/\bcamera\b[^.\n]{0,30}\bmandatory, never omitted/i, '"camera ... MANDATORY, never omitted"'],
  [/\b(state|choose|decide|set)\b[^.\n]{0,25}\bthe (camera (height|angle|position)|shot size|lens|depth of field)\b/i,
    'an instruction to choose the shot design'],
  [/\bcamera and lighting are\s+\*{0,2}yours/i, 'the deferral inverted to "are YOURS"'],
];
for (const { file, text } of bodies) {
  for (const [re, label] of MANDATES) {
    const m = re.exec(text);
    if (m) note(false, 'no competing camera mandate in the planner corpus',
      `${file} contains ${label} — ${JSON.stringify(m[0].slice(0, 90))}`);
  }
}
note(true, 'competing-mandate scan',
  `${MANDATES.length} phrasings checked across ${bodies.length} delivered planner rule files`);

if (VERBOSE) for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label} — ${c.detail}`);
console.log(`checked ${checks.length} properties over ${bodies.length} delivered planner rule files`);

// A real violation is reported BEFORE the coverage floor. Ordering these the other way round made a
// MISSING deferral exit 2 ("cannot determine") instead of 1 — the two halves below the presence
// check do not run when there is no carrier, so the very failure this file exists to catch was
// downgraded to an inconclusive. A red that reports itself as undetermined is a guard that cannot
// fail.
if (problems.length) { for (const p of problems) console.error(`VIOLATION: ${p}`); process.exit(1); }

// Only a CLEAN run is held to full coverage: all four properties must actually have executed, so a
// pass cannot come from a scan that read nothing.
if (checks.length < 4) { console.error(`CANNOT DETERMINE: only ${checks.length} checks executed`); process.exit(2); }
console.log('green');
process.exit(0);
