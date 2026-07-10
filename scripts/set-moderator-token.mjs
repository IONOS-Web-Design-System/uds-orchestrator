#!/usr/bin/env node
// set-moderator-token.mjs — store the uds-moderator bearer key (and optional base
// URL) in the user's Claude Code settings (~/.claude/settings.json) `env` block,
// merge-safe. Once set, the /imagine command finds $MODERATOR_TOKEN automatically
// with no re-entry — the key lives in the user's own config, never in the command.
//
// Usage:
//   node scripts/set-moderator-token.mjs                      # hidden prompt for the token
//   node scripts/set-moderator-token.mjs --base <url>         # also set MODERATOR_BASE
//   MODERATOR_TOKEN=… node scripts/set-moderator-token.mjs    # non-interactive (e.g. from a tool)
//
// Notes:
//   - Preserves any existing settings.json content; only sets env.MODERATOR_TOKEN
//     (and env.MODERATOR_BASE when --base is given).
//   - Refuses to overwrite a settings.json that is present but not valid JSON.
//   - Claude Code reads settings `env` at session start, so restart the session
//     (or open a new one) for the change to take effect.
import { readFileSync, writeFileSync, mkdirSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const argv = process.argv.slice(2);
let base = '';
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--base') { base = argv[i + 1] || ''; i++; }
}

function promptHidden(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    process.stdout.write(question);
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    let buf = '';
    const onData = (ch) => {
      if (ch === '\n' || ch === '\r' || ch === '') {
        stdin.setRawMode?.(false); stdin.pause(); stdin.removeListener('data', onData);
        process.stdout.write('\n'); resolve(buf);
      } else if (ch === '') { process.stdout.write('\n'); process.exit(1); } // Ctrl-C
      else if (ch === '' || ch === '\b') { buf = buf.slice(0, -1); }          // backspace
      else buf += ch;
    };
    stdin.on('data', onData);
  });
}

let token = process.env.MODERATOR_TOKEN || '';
if (!token) {
  if (!process.stdin.isTTY) {
    console.error('No token: set MODERATOR_TOKEN in the environment, or run this in a terminal.');
    process.exit(1);
  }
  token = await promptHidden('Paste your uds-moderator token (hidden): ');
}
token = token.trim();
if (!token) { console.error('No token provided.'); process.exit(1); }

const dir = join(homedir(), '.claude');
const path = join(dir, 'settings.json');
mkdirSync(dir, { recursive: true });

let cfg = {};
try {
  const raw = readFileSync(path, 'utf8');
  cfg = JSON.parse(raw);
  if (typeof cfg !== 'object' || cfg === null || Array.isArray(cfg)) throw new Error('not an object');
} catch (e) {
  if (e.code !== 'ENOENT') {
    console.error(`Existing ${path} is not valid JSON — refusing to overwrite. Fix or remove it first.`);
    process.exit(1);
  }
  cfg = {};
}

if (typeof cfg.env !== 'object' || cfg.env === null || Array.isArray(cfg.env)) cfg.env = {};
cfg.env.MODERATOR_TOKEN = token;
if (base) cfg.env.MODERATOR_BASE = base;

writeFileSync(path, JSON.stringify(cfg, null, 2) + '\n');
try { chmodSync(path, 0o600); } catch { /* best-effort */ }

console.log(`✓ wrote ${path} → env.MODERATOR_TOKEN set${base ? `, env.MODERATOR_BASE=${base}` : ''}`);
console.log('  Restart your Claude Code session (or open a new one) so the env is picked up.');
