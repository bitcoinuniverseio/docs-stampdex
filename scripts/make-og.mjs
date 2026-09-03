// Renders public/og.png, the social preview card, from an SVG written here.
// Run with `node scripts/make-og.mjs` after changing the design. The output is
// committed, so the site build needs no image pipeline.
import { writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);

const MONO =
  "ui-monospace, 'DejaVu Sans Mono', 'Liberation Mono', Consolas, monospace";

// The perforation strip: punched holes along the top, like a stamp.
const holes = Array.from({ length: 40 }, (_, i) => {
  const x = 40 + i * 28;
  return `<circle cx="${x}" cy="18" r="5" fill="#0b0e13"/>`;
}).join('\n  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0e13"/>
  <rect x="0" y="0" width="1200" height="36" fill="#f7931a"/>
  ${holes}

  <g transform="translate(72, 130)">
    <rect width="88" height="88" rx="20" fill="#131820" stroke="#2a323e" stroke-width="2"/>
    <g fill="#1c232e" transform="scale(2.75)">
      <circle cx="4" cy="16" r="1.3"/><circle cx="28" cy="16" r="1.3"/>
      <circle cx="16" cy="4" r="1.3"/><circle cx="16" cy="28" r="1.3"/>
    </g>
    <rect x="19" y="52" width="14" height="20" rx="3" fill="#4fd6dd"/>
    <rect x="37" y="36" width="14" height="36" rx="3" fill="#a99bf5"/>
    <rect x="55" y="19" width="14" height="53" rx="3" fill="#f0aa4a"/>
  </g>

  <text x="200" y="172" fill="#e2e8f1" font-family="${MONO}" font-size="56" font-weight="700" letter-spacing="-1">StampDEX Docs</text>
  <text x="200" y="222" fill="#9aa7b8" font-family="${MONO}" font-size="26">The trading venue for Bitcoin Stamps and SRC-20</text>

  <line x1="72" y1="286" x2="1128" y2="286" stroke="#2a323e" stroke-width="2"/>

  <text x="72" y="356" fill="#ffb15c" font-family="${MONO}" font-size="27" font-weight="700">Where your funds are, at every stage of a trade</text>
  <text x="72" y="404" fill="#9aa7b8" font-family="${MONO}" font-size="23">Order lifecycle, custody, fees, settlement, and the public read API</text>
  <text x="72" y="452" fill="#9aa7b8" font-family="${MONO}" font-size="23">Every page names its source, and the build it was checked against</text>

  <line x1="72" y1="512" x2="1128" y2="512" stroke="#2a323e" stroke-width="2"/>
  <text x="72" y="566" fill="#9aa7b8" font-family="${MONO}" font-size="24">bitcoinuniverseio.github.io/docs-stampdex</text>
  <text x="72" y="600" fill="#5b6675" font-family="${MONO}" font-size="20">Nothing here is financial advice.</text>
</svg>`;

const out = join(ROOT, 'public', 'og.png');
const buffer = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(out, buffer);
console.log(`Wrote ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
