#!/usr/bin/env node
/**
 * Guard — small canvases (both sides ≤ 512px) have ONE grammar: the highlight moment.
 *
 * The rule lives in `skills/uds-wireframe/rules/shared/small-format.md` and is inlined verbatim
 * into two prompts: the moderator planner (which writes the brief) and agent-svc codegen (which
 * writes the composition). It replaced two per-brand rules that each taught two layouts — a
 * product frame cropped at the canvas edge, and a disc-motif "story" — and both of those
 * survived for weeks in prose that nothing deleted. This guard keeps them dead:
 *
 *   (a) the shared rule exists, opens with the `small: true` scope (agent-svc's `ruleScope`
 *       key — any other frontmatter fails OPEN and inlines it on every canvas), stays under
 *       13,000 characters (the prompt budget; each deleted brand file was 13.7–14.3k), and
 *       carries NO hex. Fallback hex lives in agent-svc keyed by the render brand; a hex in a
 *       shared rule reaches every brand's prompt, and a negated literal gets copied.
 *   (b) it names the opening typed "Highlight moment (story|interaction|state):" sentence (verbatim, so the moderator line
 *       that copies it cannot drift unseen) and the runtime token roles.
 *   (c) the two per-brand small-format files are gone.
 *   (d) no file under `skills/` still teaches the retired layouts or their pattern names.
 *       Matched with any whitespace between words, so a phrase split across a line wrap is
 *       still found. node_modules is skipped (vendored, never inlined). The wireframe rules that
 *       teach a product frame (the demonstration frame, the floating highlight card, the
 *       constrained-viewport crops with their square override) open with `small: false`, so
 *       agent-svc never inlines them on a small canvas, and the square override lives nowhere
 *       that a small canvas can read.
 *   (e) all four hybrid embed rules (ui-core) that can reach a small canvas carry the sentence
 *       that makes the generated photo the central object of the highlight moment there.
 *   (f) the motion rule `shared/small-format-motion.md` exists and opens with exactly the
 *       `small: true` + `motion: [animation]` scope (agent-svc ANDs the keys: animated small
 *       canvases only), stays at or under 8,000 characters with no hex, carries its headings,
 *       the type-test line verbatim on a line of its own (the same line `small-format.md` gives
 *       the planner, so codegen can infer a type the brief does not name), the snap curve, the
 *       five morph moves and five background devices (each as a bold defined term), "icon
 *       story", the no-recoil sentence for text and "one blurred glow". Phrases are matched
 *       with whitespace collapsed, so a line wrap cannot hide one; the type-test line must
 *       match a whole line exactly.
 *
 * Exit codes: 0 green, 1 violation, 2 cannot determine ("read nothing" is never "clean").
 *
 * Usage:
 *   node scripts/check-small-format.mjs
 *   node scripts/check-small-format.mjs --verbose
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const VERBOSE = process.argv.includes('--verbose');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = join(ROOT, 'skills');
const WIREFRAME_RULES = join(SKILLS, 'uds-wireframe', 'rules');
const RULE = join(WIREFRAME_RULES, 'shared', 'small-format.md');
const DELETED = [
  join(WIREFRAME_RULES, 'ionos', 'small-format.md'),
  join(WIREFRAME_RULES, 'strato', 'small-format.md'),
];

const FRONTMATTER = '---\nsmall: true\n---';
const MAX_CHARS = 13000;
const HEX = /#[0-9A-Fa-f]{6}\b/g;

/** The opening sentence the planner must write — copied verbatim by the moderator's line. */
const PLANNER_SENTENCE =
  'Highlight moment (story|interaction|state): <central object> [in halo rings | on ghost cards], with <0–3 satellites> ' +
  '[linked by dashed connectors <from → to>]; the moment: <what acts> (AI|brand); labels: ' +
  '<0–3 real nouns from the body, or none>.';

const REQUIRED = [
  PLANNER_SENTENCE,
  '--private-gradient-start',
  '--private-ai-primary-start',
  '--text-link-default',
  '--text-base',
  '--surface-subtle',
  '--text-semantic-skeleton',
];

/** The type test — one line, byte-identical in the motion rule (codegen) and `small-format.md`
 *  (planner). */
const TYPE_TEST =
  'Type: a process — something arrives, is forwarded, is sent, or turns into something else — ' +
  'is a **story**; the user doing something to the product — upload, connect, add, drag, click — ' +
  'is an **interaction**; a lasting claim — secure, compliant, included, every night — is a ' +
  '**state**. A user action wins over a process, a process over a claim.';

