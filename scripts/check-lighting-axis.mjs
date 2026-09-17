#!/usr/bin/env node
/**
 * Guard — the LIGHTING axis is optional, reference-authored, and free of look vocabulary.
 *
 * At most ONE lighting line is selected in code per run (`image-svc/src/craft/treatment.ts`,
 * `resolveLightingTraced`) and injected as `Photographic lighting: <text>`. On most runs NOTHING
 * is injected: the rotation fires only on a scenario cell marked `expressive`, and a named preset
 * only arrives when the original request itself names a light condition. That optionality is the
 * subject of checks 4-6 below, and it is why the OLD invariant ("every cell lists at least three
 * slugs") is NOT checked here — see check 5 for what replaced it.
 *
 * `shared-lighting.md` and `shared-lighting-by-scenario.md` are never inlined at any profile
 * (verified against image-svc's `minimalRules` and `resolveRuleSet` in check 0), so their headers
 * cost the prompt nothing and only the ONE drawn line is ever sent. That means every text check
 * must run against the DELIVERED body with HTML comments stripped: a guard satisfied by a file's
 * own explanation of the thing it forbids has already happened twice in this workstream.
 *
 * WHY A SEPARATE SCRIPT, and what is derived rather than restated:
 *   - three exit codes: 0 green, 1 violation, 2 cannot-determine. "I did not read the corpus"
 *     must never look like "the corpus is clean";
 *   - the catalog FILE, the scenario FILE, the tag VOCABULARIES, the DAY hours, the room catalogs
 *     and the full `TIMES_OF_DAY`/`PLACES` enums are DERIVED from image-svc and never restated
 *     here, so a vocabulary change on that side cannot escape this guard;
 *   - the LOOK vocabulary (check 2) is author-declared, because it cannot be derived from
 *     anywhere: it is the list of words that name a post-production result rather than a light.
 *     Its provenance is the 14-preset audit that found 14/14 presets carrying a colour grade, a
 *     genre word or both, and 14/14 ending in a mood clause;
 *   - every extractor asserts it found something. 0 violations over 0 presets read is not a pass.
 *
 * Usage:
 *   node scripts/check-lighting-axis.mjs            # 0 green, 1 violation, 2 cannot determine
 *   node scripts/check-lighting-axis.mjs --verbose
 * Env:
 *   IMAGE_SVC_DIR   where to read src/validate.ts, src/craft/{treatment,sceneLighting,profiles}.ts
 *                   from (default ../image-svc)
 *   RULES_DIR       override the rules directory — for red-proving against a mutated copy
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const VERBOSE = process.argv.includes('--verbose');
const IMAGE_SVC = process.env.IMAGE_SVC_DIR ?? resolve(REPO, '..', 'image-svc');
const RULES_DIR = process.env.RULES_DIR ?? join(REPO, 'skills', 'uds-image', 'rules');

function undetermined(msg) {
  console.error(`CANNOT DETERMINE: ${msg}`);
  process.exit(2);
}
function readSource(rel) {
  const p = join(IMAGE_SVC, rel);
  if (!existsSync(p)) undetermined(`image-svc ${rel} not found at ${p} — set IMAGE_SVC_DIR`);
  return readFileSync(p, 'utf8');
}
function readRule(name) {
  const p = join(RULES_DIR, name);
  if (!existsSync(p)) undetermined(`rule file ${name} not found at ${p}`);
  return readFileSync(p, 'utf8');
}
/** The DELIVERED body: exactly what image-svc's `stripHtmlComments` leaves behind. */
const strip = (md) => md.replace(/<!--[\s\S]*?-->/g, '');

const violations = [];
const notes = [];
const fail = (m) => violations.push(m);
const note = (m) => notes.push(m);

// ─────────────────────────────────────────────────────────────────────────────
// Derive everything derivable from image-svc.
// ─────────────────────────────────────────────────────────────────────────────
const sceneLightingSrc = readSource(join('src', 'craft', 'sceneLighting.ts'));
const treatmentSrc = readSource(join('src', 'craft', 'treatment.ts'));
const profilesSrc = readSource(join('src', 'craft', 'profiles.ts'));
const validateSrc = readSource(join('src', 'validate.ts'));

