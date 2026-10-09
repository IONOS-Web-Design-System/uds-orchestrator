import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * The guard `tsc` structurally cannot be.
 *
 * These files are copied into every agent-svc render workspace and bundled by REMOTION, not
 * by tsc. The two resolvers disagree about extensions:
 *
 *   - tsc under `moduleResolution: 'bundler'` accepts `./x.js` and silently maps it to `x.ts`.
 *   - Remotion's webpack resolve config is `extensions: ['.ts','.tsx','.web.js','.js','.jsx',
 *     '.mjs','.cjs']` with NO `extensionAlias` (`@remotion/bundler/dist/shared-bundler-config.js`,
 *     4.0.464). `./x.js` is therefore looked up literally, `x.js` does not exist, and the
 *     render dies with `Module not found` — on all 5 codegen attempts, un-repairable, because
 *     `src/uds/` is in agent-svc's PROTECTED_PREFIXES so no corrective write lands.
 *
 * So the templates CI typecheck, agent-svc's boot preflight and the per-run workspace tsc gate
 * ALL pass on a specifier that cannot be bundled. This test closes that gap by reading the real
 * specifiers off disk. `agent-svc/src/agents/prompt.ts` already states the same rule to codegen
 * ("Intra-template imports must NOT include file extensions"); this holds the template itself
 * to it.
 *
 * Applied to test files too. They are excluded from the workspace copy so they never reach the
 * bundler, but keeping one rule for the whole tree is what stops the fixed files from drifting
 * back by example.
 */

const HERE = dirname(fileURLToPath(import.meta.url));
/** `__tests__` -> `product-pop-out` -> `templates`. The whole templates tree, not just this dir. */
const TEMPLATES_ROOT = join(HERE, '..', '..');

/** Every extension either resolver could be handed. `.json` too — an extensioned JSON import
 *  resolves in both, but listing it keeps the rule "no extensions, ever" rather than a
 *  case-by-case exemption someone has to reason about. */
const EXTENSIONS = ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.json'];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name === 'node_modules' || e.name.startsWith('.')) return [];
    if (e.isDirectory()) return sourceFiles(join(dir, e.name));
    return /\.tsx?$/.test(e.name) ? [join(dir, e.name)] : [];
  });
}

/** `from '…'`, a bare side-effect `import '…'`, and a dynamic `import('…')` — the three forms
 *  that produce a module request. Only RELATIVE requests are our business: a bare package
 *  specifier's subpath (e.g. `@ionos-web-design-system/icon/system/mic`) is resolved through
 *  the package's exports map and is not affected by the extension list. */
const RELATIVE_REQUEST = /(?:\bfrom\s*|\bimport\s*\(?\s*)'(\.[^']*)'/g;

function relativeRequests(src: string): string[] {
  return [...src.matchAll(RELATIVE_REQUEST)].map((m) => m[1]!);
}

describe('intra-template import specifiers', () => {
  const files = sourceFiles(TEMPLATES_ROOT);

  // Anti-vacuity. A refactor that moves the tree, or a walk that silently returns [], would
  // otherwise make every assertion below pass by finding nothing to assert on.
  it('finds the templates tree and its relative imports', () => {
    expect(files.length).toBeGreaterThanOrEqual(4);
    const total = files.reduce((n, f) => n + relativeRequests(readFileSync(f, 'utf8')).length, 0);
    expect(total).toBeGreaterThanOrEqual(6);
  });

  it('carries no extension on any relative import, so Remotion can bundle them', () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const spec of relativeRequests(readFileSync(file, 'utf8'))) {
        if (EXTENSIONS.some((ext) => spec.endsWith(ext))) {
          offenders.push(`${relative(TEMPLATES_ROOT, file)}: from '${spec}'`);
        }
      }
    }
    // Named in the message so a failure says which specifier and which file, not just a count.
    expect(offenders, `extensioned relative import(s):\n${offenders.join('\n')}`).toEqual([]);
  });
});
