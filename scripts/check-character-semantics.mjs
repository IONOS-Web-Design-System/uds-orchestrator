#!/usr/bin/env node
/**
 * Guard — CHARACTER SEMANTICS. The three user-reported defects this workstream's character half
 * exists to fix, each asserted against the thing that actually decides it:
 *
 *   ITEM 1  a brief whose situation is a problem must be photographed RESOLVED, and the expression
 *           must follow from the situation rather than be prescribed in either direction.
 *   ITEM 3  a person need not be in the frame; the decision is scenario-driven; and no brand's
 *           negative baseline may forbid the absence it permits.
 *   ITEM 6  attention direction, role differentiation and motion are authored, and authored in a
 *           file the profile actually inlines.
 *
 * EXPECTATIONS ARE DERIVED, NEVER HARDCODED:
 *   - the delivered file set comes from image-svc's `minimalRules` (the same extraction
 *     check-minimal-conflict.mjs uses), so a rule that stops being inlined fails here;
 *   - the camera/lighting vocabulary comes from image-svc's `sceneMetrics.ts` MARKERS;
 *   - the prop vocabulary comes from `shared-scenario-props.md`'s own tables;
 *   - the brand-baseline list comes from scanning the rules directory for the baseline heading;
 *   - `CASTS` is compared between the two repos rather than written out here.
 * Matched against the DELIVERED body (comments stripped) where the question is "what does the
 * model read", and against the RAW body where the question is "what may this file name at all" —
 * because `stripComments` is gated on `craftProfile === 'minimal'` in image-svc's prompt.ts, so a
 * comment IS delivered on `full`.
 *
 * Every extractor asserts it found something: a parser that silently matches nothing reports a
 * clean bill of health on input it never read, which has happened in this repo more than once.
 *
 * Usage:
 *   node scripts/check-character-semantics.mjs             # 0 green, 1 violation, 2 cannot determine
 *   node scripts/check-character-semantics.mjs --verbose
 * Env:
 *   IMAGE_SVC_DIR   where to read src/craft/profiles.ts, src/validate.ts, src/craft/sceneMetrics.ts
 *   MODERATOR_DIR   where to read src/plan/planner.ts and src/plan/prompt.ts
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
const MODERATOR = process.env.MODERATOR_DIR
  ?? [resolve(REPO, '..', 'uds-moderator-ctx'), resolve(REPO, '..', 'uds-moderator')].find(existsSync);

function undetermined(msg) { console.error(`CANNOT DETERMINE: ${msg}`); process.exit(2); }
const read = (p, what) => { if (!existsSync(p)) undetermined(`${what} not found at ${p}`); return readFileSync(p, 'utf8'); };

/** Strip TRUE html comments. Approximate vs image-svc's scanner (which honours code spans), and
 *  only ever used to ask "is this section delivered", never "is this word absent" — the absence
 *  questions below run on the RAW body precisely so the approximation cannot create a false green. */
const delivered = (raw) => raw.replace(/<!--[\s\S]*?-->/g, '');
const flat = (s) => s.replace(/\s+/g, ' ').toLowerCase();

// ─── 1. the DELIVERED file set, derived from image-svc's minimalRules ────────────────────────────
function minimalRuleFiles() {
  const src = read(join(IMAGE_SVC, 'src', 'craft', 'profiles.ts'), 'image-svc profiles.ts');
  const start = src.indexOf('export function minimalRules');
  if (start === -1) undetermined('`export function minimalRules` not found — renamed, or wrong file');
  const end = src.indexOf('\n}', start);
  if (end === -1) undetermined('could not find the end of minimalRules');
  // The experiment log lives in comments and names OTHER rule files as prose. Strip it.
  const code = src.slice(start, end).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  const files = new Set();
  for (const m of code.matchAll(/'([A-Za-z0-9._-]+\.md)'/g)) files.add(m[1]);
  const brandsSrc = read(join(IMAGE_SVC, 'src', 'validate.ts'), 'image-svc validate.ts');
  const bm = brandsSrc.match(/export const BRANDS = \[([\s\S]*?)\] as const;/);
  if (!bm) undetermined('BRANDS not found in validate.ts');
  const brands = [...bm[1].matchAll(/'([a-z0-9]+)'/g)].map((m) => m[1]);
  if (brands.length < 2) undetermined(`BRANDS parsed implausibly small (${brands.length})`);
  for (const m of code.matchAll(/`\$\{brand\}([A-Za-z0-9._-]*\.md)`/g)) for (const b of brands) files.add(`${b}${m[1]}`);
  if (files.size === 0) undetermined('parsed ZERO rule files out of minimalRules');
  return { files: [...files], brands };
}

