#!/usr/bin/env node
/**
 * Guard — the PHYSICAL-PLAUSIBILITY arbiter keeps the scope and the two remedies that the
 * 2026-09-17 pixel re-audit showed it needs, and keeps naming the failure nowhere.
 *
 * WHY THIS SCRIPT EXISTS, and what it is guarding against specifically.
 * A user reported that generated frames still show screen content on the back of devices after an
 * audit reported "0 of 36". The re-audit found the audit's detector scored one visual form and the
 * defect has four, and found the rule itself had three holes. All three are things a later edit can
 * silently reintroduce, and only one of them is visible to a test that merely checks the block is
 * present:
 *
 *   1. SCOPE. The rule's second paragraph used to open "Someone holding a tablet and looking at
 *      it". A display RESTING ON A DESK therefore fell outside its antecedent, and the craft model
 *      kept asserting content on one: 13 of 57 delivered prompts at craftProfile=minimal
 *      (gemini-3.1-flash-lite) said some form of "the laptop screen displays <interface>", and
 *      every defective frame in the 36-frame set came from that population. Narrowing the
 *      antecedent back to the held case is the single most likely regression here.
 *
 *   2. THE TWIST PROHIBITION MUST BE UNCONDITIONAL. "move the camera, never the device" used to be
 *      the last sentence of craft-plausibility-reframe.md, which image-svc splices in ONLY when
 *      nothing has fixed the shot. Measured on the real code path: the prohibition was delivered on
 *      0 of 57 `minimal` runs, because a camera preset is drawn on essentially all of them. The
 *      model then satisfied the surviving content demand by rotating the device to the lens — 14 of
 *      84 frames across three artefact sets. So the sentence belongs in the unconditional body, and
 *      it must appear EXACTLY ONCE in the spliced result or it is sent twice when the clause fires.
 *
 *   3. THE UNSEEN FACE MUST BE DIRECTED, NOT MERELY LEFT UNASSERTED. Stopping the craft model from
 *      claiming visible content removes the contradiction without telling the renderer what the
 *      turned-away face looks like. The vacuum is what got filled — a web page printed edge-to-edge
 *      on an outer lid, a fruit logo on a lid, a lid drawn twice over its own display. All four
 *      negative-prompt forms were present in the brand baseline on 36 of 36 of those runs, so the
 *      negative channel is DISPROVEN as sufficient at that n and the fix has to be a positive
 *      statement of appearance.
 *
 * DISCIPLINE THIS SCRIPT FOLLOWS, all of it learned the hard way in this workstream:
 *   - it matches the DELIVERED body, with HTML comments stripped, because these files carry heavy
 *     author-facing forensics and a guard satisfied by a file's own explanation of the thing it
 *     forbids has already happened twice here. Every forbidden phrase below appears in the very
 *     comments of the files being checked, so reading the raw bytes would fail every run;
 *   - three exit codes: 0 green, 1 violation, 2 cannot-determine. "I could not read the corpus"
 *     must never look like "the corpus is clean";
 *   - every extractor asserts it found something. 0 violations over 0 files read is not a pass;
 *   - it never asserts `a.indexOf(x) > b.indexOf(y)` without proving both operands present first —
 *     that exact shape let a deleted block pass an ordering assertion in this repo.
 *
 * It is deliberately NOT a duplicate of image-svc's contextLocation.test.ts. That test owns the
 * POSITION and the CONDITIONALITY of the block inside an assembled prompt, which needs the real
 * builder. This script owns the CONTENT of the two fragments and runs with no image-svc checkout
 * at all, so the skills repo can be validated on its own.
 *
 * Usage:
 *   node scripts/check-plausibility-scope.mjs             # 0 green, 1 violation, 2 cannot determine
 *   node scripts/check-plausibility-scope.mjs --verbose
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERBOSE = process.argv.includes('--verbose');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RULES = join(ROOT, 'skills/uds-image/rules');
const BASE = 'craft-plausibility.md';
const CLAUSE = 'craft-plausibility-reframe.md';

const problems = [];
const undetermined = [];
const checks = [];
const note = (ok, label, detail) => { checks.push({ ok, label, detail }); if (!ok) problems.push(`${label} — ${detail}`); };

/** The body the image model is handed: HTML comments stripped, whitespace normalised.
 *  `loadCraftContext` strips comments on EVERY profile, so this is the author/model boundary. */
