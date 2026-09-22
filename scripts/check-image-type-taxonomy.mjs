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
const allFiles = SCAN_ROOTS.flatMap((d) => walk(d)).filter((p) => /\.(md|tsx?|json)$/.test(p));
note(allFiles.length > 50, 'corpus scan found files',
  `${allFiles.length} files under ${SCAN_ROOTS.map((d) => relative(ROOT, d) + '/').join(' ')}`);

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
// 3. EVERY TYPE NAMED IN SKILL.md HAS A RULE FILE — and the reachability verdict is RECORDED.
// ---------------------------------------------------------------------------
const SKILL = join(SKILLS, 'uds-image', 'SKILL.md');
if (!existsSync(SKILL)) {
  undetermined.push('uds-image/SKILL.md missing — cannot check named types');
} else {
  const skill = flat(readFileSync(SKILL, 'utf8'));
  // Types SKILL.md points at by rule name. Both spellings, so this check survives a rename.
  const named = new Set(
    [...skill.matchAll(/(?:shared-)?image-type-([a-z-]+?)(?=[`\s.,/)]|$)/g)].map((m) => m[1]),
  );
  named.delete('detection');
  note(named.size > 0, 'SKILL.md names image-type rules', `${named.size} distinct: [${[...named].sort().join(', ')}]`);
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
  const VERDICT = join(RULES, `${prefix}detection.md`);
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
  void VERDICT;
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
const SIBLINGS = join(ROOT, '..');
const ISVC = process.env['IMAGE_SVC_ROOT'] ?? join(SIBLINGS, 'image-svc');
const MOD = process.env['MODERATOR_ROOT'] ?? join(SIBLINGS, 'uds-moderator');

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

if (isvc.err) undetermined.push(`image-svc: ${isvc.err}`);
else note(isvc.vals.length === CANONICAL.length && CANONICAL.every((t) => isvc.vals.includes(t)),
  'image-svc IMAGE_TYPES is the four canonical types', `[${isvc.vals.join(', ')}]`);

// The moderator declares it in ONE of two shapes depending on the line: a shared const
// (feature line) or the wire union (main line). Either satisfies this; NEITHER does not.
const modDecl = mod.err ? modUnion : mod;
const modWhere = mod.err ? 'payloads.ts union' : 'planner.ts IMAGE_TYPES';
if (modDecl.err) undetermined.push(`uds-moderator: ${mod.err} AND ${modUnion.err}`);
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
if (checks.length < 15) {
  console.error(`CANNOT DETERMINE: only ${checks.length} checks executed`);
  process.exit(2);
}
if (VERBOSE) for (const c of checks) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.label} — ${c.detail}`);
console.log(`checked ${checks.length} properties · naming line "${prefix}*" · ${typeSlugs.length} type rules · ${allFiles.length} files scanned across ${SCAN_ROOTS.length} roots`);
for (const u of undetermined) console.error(`UNDETERMINED: ${u}`);
if (problems.length) { for (const p of problems) console.error(`VIOLATION: ${p}`); process.exit(1); }
if (undetermined.length) process.exit(2);
console.log('green');
process.exit(0);