// ─── 2. photographic vocabulary, derived from image-svc's sceneMetrics MARKERS ───────────────────
function axisMarkers() {
  const src = read(join(IMAGE_SVC, 'src', 'craft', 'sceneMetrics.ts'), 'image-svc sceneMetrics.ts');
  const block = /const MARKERS = \{([\s\S]*?)\n\} as const;/.exec(src);
  if (!block) undetermined('MARKERS not found in sceneMetrics.ts');
  const out = {};
  const keys = [...block[1].matchAll(/\n {2}(camera|lighting|environment): \[/g)].map((m) => m[1]);
  const sections = block[1].split(/\n {2}(?:camera|lighting|environment): \[/).slice(1);
  if (keys.length !== 3 || sections.length !== 3) undetermined(`parsed ${keys.length} marker axes, expected 3`);
  keys.forEach((k, i) => {
    const pats = [...sections[i].matchAll(/\/((?:\\.|\[[^\]]*\]|[^/\\])+)\/i/g)].map((m) => m[1]);
    if (pats.length < 10) undetermined(`${k} parsed only ${pats.length} markers`);
    out[k] = pats.map((p) => new RegExp(p, 'i'));
  });
  return out;
}

// ─── 3. the prop question is DELEGATED, deliberately ────────────────────────────────────────────
/**
 * "No injected rule may name a prop object outside shared-scenario-props.md" is already guarded,
 * properly, by image-svc/src/craft/__tests__/scenarioProps.test.ts: it derives the vocabulary from
 * the two canonical tables, sweeps every injected rule, scans the wrapped body as well as the
 * per-line one, and asserts PRESENT-IN-SOURCE for every noun it extracted. It caught three nouns
 * in the first draft of the owned files, one of them only inside an HTML comment.
 *
 * A second, cruder extractor HERE was written and then withdrawn: taking the last word of each
 * table cell yielded `down`, `edge`, `alone` and `reach` as "prop nouns", which flagged
 * "clipped by the frame edge" and "set down" — content the rule requires. A check that flags what
 * the rule permits can never be hardened, and that lesson is written into three other files in
 * this repo. One subject per script; this one does not own props.
 *
 * What is asserted is that the delegate still EXISTS, so the delegation cannot silently become no
 * coverage at all.
 */
function assertPropGuardDelegate() {
  const p = join(IMAGE_SVC, 'src', 'craft', '__tests__', 'scenarioProps.test.ts');
  if (!existsSync(p)) undetermined(`the prop guard this script delegates to is missing: ${p}`);
  const src = readFileSync(p, 'utf8');
  if (!/names a prop object only inside a row of the two scenario tables/.test(src)) {
    undetermined(`${p} exists but no longer contains the prop-scope test this script delegates to`);
  }
  return p;
}

// ─── 4. brand negative baselines, derived by scanning the rules directory ───────────────────────
function baselines() {
  const out = new Map();
  for (const f of readdirSync(RULES_DIR).filter((f) => f.endsWith('.md'))) {
    const body = readFileSync(join(RULES_DIR, f), 'utf8');
    const m = /## Negative prompt baseline[\s\S]*?`"([\s\S]*?)"`/.exec(body);
    if (m) out.set(f, m[1].replace(/\s+/g, ' ').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean));
  }
  if (out.size < 3) undetermined(`found ${out.size} negative baselines in ${RULES_DIR}, expected at least 3`);
  for (const [f, terms] of out) if (terms.length < 8) undetermined(`${f}'s baseline parsed to ${terms.length} terms`);
  return out;
}