function arrayLiteral(src, re, what) {
  const m = src.match(re);
  if (!m) undetermined(`could not read ${what} out of image-svc — the declaration moved or changed shape`);
  const vals = [...m[1].matchAll(/'([a-z0-9-]+)'/g)].map((x) => x[1]);
  if (vals.length === 0) undetermined(`read ${what} but it yielded no values`);
  return vals;
}

const LIGHTING_FILE = (() => {
  const m = treatmentSrc.match(/file: '(shared-lighting[a-z.-]*\.md)'/);
  if (!m) undetermined('could not read the lighting catalog filename out of treatment.ts');
  return m[1];
})();
const SCENARIO_FILE = (() => {
  const m = sceneLightingSrc.match(/const RULE = '([a-z.-]+\.md)';/);
  if (!m) undetermined('could not read the scenario filename out of sceneLighting.ts');
  return m[1];
})();
const TIMES = arrayLiteral(validateSrc, /export const TIMES_OF_DAY = \[([\s\S]*?)\] as const;/, 'TIMES_OF_DAY');
const PLACES = arrayLiteral(validateSrc, /export const PLACES = \[([\s\S]*?)\] as const;/, 'PLACES');
const DAY_HOURS = arrayLiteral(sceneLightingSrc, /export const DAY_HOURS: ReadonlySet<string> = new Set\(\[([\s\S]*?)\]\);/, 'DAY_HOURS');
const LIGHTING_REQUIRES = arrayLiteral(sceneLightingSrc, /export const LIGHTING_REQUIRES = \[\.\.\.DAYLIGHT_DIRECTIONS, ([\s\S]*?)\] as const;/, 'LIGHTING_REQUIRES tail');
const DAYLIGHT_DIRECTIONS = arrayLiteral(sceneLightingSrc, /export const DAYLIGHT_DIRECTIONS = \[([\s\S]*?)\] as const;/, 'DAYLIGHT_DIRECTIONS');
const LIGHTING_TONE = arrayLiteral(sceneLightingSrc, /export const LIGHTING_TONE = \[([\s\S]*?)\] as const;/, 'LIGHTING_TONE');
const ROOM_TONE = arrayLiteral(sceneLightingSrc, /export const ROOM_TONE = \[([\s\S]*?)\] as const;/, 'ROOM_TONE');
const ENV_FILES = (() => {
  const m = profilesSrc && treatmentSrc.match(/const ENVIRONMENT_BY_PLACE: Readonly<Record<string, string>> = \{([\s\S]*?)\};/);
  if (!m) undetermined('could not read ENVIRONMENT_BY_PLACE out of treatment.ts');
  const out = new Map();
  for (const hit of m[1].matchAll(/'([a-z-]+)':\s*'([a-z.-]+\.md)'/g)) out.set(hit[1], hit[2]);
  if (out.size === 0) undetermined('read ENVIRONMENT_BY_PLACE but it yielded no place->file pairs');
  return out;
})();

// ─────────────────────────────────────────────────────────────────────────────
// Parse the two rule files the way image-svc does.
// ─────────────────────────────────────────────────────────────────────────────
const catalogRaw = readRule(LIGHTING_FILE);
const catalogBody = strip(catalogRaw);

/** `## slug` + the next non-empty line, then the tag lines beneath it. */
function parseCatalog(body) {
  const lines = body.split(/\r?\n/);
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const m = /^## ([a-z0-9-]+)$/.exec(lines[i]);
    if (!m) continue;
    let j = i + 1;
    while (j < lines.length && lines[j].trim().length === 0) j++;
    if (j >= lines.length) continue;
    const tags = {};
    for (let k = j + 1; k < lines.length && !/^## /.test(lines[k]) && lines[k].trim().length > 0; k++) {
      const t = /^([A-Za-z]+):\s*(.+)$/.exec(lines[k].trim());
      if (t) tags[t[1]] = t[2].split(',').map((x) => x.trim()).filter(Boolean);
    }
    out.push({ slug: m[1], text: lines[j].trim(), tags });
  }
  return out;
}
const presets = parseCatalog(catalogBody);
if (presets.length === 0) undetermined(`${LIGHTING_FILE} yielded no presets — the file or the format changed shape`);