function delivered(name) {
  const p = join(RULES, name);
  if (!existsSync(p)) { undetermined.push(`${name} is missing — cannot determine`); return null; }
  const raw = readFileSync(p, 'utf8');
  const body = raw.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim();
  // A stripped-to-nothing fragment would satisfy every "does not contain" check below.
  // FLOOR, not a content check. Red-proving this guard showed a floor of 100 swallowing the
  // reframe-offer violation: the clause's delivered body is only ~118 chars, so shortening the
  // offer dropped it under the floor and the script reported cannot-determine instead of the
  // violation it had actually detected. 40 is below any real fragment and above an empty one.
  if (body.length < 40) { undetermined.push(`${name} delivers only ${body.length} chars — too short to check`); return null; }
  return body;
}

const base = delivered(BASE);
const clause = delivered(CLAUSE);
if (!base || !clause) {
  for (const u of undetermined) console.error(`CANNOT DETERMINE: ${u}`);
  process.exit(2);
}

const PROHIBITION = 'move the camera, never the device';
const spliced = base.replace('{{reframeClause}}', ` ${clause}`);
const suppressed = base.replace('{{reframeClause}}', '');

// The placeholder must still be there, or `spliced` and `suppressed` are the same string and the
// two cells below stop being different cells.
note(base.includes('{{reframeClause}}'), 'clause splice point',
  base.includes('{{reframeClause}}') ? 'present' : 'the {{reframeClause}} placeholder is gone — the conditional remedy can no longer be spliced');

// 1. SCOPE — the antecedent must reach a display at rest, and must not be narrowed back.
note(/resting on a desk/i.test(suppressed), 'scope covers a display at rest',
  /resting on a desk/i.test(suppressed) ? 'found "resting on a desk"' : 'the antecedent no longer names a display at rest — a desk device escapes the rule, which is the measured bug');
note(!/someone holding a tablet/i.test(spliced), 'no held-only antecedent',
  /someone holding a tablet/i.test(spliced) ? 'the held-only antecedent is back' : 'absent');

// 2. THE TWIST PROHIBITION — unconditional, and exactly once when the clause fires.
note(suppressed.toLowerCase().includes(PROHIBITION), 'twist prohibition survives clause suppression',
  suppressed.toLowerCase().includes(PROHIBITION) ? 'in the unconditional body' : `"${PROHIBITION}" is not in the body delivered when the clause is suppressed — it was delivered 0/57 times from the clause`);
const occurrences = spliced.toLowerCase().split(PROHIBITION).length - 1;
note(occurrences === 1, 'twist prohibition appears exactly once',
  `${occurrences} occurrence(s) in the spliced body`);

// 3. THE UNSEEN FACE — directed positively.
note(/other side is unmarked casing/i.test(suppressed), 'the turned-away face is directed',
  /other side is unmarked casing/i.test(suppressed) ? 'found the positive appearance clause' : 'no positive statement of the turned-away face — the renderer is un-contradicted rather than directed');

// The blanking word has to stay the one the screen-content reference block overrides by name,
// or the two blocks start arguing and only position resolves it.
note(/\bblank\b/i.test(suppressed), 'blanking vocabulary', /\bblank\b/i.test(suppressed) ? 'found "blank"' : '"blank" is gone — craft-reference-screen-content.md overrides that exact word');

// The conditional half keeps the remedy that genuinely must stay conditional.
note(/past their shoulder/i.test(clause), 'reframe offer intact', /past their shoulder/i.test(clause) ? 'found' : 'the reframe offer is gone from the conditional clause');

// 4. THE FAILURE IS NAMED NOWHERE. Each of these is one of the four forms the brand baselines
//    forbid in negativePrompt; the delivered body must not hand the model the words.
const FORBIDDEN = ['back of a device', 'back of the device', 'back of a laptop', 'tablet back', 'device lid', 'laptop lid', 'the back'];
for (const phrase of FORBIDDEN) {
  for (const [label, body] of [['base+clause', spliced], ['clause', clause]]) {
    const hit = body.toLowerCase().includes(phrase);
    if (hit) note(false, 'names the failure', `${label} contains ${JSON.stringify(phrase)}`);
  }
}
note(true, 'failure-naming scan', `${FORBIDDEN.length} phrases checked against 2 delivered bodies`);

// 0 checks executed is not a pass.
if (checks.length < 8) { console.error(`CANNOT DETERMINE: only ${checks.length} checks executed`); process.exit(2); }

if (VERBOSE) for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label} — ${c.detail}`);
console.log(`checked ${checks.length} properties over 2 delivered fragments (${base.length} + ${clause.length} chars)`);
if (problems.length) { for (const p of problems) console.error(`VIOLATION: ${p}`); process.exit(1); }
console.log('green');
process.exit(0);