const MOTION_RULE = join(WIREFRAME_RULES, 'shared', 'small-format-motion.md');
const MOTION_FRONTMATTER = '---\nsmall: true\nmotion: [animation]\n---';
const MOTION_MAX_CHARS = 8000;
const MOTION_HEADINGS = [
  '# Small-format motion — three highlight-moment types',
  '## Type test',
  '## Story — a morph with a climax',
  '## Interaction — a UI animation',
  '## State — an icon story with background motion',
  '## Shared rules',
  '## Still renders',
];
const MOTION_REQUIRED = [
  'bezier(0.2, 1.8, 0.4, 1)',
  'icon story',
  'Text-bearing satellites and labels never recoil.',
  'one blurred glow',
];
/** The five morph moves and the five background devices, each required as a bold defined term:
 *  a bare substring would survive deleting its definition ("unfolds", "press ripples" occur
 *  elsewhere in the rule). */
const MOTION_TERMS = [
  'unfold', 'stretch', 'split', 'settle in', 'launch',
  'ripples', 'particles', 'dot field', 'orbit', 'light sweep',
];

/** The retired layouts and their pattern names; `\s+` so a line wrap cannot hide a phrase,
 *  `[*_]*` so Markdown emphasis cannot either. */
const RETIRED = /icon-story|cropped\s+product\s+frame|small-cropped-frame|small-icon-story|CROP,\s+not|crops[*_]*\s+the\s+frame|important\s+corner/gi;

/** Frame-layout rules agent-svc must never inline on a small canvas (`small: false` = not small). */
const NOT_SMALL = ['constrained-viewport.md', 'demonstration-frame.md', 'floating-card.md']
  .map((name) => join(WIREFRAME_RULES, 'shared', name));
/** Large-canvas-only teaching: allowed only in a file scoped `small: false`. */
const NOT_SMALL_ONLY = /Square\s+canvas\s+override/gi;
const FM = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const scopedNotSmall = (text) => /^small:\s*false\s*$/m.test(text.match(FM)?.[1] ?? '');
const TEXT_EXT = new Set(['.md', '.ts', '.tsx', '.js', '.mjs', '.cjs', '.json', '.yml', '.yaml', '.txt', '.css']);

const rel = (p) => relative(ROOT, p);
const failures = [];
const fail = (check, msg) => failures.push(`FAIL (${check}) ${msg}`);

function cannotDetermine(why) {
  console.error(`CANNOT DETERMINE — ${why}`);
  process.exit(2);
}

// ── (a) + (b): the shared rule ──────────────────────────────────────────────
let ruleChars = null;
if (!existsSync(RULE)) {
  fail('a', `${rel(RULE)} is missing`);
} else {
  const text = readFileSync(RULE, 'utf8');
  ruleChars = text.length;
  if (!text.startsWith(FRONTMATTER)) {
    fail('a', `${rel(RULE)} does not start with ${JSON.stringify(FRONTMATTER)}`);
  }
  if (text.length >= MAX_CHARS) {
    fail('a', `${rel(RULE)} is ${text.length} chars (limit: under ${MAX_CHARS})`);
  }
  for (const m of text.matchAll(HEX)) {
    const line = text.slice(0, m.index).split('\n').length;
    fail('a', `${rel(RULE)}:${line} carries hex ${m[0]} (fallback hex belongs in agent-svc)`);
  }
  for (const needle of REQUIRED) {
    if (!text.includes(needle)) {
      fail('b', `${rel(RULE)} lacks ${JSON.stringify(needle)}`);
    }
  }
  const typeLines = text.split('\n').filter((l) => l.startsWith('Type: '));
  if (!text.split('\n').includes(TYPE_TEST)) {
    fail('b', `${rel(RULE)} lacks the type-test line verbatim, on a line of its own`);
  }
  if (existsSync(MOTION_RULE)) {
    const motionTypeLines = readFileSync(MOTION_RULE, 'utf8').split('\n').filter((l) => l.startsWith('Type: '));
    if (typeLines.length !== 1 || motionTypeLines.length !== 1 || typeLines[0] !== motionTypeLines[0]) {
      fail('b', 'the type-test line in small-format.md and small-format-motion.md differ (or are not exactly one each)');
    }
  }
}

// ── (c): the per-brand files are gone ───────────────────────────────────────
for (const file of DELETED) {
  if (existsSync(file)) fail('c', `${rel(file)} still exists`);
}

// ── (d): no retired layout anywhere under skills/ ───────────────────────────
if (!existsSync(SKILLS)) cannotDetermine(`${rel(SKILLS)} not found`);

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile() && TEXT_EXT.has(extname(entry.name))) yield full;
  }
}

