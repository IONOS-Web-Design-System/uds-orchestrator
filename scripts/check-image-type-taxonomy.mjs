#!/usr/bin/env node
/**
 * Guard — the image-type taxonomy is EXACTLY FOUR types, everywhere, with no retired type
 * surviving anywhere a model can read it, and no type named without a rule behind it.
 *
 * WHY THIS SCRIPT EXISTS. The taxonomy had drifted into four DIFFERENT shapes at once, each in a
 * place that could not see the others:
 *   - image-svc main declared `['portrait','avatar','scene','scenario']`;
 *   - image-svc's feature branch declared `['device-focused','portrait','avatar','scene']`;
 *   - uds-moderator's wire type declared a third list as a bare TS union with no shared constant;
 *   - and this corpus shipped FIVE rule files, one of which (`person-scenario`) had no enum entry
 *     in any repo and was referenced by nothing — measured at 0 mentions across 1502 production
 *     craft prompts — while `scene` and `person-scenario` shared six of seven trigger strings and
 *     then stated OPPOSITE face rules ("non-negotiable, 100% visible, if the face is cut off the
 *     image fails" against "no hard face requirement"). That is a contradiction handed to one
 *     model in one prompt, not a redundancy.
 * The four canonical types are `device-focused`, `portrait`, `avatar`, `scene`. `scenario` and
 * `person-scenario` are RETIRED.
 *
 * WHY THE RETIRED-NAME CHECK IS NOT A SEARCH FOR THE WORD "scenario". "scenario" is ordinary
 * vocabulary in this corpus — `shared-scenario-props`, `shared-lighting-by-scenario`, "fit the
 * device into a natural scenario". A guard that forbade the word would be red on arrival and
 * would be deleted within a day. So it forbids the TYPE TOKEN in the three forms a type actually
 * appears in: a rule-file basename, a cross-reference to that basename, and a backticked
 * `scenario` / `person-scenario` used as a type name. That distinction is the whole reason this
 * check can be both strict and green.
 *
 * WHY IT DOES NOT ASSERT THE FILES ARE REACHABLE. Measured, not assumed: `appendInlinedRules`
 * (image-svc `src/craft/skills.ts`) and `collectRuleFiles` (uds-moderator `src/plan/skills.ts`)
 * both admit a flat rule file only when its basename is `<brand>.md`, starts with `<brand>-`, or
 * starts with `shared-`. On this naming line the type rules begin with `image-type-`, so they
 * reach NEITHER prompt — confirmed at the delivered-bytes level: 0 of 1502 production craft
 * prompts contain any of their bodies, and none appears in any prompt's `### Inlined rule:`
 * manifest. That is the CURRENT DELIBERATE STATE and the reason the check below is that every
 * named type has a rule FILE, plus a recorded reachability verdict — not that the file is
 * inlined. Renaming them to `shared-*` to change that is a ~42 KB addition to every craft prompt
 * and is a decision for a human, not a side effect of an edit; see the report accompanying this
 * commit.
 *
 * DISCIPLINE, all of it learned the hard way in this workstream:
 *   - three exit codes: 0 green, 1 violation, 2 cannot-determine. "I could not read the corpus"
 *     must never look like "the corpus is clean";
 *   - every extractor asserts it found something. 0 violations over 0 files read is not a pass;
 *   - line-based matching is avoided: a needle split across a line wrap hid from a line grep
 *     here, so every haystack is whitespace-collapsed before matching;
 *   - both naming lines are handled by DETECTION, not by a flag — this repo has two live corpus
 *     branches (`image-type-*` on the main line, `shared-image-type-*` on the feature line) and a
 *     guard that only understood one would go quiet on the other instead of red.
 *
 * Usage:
 *   node scripts/check-image-type-taxonomy.mjs            # 0 green, 1 violation, 2 cannot determine
 *   node scripts/check-image-type-taxonomy.mjs --verbose
 *
 * Env. EITHER spelling of each knob works. The two guards in this directory grew up with
 * different names for the same checkout (`*_ROOT` here, `*_DIR` in check-character-semantics),
 * and a half-set pair is how a run quietly checks FEWER properties instead of failing:
 *   IMAGE_SVC_ROOT | IMAGE_SVC_DIR   the sibling image-svc checkout
 *   MODERATOR_ROOT | MODERATOR_DIR   the sibling uds-moderator checkout
 * A knob that IS set but points nowhere is a hard cannot-determine, never a narrowed run.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERBOSE = process.argv.includes('--verbose');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = join(ROOT, 'skills');

/** The taxonomy. Order is the detection order; membership is what every enum must equal. */
const CANONICAL = ['device-focused', 'portrait', 'avatar', 'scene'];
const RETIRED = ['scenario', 'person-scenario'];