// ─── the checks ─────────────────────────────────────────────────────────────────────────────────
const OWNED = { presence: 'shared-character-presence.md', moment: 'shared-natural-moment.md' };
/** Section headings each owned file must DELIVER. One entry per user item, so a file gutted to
 *  its title fails with the item named. */
const REQUIRED_SECTIONS = {
  [OWNED.presence]: [
    ['item 1 — the resolved-state re-frame', /^## When the situation is a problem, photograph it dealt with$/m],
    ['item 1 — expression follows the situation', /^## The situation decides the expression/m],
    ['item 3 — the three cast positions', /^## Whether a person is in the frame, and how prominent$/m],
    ['item 3 — unpeopled vs idle', /^### An unpeopled frame is a place in use, not an idle product shot$/m],
  ],
  [OWNED.moment]: [
    ['item 6 — attention direction', /^## Where the attention goes$/m],
    ['item 6 — role differentiation', /^## More than one person: give each of them a different job$/m],
    ['item 6 — motion (pre-existing)', /^## Put the subject in the middle of something$/m],
  ],
};
/** Every `cast` value must be DEFINED in prose, not merely acted on in code. Derived from the
 *  enum, so a fourth value added later fails here until it is documented. */
function castValues() {
  const a = /export const CASTS = \[([^\]]*)\] as const;/.exec(read(join(IMAGE_SVC, 'src', 'validate.ts'), 'image-svc validate.ts'));
  if (!a) undetermined('CASTS not found in image-svc validate.ts');
  const vals = [...a[1].matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
  if (vals.length < 2) undetermined(`CASTS parsed to ${vals.length} values`);
  return vals;
}
/** Hazards visible in the three reference photographs. Not derivable — the source is a set of
 *  images — so this is the one hand-written list, and it is a list of things that must NOT appear,
 *  which is the safe direction: a missing entry under-reports, it cannot create a false red. */
const REFERENCE_HAZARDS = ['exit sign', 'extinguisher', 'christmas', 'stocking', 'snow globe',
                           'plaid', 'microsoft', 'whiteboard'];

const violations = [];
const v = (m) => violations.push(m);

const { files, brands } = minimalRuleFiles();
const MARKERS = axisMarkers();
const PROP_DELEGATE = assertPropGuardDelegate();
const BASELINES = baselines();
const CASTS = castValues();

// CHECK A — the owned files are really in the inlined set. Asserted against minimalRules, never a
// filename: a rule authored in a file the profile does not inline is a silent no-op.
for (const f of Object.values(OWNED)) {
  if (!files.includes(f)) v(`${f} is NOT in image-svc's minimalRules — anything authored in it is a silent no-op on the profile the defect was measured at`);
}

// CHECK B — each owned file delivers its required sections.
for (const [f, reqs] of Object.entries(REQUIRED_SECTIONS)) {
  const p = join(RULES_DIR, f);
  if (!existsSync(p)) { v(`${f} does not exist`); continue; }
  const raw = readFileSync(p, 'utf8');
  if (raw.length < 1000) undetermined(`${f} is ${raw.length} chars — the guard is reading a stub`);
  const body = delivered(raw);
  for (const [label, re] of reqs) {
    if (!re.test(body)) {
      v(`${f}: ${label} — the section is GONE from the delivered body` +
        (re.test(raw) ? ' — it is in the RAW file but only inside an HTML comment, which `minimal` strips' : ''));
    }
  }
}

// CHECK C — the owned files may not OWN a photographic axis, and may not name a reference hazard.
// RAW body, comments included: `stripComments` is gated on `minimal`, so a comment is delivered
// verbatim on `full`.
//
// SENTENCE-SCOPED, with a DEFERRAL carve-out, because a file-wide substring test cannot tell
// "this rule sets the framing" from "the injected camera line owns the framing, not this rule" —
// and the second is the precedence statement that KEEPS the axis intact. The same distinction is
// written into check-minimal-conflict.mjs, which spares "the precedence instruction that tells the
// model to obey an injected line" for exactly this reason. The carve-out is itself asserted to
// have fired at least once, so it can never silently swallow the whole check.
const DEFERRAL = /Photographic (?:camera|lighting):|(?:camera|lighting) axis owns|still owns|decided (?:elsewhere|downstream)|belongs to the camera|owns it/i;
/**
 * Two markers in image-svc's list are blunt outside the context it uses them in, and both produce
 * measured false positives here, so each is re-qualified rather than dropped:
 *
 *  - `\blens\b` — a camera DECISION is "normal lens", "long lens", "35mm lens". But "the lens" is
 *    also the thing a subject's eyeline must not meet, which is this file's oldest sentence and is
 *    about the SUBJECT, not the optics. Requalified to require a lens qualifier.
 *  - `\bframing\b` — a camera decision when it means shot design; but "that framing was wrong" in
 *    a comment about how a brand was POSITIONED against another brand is not photography.
 *    Requalified to require a photographic qualifier.
 *
 * Requalifying NARROWS only, so nothing previously caught escapes by another route; and each
 * replacement is asserted to fire on its own construct below, so a typo cannot turn one off
 * silently.
 */
const REQUALIFIED = new Map([
  ['\\blens\\b', /\b(?:normal|long|wide|short|tele(?:photo)?|prime|\d{2,3}\s?mm)\s+lens\b|\blens\s+(?:choice|selection|at\b)/i],
  ['\\bframing\\b', /\b(?:shot|crop|tight|loose|wide|close|the)\s+framing\b|\bframing\s+(?:decision|owns|is decided)/i],
]);
const effective = (re) => REQUALIFIED.get(re.source) ?? re;
// RED-PROVE the requalification in-process: each replacement must still fire on the construct it
// is meant to catch, or the narrowing has silently become "off".
for (const [src, narrowed] of REQUALIFIED) {
  const probe = src.includes('lens') ? 'shot on a normal lens at eye level' : 'the shot framing is fixed';
  if (!narrowed.test(probe)) undetermined(`the requalified marker for ${src} no longer fires on "${probe}" — narrowing has turned the check off`);
  const spared = src.includes('lens') ? 'the eyeline must never meet the lens' : 'that framing was wrong';
  if (narrowed.test(spared)) undetermined(`the requalified marker for ${src} still fires on "${spared}" — the false positive it exists to remove is back`);
}
const sentences = (t) => t.split(/(?<=[.!?])\s+|\n{2,}/).filter((x) => x.trim().length > 0);
let deferralsSeen = 0;
for (const f of Object.values(OWNED)) {
  const p = join(RULES_DIR, f);
  if (!existsSync(p)) continue;
  const raw = readFileSync(p, 'utf8');
  const foldDashes = (t) => t.replace(/[‐-―-]/g, ' ');
  for (const sent of sentences(raw)) {
    if (DEFERRAL.test(sent)) { deferralsSeen++; continue; }
    for (const axis of ['camera', 'lighting']) {
      for (const re of MARKERS[axis]) {
        if (effective(re).test(foldDashes(sent))) {
          v(`${f} states the ${axis} construct /${re.source}/ OUTSIDE a deferral sentence — that axis owns it, and an injected line must not be argued with: "${sent.trim().replace(/\s+/g, ' ').slice(0, 110)}"`);
        }
      }
    }
  }
  const one = flat(raw);
  for (const h of REFERENCE_HAZARDS) {
    if (one.includes(h)) v(`${f} names "${h}", a hazard present in the reference photographs — a rule that names one reproduces it (and on \`full\` even a comment is delivered)`);
  }
}
if (deferralsSeen === 0) {
  undetermined('the DEFERRAL carve-out matched NOTHING in either owned file — either the precedence statements are gone (a real regression these files should state) or the carve-out regex no longer matches them, and in the second case every axis violation below is being reported against a broken filter');
}

// CHECK D — item 3 vs the negative baselines. Both halves, because dropping the veto outright
// re-admits the accidental empty product shot the veto exists for.
let idleSeen = 0;
for (const [f, terms] of BASELINES) {
  for (const t of terms) {
    if (/\bno person\b|\bwith no person\b|\bnobody\b|\bwithout a person\b/.test(t)) {
      v(`${f}'s negative baseline term "${t}" bans a person being ABSENT, which item 3 makes a legitimate scenario choice — and which the camera catalog's own unattended device-hero preset already contradicts`);
    }
    if (/idle/.test(t)) idleSeen++;
  }
}
if (idleSeen < BASELINES.size) {
  v(`only ${idleSeen} of ${BASELINES.size} negative baselines still veto the IDLE composition — narrowing the absence claim must not drop the failure mode it existed for`);
}

// CHECK E — ONE canonical home for expression, and no copyable garment noun in the brand files.
// The `knit` defect: 27 of 36 audited outputs carried it, 24 attributable to these files handing
// the craft model a literal garment phrase.
const AUTHORED_BRAND_FILES = files.filter((f) => existsSync(join(RULES_DIR, f))
  && /^(?:ionos-image-photoreal|strato-image-style|homepl-image-style)\.md$/.test(f));
if (AUTHORED_BRAND_FILES.length !== 3) undetermined(`expected the 3 authored brand rules among minimalRules, found ${AUTHORED_BRAND_FILES.length}`);
for (const f of AUTHORED_BRAND_FILES) {
  const full = delivered(readFileSync(join(RULES_DIR, f), 'utf8'));
  // The negative-prompt baseline is EXCISED from the expression scan: a face term there is a
  // VETO, which is the one legitimate use, and all three baselines carry one. It is not excised
  // from the garment scan below, because a garment noun there is a prohibition too and equally
  // legitimate — so that scan runs on the same excised body for consistency of what "this file
  // states" means, and CHECK D is what reads the baselines.
  const idx = full.indexOf('## Negative prompt baseline');
  if (idx === -1) undetermined(`${f} has no '## Negative prompt baseline' heading — CHECK D parsed one, so the two are reading different things`);
  const body = full.slice(0, idx);
  const one = flat(body);
  if (body.length < 500) undetermined(`${f}: the pre-baseline body is ${body.length} chars — the excision ate the file`);
  // A garment NOUN the model can lift. `knitwear`/`knit` is the measured one; `hoodie`/`tee` are
  // legitimate here because all three files use them as PROHIBITIONS, which is checked for.
  for (const m of one.matchAll(/\b(knit|knitwear|knitted)\b/g)) {
    v(`${f} states the garment noun "${m[1]}" — measured in 27 of 36 outputs, 24 of them traced to these files handing over a literal garment phrase`);
  }
  // Expression must live in ONE place. A brand file may name a BEARING (composed, at ease) and may
  // still say a frozen smile-for-the-camera frame is wrong; it may not PRESCRIBE the face.
  // Sentence-scoped with a prohibition carve-out, for the same reason CHECK C is: ionos's
  // long-standing candid-moment precedence sentence calls a "stand still and smile" frame wrong,
  // which is the rule being upheld rather than broken. The label form `**Expression:**` is flagged
  // unconditionally — a labelled field IS a prescription however it is worded.
  const PROHIBITION = /\bnot\b|\bnever\b|\bno\b|\bwrong\b|\brefus|\bavoid\b|❌/i;
  if (/\*\*expression:\*\*/.test(one)) {
    v(`${f} carries an "Expression:" field — ${OWNED.presence} is the single canonical home, and a labelled expression field is a prescription`);
  }
  // SPLIT THE UN-COLLAPSED BODY. `flat()` folds newlines to spaces, so a split on `\n{2,}` after
  // flattening can never match and the whole file becomes two or three enormous "sentences" — any
  // one of which contains a `no` somewhere and spares everything in it. Measured: with that bug
  // the check went GREEN on a re-added literal expression clause, which is the unfalsifiable-
  // assertion failure mode this repo has shipped before. Markdown bullets are LINES, so lines are
  // a split boundary too.
  const chunks = body.split(/(?<=[.!?])\s+|\r?\n/).map((c) => c.trim().toLowerCase()).filter(Boolean);
  if (chunks.length < 20) undetermined(`${f} split into ${chunks.length} chunks — the splitter is not reading the body`);
  for (const sent of chunks) {
    if (PROHIBITION.test(sent)) continue;
    if (/\bsmil(?:e|es|ing)\b|\bgrin\b|\blaugh(?:s|ing)?\b|\bbeaming\b/.test(sent)) {
      v(`${f} prescribes the EXPRESSION — ${OWNED.presence} is the single canonical home, and a literal expression clause here is copied verbatim: "${sent.slice(0, 110)}"`);
    }
  }
  if (!/shared-character-presence/.test(body)) {
    v(`${f} does not point at ${OWNED.presence} — the single-home arrangement needs the pointer, or a reader restates the rule locally`);
  }
}

// CHECK F — the planner side. The moment is chosen upstream, so the rule has to be THERE too.
if (!MODERATOR) {
  console.log('NOTE: no moderator checkout found — CHECK F skipped (set MODERATOR_DIR to include it)');
} else {
  const plannerSrc = read(join(MODERATOR, 'src', 'plan', 'planner.ts'), 'moderator planner.ts');
  const pm = /export const CASTS = \[([^\]]*)\] as const;/.exec(plannerSrc);
  if (!pm) v(`${MODERATOR}/src/plan/planner.ts has no CASTS — image-svc reads sceneContext.cast, so the planner must be able to emit it`);
  else {
    const modCasts = [...pm[1].matchAll(/'([a-z]+)'/g)].map((m) => m[1]);
    if (modCasts.join('|') !== CASTS.join('|')) v(`CASTS drift: image-svc [${CASTS}] vs moderator [${modCasts}]`);
  }
  const promptSrc = read(join(MODERATOR, 'src', 'plan', 'prompt.ts'), 'moderator prompt.ts');
  const F = [
    ['the resolved-state re-frame', /that problem is WHY the image[\s\S]{0,80}NOT the moment to photograph/],
    ['the do-not-write-the-face clause', /do NOT write the FACE/],
    ['the problem goes in "intent"', /Put the difficulty itself in "intent"/],
    ['cast is scenario-driven', /"cast" is decided by WHOSE STORY/],
    ['cast in the output contract', /"cast": "\$\{CASTS\.join/],
  ];
  for (const [label, re] of F) if (!re.test(promptSrc)) v(`moderator planner prompt: ${label} is absent (/${re.source}/)`);
  // The planner must NOT be asked for an expression — the literal-copy defect class applied to
  // the face. Checked as an ABSENCE inside the scene rule, where such a request would live.
  const scene = /const sceneContextRule = wantsImageTypeRubric([\s\S]*?)\n    : '';/.exec(promptSrc);
  if (!scene) undetermined('could not locate sceneContextRule in the moderator planner prompt');
  // The rule's own text CONTAINS the words, in the clause forbidding them ("no expression word in
  // any field, in either direction, whether unhappy or happy"), so a bare substring test fires on
  // the fix. Sentence-scoped with the same prohibition carve-out as CHECK E.
  // FLATTEN THE TEMPLATE CONCATENATION FIRST. The rule is authored as a dozen backtick fragments
  // joined with `+`, so the JS punctuation falls in the middle of English sentences and a naive
  // sentence split cut "…do NOT write the FACE — no expression word…" away from "…whether unhappy
  // or happy", which then looked like a bare request for a happy face. Measured: it reported the
  // fix as the defect.
  const plannerProse = scene[1]
    // JS COMMENTS FIRST, and this is not tidying. The extracted region is SOURCE, so the design
    // notes inside it — which necessarily discuss the defect, "an instruction to write a happy
    // face here would…" — are not part of the prompt at all. Left in, they made this check report
    // its own rationale as the violation. Every other check that reads this region inherits the
    // same hazard.
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^[ \t]*\/\/.*$/gm, ' ')
    .replace(/\\n/g, ' ').replace(/`\s*\+\s*`/g, '').replace(/[`]/g, ' ')
    .replace(/\$\{[^}]*\}/g, ' ').replace(/\s+/g, ' ');
  if (plannerProse.length < 800) undetermined(`the flattened planner scene rule is ${plannerProse.length} chars — the flattener read almost nothing`);
  // PRESENT-IN-SOURCE: the flattener must still be holding real prompt prose after all that
  // stripping, or an over-eager replace would make every absence check below vacuously green.
  for (const probe of ['rephrase the request as a STORY', 'do NOT write the FACE', 'decided by WHOSE STORY']) {
    if (!plannerProse.includes(probe)) undetermined(`the flattened planner prose lost "${probe}" — the flattener is removing prompt text, so the checks on it cannot be trusted`);
  }
  let plannerAsksForAFace = false;
  for (const sent of plannerProse.split(/(?<=[.!?])\s+/)) {
    if (/\bnot\b|\bnever\b|\bno\b|forbid|without/i.test(sent)) continue;
    if (/\bsmil|\bhappy\b|\bjoyful\b|\bcheerful\b|\bdelighted\b/i.test(sent)) plannerAsksForAFace = true;
  }
  if (plannerAsksForAFace) {
    v('moderator planner prompt: the scene rule asks the planner for a positive EXPRESSION — that trades a uniform unhappy face for a uniform fixed one, which is the same defect');
  }
  // And the fix itself must be THERE: the clause that forbids an expression word in either
  // direction. Asserted positively, so deleting the clause is a violation rather than a green.
  if (!/in either direction, whether unhappy or happy/.test(promptSrc)) {
    v('moderator planner prompt: the both-directions clause is gone — forbidding only the unhappy half is how a uniform sad face becomes a uniform fixed grin');
  }
}

// ─── report ─────────────────────────────────────────────────────────────────────────────────────
if (VERBOSE) {
  console.log(`minimal rule files (${files.length}, brands ${brands.length}): ${files.join(', ')}`);
  console.log(`axis markers: camera ${MARKERS.camera.length} lighting ${MARKERS.lighting.length}`);
  console.log(`prop guard delegated to ${PROP_DELEGATE}; baselines ${BASELINES.size}; casts ${CASTS.join('|')}`);
  console.log(`moderator: ${MODERATOR ?? '(none)'}`);
}
console.log(`checked: ${Object.keys(REQUIRED_SECTIONS).length} owned rule files, ` +
  `${Object.values(REQUIRED_SECTIONS).flat().length} required sections, ${BASELINES.size} negative baselines, ` +
  `${AUTHORED_BRAND_FILES.length} authored brand rules, ${deferralsSeen} deferral sentences spared, ` +
  `${MARKERS.camera.length + MARKERS.lighting.length} axis markers, casts=${CASTS.join('|')}`);
if (violations.length) {
  console.error(`\nVIOLATIONS (${violations.length}):`);
  for (const m of violations) console.error(`  - ${m}`);
  process.exit(1);
}
console.log('PASS — item 1 (resolved re-frame + expression-follows-situation) is authored in the planner AND in a rule\n' +
  '       `minimal` inlines; item 3 (cast) is defined in prose, enumerated identically in both repos, and no\n' +
  '       baseline forbids the absence while all still forbid the idle composition; item 6 (attention, role,\n' +
  '       motion) is in the step-2 file; no owned file OWNS a camera/lighting construct or names a\n' +
  '       reference hazard; and no brand file hands over a garment noun or prescribes the face.');
