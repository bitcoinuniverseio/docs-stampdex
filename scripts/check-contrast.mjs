// WCAG 2.2 contrast gate for the palette in src/styles/tokens.css.
//
// The four semantic colours appear as label text on their own wash inside
// diagram cells and chips, in both themes. Brand orange appears as text on
// light and dark surfaces. Status inks appear on panels and on their own
// washes. Shell text sits on the dark navigation surface in both themes.
// Those are the pairings most likely to drift when somebody adjusts a
// colour, so they are checked here rather than left to a manual audit. Text
// pairings need 4.5:1; strokes and focus rings, which carry meaning without
// carrying words, need 3:1.
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const css = readFileSync(join(ROOT, 'src', 'styles', 'tokens.css'), 'utf8');

/** The custom properties declared inside one selector block. */
function tokensIn(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`selector not found: ${selector}`);
  const open = css.indexOf('{', start);
  const close = css.indexOf('}', open);
  const block = css.slice(open + 1, close);
  const tokens = {};
  for (const match of block.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{3,8})\s*;/gi)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}

const light = tokensIn(':root {');
const dark = tokensIn(":root[data-theme='dark'] {");

const channels = (h) => {
  const clean = h.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};
const linear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const luminance = (h) => {
  const [r, g, b] = channels(h).map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [luminance(a), luminance(b)];
  const [hi, lo] = x > y ? [x, y] : [y, x];
  return (hi + 0.05) / (lo + 0.05);
};

const SIDES = ['bid', 'ask', 'venue', 'chain'];
const STATUSES = ['ok', 'warn', 'err', 'info'];

const pairs = [];
for (const [themeName, t] of [
  ['light', light],
  ['dark', dark],
]) {
  pairs.push(
    [`${themeName}: body text on panel`, t['--sd-ink'], t['--sd-panel'], 4.5],
    [`${themeName}: body text on canvas`, t['--sd-ink'], t['--sd-bg'], 4.5],
    [`${themeName}: body text on inset`, t['--sd-ink'], t['--sd-inset'], 4.5],
    [`${themeName}: muted on panel`, t['--sd-muted'], t['--sd-panel'], 4.5],
    [`${themeName}: muted on panel-2`, t['--sd-muted'], t['--sd-panel-2'], 4.5],
    [`${themeName}: muted on canvas`, t['--sd-muted'], t['--sd-bg'], 4.5],
    // The navigation surface is dark in both themes.
    [
      `${themeName}: shell text on nav`,
      t['--sd-ink-inverse'],
      t['--sd-nav'],
      4.5,
    ],
    [
      `${themeName}: shell muted on nav`,
      t['--sd-muted-inverse'],
      t['--sd-nav'],
      4.5,
    ],
    // Brand orange is text on light surfaces, accent on dark surfaces.
    [
      `${themeName}: brand text on panel`,
      t['--sd-brand-text'],
      t['--sd-panel'],
      4.5,
    ],
    [`${themeName}: brand text on canvas`, t['--sd-brand-text'], t['--sd-bg'], 4.5],
    [
      `${themeName}: brand accent on nav`,
      t['--sd-brand-accent'],
      t['--sd-nav'],
      4.5,
    ],
    [
      `${themeName}: focus ring on panel`,
      t['--sd-focus'],
      t['--sd-panel'],
      3,
    ],
  );
  for (const side of SIDES) {
    pairs.push(
      [
        `${themeName}: ${side} label on its wash`,
        t[`--sd-${side}`],
        t[`--sd-${side}-wash`],
        4.5,
      ],
      [
        `${themeName}: muted label on ${side} wash`,
        t['--sd-muted'],
        t[`--sd-${side}-wash`],
        4.5,
      ],
      [
        `${themeName}: ${side} stroke on panel`,
        t[`--sd-${side}`],
        t['--sd-panel'],
        3,
      ],
    );
  }
  for (const status of STATUSES) {
    pairs.push(
      [
        `${themeName}: ${status} ink on panel`,
        t[`--sd-${status}`],
        t['--sd-panel'],
        4.5,
      ],
      [
        `${themeName}: ${status} ink on its wash`,
        t[`--sd-${status}`],
        t[`--sd-${status}-wash`],
        4.5,
      ],
    );
  }
}

const findings = [];
for (const [name, fg, bg, min] of pairs) {
  if (!fg || !bg) {
    findings.push(`${name}: a colour token is missing`);
    continue;
  }
  const ratio = contrast(fg, bg);
  if (ratio < min) {
    findings.push(`${name}: ${ratio.toFixed(2)}:1, needs ${min}:1 (${fg} on ${bg})`);
  }
}

if (findings.length > 0) {
  console.error('Contrast failures:');
  console.error(findings.map((line) => `  ${line}`).join('\n'));
  process.exit(1);
}

console.log(`Checked ${pairs.length} colour pairs in both themes. All meet WCAG 2.2 AA.`);