// ---------------------------------------------------------------------------
// SIBLING ROOTS. Resolved ONCE, from EITHER spelling of each knob.
//
// WHY BOTH SPELLINGS. This guard read `IMAGE_SVC_ROOT`/`MODERATOR_ROOT`; its neighbour
// `check-character-semantics.mjs` read `IMAGE_SVC_DIR`/`MODERATOR_DIR` for the same two
// checkouts. Anyone exporting one pair and running both got a run that looked like it had
// checked the siblings and had not: with the roots unresolved this script reported 34
// properties where the same corpus with roots resolved reports 38, and the only floor in the
// file (`checks.length < 15`) is nowhere near tight enough to notice a four-property hole.
// So: accept either name, and make the hole VISIBLE (`skippedForRoots`, printed in the report
// line) rather than inferable only by diffing two runs.
//
// A knob that is SET but does not resolve is a mistake, not an optional sibling: it fails
// immediately and by name, instead of narrowing.
// ---------------------------------------------------------------------------
const skippedForRoots = [];
function resolveRoot(names, fallback, label) {
  for (const n of names) {
    const raw = process.env[n];
    if (!raw) continue;
    if (!existsSync(raw)) {
      console.error(`CANNOT DETERMINE: ${n} is set to ${raw}, which does not exist — refusing to run a narrowed ${label} check`);
      process.exit(2);
    }
    return { path: raw, via: n };
  }
  return { path: fallback, via: `sibling default — no ${names.join('/')} set` };
}

const SIBLING_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ISVC_R = resolveRoot(['IMAGE_SVC_ROOT', 'IMAGE_SVC_DIR'], join(SIBLING_DIR, 'image-svc'), 'image-svc');
const MOD_R = resolveRoot(['MODERATOR_ROOT', 'MODERATOR_DIR'], join(SIBLING_DIR, 'uds-moderator'), 'uds-moderator');

// Section 7's exemption check runs before section 6's enum comparison; both read this one value.
const ISVC_PRE = ISVC_R.path;

const problems = [];
const undetermined = [];
const checks = [];
const note = (ok, label, detail) => {
  checks.push({ ok, label, detail });
  if (!ok) problems.push(`${label} — ${detail}`);
};

