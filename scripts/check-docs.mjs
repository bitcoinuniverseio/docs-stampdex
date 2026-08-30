// Checks every markdown file for the em dash, mojibake bytes, and broken
// relative links or images. Exits 1 with a list of findings.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const BAD_CHARS = [0x2014, 0x00e2, 0x00c2, 0x00c3, 0xfffd];
const NEWLINE = String.fromCharCode(10);

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.md')) files.push(p);
  }
};
walk(ROOT);

const findings = [];
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const code of BAD_CHARS) {
    const idx = text.indexOf(String.fromCharCode(code));
    if (idx !== -1) {
      const line = text.slice(0, idx).split('\n').length;
      findings.push(`${file}:${line} contains U+${code.toString(16).toUpperCase().padStart(4, '0')}`);
    }
  }
  // Relative links and images: [text](path) where path has no scheme.
  for (const match of text.matchAll(/\]\(([^)#\s]+)(?:#[^)\s]*)?\)/g)) {
    const target = match[1];
    if (/^[a-z]+:/i.test(target)) continue;
    const targetPath = resolve(dirname(file), target);
    if (!existsSync(targetPath)) {
      const line = text.slice(0, match.index).split('\n').length;
      findings.push(`${file}:${line} broken relative link: ${target}`);
    }
  }
  // HTML img/src and srcset references.
  for (const match of text.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    const target = match[1];
    if (/^[a-z]+:/i.test(target)) continue;
    const targetPath = resolve(dirname(file), target);
    if (!existsSync(targetPath)) {
      const line = text.slice(0, match.index).split('\n').length;
      findings.push(`${file}:${line} missing asset: ${target}`);
    }
  }
}

// The wallet capability tables are generated from
// `frontend/src/wallet/capabilities.js` in the `stampdex` repository. Hand
// editing them makes this page disagree with the product, which is the one
// thing the page exists to prevent. Check the markers are intact and that
// every wallet named above the table also appears inside it.
const walletsPage = join(ROOT, 'docs', 'wallets.md');
if (existsSync(walletsPage)) {
  const text = readFileSync(walletsPage, 'utf8');
  for (const block of ['wallet-capabilities', 'wallet-native-display']) {
    const open = `<!-- generated:${block} -->`;
    const close = `<!-- end:${block} -->`;
    const from = text.indexOf(open);
    const to = text.indexOf(close);
    if (from === -1 || to === -1 || to < from) {
      findings.push(`${walletsPage}: the ${block} block is missing or out of order`);
      continue;
    }
    const rows = text
      .slice(from + open.length, to)
      .split(NEWLINE)
      .filter((line) => line.trim().startsWith('|'));
    if (rows.length < 3) {
      findings.push(`${walletsPage}: the ${block} block has no table`);
    }
  }
  const header = text.split(NEWLINE).find((line) => line.startsWith('| Action |')) ?? '';
  for (const wallet of ['Universe Wallet', 'UniSat', 'Leather', 'Xverse', 'OKX Wallet']) {
    if (!header.includes(wallet)) {
      findings.push(`${walletsPage}: ${wallet} is offered but not in the capability table`);
    }
  }
}

if (findings.length) {
  console.error(findings.join('\n'));
  process.exit(1);
}
console.log(`Checked ${files.length} markdown files. No em dash, no mojibake, no broken relative link.`);
