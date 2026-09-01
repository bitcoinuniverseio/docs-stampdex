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

const rows = [
  { y: 300, label: 'THE TOKENS', a: 'Listing escrow', b: 'In the transfer tx', c: "Buyer's wallet" },
  { y: 400, label: 'THE BTC', a: 'Listing escrow', b: 'Listing escrow', c: "Seller's wallet" },
];

const cols = [
  { x: 320, w: 250, tone: 'venue' },
  { x: 586, w: 250, tone: 'venue' },
  { x: 852, w: 250, tone: 'done' },
];

const tone = {
  venue: { fill: '#201b3d', stroke: '#a99bf5', text: '#a99bf5' },
  done: { fill: '#0b2c2f', stroke: '#4fd6dd', text: '#4fd6dd' },
};

const cellText = (row, i) => [row.a, row.b, row.c][i];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0b0e13"/>
  <rect x="0" y="0" width="1200" height="6" fill="#a99bf5"/>
  <text x="72" y="112" fill="#e2e8f1" font-family="${MONO}" font-size="54" font-weight="700" letter-spacing="-1">StampDEX documentation</text>
  <text x="72" y="164" fill="#9aa7b8" font-family="${MONO}" font-size="27">The trading venue for Bitcoin Stamps and SRC-20</text>
  <text x="72" y="232" fill="#4fd6dd" font-family="${MONO}" font-size="24" font-weight="700">Where your funds are, at every stage of a trade</text>

  <text x="72" y="${rows[0].y + 40}" fill="#9aa7b8" font-family="${MONO}" font-size="20" font-weight="700" letter-spacing="2">${rows[0].label}</text>
  <text x="72" y="${rows[1].y + 40}" fill="#9aa7b8" font-family="${MONO}" font-size="20" font-weight="700" letter-spacing="2">${rows[1].label}</text>

  ${cols
    .map(
      (c) => `<text x="${c.x}" y="268" fill="#9aa7b8" font-family="${MONO}" font-size="18" letter-spacing="1.5">${
        c.x === 320 ? 'AWAITING TRANSFER' : c.x === 586 ? 'AWAITING CONF.' : 'FILLED'
      }</text>`,
    )
    .join('\n  ')}

  ${rows
    .map((row, ri) =>
      cols
        .map((c, ci) => {
          const t = ri === 0 && ci === 1 ? tone.done : ci === 2 ? tone.done : tone.venue;
          return `<rect x="${c.x}" y="${row.y}" width="${c.w}" height="62" rx="5" fill="${t.fill}" stroke="${t.stroke}" stroke-width="2"/>
  <text x="${c.x + 18}" y="${row.y + 39}" fill="${t.text}" font-family="${MONO}" font-size="21" font-weight="700">${cellText(row, ci)}</text>`;
        })
        .join('\n  '),
    )
    .join('\n  ')}

  <line x1="72" y1="510" x2="1128" y2="510" stroke="#2a323e" stroke-width="2"/>
  <text x="72" y="556" fill="#9aa7b8" font-family="${MONO}" font-size="22">Order lifecycle, settlement, custody, fees, and the public API</text>
  <text x="72" y="592" fill="#5b6675" font-family="${MONO}" font-size="20">bitcoinuniverseio.github.io/docs-stampdex</text>
</svg>`;

const out = join(ROOT, 'public', 'og.png');
const buffer = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync(out, buffer);
console.log(`Wrote ${out} (${(buffer.length / 1024).toFixed(1)} KB)`);
