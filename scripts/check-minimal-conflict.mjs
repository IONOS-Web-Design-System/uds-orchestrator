#!/usr/bin/env node
/**
 * Guard — the rule files the `minimal` craft profile inlines must not carry the photographic
 * CONFLICT: no ✅/❌ photographic example list, and no per-scenario lighting mapping. And each
 * authored brand rule's grade/key bias must be GATED — its preference stated inside a
 * "no injected `Photographic lighting:` line" condition, with the converse stated (CHECK D).
 *
 * WHY THIS SHAPE AND NOT "ZERO CAMERA/LIGHTING MARKERS". An earlier draft of the design spec asked
 * for zero markers. It was withdrawn before implementation after all 19 markers in
 * `ionos-image-photoreal.md` were classified in context (spec §7): only 7 are the conflict. The
 * other 12 sit in content that cannot do its job without naming tonal vocabulary — the three-brand
 * comparison table (it describes the OTHER brands), the brand bias sentence, the precedence
 * instruction that tells the model to obey an injected low-key line, and the negative-prompt
 * baseline's own guard text, which exists to say "no tonal term belongs in this list" and cannot
 * say that without naming tonal terms. A guard demanding zero would force an implementer to delete
 * brand identity to go green. So this guard is anchored to the two CONSTRUCTS that are the
 * conflict, and a separate set of assertions (part 3) pins the brand content that must survive, so
 * the diet cannot hollow the file in a later edit either.
 *
 * WHY IT LIVES HERE. Its natural home is an `image-svc` test (that repo has vitest and can import
 * `minimalRules` directly). It was written here because `image-svc` was being edited concurrently.
 * See the handoff note at the bottom of this file.
 *
 * Usage:
 *   node scripts/check-minimal-conflict.mjs            # 0 = green, 1 = violation, 2 = cannot determine
 *   node scripts/check-minimal-conflict.mjs --verbose
 * Env:
 *   IMAGE_SVC_DIR   where to read `src/craft/profiles.ts` + `src/validate.ts` from (default ../image-svc)
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

// ─────────────────────────────────────────────────────────────────────────────
// 1. Derive the file list from image-svc's minimalRules — never hardcode it, so a rule added to
//    `minimal` later cannot escape this guard.
// ─────────────────────────────────────────────────────────────────────────────
function minimalRuleFiles() {
  const profiles = join(IMAGE_SVC, 'src', 'craft', 'profiles.ts');
  const validate = join(IMAGE_SVC, 'src', 'validate.ts');
  if (!existsSync(profiles)) undetermined(`image-svc profiles.ts not found at ${profiles} — set IMAGE_SVC_DIR`);
  if (!existsSync(validate)) undetermined(`image-svc validate.ts not found at ${validate} — set IMAGE_SVC_DIR`);

  const src = readFileSync(profiles, 'utf8');
  // The body of minimalRules: from its signature to the closing `}` of the function.
  const start = src.indexOf('export function minimalRules');
  if (start === -1) undetermined('`export function minimalRules` not found in profiles.ts — the guard is reading the wrong file or the export was renamed');
  const after = src.indexOf('\n}', start);
  if (after === -1) undetermined('could not find the end of minimalRules in profiles.ts');
  const body = src.slice(start, after);

  // Comments inside the body name other rule files as prose (the experiment log). Strip them, or
  // the guard would check files `minimal` does not inline.
  const code = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  const brandsMatch = readFileSync(validate, 'utf8').match(/export const BRANDS = \[([\s\S]*?)\] as const;/);
  if (!brandsMatch) undetermined('BRANDS not found in validate.ts');
  const brands = [...brandsMatch[1].matchAll(/'([a-z0-9]+)'/g)].map((m) => m[1]);
  if (brands.length < 2) undetermined(`BRANDS parsed implausibly small (${brands.length})`);

  const files = new Set();
  // literal '...md'
  for (const m of code.matchAll(/'([A-Za-z0-9._-]+\.md)'/g)) files.add(m[1]);
  // template `${brand}-suffix.md` — expand over every brand, since `minimal` is reachable for all
  for (const m of code.matchAll(/`\$\{brand\}([A-Za-z0-9._-]*\.md)`/g)) {
    for (const b of brands) files.add(`${b}${m[1]}`);
  }
  if (files.size === 0) undetermined('parsed ZERO rule files out of minimalRules — the parser read nothing');
  return { files: [...files].sort(), brands };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Vocabularies. Copied from image-svc/src/craft/sceneMetrics.ts MARKERS so the guard and the
//    retention metric cannot disagree about what a photographic construct is. `environment` is not
//    used: an environment noun in a brand rule is not the conflict this guard names.
// ─────────────────────────────────────────────────────────────────────────────
const MARKERS = {
  camera: [
    /\bover[- ]the[- ]shoulder\b/i, /\bwaist[- ]up\b/i, /\bknee[- ]up\b/i,
    /\bfull[- ]body\b/i, /\bclose[- ]up\b/i, /\bwide shot\b/i, /\bmedium shot\b/i,
    /\blow[- ]angle\b/i, /\bhigh[- ]angle\b/i, /\beye[- ]level\b/i, /\bfrom (?:slightly )?above\b/i,
    /\bfrom below\b/i, /\bbokeh\b/i, /\bshallow depth of field\b/i, /\bdepth of field\b/i,
    /\bsoft[- ]focus\b/i, /\bsoft focus\b/i, /\bout of focus\b/i,
    /\bthree[- ]quarter (?:view|shot|crop|framing)\b/i,
    /\bprofile view\b/i, /\bframing\b/i, /\blens\b/i,
  ],
  lighting: [
    /\bdaylight\b/i, /\blight[- ]filled\b/i, /\bsunlit\b/i, /\bbacklit\b/i, /\bgolden hour\b/i,
    /\bblue hour\b/i, /\bhigh[- ]key\b/i, /\blow[- ]key\b/i, /\bovercast\b/i, /\bhard sun\b/i,
    /\bdirect sunlight\b/i, /\bnatural (?:morning |afternoon |evening )?light(?:ing)?\b/i,
    /\brim light\b/i, /\bkey light\b/i, /\bfill light\b/i, /\bcolou?r grade\b/i, /\bgrade\b/i,
    /\bcasts? soft\b/i, /\bsoft shadows?\b/i, /\bharsh shadows?\b/i, /\bdiffused\b/i,
    /\bcool[- ]neutral\b/i, /\bwarm[- ]toned\b/i, /\bmoody\b/i, /\bdramatic light/i,
    /\bwindow light\b/i, /\bpractical(?:s)? light/i, /\bairy\b/i,
  ],
};
const hit = (axis, text) => MARKERS[axis].filter((p) => p.test(text)).map((p) => p.source);

/** The NOISY axis measure, also from sceneMetrics.ts: the content words of the real preset TEXTS.
 *  Used only as a density test inside an emoji list item (checkA condition c), never as a verdict
 *  on ordinary prose — the catalogs contain everyday words ("office", "desk", "warm"). */
