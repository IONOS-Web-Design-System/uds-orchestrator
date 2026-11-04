import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The stage's shipped files import nothing outside `strato-stage/`.
 *
 * agent-svc copies this directory ALONE into the compose workspace as `src/uds/strato-stage/`,
 * while `product-pop-out/` lands FLAT in `src/uds/` (copyUdsTemplates). A relative import that
 * leaves the directory therefore resolves here (`../product-pop-out/x`) but not there
 * (`../x`), and the compose render dies on the workspace tsc gate / the bundler. That is why
 * geometry.ts MIRRORS `STRATO_SIMPLE.aspect` instead of importing it (the mirror is locked by
 * geometry.test.ts). Tests are exempt: they are never copied.
 */
const STAGE_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/** Every module request: `from` (import and export), a bare `import`, `import(…)` and
 *  `require(…)`, quoted with ', " or a backtick (a template literal's `${…}` stays as text). */
const REQUEST = /(?:\bfrom|\bimport|\brequire)\s*\(?\s*(['"`])([^'"`]*)\1/g;

/** The path requests in `src` (a file in `fromDir`) that RESOLVE outside strato-stage/, whatever
 *  their spelling (`../x`, `./../x`, `./a/../../x`, `/abs`). A bare package specifier is resolved
 *  by the package manager, not by path, and is not checked. */
const escaping = (src: string, fromDir = STAGE_DIR): string[] =>
  [...src.matchAll(REQUEST)].map((m) => m[2]!).filter((spec) => {
    if (!spec.startsWith('.') && !spec.startsWith('/')) return false;
    const target = resolve(fromDir, spec);
    return target !== STAGE_DIR && !target.startsWith(STAGE_DIR + sep);
  });

/** What agent-svc copies: every .ts/.tsx under strato-stage/ except `__tests__/`, at any depth. */
function shippedFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const abs = join(dir, e.name);
    if (e.isDirectory()) return e.name === '__tests__' || e.name === 'node_modules' ? [] : shippedFiles(abs);
    return /\.tsx?$/.test(e.name) ? [abs] : [];
  });
}

describe('strato-stage is self-contained', () => {
  const files = shippedFiles(STAGE_DIR);
  const shipped = files.map((f) => relative(STAGE_DIR, f));

  it('the check finds the shipped files and flags an escaping import', () => {
    expect(shipped).toEqual(expect.arrayContaining(['geometry.ts', 'layers.ts', 'motion.ts', 'styles.ts', 'StratoStage.tsx']));
    // Every quote style and request form that leaves the directory is flagged.
    const flagged: [string, string][] = [
      [`import { STRATO_SIMPLE } from '../product-pop-out/promptWindow.strato';`, '../product-pop-out/promptWindow.strato'],
      [`import { STRATO_SIMPLE } from "../product-pop-out/x";`, '../product-pop-out/x'],
      [`import { X } from './../x';`, './../x'],
      ['const m = await import(`../product-pop-out/${name}`);', '../product-pop-out/${name}'],
      [`export * from '../x';`, '../x'],
      [`export { a } from "./sub/../../x";`, './sub/../../x'],
      [`import '../side-effect';`, '../side-effect'],
      [`const x = require("../x");`, '../x'],
      [`import type { Rect } from '/abs/geometry';`, '/abs/geometry'],
    ];
    for (const [src, spec] of flagged) expect(escaping(src), src).toEqual([spec]);
    // Requests that stay inside, and bare packages, are not.
    for (const src of [
      `import { VISUAL } from './geometry';`, `import { VISUAL } from "./geometry";`,
      `import { a } from './sub/../geometry';`, 'const g = await import(`./geometry`);',
      `import type { FC } from 'react';`, `import { AbsoluteFill } from "remotion";`,
    ]) expect(escaping(src), src).toEqual([]);
  });

  it('no shipped file imports outside strato-stage/', () => {
    const offenders = files.flatMap((f) =>
      escaping(readFileSync(f, 'utf8'), dirname(f)).map((spec) => `${relative(STAGE_DIR, f)}: '${spec}'`));
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