/** Collapse whitespace so a needle cannot hide in a line wrap. */
const flat = (s) => s.replace(/\s+/g, ' ');

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir)) {
    const full = join(dir, e);
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

if (!existsSync(SKILLS)) {
  console.error(`CANNOT DETERMINE: no skills/ under ${ROOT}`);
  process.exit(2);
}

const RULES = join(SKILLS, 'uds-image', 'rules');
if (!existsSync(RULES)) {
  console.error(`CANNOT DETERMINE: no uds-image/rules under ${SKILLS}`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// 1. WHICH NAMING LINE. Detected from disk, so one script serves both corpus branches.
// ---------------------------------------------------------------------------
const basenames = readdirSync(RULES).filter((f) => f.endsWith('.md'));
const prefix = basenames.some((f) => f.startsWith('shared-image-type-'))
  ? 'shared-image-type-'
  : 'image-type-';
const typeFiles = basenames.filter((f) => f.startsWith(prefix)).sort();
if (typeFiles.length === 0) {
  console.error(`CANNOT DETERMINE: no ${prefix}*.md in ${RULES}`);
  process.exit(2);
}

// `detection` is a rubric file, not a type. Everything else under the prefix must BE a type.
const DETECTION = `${prefix}detection.md`;
// The brand prefixes the loaders admit, DERIVED from disk: every `<brand>-*.md` basename whose
// stem is not `shared` and not a type rule. Hardcoding the brand list here would go stale
// against image-svc's BRANDS the first time a brand is added.
const BRAND_PREFIXES = [...new Set(
  basenames
    .filter((f) => !f.startsWith('shared-') && !f.startsWith('craft-') && !f.startsWith(prefix))
    .map((f) => f.split('-')[0]),
)].sort();
const typeSlugs = typeFiles.filter((f) => f !== DETECTION).map((f) => f.slice(prefix.length, -3));

note(
  typeSlugs.length === CANONICAL.length && CANONICAL.every((t) => typeSlugs.includes(t)),
  'rule-file set is exactly the four canonical types',
  `found [${typeSlugs.join(', ')}] under ${prefix}*`,
);

// A rule file that exists but is empty would satisfy every "is present" check below.
for (const f of typeFiles) {
  const n = readFileSync(join(RULES, f), 'utf8').replace(/<!--[\s\S]*?-->/g, '').trim().length;
  note(n > 500, `${f} has a real body`, `${n} chars after comment strip`);
}

// ---------------------------------------------------------------------------
// 2. NO RETIRED TYPE SURVIVES — as a filename, a cross-reference, or a backticked type token.
//    Scanned over EVERY skills file, because a retired type reached five files in three skills.
// ---------------------------------------------------------------------------
// `commands/` and `docs/` are scanned too, not just `skills/`. Found by sweeping after the
// corpus was clean: `commands/imagine.md` listed the rule files to read as "(`avatar`,
// `portrait`, `person-scenario`, `scenario`)" — BOTH retired names, in a file the /imagine agent
// reads directly. A guard scoped to the corpus would have called that green.
const SCAN_ROOTS = ['skills', 'commands', 'docs', 'internal']
  .map((d) => join(ROOT, d))
  .filter((d) => existsSync(d));
// PLUS the model-readable files at the repo ROOT, which no directory root covers. `CLAUDE.md` is
// read by an agent working in this repo and `README.md` by anyone extending the corpus; both are
// exactly the kind of file `commands/imagine.md` turned out to be — outside the corpus, read
// directly, and invisible to a guard scoped to directories. Clean today; that is the point of
// checking before it is not.
const ROOT_FILES = ['CLAUDE.md', 'README.md', 'version.txt']
  .map((f) => join(ROOT, f))
  .filter((f) => existsSync(f));
const allFiles = [...SCAN_ROOTS.flatMap((d) => walk(d)), ...ROOT_FILES]
  .filter((p) => /\.(md|tsx?|json|txt)$/.test(p));
note(allFiles.length > 50 && ROOT_FILES.length > 0, 'corpus scan found files',
  `${allFiles.length} files under ${SCAN_ROOTS.map((d) => relative(ROOT, d) + '/').join(' ')} plus ${ROOT_FILES.length} repo-root file(s)`);

for (const r of RETIRED) {
  const fname = `${prefix}${r}.md`;
  note(!existsSync(join(RULES, fname)), `${fname} is gone`, existsSync(join(RULES, fname)) ? 'still on disk' : 'absent');
}

const retiredHits = [];
for (const p of allFiles) {
  const body = flat(readFileSync(p, 'utf8'));
  const rel = relative(ROOT, p);
  for (const r of RETIRED) {
    // (a) a cross-reference to the retired rule file, under EITHER naming line — a rename on one
    //     branch must not let the other branch's spelling slip through.
    for (const pfx of ['image-type-', 'shared-image-type-']) {
      if (body.includes(`${pfx}${r}`)) retiredHits.push(`${rel}: references \`${pfx}${r}\``);
    }
    // (b) the backticked type token. `person-scenario` is matched first and its hit consumed, so
    //     it cannot also be counted as a `scenario` hit — the substring trap.
    const tok = '`' + r + '`';
    if (body.includes(tok)) retiredHits.push(`${rel}: uses the retired type token ${tok}`);
    // (c) the enum literal, in a corpus that also carries .ts templates.
    for (const q of ["'", '"']) {
      if (new RegExp(`imageType[^;\\n]{0,40}${q}${r}${q}`).test(body)) {
        retiredHits.push(`${rel}: imageType literal ${q}${r}${q}`);
      }
    }
  }
}
// `person-scenario` contains `scenario`: a file mentioning only the former would report both.
// Drop the shadowed duplicate so the count is honest about what is actually wrong.
const deduped = retiredHits.filter((h, i, a) => {
  if (!h.includes('`scenario`') && !h.includes('-scenario')) return true;
  const shadow = h.replace('`scenario`', '`person-scenario`').replace(/(?<!person-)scenario/, 'person-scenario');
  return !(a.includes(shadow) && shadow !== h && a.indexOf(shadow) < i);
});
note(deduped.length === 0, 'no retired type token anywhere in the repo',
  deduped.length ? deduped.join(' | ') : `${RETIRED.length} retired names checked against ${allFiles.length} files`);

// ---------------------------------------------------------------------------
// 3. EVERY TYPE NAMED IN SKILL.md HAS A RULE FILE, AND EVERY RULE FILE IS A NAMED TYPE.
//    THE MATCH IS ON THE TYPE NAME, NOT ON THE RULE BASENAME. It used to be on the basename,
//    and that is exactly what made this check go red the moment the dangling `image-type-*`
//    POINTERS were removed from SKILL.md (see section 7): the four types were still named, as
//    the bare type names they are, and a guard keyed to the basename read that as "no type is
//    named". The taxonomy is a set of TYPE NAMES; which file carries each one is section 1's
//    business and the loaders'.
// ---------------------------------------------------------------------------
const SKILL = join(SKILLS, 'uds-image', 'SKILL.md');
if (!existsSync(SKILL)) {
  undetermined.push('uds-image/SKILL.md missing — cannot check named types');
} else {
  const skill = flat(readFileSync(SKILL, 'utf8'));
  // Either spelling of a rule reference, AND the bare backticked type name. Both count as
  // "SKILL.md names this type", so this survives the pointer removal and a future rename alike.
  const named = new Set(
    [...skill.matchAll(/(?:shared-)?image-type-([a-z-]+?)(?=[`\s.,/)]|$)/g)].map((m) => m[1]),
  );
  for (const t of CANONICAL) if (skill.includes('`' + t + '`')) named.add(t);
  named.delete('detection');
  note(named.size > 0, 'SKILL.md names the image types', `${named.size} distinct: [${[...named].sort().join(', ')}]`);
  const orphans = [...named].filter((t) => !typeSlugs.includes(t));
  note(orphans.length === 0, 'every type SKILL.md names has a rule file on disk',
    orphans.length ? `no rule for: ${orphans.join(', ')}` : `all ${named.size} resolve`);
  const unnamed = typeSlugs.filter((t) => !named.has(t));
  note(unnamed.length === 0, 'every rule file on disk is named by SKILL.md',
    unnamed.length ? `never named: ${unnamed.join(', ')}` : `all ${typeSlugs.length} named`);

  // THE REACHABILITY VERDICT. `shared-` is the prefix both loaders admit; `image-type-` is not.
  // Whichever line this corpus is on, the verdict must be STATED, because "unreachable" is a
  // deliberate choice here and an undocumented one is indistinguishable from a bug.
  const reachable = prefix.startsWith('shared-');
  if (reachable) {
    note(true, 'type rules are REACHABLE by the prefix loaders', `basenames begin with "shared-"`);
  } else {
    // Documented-as-unreachable: SKILL.md must not tell the model to apply a rule "from the
    // skill above" when no such rule is above it. That pointer was one of 15.14 dangling
    // `image-type-*` mentions per production craft prompt, measured over 1502 prompts.
    const dangling = /apply the .{0,4}(?:shared-)?image-type-.{0,30}rule from the skill above/i.test(skill);
    note(!dangling, 'no "apply the rule from the skill above" pointer while the rules are unreachable',
      dangling ? 'SKILL.md points at a rule the prefix loaders exclude' : 'no such pointer in SKILL.md');
    note(true, 'type rules are NOT reachable by the prefix loaders (deliberate)',
      `basenames begin with "${prefix}", which neither appendInlinedRules nor collectRuleFiles admits`);
  }
}

// ---------------------------------------------------------------------------
// 4. THE FACE-RULE CONTRADICTION STAYS SETTLED. `scene` absorbed `person-scenario`, whose face
//    rule was its exact opposite. The permissive rule is the one that survives; the strict
//    technique is conditional. A future edit that re-promotes the absolute is the regression.
// ---------------------------------------------------------------------------
const sceneFile = join(RULES, `${prefix}scene.md`);
if (!existsSync(sceneFile)) {
  undetermined.push(`${prefix}scene.md missing — cannot check the face rule`);
} else {
  const scene = flat(readFileSync(sceneFile, 'utf8').replace(/<!--[\s\S]*?-->/g, ''));
  note(/no hard face requirement/i.test(scene), 'scene keeps the permissive face rule',
    /no hard face requirement/i.test(scene) ? 'found' : 'the permissive rule is gone');
  const ABSOLUTES = [
    'face rule (non-negotiable)',
    'if the face is cut off, the image fails',
    "face must be 100% visible",
  ];
  for (const a of ABSOLUTES) {
    const hit = scene.toLowerCase().includes(a.toLowerCase());
    if (hit) note(false, 'scene re-promoted an absolute face rule', `contains "${a}"`);
  }
  note(true, 'scene absolute-face scan', `${ABSOLUTES.length} phrases checked`);
}

// ---------------------------------------------------------------------------
// 5. AVATAR IS DEFINED BY USE AND CROP, NOT BY POSE OR FACE VISIBILITY.
//    Both previous definitions got this wrong in opposite ways — one required a face "always
//    clearly visible", the other forbade action outright. Both are the regression to catch.
// ---------------------------------------------------------------------------
const avatarFile = join(RULES, `${prefix}avatar.md`);
if (!existsSync(avatarFile)) {
  undetermined.push(`${prefix}avatar.md missing — cannot check the definition`);
} else {
  const av = flat(readFileSync(avatarFile, 'utf8').replace(/<!--[\s\S]*?-->/g, ''));
  const avl = av.toLowerCase();
  // The two withdrawn claims, in the words each version actually used.
  const WITHDRAWN = [
    'the face is always clearly visible and identifiable',
    'face rule (non-negotiable)',
    'must be 100% visible in every avatar',
    'no meaningful environment, no action',
  ];
  for (const w of WITHDRAWN) {
    if (avl.includes(w.toLowerCase())) note(false, 'avatar re-states a withdrawn claim', `contains "${w}"`);
  }
  note(true, 'avatar withdrawn-claim scan', `${WITHDRAWN.length} phrases checked`);
  // And the two things the new definition must positively say.
  note(/profile picture/i.test(av) && /thumbnail/i.test(av), 'avatar is defined by its destination',
    'names the profile-picture / thumbnail destination');
  note(/mid-action|may be mid-task|action is allowed/i.test(av), 'avatar permits action',
    /mid-action|may be mid-task|action is allowed/i.test(av) ? 'found' : 'nothing permits action');
  note(/turned|shadow|occluded|obscured/i.test(av), 'avatar permits a face that is not fully visible',
    /turned|shadow|occluded|obscured/i.test(av) ? 'found' : 'nothing permits a non-visible face');
}

// ---------------------------------------------------------------------------
// 5b. THE DETECTION RUBRIC, where one of the two wrong avatar definitions actually lived.
//     Found by red-proving: mutation B1 put "No meaningful environment, no action" — the feature
//     line's exact wrong wording — into the rubric and this guard stayed GREEN, because check 5
//     reads only the avatar RULE file. A definition can be withdrawn in one file and reinstated in
//     the file that decides which file gets read, which is the more consequential of the two.
//     The rubric is OPTIONAL (the main line puts detection in `shared-image-principles.md`
//     instead), so absence is not a violation — but wherever it lives, it is scanned.
// ---------------------------------------------------------------------------
// Exactly ONE file is THE rubric — the dedicated detection file where a line has one, else
// `shared-image-principles.md`, which is where the other line keeps the ordered rubric. The
// positive "decides avatar by destination" check applies to THAT file only. Red-proving showed why
// the distinction matters: applied to every candidate it fired on the feature line's
// `shared-image-principles.md`, which merely LISTS the four type names and delegates the rubric to
// the detection file. A guard that demands a definition from a file whose job is to point
// elsewhere is red on arrival, and a guard that is red on arrival gets deleted.
const RUBRIC = existsSync(join(RULES, DETECTION))
  ? join(RULES, DETECTION)
  : join(RULES, 'shared-image-principles.md');
// The NEGATIVE scan is wider: a withdrawn claim is wrong in either file, and cheap to check.
const detectionFiles = [join(RULES, DETECTION), join(RULES, 'shared-image-principles.md')]
  .filter((p) => existsSync(p));
note(existsSync(RUBRIC), 'the detection rubric exists', `${relative(ROOT, RUBRIC)}${detectionFiles.length > 1 ? ` (scanning ${detectionFiles.length} files for withdrawn claims)` : ''}`);
// The withdrawn claims, in the words each previous version used, scanned across every file that
// decides the classification.
const WITHDRAWN_ANYWHERE = [
  'the face is always clearly visible and identifiable',
  'no meaningful environment, no action',
  'face rule (non-negotiable)',
  'must be 100% visible in every avatar',
];
for (const f of detectionFiles) {
  const body = flat(readFileSync(f, 'utf8').replace(/<!--[\s\S]*?-->/g, '')).toLowerCase();
  for (const w of WITHDRAWN_ANYWHERE) {
    if (body.includes(w.toLowerCase())) {
      note(false, 'the detection rubric re-states a withdrawn avatar claim', `${relative(ROOT, f)} contains "${w}"`);
    }
  }
}
{
  // The positive claim, against THE rubric only.
  const body = flat(readFileSync(RUBRIC, 'utf8').replace(/<!--[\s\S]*?-->/g, ''));
  const ok = /profile picture|thumbnail/i.test(body);
  note(ok, 'the detection rubric decides avatar by DESTINATION',
    `${relative(ROOT, RUBRIC)} ${ok ? 'names the profile-picture / thumbnail destination' : 'classifies avatar without naming its destination'}`);
}
note(true, 'detection-rubric withdrawn-claim scan',
  `${WITHDRAWN_ANYWHERE.length} phrases checked against ${detectionFiles.length} rubric file(s)`);

// ---------------------------------------------------------------------------
// 6. THE TWO IMAGE_TYPES DECLARATIONS AGREE — checked here too, because this repo has no
//    package.json and therefore no test run of its own. Sibling checkouts are OPTIONAL: absent
//    they are reported, never silently skipped, and never counted as agreement.
// ---------------------------------------------------------------------------
const ISVC = ISVC_R.path;
const MOD = MOD_R.path;

function readTypeList(file, patterns) {
  if (!existsSync(file)) return { err: `${file} not found` };
  const src = readFileSync(file, 'utf8');
  for (const re of patterns) {
    const m = re.exec(src);
    if (!m) continue;
    const vals = m[1].split('|').flatMap((s) => s.split(',')).map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    if (vals.length === 0) return { err: `${file} matched ${re} but parsed to nothing` };
    return { vals };
  }
  return { err: `${file} declares no recognisable image-type list` };
}

const isvc = readTypeList(join(ISVC, 'src/validate.ts'), [/const IMAGE_TYPES = \[([^\]]*)\] as const;/]);
const mod = readTypeList(join(MOD, 'src/plan/planner.ts'), [/const IMAGE_TYPES = \[([^\]]*)\] as const;/]);
const modUnion = readTypeList(join(MOD, 'src/orchestrate/payloads.ts'), [/imageType\?:\s*((?:'[a-z-]+'\s*\|?\s*)+);/]);

if (isvc.err) {
  skippedForRoots.push('image-svc IMAGE_TYPES (+ the two-declaration agreement)');
  undetermined.push(`image-svc: ${isvc.err} — root came from ${ISVC_R.via}; set IMAGE_SVC_ROOT or IMAGE_SVC_DIR`);
}
else note(isvc.vals.length === CANONICAL.length && CANONICAL.every((t) => isvc.vals.includes(t)),
  'image-svc IMAGE_TYPES is the four canonical types', `[${isvc.vals.join(', ')}]`);

// The moderator declares it in ONE of two shapes depending on the line: a shared const
// (feature line) or the wire union (main line). Either satisfies this; NEITHER does not.
const modDecl = mod.err ? modUnion : mod;
const modWhere = mod.err ? 'payloads.ts union' : 'planner.ts IMAGE_TYPES';
if (modDecl.err) {
  skippedForRoots.push('uds-moderator IMAGE_TYPES (+ the two-declaration agreement)');
  undetermined.push(`uds-moderator: ${mod.err} AND ${modUnion.err} — root came from ${MOD_R.via}; set MODERATOR_ROOT or MODERATOR_DIR`);
}
else {
  note(modDecl.vals.length === CANONICAL.length && CANONICAL.every((t) => modDecl.vals.includes(t)),
    `uds-moderator ${modWhere} is the four canonical types`, `[${modDecl.vals.join(', ')}]`);
  if (!isvc.err) {
    const same = isvc.vals.length === modDecl.vals.length && isvc.vals.every((v, i) => v === modDecl.vals[i]);
    note(same, 'the two IMAGE_TYPES declarations agree (membership AND order)',
      same ? `both [${isvc.vals.join(', ')}]` : `image-svc [${isvc.vals.join(', ')}] vs moderator ${modWhere} [${modDecl.vals.join(', ')}]`);
  }
}


// ---------------------------------------------------------------------------
// 7. NO UNRESOLVABLE TYPE-RULE REFERENCE IN ANY DELIVERABLE FILE.
//
//    WHY THIS IS A NAME-FREE RULE AND NOT A PER-RUN SIMULATION. A craft prompt delivers AT MOST
//    ONE type rule body, and which one depends on the run's `imageType` (image-svc
//    `resolveRuleSet`: `if (imageType) img('shared-image-type-<type>.md') else img(detection)`).
//    On the other naming line it delivers NONE, because `image-type-*` fails both loaders'
//    prefix test. So a `(shared-)?image-type-<slug>` token written into any DELIVERABLE file is
//    unresolvable on at least three runs in four, and on every run on the other line. There is
//    no run-dependent exemption to compute: the token simply must not be there.
//    MEASURED, not reasoned. Over the real assembled craft prompt (image-svc `buildCraftPrompt`,
//    72 cells = 2 brands x 3 profiles x 3 modules x 4 types on the feature line, 24 on the main
//    line) the counts before this check existed were 16 per ionos prompt and 18 per strato prompt
//    on the main line with ZERO type-rule bodies delivered, and 11-15 per prompt on the feature
//    line's `full` profile with exactly one body delivered. Production agrees: 15.14 mean over
//    1502 recorded craft prompts, 15 or 16 in every single one, 0 bodies ever delivered.
//
//    WHAT A DELIVERABLE FILE IS. SKILL.md, plus any rule whose basename the prefix loaders admit
//    (`shared-*`, `<brand>*`), plus `craft-*` — the feature line's `minimal` profile names those
//    explicitly. The camera/lighting/environment catalogs are deliverable by basename but are
//    read line-at-a-time in code and never inlined, so a reference in their HEADER cannot reach a
//    model; their bodies are still checked.
//
//    COMMENTS ARE NOT EXEMPT, and that is the point. `loadSkillRules` strips HTML comments ONLY
//    when the caller passes `stripComments`, which only the `minimal` profile does. Measured on
//    the assembled `full` prompt: 16,162 chars of author comments reach the model on ionos
//    (19.9% of the prompt) and 14,237 on strato. A forensics note that names a rule file is
//    therefore a dangling pointer in the delivered bytes, not an aside to a human.
// ---------------------------------------------------------------------------
// Files whose HTML COMMENTS provably cannot reach a model, so only their BODY is swept.
//   shared-camera-* / shared-lighting* / shared-environment-* — read line-at-a-time in code
//     (image-svc `resolveAxis`/`resolveCamera`/`resolveEnvironment`) and listed in
//     `skills.coverage.test.ts`'s INTENTIONALLY_UNSELECTED, so the file is never inlined at all.
//   craft-* — delivered ONLY through `buildCraftPrompt`'s thin-profile branch, which passes
//     `stripComments: brief.craftProfile === 'minimal'`; `profileRules` returns [] for `none`, so
//     `minimal` is the only profile that delivers a craft-* file and it strips the comments.
// THE EXEMPTION IS ITSELF GUARDED below (`comment-strip exemption still holds`) — an exemption
// whose premise has gone stale is worse than no exemption, because it reads as a pass.
const COMMENTS_NEVER_DELIVERED = /^(shared-(camera|lighting|environment)|craft-)/;
const deliverable = (f) =>
  f.startsWith('shared-') || f.startsWith('craft-') || BRAND_PREFIXES.some((b) => f.startsWith(b));
const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, '');
const REF_RE = new RegExp(`(?:shared-)?image-type-([a-z][a-z-]*)`, 'g');
const badRefs = [];
let refFilesRead = 0;
{
  // SKILL.md first, then every deliverable rule file.
  const targets = [['uds-image/SKILL.md', readFileSync(SKILL, 'utf8')]];
  for (const f of basenames.filter(deliverable)) {
    let body = readFileSync(join(RULES, f), 'utf8');
    // A catalog's header comment is never delivered (read line-at-a-time in code); its BODY is
    // still subject to the rule, so only the comments are dropped for those files.
    if (COMMENTS_NEVER_DELIVERED.test(f)) body = stripComments(body);
    targets.push([`uds-image/rules/${f}`, body]);
  }
  for (const [rel, body] of targets) {
    refFilesRead++;
    const self = rel.split('/').pop().replace(/\.md$/, '');           // a type rule may name itself
    const hay = flat(body);
    for (const m of hay.matchAll(REF_RE)) {
      const slug = m[1];
      const tok = m[0];
      if (rel.endsWith(`${prefix}${slug}.md`)) continue;              // self-reference inside its own file
      if (self === tok) continue;
      badRefs.push(`${rel}: \`${tok}\``);
    }
  }
}
note(refFilesRead > 5, 'reference sweep read the deliverable corpus', `${refFilesRead} deliverable files`);
{
  // The craft-* half of the exemption above, checked against the code that implements it.
  // Sibling checkout OPTIONAL: absent it is reported, never silently treated as holding.
  const promptTs = join(ISVC_PRE, 'src/craft/prompt.ts');
  const profilesTs = join(ISVC_PRE, 'src/craft/profiles.ts');
  // Only checked when the exemption is actually EXERCISED. The main naming line ships no
  // `craft-*` file and its image-svc has no `profiles.ts` at all, so demanding the premise there
  // is a cannot-determine for an exemption nothing uses — and a guard that reports UNDETERMINED
  // on a corpus it has nothing to say about is the same defect as one that is red on arrival.
  const usesCraftRules = basenames.some((f) => f.startsWith('craft-'));
  if (!usesCraftRules) {
    note(true, 'comment-strip exemption not exercised on this line', 'no craft-* rule files on disk');
  } else if (!existsSync(promptTs) || !existsSync(profilesTs)) {
    skippedForRoots.push('the craft-* comment-strip exemption');
    undetermined.push(`comment-strip exemption unverifiable: no image-svc at ${ISVC_PRE} (root came from ${ISVC_R.via}; set IMAGE_SVC_ROOT or IMAGE_SVC_DIR)`);
  } else {
    const pt = flat(readFileSync(promptTs, 'utf8'));
    const gate = /stripComments\s*=\s*brief\.craftProfile\s*===\s*'minimal'/.test(pt);
    const passed = /loadSkillRules\(pluginDir, slug, rules, \{ stripComments \}\)/.test(pt);
    note(gate && passed, 'comment-strip exemption still holds (craft-* comments cannot reach a model)',
      gate && passed
        ? "prompt.ts gates stripComments on craftProfile === 'minimal' and passes it to the craft-* loader"
        : `prompt.ts no longer does: gate=${gate} passedToLoader=${passed} — craft-* comments may now be delivered, so re-scan them`);
  }
}
note(badRefs.length === 0, 'no unresolvable type-rule reference in any deliverable file',
  badRefs.length ? `${badRefs.length}: ${badRefs.slice(0, 8).join(' | ')}${badRefs.length > 8 ? ' …' : ''}`
                 : `${refFilesRead} files carry none`);

// ---------------------------------------------------------------------------
// 8. EVERY TYPE HAS A CAMERA CATALOG, AND THE AVATAR CATALOG DECLARES ITS GAP.
//
//    A camera catalog is OPTIONAL on the main naming line (it has none) — absence is reported,
//    never counted as coverage. Where the catalogs DO exist, the one property a script can check
//    is that the roster is complete and that the one catalog whose type permits a range the
//    references cannot represent SAYS SO. `shared-image-type-avatar.md` permits a face that is
//    turned, shadowed or occluded and names "in profile" and "glancing up or down" among the
//    turns to pick from; all seven `avatar-*` references — and all thirteen portrait+avatar
//    references — are eye-level frames of a visible face, so profile, over-the-shoulder and any
//    non-eye-level height are NOT authorable from the reference set. That gap is legitimate and
//    is the reason this is a DOCUMENTATION check: the failure mode is a future author quietly
//    inventing the missing presets (seven of eighteen presets across two catalogs were once
//    exactly that), or quietly claiming the axis covers the type. Either way the header stops
//    saying what it says below.
// ---------------------------------------------------------------------------
{
  const cams = CANONICAL.map((t) => [t, join(RULES, `shared-camera-${t}.md`)]);
  const present = cams.filter(([, p]) => existsSync(p));
  if (present.length === 0) {
    note(true, 'no camera catalogs on this naming line (reported, not counted as coverage)',
      `none of shared-camera-{${CANONICAL.join(',')}}.md exists`);
  } else {
    const missing = cams.filter(([, p]) => !existsSync(p)).map(([t]) => t);
    note(missing.length === 0, 'every canonical type has a camera catalog',
      missing.length ? `missing: ${missing.join(', ')}` : `all ${CANONICAL.length} present`);
    const av = join(RULES, 'shared-camera-avatar.md');
    if (!existsSync(av)) {
      undetermined.push('shared-camera-avatar.md missing — cannot check the declared gap');
    } else {
      const head = flat(readFileSync(av, 'utf8'));
      // The gap must be declared, and declared as the three things the references cannot supply.
      const declares = /WHAT THIS AXIS DOES NOT COVER/i.test(head);
      note(declares, 'the avatar camera catalog DECLARES its coverage gap',
        declares ? 'header states what the axis does not cover' : 'header claims or implies full coverage of the type range');
      for (const needle of ['in profile', 'eye level']) {
        note(head.toLowerCase().includes(needle),
          `the declared gap names "${needle}"`, head.toLowerCase().includes(needle) ? 'found' : 'absent');
      }
      // And the presets must not have grown the gap shut by invention: a preset asserting a
      // camera height other than eye level, or a strict profile, has no reference behind it.
      const body = stripComments(readFileSync(av, 'utf8'));
      const presets = [...body.matchAll(/^## (\S+)\n(.+)$/gm)].map((m) => [m[1], m[2]]);
      note(presets.length > 0, 'avatar camera presets parsed', `${presets.length} presets`);
      const invented = presets.filter(([, text]) =>
        /\b(low angle|high angle|below the subject|above the subject|strict side-on|full profile|from behind)\b/i.test(text));
      note(invented.length === 0, 'no avatar camera preset asserts a framing the references cannot supply',
        invented.length ? `invented: ${invented.map(([s]) => s).join(', ')}` : `${presets.length} presets checked`);
    }
  }
}

// ---------------------------------------------------------------------------
// 9. THE MODULE-BIAS MAPPING AGREES WITH THE TYPE DEFINITIONS.
//
//    `shared-module-bias.md` maps a downstream component to a default image type, and it is
//    DELIVERED to the craft prompt on every run that carries a module (`resolveRuleSet`:
//    `if (module) img('shared-module-bias.md')`). Two ways it can disagree with the taxonomy:
//    it can name a type that does not exist, and it can re-impose on a type a requirement that
//    type's own rule withdrew. The second is the one that actually happened: the
//    `testimonial_slider -> avatar` row used to delegate framing to the avatar rule by NAME,
//    which (a) dangles, and (b) is the place a face requirement would be reinstated.
//    Measured, so the row is known to matter: `testimonial_slider` is 194 of 1902 production
//    runs, every one of them 512x512 and mode=image — which is the avatar destination exactly.
// ---------------------------------------------------------------------------
{
  const mb = join(RULES, 'shared-module-bias.md');
  if (!existsSync(mb)) {
    undetermined.push('shared-module-bias.md missing — cannot check the module mapping');
  } else {
    const raw = readFileSync(mb, 'utf8');
    const body = flat(stripComments(raw));
    // Types the file names as a DEFAULT for some module: `image-type **<name>**` or a bolded
    // type in the type column. Matched on the type vocabulary, not on a basename.
    const claimed = CANONICAL.filter((t) => new RegExp(`image type to \\*\\*${t}\\*\\*|image-type \\*\\*${t}\\*\\*`, 'i').test(body));
    note(claimed.length > 0, 'module-bias names at least one image type as a module default',
      `[${claimed.join(', ')}]`);
    // Any type token it names must be canonical — a retired or invented one is a mapping to
    // nowhere. Section 2 already forbids the retired names; this catches an invented one.
    const tokens = [...body.matchAll(/image[- ]type(?: to)? \*\*([a-z-]+)\*\*/gi)].map((m) => m[1].toLowerCase());
    const unknown = [...new Set(tokens)].filter((t) => !CANONICAL.includes(t));
    note(unknown.length === 0, 'every image type module-bias names is canonical',
      unknown.length ? `not a type: ${unknown.join(', ')}` : `${tokens.length} mentions, all canonical`);
    // It must not re-impose a face requirement on avatar, whose own rule withdrew it.
    const reimposes = /avatar[^|]{0,400}?(visible face|face (?:must|should) be|face is (?:always|required))/i.test(body)
      && !/no face-visibility requirement|does NOT require a visible face/i.test(body);
    note(!reimposes, 'module-bias does not re-impose a face requirement on avatar',
      reimposes ? 'an avatar row demands a visible face' : 'no face demand added by the module');
  }
}

// ---------------------------------------------------------------------------
if (checks.length < 15) {
  console.error(`CANNOT DETERMINE: only ${checks.length} checks executed`);
  process.exit(2);
}
if (VERBOSE) for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label} — ${c.detail}`);
console.log(`checked ${checks.length} properties · naming line "${prefix}*" · ${typeSlugs.length} type rules · ${allFiles.length} files scanned across ${SCAN_ROOTS.length} roots`);
console.log(`  image-svc root: ${ISVC_PRE} [${ISVC_R.via}]`);
console.log(`  uds-moderator root: ${MOD} [${MOD_R.via}]`);
// COVERAGE, STATED. A narrowed run must SAY it is narrowed on the same line as its property
// count, or the count reads as full coverage to everyone who does not have the other run to
// compare it against.
if (skippedForRoots.length) {
  console.error(`NARROWED: ${skippedForRoots.length} propert${skippedForRoots.length === 1 ? 'y' : 'ies'} NOT checked because a sibling root did not resolve: ${skippedForRoots.join('; ')}`);
}
for (const u of undetermined) console.error(`UNDETERMINED: ${u}`);
if (problems.length) { for (const p of problems) console.error(`VIOLATION: ${p}`); process.exit(1); }
if (undetermined.length) process.exit(2);
console.log('green');
process.exit(0);