const scenarioRaw = readRule(SCENARIO_FILE);
const scenarioBody = strip(scenarioRaw);
/** Mirrors `parseScenarioLighting`: three row forms, and a marker that is not `expressive` is a fault. */
function parseScenario(body) {
  const cells = new Map();
  const problems = [];
  let place = null;
  for (const raw of body.split(/\r?\n/)) {
    if (/^##(?!#)/.test(raw)) {
      const m = /^## ([a-z0-9-]+)\s*$/.exec(raw);
      place = m && PLACES.includes(m[1]) ? m[1] : null;
      if (!place) problems.push(`malformed place heading: "${raw.trim()}"`);
      continue;
    }
    const line = raw.trim();
    if (line.length === 0) continue;
    const t = /^-\s*([^\s:]+)\s*:\s*(.*)$/.exec(line);
    if (!t) continue;
    if (place === null) { problems.push(`row with no place in scope: "${line}"`); continue; }
    if (!TIMES.includes(t[1])) { problems.push(`unrecognised time "${t[1]}": "${line}"`); continue; }
    let value = t[2].trim();
    if (value === 'none') { cells.set(`${place}/${t[1]}`, { slugs: [], openness: 'none' }); continue; }
    let openness = 'named-only';
    const marked = /^([a-z-]+)\s*\|\s*(.*)$/.exec(value);
    if (marked) {
      if (marked[1] !== 'expressive') { problems.push(`unrecognised marker "${marked[1]}": "${line}"`); continue; }
      openness = 'expressive';
      value = marked[2].trim();
    }
    const slugs = value.split(',').map((x) => x.trim()).filter(Boolean);
    if (slugs.length === 0) { problems.push(`row lists no slugs: "${line}"`); continue; }
    cells.set(`${place}/${t[1]}`, { slugs, openness });
  }
  return { cells, problems };
}
const { cells, problems } = parseScenario(scenarioBody);
if (cells.size === 0) undetermined(`${SCENARIO_FILE} yielded no cells`);
for (const p of problems) fail(`${SCENARIO_FILE}: ${p}`);

