// Copy guard for every markdown and MDX file, plus the components that carry
// prose. Refuses the long dash, mojibake bytes, the banned authority word,
// hype vocabulary, and broken relative links or images.
//
// Also holds the wallet capability table to its contract: the table is a
// transcription of `frontend/src/wallet/capabilities.js` in the `stampdex`
// repository, and every wallet the page offers must appear in it. A page that
// disagrees with the product is the one thing this page exists to prevent.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const NEWLINE = String.fromCharCode(10);

// U+2014 long dash, and the byte sequences a mis-decoded UTF-8 file shows.
const BAD_CHARS = [0x2014, 0x00e2, 0x00c2, 0x00c3, 0xfffd];

// The word the organisation does not use in prose for "authoritative".
const BANNED_WORD = new RegExp(
  ['c', 'a', 'n', 'o', 'n', 'i', 'c', 'a', 'l'].join(''),
  'i',
);

const HYPE = [
  'comprehensive',
  'robust',
  'seamless',
  'world-class',
  'revolutionary',
  'cutting-edge',
  'game-changing',
  'best-in-class',
  'blazing fast',
  'coming soon',
];

const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.astro']);

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(md|mdx|astro)$/.test(name)) files.push(p);
  }
};
walk(ROOT);

const findings = [];
const lineOf = (text, index) => text.slice(0, index).split(NEWLINE).length;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const where = file.slice(ROOT.length + 1).replace(/\\/g, '/');

  for (const code of BAD_CHARS) {
    const idx = text.indexOf(String.fromCharCode(code));
    if (idx !== -1) {
      findings.push(
        `${where}:${lineOf(text, idx)} contains U+${code
          .toString(16)
          .toUpperCase()
          .padStart(4, '0')}`,
      );
    }
  }

  // The banned word is allowed only as the rel="canonical" HTML attribute.
  for (const match of text.matchAll(/[A-Za-z-]+/g)) {
    if (!BANNED_WORD.test(match[0])) continue;
    const context = text.slice(Math.max(0, match.index - 24), match.index + 24);
    if (/rel=|link rel|HTML attribute/i.test(context)) continue;
    findings.push(`${where}:${lineOf(text, match.index)} uses the banned authority word`);
  }

  for (const word of HYPE) {
    const re = new RegExp(`\\b${word}\\b`, 'i');
    const match = re.exec(text);
    if (match) {
      findings.push(`${where}:${lineOf(text, match.index)} hype word "${word}"`);
    }
  }

  // Relative links and images. Site-absolute paths starting with "/" are
  // validated against the built output by scripts/check-links.mjs instead.
  for (const match of text.matchAll(/\]\(([^)#\s]+)(?:#[^)\s]*)?\)/g)) {
    const target = match[1];
    if (/^[a-z]+:/i.test(target) || target.startsWith('/')) continue;
    if (!existsSync(resolve(dirname(file), target))) {
      findings.push(`${where}:${lineOf(text, match.index)} broken relative link: ${target}`);
    }
  }
}

// The wallet capability table.
const walletsPage = join(ROOT, 'src', 'content', 'docs', 'reference', 'wallets.mdx');
if (!existsSync(walletsPage)) {
  findings.push('src/content/docs/reference/wallets.md is missing');
} else {
  const text = readFileSync(walletsPage, 'utf8');
  const header = text.split(NEWLINE).find((line) => line.startsWith('| Action |')) ?? '';
  for (const wallet of ['Universe Wallet', 'UniSat', 'Leather', 'Xverse', 'OKX Wallet']) {
    if (!header.includes(wallet)) {
      findings.push(`wallets.md: ${wallet} is offered but not in the capability table`);
    }
  }
  const rows = text.split(NEWLINE).filter((line) => /^\| [A-Z]/.test(line));
  if (rows.length < 15) {
    findings.push(`wallets.md: the capability table has only ${rows.length} rows`);
  }
}

// The registry data the capability tables are generated from must be present
// and must still carry both protocols.
const registryPath = join(ROOT, 'src', 'data', 'registry.json');
if (!existsSync(registryPath)) {
  findings.push('src/data/registry.json is missing');
} else {
  const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
  for (const id of ['stamps', 'src20']) {
    const entry = registry.protocols?.[id];
    if (!entry) {
      findings.push(`registry.json: no "${id}" entry`);
      continue;
    }
    for (const action of entry.marketplace.actions.unsupported) {
      if (!action.reason || action.reason.length < 10) {
        findings.push(`registry.json: ${id}.${action.action} has no usable reason`);
      }
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join(NEWLINE));
  process.exit(1);
}
console.log(
  `Checked ${files.length} content files. No long dash, no mojibake, no banned word, no hype, no broken relative link.`,
);
