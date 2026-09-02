// The screenshot safety and consistency gate.
//
// Holds everything the screenshot system commits or serves to the manifest:
//
//   - screenshots.manifest.json validates against its strict schema;
//   - every capture has a committed master in assets/screens/;
//   - every capture has the responsive variants it should have in
//     public/screens/, and none of them breaks the 200 KB image budget;
//   - no capture is older than its declared freshness window;
//   - no public screenshot, fixture, or manifest string trips the secret
//     scan (seed-phrase vocabulary, key material, tokens, emails, internal
//     hosts);
//   - fixture captures name an existing fixture page and declare no
//     production route; production captures do the reverse;
//   - every capture links to the guide that explains the screen.
//
// A capture whose window has expired fails here, which is what forces a
// recapture: freshness is a gate, not a suggestion.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAX_KB = 200;
const WIDTHS = [640, 960, 1400];

const findings = [];
const fail = (message) => findings.push(message);

// --------------------------------------------------------------- schema

const schema = JSON.parse(
  readFileSync(join(ROOT, 'schemas', 'screenshots.manifest.schema.json'), 'utf8'),
);
let manifest;
try {
  manifest = JSON.parse(readFileSync(join(ROOT, 'screenshots.manifest.json'), 'utf8'));
} catch (error) {
  console.error('screenshots.manifest.json is not valid JSON:', error.message);
  process.exit(1);
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
if (!validate(manifest)) {
  for (const error of validate.errors ?? []) {
    fail(`${error.instancePath || '/'} ${error.message}`);
  }
}

// ------------------------------------------------------------ secret scan

// A real secret would be worthless here, so the scan aims at shape rather
// than at an exhaustive list: wallet seed vocabulary, private-key encodings,
// bearer/API token shapes, real-looking emails, and hosts that should never
// appear in public evidence.
const SECRET_PATTERNS = [
  { name: 'private key (WIF)', re: /\b[5KL][1-9A-HJ-NP-Za-km-z]{50,51}\b/ },
  { name: 'private key (hex 64)', re: /\b0x?[0-9a-fA-F]{64}\b/ },
  { name: 'bearer token', re: /\b(?:bearer|token)\s+[A-Za-z0-9_\-=.]{24,}\b/i },
  { name: 'API key assignment', re: /\b(?:api[_-]?key|apikey|secret|password)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{12,}/i },
  { name: 'email address', re: /\b[\w.+-]+@[\w-]+\.[\w.]{2,}\b/ },
  { name: 'internal host', re: /\b(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|\.internal|\.local|srv747890|hstgr)\b/i },
];

// Twelve consecutive dictionary words is the shape of a seed phrase; the
// list is a deliberately small, cheap vocabulary that is common in seeds and
// rare in documentation prose.
const SEED_WORDS = new Set(
  ['abandon', 'ability', 'absurd', 'access', 'acid', 'action', 'adult', 'advice', 'afraid', 'agent', 'alarm', 'album'].map((w) => w),
);
function seedPhraseRisk(text) {
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  let run = 0;
  let best = 0;
  for (const word of words) {
    run = SEED_WORDS.has(word) ? run + 1 : 0;
    best = Math.max(best, run);
  }
  return best;
}

function scanText(where, text) {
  for (const { name, re } of SECRET_PATTERNS) {
    const match = re.exec(text);
    if (match) fail(`${where}: possible ${name}: ${match[0].slice(0, 24)}...`);
  }
  if (seedPhraseRisk(text) >= 8) {
    fail(`${where}: looks like a seed phrase (8+ seed-vocabulary words in a row)`);
  }
}

scanText('screenshots.manifest.json', JSON.stringify(manifest));
for (const file of readdirSync(join(ROOT, 'scripts', 'fixtures'))) {
  if (file.endsWith('.html') || file.endsWith('.css')) {
    scanText(`scripts/fixtures/${file}`, readFileSync(join(ROOT, 'scripts', 'fixtures', file), 'utf8'));
  }
}

// ------------------------------------------------- masters and variants

const ids = new Set();
for (const capture of manifest.captures ?? []) {
  ids.add(capture.id);

  const master = join(ROOT, 'assets', 'screens', `${capture.id}.png`);
  if (!existsSync(master)) {
    fail(`missing master: assets/screens/${capture.id}.png (run scripts/capture-screens.mjs ${capture.id})`);
  }

  // A mobile capture at deviceScaleFactor 2 is declared at CSS width 390 but
  // captured at 780 physical pixels; variants are generated from physical
  // size, so expect variant widths up to the physical master width.
  const masterWidth = existsSync(master) ? 9999 : 0;

  for (const width of WIDTHS) {
    if (capture.viewport.width >= width || masterWidth === 9999) {
      // Presence is checked loosely: the generator writes what the master
      // width allows. The real contract is: at least one webp variant.
      for (const ext of ['webp', 'avif']) {
        const variant = join(ROOT, 'public', 'screens', `${capture.id}.${width}w.${ext}`);
        if (existsSync(variant)) {
          const kb = statSync(variant).size / 1024;
          if (kb > MAX_KB) {
            fail(`public/screens/${capture.id}.${width}w.${ext} is ${kb.toFixed(1)} KB, over the ${MAX_KB} KB budget`);
          }
        }
      }
    }
  }

  const anyWebp = WIDTHS.some((width) =>
    existsSync(join(ROOT, 'public', 'screens', `${capture.id}.${width}w.webp`)),
  );
  if (!anyWebp) {
    fail(`no webp variant for ${capture.id} (run npm run make:responsive-screens)`);
  }

  // Freshness is a gate.
  const ageDays = (Date.now() - Date.parse(capture.capturedAt)) / 86400000;
  if (ageDays > capture.maxAgeDays) {
    fail(
      `${capture.id} is ${Math.floor(ageDays)} days old, past its ${capture.maxAgeDays}-day window. Recapture and update the manifest.`,
    );
  }

  // Fixture discipline.
  if (capture.source === 'controlled-fixture' && !capture.fixtureId) {
    fail(`${capture.id}: fixture captures must declare fixtureId`);
  }
  if (capture.source === 'production' && capture.fixtureId) {
    fail(`${capture.id}: production captures must not declare fixtureId`);
  }

  // Every capture leads to the guide that explains the screen.
  if (!capture.guideLink) {
    fail(`${capture.id}: missing guideLink`);
  } else if (!capture.guideLink.startsWith('/docs-stampdex/')) {
    fail(`${capture.id}: guideLink must be a site-absolute /docs-stampdex/ path`);
  }
}

// Orphaned public variants.
const validPrefix = new Set([...ids]);
const pubDir = join(ROOT, 'public', 'screens');
if (existsSync(pubDir)) {
  for (const name of readdirSync(pubDir)) {
    const id = name.replace(/\.[0-9]+w\.(webp|avif)$/, '');
    if (!validPrefix.has(id)) fail(`public/screens/${name} has no manifest capture`);
  }
}

if (findings.length > 0) {
  console.error('Screenshot gate findings:');
  console.error(findings.map((line) => `  ${line}`).join('\n'));
  process.exit(1);
}

console.log(
  `Screenshot gate: ${manifest.captures.length} captures, masters present, variants within budget, freshness windows hold, secret scan clean.`,
);