const STOP = new Set(
  ('a an the and or of on in with at to for from into under over along its their his her this that ' +
   'is are be been being as by but not no than then there here which who whom whose what when where ' +
   'while very more most much some any all both each few other such own same so only just also').split(' '),
);
const contentWords = (text) => new Set((text.toLowerCase().match(/[a-z][a-z-]{4,}/g) ?? []).filter((w) => !STOP.has(w)));
function presetTexts(body) {
  const out = [];
  let slug = false;
  for (const raw of body.split('\n')) {
    if (/^##(?!#)\s/.test(raw)) { slug = true; continue; }
    if (!slug) continue;
    const line = raw.trim();
    if (line.length === 0) continue;
    if (/^\s*(daylight|light\s*openings)\s*:/i.test(line)) { slug = false; continue; }
    out.push(line);
    slug = false;
  }
  return out;
}
function buildLightingVocab(dir) {
  const p = join(dir, 'shared-lighting.md');
  if (!existsSync(p)) undetermined(`lighting catalog not found at ${p} — the density net has no vocabulary`);
  const v = new Set();
  for (const t of presetTexts(readFileSync(p, 'utf8'))) for (const w of contentWords(t)) v.add(w);
  if (v.size < 20) undetermined(`lighting vocabulary implausibly small (${v.size}) — the preset-text parser is not reading the catalog`);
  return { lighting: v };
}

/** Scene tokens, from image-svc's PLACES / TIMES_OF_DAY. `other`/`unspecified` are excluded (they
 *  are not words a mapping would key on); bare `office` is included because the mapping this guard
 *  caught in the wild was keyed "Morning office → …", not "open-plan-office → …". */
const SCENE_TOKENS = [
  'open-plan office', 'open-plan', 'home office', 'meeting room', 'office', 'café', 'cafe',
  'workshop', 'retail', 'studio', 'outdoors',
  'morning', 'midday', 'afternoon', 'evening', 'night',
];
const sceneToken = (text) => SCENE_TOKENS.filter((t) => new RegExp(`(?<![a-z-])${t.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?![a-z])`, 'i').test(text));

// ─────────────────────────────────────────────────────────────────────────────
// 3. Reading the files. These hard-wrap at ~80 chars, so a construct is reassembled from its
//    continuation lines before matching and whitespace is normalised. A whole-document match would
//    be satisfied by unrelated prose one paragraph away.
// ─────────────────────────────────────────────────────────────────────────────
const norm = (s) => s.replace(/\s+/g, ' ').trim();

/** Logical list ITEMS: a `- `/`* ` bullet plus its indented continuation lines. */
function listItems(body) {
  const out = [];
  let cur = null;
  for (const [i, raw] of body.split('\n').entries()) {
    const bullet = /^(\s*)[-*]\s+(.*)$/.exec(raw);
    if (bullet) {
      if (cur) out.push(cur);
      cur = { line: i + 1, indent: bullet[1].length, text: bullet[2] };
      continue;
    }
    if (cur === null) continue;
    if (raw.trim() === '' || /^\S/.test(raw) || /^#/.test(raw.trim())) { out.push(cur); cur = null; continue; }
    cur.text += ` ${raw.trim()}`;
  }
  if (cur) out.push(cur);
  return out.map((x) => ({ ...x, text: norm(x.text) }));
}

/** Logical PARAGRAPHS (for arrow mappings that are not bullets) and table ROWS. */
function paragraphs(body) {
  const out = [];
  let buf = [];
  let at = 1;
  for (const [i, raw] of body.split('\n').entries()) {
    if (raw.trim() === '') { if (buf.length) { out.push({ line: at, text: norm(buf.join(' ')) }); buf = []; } continue; }
    if (buf.length === 0) at = i + 1;
    buf.push(raw);
  }
  if (buf.length) out.push({ line: at, text: norm(buf.join(' ')) });
  return out;
}
const tableRows = (body) => body.split('\n')
  .map((l, i) => ({ line: i + 1, text: l.trim() }))
  .filter((r) => r.text.startsWith('|') && r.text.endsWith('|') && !/^\|[\s|:-]*\|$/.test(r.text));

// ─────────────────────────────────────────────────────────────────────────────
// CHECK A — no ✅/❌ photographic example list.
//
// The discriminator is NOT "the item contains a marker". `shared-natural-moment.md` is one of
// `minimal`'s two rule files and carries a legitimate ✅/❌ list about POSE and motion, and one of
// its ❌ items reads "facing the lens square-on" — a camera marker inside content spec §7 keeps.
// Measured on the real corpus, two conditions separate the conflict from that list:
//   (a) a LIGHTING marker in an emoji item — natural-moment has zero, the deleted IONOS list had six;
//   (b) a backtick-quoted PROMPT FRAGMENT carrying a camera marker — natural-moment's backticked
//       items carry none, and its `lens` item is prose, not a quoted fragment.
// ─────────────────────────────────────────────────────────────────────────────
function checkA(name, body, vocab) {
  const violations = [];
  let seen = 0;
  for (const it of listItems(body)) {
    if (!/[✅❌]/.test(it.text)) continue;
    seen++;
    const lit = hit('lighting', it.text);
    const quoted = /`"[^`]*"`|`[^`]*`/.test(it.text);
    const cam = quoted ? hit('camera', it.text) : [];
    // (c) the catalog-derived net: an item phrased entirely in words no narrow MARKER covers is
    // still a lighting example if it is dense in the lighting catalog's own vocabulary. THRESHOLD
    // DERIVED FROM A SWEEP over the two real lists, not chosen: the pose list's five items score
    // 0,0,1,0,0 lighting-vocab words ("documentary", "subject"); the deleted IONOS list's nine
    // score 5,6,5,3,5,5,1,2,1. So >= 2 sits between the healthy maximum (1) and the conflict, and
    // catches the construct even if the marker-bearing members of a future list are reworded away.
    const dense = quoted ? [...contentWords(it.text)].filter((w) => vocab.lighting.has(w)).sort() : [];
    if (lit.length || cam.length || dense.length >= 2) {
      violations.push(`${name}:${it.line} ✅/❌ photographic example — lighting[${lit.join(', ')}] camera[${cam.join(', ')}] litVocab×${dense.length}[${dense.join(',')}] :: ${it.text.slice(0, 110)}`);
    }
  }
  return { violations, seen };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK B — no per-scenario lighting mapping.
//
// Two shapes, both observed: an ARROW whose left side keys on a place or a time of day (the wild
// instance was `("Morning office → …", "Café midday → …", "Workshop → …")`, quoted inside prose
// with the right side ELIDED — so a check that required a lighting marker on the right of the
// arrow would have read it as clean), and a TABLE ROW pairing a scene token with a lighting marker.
// ─────────────────────────────────────────────────────────────────────────────
function checkB(name, body) {
  const violations = [];
  const units = [...listItems(body), ...paragraphs(body)];
  for (const u of units) {
    for (const m of u.text.matchAll(/→|->|⟶/g)) {
      const lhs = u.text.slice(Math.max(0, m.index - 40), m.index);
      const toks = sceneToken(lhs);
      if (toks.length) {
        violations.push(`${name}:${u.line} per-scenario mapping — arrow keyed on [${toks.join(', ')}] :: …${lhs.slice(-60)}${m[0]}${u.text.slice(m.index + m[0].length, m.index + m[0].length + 40)}`);
      }
    }
  }
  for (const r of tableRows(body)) {
    const cells = r.text.split('|').slice(1, -1).map(norm);
    const sceneCell = cells.findIndex((c) => sceneToken(c).length > 0);
    const litCell = cells.findIndex((c) => hit('lighting', c).length > 0);
    if (sceneCell !== -1 && litCell !== -1 && sceneCell !== litCell) {
      violations.push(`${name}:${r.line} per-scenario mapping — table row pairs scene[${sceneToken(cells[sceneCell]).join(', ')}] with lighting[${hit('lighting', cells[litCell]).join(', ')}] :: ${r.text.slice(0, 110)}`);
    }
  }
  return { violations };
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECK C — the brand content the diet must NOT take with it (risk R1).
//
// Each assertion is anchored to a construct — a heading, a table row, a named sentence — not to the
// document, and matched against whitespace-NORMALISED text so an ~80-char hard wrap cannot defeat
// it. These apply to `ionos-image-photoreal.md` only: it is the file being dieted, and the other
// brand rules have their own shape.
// ─────────────────────────────────────────────────────────────────────────────
const MUST_SURVIVE = [
  // The brand bias sentence and its precedence instruction used to be asserted here, as two
  // separate presence tests. CHECK D owns both now — it asserts the preference is still stated
  // AND that it is stated inside its condition with the converse spelled out, which a presence
  // test cannot distinguish from the ungated form. Two homes for one assertion is how a marker
  // survived a deletion in this workstream; there is one home.
  { what: 'the anti-veto permission — the repetition caution is not a ban',
    test: (b) => /not a ban on any particular hour/.test(norm(b)) },
  { what: 'the audience section heading',
    test: (b) => /^## Target audience — character profile$/m.test(b) },
  { what: 'the audience age range',
    test: (b) => /mid-30s to early 50s/.test(norm(b)) },
  { what: 'the wardrobe bullets (hair, accessories, clothing)',
    test: (b) => ['Hair:', 'Accessories:', 'Clothing:'].every((k) => norm(b).includes(`**${k}**`)) },
  { what: 'the three-brand comparison table (header + the grade row)',
    test: (b) => tableRows(b).some((r) => /IONOS/.test(r.text) && /Strato/.test(r.text) && /home\.pl/.test(r.text))
      && tableRows(b).some((r) => /^\|\s*grade\s*\|/.test(r.text)) },
  { what: 'the palette anchors (IONOS Blue and Sky hex)',
    test: (b) => norm(b).includes('#003D8F') && norm(b).includes('#11C7E6') },
  { what: 'the negative-prompt baseline, with its own guard text',
    test: (b) => /^## Negative prompt baseline/m.test(b)
      && /No tonal term belongs in this list\./.test(norm(b))
      && /text, watermark, logo/.test(norm(b)) },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHECK D — the brand bias sentence must be GATED, not merely present.
//
// THE FAULT IT NAMES. Each authored brand rule states one grade/key preference of the shape
// "prefer <the brand's grade>". Stated UNCONDITIONALLY with a precedence caveat AFTER it, the
// craft model reads the preference first and the caveat second, and the brand's own term reaches
// the final prompt while the injected `Photographic lighting:` line says the opposite — measured
// 4/24 and 2/24 over runs drawing a warm or low-key preset, and 1/11 a task earlier. Deleting the
// vocabulary MENU (the ✅/❌ list, CHECK A) did not remove the TERM, and the caveat was already
// in the sentence. So the assertion is STRUCTURAL: the preference must sit inside its condition.
//
// The gated shape is the one the daylight-default bullet in `ionos-image-photoreal.md` already
// uses and which this check pins for all three authored brand files:
//   1. an antecedent — "where NO `Photographic lighting:` line is injected" — in the SAME
//      sentence and immediately BEFORE the "prefer …" clause, not in a later one;
//   2. the CONVERSE stated explicitly — a line IS injected ⇒ it sets the axis and the
//      preference does not apply — in the same paragraph, AFTER the preference.
// Presence of the preference is asserted too, so this is also the R1 assertion: a green here
// means the brand grade identity survived AND is scoped. It cannot be satisfied by deletion.
//
// MATCHED AGAINST THE DELIVERED BODY. `minimal` strips HTML comments at the loader, so an author
// comment that happens to contain the gated wording must not satisfy this check — a rule's own
// explanatory comment has satisfied an assertion about the rule in this workstream before.
// ─────────────────────────────────────────────────────────────────────────────

/** The body `minimal` actually delivers: HTML comments removed, fenced blocks opaque.
 *  image-svc's `stripHtmlComments` is the authority; this is the narrow equivalent for files with
 *  no fenced blocks, and a fence in a checked file returns 2 rather than risk reading it wrong. */
function delivered(name, raw) {
  if (/^\s*```/m.test(raw)) {
    undetermined(`${name} contains a fenced code block — this guard's comment strip is only exact for fence-free files; port image-svc's stripHtmlComments before checking it`);
  }
  const out = raw.replace(/<!--[\s\S]*?-->/g, '');
  if (/<!--|-->/.test(out)) undetermined(`${name} has an UNBALANCED HTML comment marker after stripping — the delivered body cannot be determined`);
  return out;
}

/** Blank-line-delimited blocks of a body, whitespace-normalised. Anchoring to the paragraph (not
 *  the document) is what stops an unrelated gated sentence elsewhere in the file from passing. */
const blocks = (body) => body.split(/\n\s*\n/).map(norm).filter((t) => t.length > 0);

/** "where NO `Photographic lighting:` line is injected" and its wording variants. */
const GATE_ANTECEDENT = /where\s+no\s+`Photographic lighting:`\s+line\s+is\s+(?:injected|present)/gi;
/** the converse: a line IS injected, and the preference stands down. BOTH halves required — "the
 *  line wins" without "the preference does not apply" is the caveat shape this check rejects. */
const CONVERSE_LINE = /where\s+(?:a|an|the)\s+(?:injected\s+)?line\s+is\s+injected/i;
const CONVERSE_STANDS_DOWN = /(?:this|the)\s+(?:preference|default)\s+does\s+not\s+apply/i;

/** One entry per AUTHORED brand rule. `prefer` is the brand's own grade identity — R1 material,
 *  so it is asserted present, never asserted absent. */
const GATED_BIAS = [
  { file: 'ionos-image-photoreal.md', term: 'cool-neutral',
    prefer: /prefer a well-lit frame on a cool-neutral grade/i },
  { file: 'strato-image-style.md', term: 'sunlit',
    prefer: /prefer a bright, diffused,? sunlit frame/i },
  { file: 'homepl-image-style.md', term: 'high-key',
    prefer: /prefer the high-key end/i },
];

/** How far before the "prefer …" clause the antecedent may sit, in normalised chars. The authored
 *  antecedent is ~52 chars; 160 leaves room for a rewording without letting a condition from the
 *  far end of the paragraph count as one. */
const GATE_WINDOW = 160;

function checkD(spec, raw) {
  const v = [];
  const body = delivered(spec.file, raw);
  const para = blocks(body).find((t) => spec.prefer.test(t));
  if (!para) {
    // Distinguish "the preference was deleted" (an R1 violation) from "it moved into a comment"
    // (also a violation, and a different one worth naming).
    const inRaw = spec.prefer.test(norm(raw));
    v.push(`${spec.file}: R1 — the '${spec.term}' bias PREFERENCE is GONE from the delivered body` +
      (inRaw ? ' — it is present in the RAW file but only inside an HTML comment, which `minimal` strips' : ''));
    return v;
  }
  const p = para.search(spec.prefer);

  // 1. the antecedent, in the same sentence, immediately before the preference
  let gated = false;
  for (const m of para.matchAll(GATE_ANTECEDENT)) {
    const end = m.index + m[0].length;
    if (end > p) continue;                                   // after the preference: not a gate on it
    if (p - end > GATE_WINDOW) continue;                     // too far to be this clause's condition
    if (/\.\s/.test(para.slice(end, p))) continue;           // a sentence boundary in between
    gated = true; break;
  }
  if (!gated) {
    v.push(`${spec.file}: the '${spec.term}' bias preference is NOT GATED — no "where NO \`Photographic lighting:\` line is injected" antecedent in the same sentence before it :: …${para.slice(Math.max(0, p - 90), p + 60)}…`);
  }
  // 2. the converse, stated after it, in the same paragraph
  const after = para.slice(p);
  if (!CONVERSE_LINE.test(after) || !CONVERSE_STANDS_DOWN.test(after)) {
    v.push(`${spec.file}: the '${spec.term}' bias preference states no CONVERSE after it — the paragraph must say a line IS injected ⇒ it sets the axis and the preference does not apply (line ${CONVERSE_LINE.test(after) ? 'ok' : 'MISSING'}, stands-down ${CONVERSE_STANDS_DOWN.test(after) ? 'ok' : 'MISSING'})`);
  }
  return v;
}

// ─────────────────────────────────────────────────────────────────────────────
// Run
// ─────────────────────────────────────────────────────────────────────────────
if (!existsSync(RULES_DIR)) undetermined(`rules dir not found: ${RULES_DIR}`);
const { files, brands } = minimalRuleFiles();
console.log(`minimal rule files derived from image-svc minimalRules (brands: ${brands.length}):`);
const bodies = new Map();
for (const f of files) {
  const p = join(RULES_DIR, f);
  if (!existsSync(p)) { console.log(`  ${f.padEnd(34)} (absent on disk — loadSkillRules warns and skips)`); continue; }
  const body = readFileSync(p, 'utf8');
  if (body.trim().length < 50) undetermined(`${f} is under 50 chars — the guard is reading a stub, not a rule`);
  bodies.set(f, body);
  console.log(`  ${f.padEnd(34)} ${String(body.length).padStart(6)} ch`);
}
if (bodies.size === 0) undetermined(`none of the ${files.length} derived rule files exist under ${RULES_DIR}`);
if (readdirSync(RULES_DIR).filter((f) => f.endsWith('.md')).length < 10) undetermined(`${RULES_DIR} holds under 10 rule files — wrong directory`);

const vocab = buildLightingVocab(RULES_DIR);
const seenMsgs = new Set();
const violations = [];
const add = (msgs) => { for (const m of msgs) if (!seenMsgs.has(m)) { seenMsgs.add(m); violations.push(m); } };
let emojiItemsSeen = 0;
for (const [name, body] of bodies) {
  const a = checkA(name, body, vocab);
  emojiItemsSeen += a.seen;
  add(a.violations);
  // checkB scans bullets AND paragraphs, which overlap for a bulleted mapping — dedupe by message.
  add(checkB(name, body).violations);
  if (VERBOSE) console.log(`  · ${name}: ${a.seen} ✅/❌ items read`);
}
// Standing rule: assert the extractor found something. 0 flagged out of 0 items read is not a pass.
if (emojiItemsSeen === 0) {
  undetermined(`the ✅/❌ item extractor read ZERO items across ${bodies.size} files — it cannot have cleared them`);
}

const brandRule = 'ionos-image-photoreal.md';
if (!bodies.has(brandRule)) undetermined(`${brandRule} not among the derived files — the R1 preservation assertions have nothing to check`);
for (const m of MUST_SURVIVE) {
  if (!m.test(bodies.get(brandRule))) add([`${brandRule}: R1 — ${m.what} is GONE`]);
}

// CHECK D over every AUTHORED brand rule. Each must be among the files `minimal` inlines for its
// own brand, or the spec is checking something the profile never delivers.
let gatesChecked = 0;
for (const spec of GATED_BIAS) {
  if (!files.includes(spec.file)) {
    undetermined(`${spec.file} is not among the files derived from minimalRules — CHECK D's spec and the profile have drifted apart`);
  }
  const raw = bodies.get(spec.file);
  if (raw === undefined) undetermined(`${spec.file} is derived from minimalRules but absent on disk — CHECK D cannot evaluate its gate`);
  gatesChecked++;
  add(checkD(spec, raw));
}
// Standing rule: assert the extractor found something. 0 violations over 0 specs is not a pass.
if (gatesChecked !== GATED_BIAS.length) {
  undetermined(`CHECK D evaluated ${gatesChecked} of ${GATED_BIAS.length} brand gates`);
}

console.log(`\n✅/❌ list items read: ${emojiItemsSeen}; R1 assertions: ${MUST_SURVIVE.length}; brand bias gates checked: ${gatesChecked}`);
if (violations.length) {
  console.error(`\nFAIL — ${violations.length} violation(s):`);
  for (const v of violations) console.error(`  ✗ ${v}`);
  process.exit(1);
}
console.log('PASS — no ✅/❌ photographic example list, no per-scenario lighting mapping, all brand content present,\n       and every brand bias preference is stated inside its no-injected-line condition with the converse spelled out.');

/* ────────────────────────────────────────────────────────────────────────────
 * HANDOFF — this belongs in image-svc, not here.
 *
 * `uds-orchestrator` has no test harness at all (no package.json, no runner), so this is a
 * standalone checked script and it is NOT wired into any CI. It lives here only because
 * `image-svc` was being edited concurrently by another task when it was written.
 *
 * Its eventual home is `image-svc/src/craft/__tests__/minimalConflict.test.ts`, where it can
 * `import { minimalRules }` instead of regex-parsing profiles.ts, and import MARKERS from
 * `sceneMetrics.ts` instead of duplicating them — the duplication here is the only thing in this
 * file that can drift. Move CHECK A, CHECK B and MUST_SURVIVE across verbatim; they are pure
 * functions of a file's text and need nothing from this script's plumbing.
 * ──────────────────────────────────────────────────────────────────────────── */