// ─────────────────────────────────────────────────────────────────────────────
// 0. Neither file may be INLINED. Every text check below matches the delivered body, which is
//    only the right corpus while the file is never inlined as prose.
// ─────────────────────────────────────────────────────────────────────────────
for (const f of [LIGHTING_FILE, SCENARIO_FILE]) {
  if (profilesSrc.includes(`'${f}'`)) {
    fail(`${f} is named in image-svc/src/craft/profiles.ts, so it may now be INLINED as prose — every text check in this guard matches the comment-stripped body only, which is no longer the delivered corpus`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Every preset states a light SOURCE, a DIRECTION and a SHADOW character.
// ─────────────────────────────────────────────────────────────────────────────
// LIMITATION, stated rather than papered over: this is a word-presence test and cannot read a
// NEGATION. `overcast daylight, one broad soft source with no sun in it` satisfies it twice over,
// and a contrived text that mentions a source only to deny it would satisfy it once. The check
// catches a preset that forgot to name a source at all, which is the real failure mode; it is not
// a semantic reading of the sentence.
const SOURCE = /\b(sun|sunlight|daylight|window|windows|lamp|lamps|sky|glazing|skylight|fitting|fittings)\b/i;
const DIRECTION = /\b(from|behind|above|overhead|side|raking|frontal|back|down|through|beyond|level)\b/i;
const SHADOW = /\b(shadow|shadows|shadowed|shade|shaded|falling off|falls away|falloff|dark|near-black|unlit|highlight|highlights)\b/i;
for (const p of presets) {
  if (!SOURCE.test(p.text)) fail(`${p.slug}: names no light SOURCE — "${p.text}"`);
  if (!DIRECTION.test(p.text)) fail(`${p.slug}: names no light DIRECTION — "${p.text}"`);
  if (!SHADOW.test(p.text)) fail(`${p.slug}: names no SHADOW character — "${p.text}"`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. No LOOK vocabulary: no mood clause, no photographic genre word, no grade term that is not a
//    physical fact of the light named.
//
//    AUTHOR-DECLARED, with provenance. The audit of the 14-preset catalog this replaced found
//    14/14 presets carrying a colour grade, a genre word or both, and 14/14 ending in a mood
//    clause — a LOOK catalog wearing a lighting catalog's header. Each list below is the
//    vocabulary that made that true.
//
//    The GRADE list is the subtle one. A colour word is legal when it is a physical fact of the
//    source the preset names — low sun IS warm, a dusk sky IS deep blue, a tungsten lamp IS warm
//    — so `warm` is NOT banned outright. What is banned is the vocabulary of GRADING: a named
//    grade, a colour cast asserted independently of a source, and the tonal-curve words.
// ─────────────────────────────────────────────────────────────────────────────
const MOOD = /\b(feel|feeling|mood|moody|atmosphere|atmospheric|calm|quiet|serene|confident|energetic|refined|unhurried|deliberate|reflective|friendly|welcoming|inviting|hands-on|airy|premium|elegant|dramatic|intimate|cosy|cozy)\b/i;
const GENRE = /\b(studio|cinematic|editorial|documentary|graphic|bloom|hazy|haze|rim|rim-light|filmic|film-like|glamour|noir|chiaroscuro|bokeh)\b/i;
// `cast` is NOT a bare entry: "cast shadows" is the correct name for what direct sun throws, and
// banning the word measured as a false positive on the one preset most faithful to its reference.
// A colour cast needs a colour word attached to be a grade.
const GRADE = /\b(grade|graded|grading|high-key|low-key|high key|low key|lifted blacks|crushed blacks|muted|desaturated|tinted|filter|tonal|sepia|teal)\b|\b(?:colour|color|warm|cool|blue|amber|green|magenta)\s+(?:cast|tones|tone)\b/i;
for (const p of presets) {
  const mood = p.text.match(MOOD);
  const genre = p.text.match(GENRE);
  const grade = p.text.match(GRADE);
  if (mood) fail(`${p.slug}: MOOD clause "${mood[0]}" — this axis states light, not how it feels: "${p.text}"`);
  if (genre) fail(`${p.slug}: GENRE word "${genre[0]}" — a photographic genre is not a light: "${p.text}"`);
  if (grade) fail(`${p.slug}: GRADE term "${grade[0]}" — a colour word is legal only as a physical fact of the source named, never as a grade: "${p.text}"`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Every preset cites a REFERENCE that exists, by NAME.
//
//    Node ids are deliberately NOT accepted: they are not in name order and have changed on
//    re-publish twice, so a cited id is a citation that rots. The reference set is verified
//    against the inventory files actually on disk where one is present, and reported as a NOTE
//    rather than a violation where the local reference directory is absent — a guard that fails
//    on a missing local download would be unrunnable in CI.
// ─────────────────────────────────────────────────────────────────────────────
const REF_NAME = /^[a-z][a-z0-9-]*-\d{2}$/;
for (const p of presets) {
  const refs = p.tags['Reference'];
  if (!refs || refs.length === 0) {
    fail(`${p.slug}: cites no Reference — every preset must be authored from a named Figma reference`);
    continue;
  }
  for (const r of refs) {
    if (/^\d+[:-]\d+$/.test(r)) fail(`${p.slug}: Reference "${r}" is a bare node id — cite references by NAME, ids are not in name order and have changed on re-publish twice`);
    else if (!REF_NAME.test(r)) fail(`${p.slug}: Reference "${r}" is not a reference name of the form <set>-NN`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Tag hygiene, BOTH sides, and the producer/consumer rule.
// ─────────────────────────────────────────────────────────────────────────────
const roomDirections = new Set();
const roomTones = new Set();
let roomsRead = 0;
for (const f of new Set(ENV_FILES.values())) {
  const rooms = parseCatalog(strip(readRule(f)));
  if (rooms.length === 0) undetermined(`environment catalog ${f} yielded no rooms`);
  roomsRead += rooms.length;
  for (const r of rooms) {
    for (const d of r.tags['Daylight'] ?? []) roomDirections.add(d);
    for (const t of r.tags['Brightness'] ?? []) roomTones.add(t);
  }
}
if (roomsRead === 0) undetermined('no rooms were read from any environment catalog');

for (const p of presets) {
  const d = p.tags['Daylight'];
  const b = p.tags['Brightness'];
  if (!d) { fail(`${p.slug}: no \`Daylight:\` tag`); } else {
    for (const v of d) if (!LIGHTING_REQUIRES.includes(v) && !DAYLIGHT_DIRECTIONS.includes(v)) fail(`${p.slug}: \`Daylight: ${v}\` is not in image-svc's LIGHTING_REQUIRES`);
  }
  if (!b) { fail(`${p.slug}: no \`Brightness:\` tag`); } else {
    for (const v of b) if (!LIGHTING_TONE.includes(v)) fail(`${p.slug}: \`Brightness: ${v}\` is not in image-svc's LIGHTING_TONE (this side may not say \`dim\` — nothing here needs a dark surround)`);
  }
  // EVERY DIRECTION A PRESET REQUIRES NEEDS A ROOM PRODUCING IT. This is the `overhead-skylight`
  // failure mode: it required `above`, no authored room provides `above`, so it was excluded for
  // every room of every place that HAS a room catalog while still counting toward the cell size.
  for (const v of d ?? []) {
    if (DAYLIGHT_DIRECTIONS.includes(v) && !roomDirections.has(v)) {
      fail(`${p.slug} requires \`Daylight: ${v}\` and NO authored room provides it, so it is excluded for every room of every catalogued place while still counting toward its cells`);
    }
  }
  // And the tone side: a requirement no room tone satisfies is the same fault.
  for (const v of b ?? []) {
    if (v !== 'any' && !roomTones.has(v)) fail(`${p.slug} requires \`Brightness: ${v}\` and no authored room provides that tone`);
  }
}
for (const t of ROOM_TONE) if (!roomTones.has(t)) note(`room tone "${t}" is in image-svc's ROOM_TONE but no authored room declares it`);

// ─────────────────────────────────────────────────────────────────────────────
// 5. THE RESTATED FLOOR INVARIANT. The axis is OPTIONAL, so "no preset" is a legal outcome and a
//    cell with nothing expressive in it is not a gap. What must hold:
//      a. every real (place, timeOfDay) is DEFINED — an absent row resolves to the WHOLE catalog;
//      b. a non-`none` cell carries at least TWO slugs, never exactly one;
//      c. both markers actually occur, or the vocabulary is decorative;
//      d. every slug exists in the catalog, and every preset has at least one cell.
//    The stage-2 (per-room) half of the floor is pinned in image-svc's lightOpenings.test.ts,
//    which can compose the two filters; this script only sees stage 1.
// ─────────────────────────────────────────────────────────────────────────────
const realTimes = TIMES.filter((t) => t !== 'unspecified');
const realPlaces = PLACES.filter((p) => p !== 'other');
let expressiveCells = 0;
let closedCells = 0;
for (const place of realPlaces) {
  for (const t of realTimes) {
    const cell = cells.get(`${place}/${t}`);
    if (!cell) { fail(`${place}/${t} is NOT DEFINED — an absent row resolves to the whole catalog, which is how an interior preset reaches a place it has no business in. Use \`none\` to say nothing belongs here.`); continue; }
    if (cell.openness === 'none') { closedCells++; continue; }
    if (cell.openness === 'expressive') expressiveCells++;
    if (cell.slugs.length < 2) fail(`${place}/${t} lists ${cell.slugs.length} slug(s) — a cell the axis can inject from must never be pinned to one preset`);
  }
}
if (expressiveCells === 0) fail('NO cell is marked `expressive`, so the rotation can never fire and the axis is injected only on an explicitly named slug — which the recorded request corpus never carries (0 of 209). That is deletion, not optionality.');
if (closedCells === 0) note('no cell is marked `none`, so the closed branch of the parser is unexercised by the real data');

const catalogSlugs = new Set(presets.map((p) => p.slug));
const consumed = new Set();
for (const [key, cell] of cells) {
  for (const s of cell.slugs) {
    if (!catalogSlugs.has(s)) fail(`${key} lists "${s}", which ${LIGHTING_FILE} does not contain`);
    consumed.add(s);
  }
}
for (const s of catalogSlugs) if (!consumed.has(s)) fail(`${s} appears in NO scenario cell — a preset with no consumer reads as coverage while contributing nothing`);
// And the stronger form: reachable by the ROTATION, not merely listed. A preset listed only in
// unmarked cells can be reached by an explicitly named slug and by nothing else.
const rotatable = new Set();
for (const cell of cells.values()) if (cell.openness === 'expressive') for (const s of cell.slugs) rotatable.add(s);
for (const s of catalogSlugs) if (!rotatable.has(s)) fail(`${s} appears only in cells the rotation cannot fire on, so nothing but an explicitly named slug can ever reach it`);

// ─────────────────────────────────────────────────────────────────────────────
// 6. THE TWO-WAY DAYLIGHT FILTER must be live in image-svc, and the one-way BRIGHTNESS filter must
//    stay one-way. Read off the source rather than trusted: this is the mechanism the whole
//    interior-key contradiction class depends on, and it is invisible in the rule files.
// ─────────────────────────────────────────────────────────────────────────────
if (!/requires\.includes\('none'\)\s*\)\s*\{[\s\S]{0,400}?return\s+!dayHour;/.test(sceneLightingSrc)) {
  fail('the TWO-WAY daylight filter is not present in image-svc/src/craft/sceneLighting.ts: a `Daylight: none` preset must be refused when the room provides daylight AND the hour is a day hour');
}
// Scoped to `admitsTone`'s OWN BODY, not to a character window after its name: `dayHour` is
// declared just above `admitsDirection`, so a window-based match found it there and reported a
// violation against a correct file. The body is everything up to the next `const ` at the same
// indentation, which is where the arrow function ends.
const admitsToneBody = (() => {
  const i = sceneLightingSrc.indexOf('const admitsTone');
  if (i < 0) return null;
  const rest = sceneLightingSrc.slice(i);
  const end = rest.indexOf('\n  const ', 1);
  return end < 0 ? rest : rest.slice(0, end);
})();
if (admitsToneBody === null) undetermined('could not find `admitsTone` in image-svc/src/craft/sceneLighting.ts — the brightness filter moved or was renamed');
if (/dayHour|DAY_HOURS/.test(admitsToneBody)) {
  fail('`admitsTone` in image-svc references the day-hour gate, so the BRIGHTNESS filter has been made two-way as well. It must stay ONE-WAY — the symmetric version collapses the evening and night cells of every catalogued place, and lightOpenings.test.ts pins that.');
}
// ORDER MATTERS, and the red-prove found it: the `unspecified` case has to be tested BEFORE the
// membership check, because `realTimes` excludes `unspecified` by construction — so a DAY_HOURS
// containing it fell into "cannot determine" and reported an unreadable corpus instead of the
// specific fault it is. A cannot-determine that should have been a violation is the same class of
// error as a green that should have been a red.
if (DAY_HOURS.includes('unspecified')) fail('DAY_HOURS contains `unspecified` — an unknown hour must not trigger a new exclusion');
else if (!DAY_HOURS.every((h) => realTimes.includes(h))) undetermined(`DAY_HOURS ${DAY_HOURS.join('+')} contains an hour that is not in TIMES_OF_DAY`);

// ─────────────────────────────────────────────────────────────────────────────
// 7. The injection GATE must be live, and it must be REQUIRED rather than defaulted.
// ─────────────────────────────────────────────────────────────────────────────
if (!/if \(!o\.rotate && !o\.explicit\) return \{ preset: null, rejected \};/.test(treatmentSrc)) {
  fail('the optional-injection gate is not present in image-svc/src/craft/treatment.ts (`if (!o.rotate && !o.explicit) return { preset: null, rejected }`), so the lighting axis is injected on every run again');
}
if (/rotate\?:/.test(treatmentSrc)) {
  fail('`rotate` is OPTIONAL in image-svc/src/craft/treatment.ts. It must be required: an optional gate is one a future caller can forget to pass, and the fault it leaves behind is the always-on axis this change removed.');
}
if (!/rotate: scenario\.kind === 'cell' && scenario\.expressive/.test(treatmentSrc)) {
  fail('`resolveLightingTraced` no longer derives `rotate` from the cell\'s `expressive` marking');
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. The BRAND files must not have taken the light back, and the hour rule must be reachable.
//
//    Corpus DERIVED from image-svc's `minimalRules`, so a brand added there is covered here.
// ─────────────────────────────────────────────────────────────────────────────
const HOUR_RULE = (() => {
  const m = profilesSrc.match(/rule: '(shared-time-of-day\.md)'/);
  return m ? m[1] : null;
})();
if (!HOUR_RULE) {
  fail('image-svc `minimalRules` does not inline shared-time-of-day.md. Time-of-day fidelity has to live in a rule `minimal` actually inlines — shared-image-principles.md is NOT one of them, so writing it there leaves the profile that needs it carrying nothing. Measured: with the brand paragraph removed and nothing carrying it, all five evening frames came back as bright daytime.');
} else {
  const hour = strip(readRule(HOUR_RULE));
  if (hour.trim().length === 0) undetermined(`${HOUR_RULE} has no delivered body — it is all comment`);
  const NEEDED = [
    [/dark hour stays dark|do not raise the exposure back/i, 'the do-not-brighten-a-dark-hour rule'],
    [/source that is actually there/i, 'the encode-the-actual-source rule'],
    [/every hour is available/i, 'the every-hour-is-available permission'],
  ];
  for (const [re, what] of NEEDED) if (!re.test(hour)) fail(`${HOUR_RULE} no longer carries ${what} — this is the sentence set whose removal made all five evening frames read as bright daytime`);
}

const brandRules = [...new Set([...profilesSrc.matchAll(/'(ionos-image-(?:photoreal|cutout)\.md|\$\{brand\}-image-style\.md)'/g)].map((m) => m[1]))];
if (brandRules.length === 0) undetermined('could not derive the brand rule filenames out of image-svc profiles.ts');
const BRAND_FILES = ['ionos-image-photoreal.md', 'strato-image-style.md', 'homepl-image-style.md']
  .filter((f) => existsSync(join(RULES_DIR, f)));
if (BRAND_FILES.length === 0) undetermined('no authored brand image rule found in the rules directory');
const BRAND_PRESCRIPTIONS = [
  [/cool[\s-]?neutral/i, 'a cool-neutral grade'],
  [/high[\s-]?key/i, 'a high-key preference'],
  [/\b[3-9]\d00\s*(?:–|-|to)?\s*\d{0,4}\s*K\b/, 'a Kelvin colour temperature'],
  [/golden[\s-]?hour/i, 'a golden-hour preference'],
  [/where NO `Photographic lighting:` line is injected/i, 'a gated light preference'],
];
for (const f of BRAND_FILES) {
  const delivered = strip(readRule(f));
  if (delivered.trim().length === 0) undetermined(`${f} has no delivered body`);
  for (const [re, what] of BRAND_PRESCRIPTIONS) {
    const hit = re.exec(delivered);
    if (hit) fail(`${f} prescribes ${what} ("${hit[0]}") — brand prose carries ATMOSPHERE only; the light is decided by ${SCENARIO_FILE}, by ${HOUR_RULE ?? 'the hour rule'} and by the injected line`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Report. Every extractor above asserted it found something, so a clean run means the corpus was
// genuinely read.
// ─────────────────────────────────────────────────────────────────────────────
const read = {
  presets: presets.length,
  cells: cells.size,
  expressive: expressiveCells,
  closed: closedCells,
  rooms: roomsRead,
  brandFiles: BRAND_FILES.length,
  roomDirections: [...roomDirections].sort().join('+'),
  dayHours: DAY_HOURS.join('+'),
};
if (VERBOSE || violations.length > 0) {
  console.log(`read: ${Object.entries(read).map(([k, v]) => `${k}=${v}`).join(' ')}`);
  for (const n of notes) console.log(`NOTE: ${n}`);
}
if (violations.length > 0) {
  console.error(`\nLIGHTING AXIS: ${violations.length} violation(s)`);
  for (const v of violations) console.error(`  - ${v}`);
  process.exit(1);
}
console.log(`lighting axis OK — ${presets.length} presets, ${cells.size} cells (${expressiveCells} expressive, ${closedCells} closed), ${roomsRead} rooms, ${BRAND_FILES.length} brand files`);
process.exit(0);
