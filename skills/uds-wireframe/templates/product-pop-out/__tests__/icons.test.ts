import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { ReactElement } from 'react';
import {
  AI_SVG, SEND_SVG, SEND_ICON, ACTION_ICON, AiIcon, FlatIcon, AI_ICON_NAMES,
} from '../promptWindow.icons.js';

const require_ = createRequire(import.meta.url);
const manifest = JSON.parse(
  readFileSync(require_.resolve('@ionos-web-design-system/icon/icon-names'), 'utf8'),
) as { system: string[] };
const SYSTEM = new Set(manifest.system);

/** Every icon name the template can ever reference — read from the module's own maps, so
 *  this list cannot drift from what the component actually imports. */
const ALL_NAMES: string[] = [
  ...AI_ICON_NAMES, ...Object.values(SEND_ICON), ...Object.values(ACTION_ICON),
];

describe('icon provenance', () => {
  it('every name the template uses exists in the installed system iconset', () => {
    // An icon-package upgrade that drops one of these fails HERE, in CI, instead of
    // failing a production render as `Module not found` inside the render bundle.
    for (const name of ALL_NAMES) expect(SYSTEM.has(name), name).toBe(true);
  });

  it('resolves every AI name and send/action glyph to a base64 svgData URI', () => {
    for (const name of AI_ICON_NAMES) {
      expect(AI_SVG[name], name).toMatch(/^data:image\/svg\+xml;base64,/);
    }
    for (const svg of Object.values(SEND_SVG)) {
      expect(svg).toMatch(/^data:image\/svg\+xml;base64,/);
    }
  });

  it('excludes star and filled-star — they are never AI icons', () => {
    expect(AI_ICON_NAMES).not.toContain('star');
    expect(AI_ICON_NAMES).not.toContain('filled-star');
  });

  it('lists only the five AI icons that actually ship (filled-ai-phone does not)', () => {
    expect([...AI_ICON_NAMES]).toEqual([
      'filled-sparkles', 'filled-generative-write', 'filled-generative-wand',
      'filled-chat-ai', 'filled-envelope-ai',
    ]);
    expect(SYSTEM.has('filled-ai-phone')).toBe(false);
  });
});

describe('paint mode', () => {
  it('paints an AI icon with the gradient as background, never backgroundColor', () => {
    const el = AiIcon({ svg: AI_SVG['filled-sparkles'], size: 24 }) as ReactElement;
    const style = el.props.style as Record<string, unknown>;
    expect(style.background).toBe('linear-gradient(45deg, #095BB1, #D746F5)');
    expect(style.backgroundColor).toBeUndefined();
    expect(style.maskImage).toBe(`url(${AI_SVG['filled-sparkles']})`);
    expect(style.WebkitMaskImage).toBe(`url(${AI_SVG['filled-sparkles']})`);
    expect(style.width).toBe(24);
    expect(style.height).toBe(24);
  });

  it('paints a non-AI glyph with a flat backgroundColor, never a gradient', () => {
    const el = FlatIcon({ svg: SEND_SVG.arrow, size: 18, colour: '#FFFFFF' }) as ReactElement;
    const style = el.props.style as Record<string, unknown>;
    expect(style.backgroundColor).toBe('#FFFFFF');
    expect(style.background).toBeUndefined();
    expect(style.maskSize).toBe('contain');
    expect(style.maskRepeat).toBe('no-repeat');
    expect(style.maskPosition).toBe('center');
  });

  it('maps every send glyph to a real system glyph name', () => {
    expect(SEND_ICON).toEqual({ arrow: 'arrow-right', 'paper-plane': 'filled-paper-plane' });
  });

  it('maps every action to a real system glyph name', () => {
    expect(ACTION_ICON).toEqual({
      edit: 'edit-square',
      regenerate: 'refresh',
      attach: 'attachement',   // sic — the package spells it this way
      voice: 'mic',
    });
  });
});
