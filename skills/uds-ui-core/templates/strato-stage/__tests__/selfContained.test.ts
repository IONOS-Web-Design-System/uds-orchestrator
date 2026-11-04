import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
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
const STAGE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const RELATIVE_REQUEST = /(?:\bfrom\s*|\bimport\s*\(?\s*)'(\.[^']*)'/g;

/** The relative requests in `src` that leave the directory they are written in. */
const escaping = (src: string): string[] =>
  [...src.matchAll(RELATIVE_REQUEST)].map((m) => m[1]!).filter((spec) => !spec.startsWith('./'));

describe('strato-stage is self-contained', () => {
  const shipped = readdirSync(STAGE_DIR, { withFileTypes: true })
    .filter((e) => e.isFile() && /\.tsx?$/.test(e.name))
    .map((e) => e.name);

  it('the check finds the shipped files and flags an escaping import', () => {
    expect(shipped).toEqual(expect.arrayContaining(['geometry.ts', 'layers.ts', 'motion.ts', 'styles.ts', 'StratoStage.tsx']));
    expect(escaping(`import { STRATO_SIMPLE } from '../product-pop-out/promptWindow.strato';`)).toEqual(['../product-pop-out/promptWindow.strato']);
    expect(escaping(`import { VISUAL } from './geometry';`)).toEqual([]);
  });

  it('no shipped file imports outside strato-stage/', () => {
    const offenders = shipped.flatMap((f) => escaping(readFileSync(join(STAGE_DIR, f), 'utf8')).map((s) => `${f}: from '${s}'`));
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