let scanned = 0;
let markdown = 0;
for (const file of walk(SKILLS)) {
  scanned += 1;
  if (file.endsWith('.md')) markdown += 1;
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(RETIRED)) {
    const line = text.slice(0, m.index).split('\n').length;
    fail('d', `${rel(file)}:${line} names a retired layout: ${JSON.stringify(m[0].replace(/\s+/g, ' '))}`);
  }
  if (!scopedNotSmall(text)) {
    for (const m of text.matchAll(NOT_SMALL_ONLY)) {
      const line = text.slice(0, m.index).split('\n').length;
      fail('d', `${rel(file)}:${line} teaches ${JSON.stringify(m[0].replace(/\s+/g, ' '))} in a file a small canvas can read (scope it \`small: false\`)`);
    }
  }
}
if (markdown === 0) cannotDetermine(`scanned ${scanned} files under ${rel(SKILLS)} but no Markdown — wrong root?`);
for (const file of NOT_SMALL) {
  if (!existsSync(file)) fail('d', `${rel(file)} is missing`);
  else if (!scopedNotSmall(readFileSync(file, 'utf8'))) fail('d', `${rel(file)} lacks the \`small: false\` frontmatter (it teaches a product frame)`);
}

// ── (e): the embed rules name the photo as the central object ───────────────
const EMBED_SENTENCE =
  'On a small canvas (both sides ≤ 512px) the generated photo is the central object of the ' +
  'highlight moment (uds-wireframe shared/small-format.md)';
for (const name of ['embed-floating-intersect.md', 'embed-inline-asset.md', 'embed-image-backdrop-full.md', 'embed-interface-asset.md']) {
  const file = join(SKILLS, 'uds-ui-core', 'rules', 'shared', name);
  if (!existsSync(file)) {
    fail('e', `${rel(file)} is missing`);
  } else if (!readFileSync(file, 'utf8').replace(/\s+/g, ' ').includes(EMBED_SENTENCE)) {
    fail('e', `${rel(file)} lacks the small-canvas central-object sentence`);
  }
}

// ── (f): the motion rule ────────────────────────────────────────────────────
let motionChars = null;
if (!existsSync(MOTION_RULE)) {
  fail('f', `${rel(MOTION_RULE)} is missing`);
} else {
  const text = readFileSync(MOTION_RULE, 'utf8');
  motionChars = text.length;
  if (!text.startsWith(`${MOTION_FRONTMATTER}\n`)) {
    fail('f', `${rel(MOTION_RULE)} does not open with exactly ${JSON.stringify(MOTION_FRONTMATTER)}`);
  }
  if (text.length > MOTION_MAX_CHARS) {
    fail('f', `${rel(MOTION_RULE)} is ${text.length} chars (limit: ${MOTION_MAX_CHARS})`);
  }
  for (const m of text.matchAll(HEX)) {
    const line = text.slice(0, m.index).split('\n').length;
    fail('f', `${rel(MOTION_RULE)}:${line} carries hex ${m[0]} (colours are token roles or white)`);
  }
  const lines = text.split('\n');
  for (const heading of MOTION_HEADINGS) {
    if (!lines.includes(heading)) fail('f', `${rel(MOTION_RULE)} lacks the heading ${JSON.stringify(heading)}`);
  }
  if (!lines.includes(TYPE_TEST)) {
    fail('f', `${rel(MOTION_RULE)} lacks the type-test line verbatim, on a line of its own`);
  }
  const flat = text.replace(/\s+/g, ' ');
  for (const needle of MOTION_REQUIRED) {
    if (!flat.includes(needle)) fail('f', `${rel(MOTION_RULE)} lacks ${JSON.stringify(needle)}`);
  }
  for (const term of MOTION_TERMS) {
    if (!flat.includes(`**${term}**`)) fail('f', `${rel(MOTION_RULE)} does not define ${JSON.stringify(term)} (as **${term}**)`);
  }
}

// ── report ──────────────────────────────────────────────────────────────────
if (VERBOSE) {
  console.log(`rule: ${ruleChars === null ? 'missing' : `${ruleChars} chars`}; motion rule: ${motionChars === null ? 'missing' : `${motionChars} chars`}; scanned ${scanned} files (${markdown} .md) under ${rel(SKILLS)}`);
}
if (failures.length > 0) {
  for (const f of failures) console.log(f);
  console.log(`\n${failures.length} violation(s).`);
  process.exit(1);
}
console.log(`OK — (a)–(f) green: rule ${ruleChars} chars, motion rule ${motionChars} chars, no hex; ${scanned} files under skills/ clean.`);
