// Writes dist/.well-known/api-catalog after the build: the standards-based
// discovery document for the public API surfaces. The GitHub Pages base path
// applies, so the served URL is /docs-stampdex/.well-known/api-catalog.
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DIST = join(ROOT, 'dist');
const SITE = 'https://bitcoinuniverseio.github.io';
const BASE = '/docs-stampdex';

let version = 'unrecorded';
const snapshotPath = join(ROOT, 'src', 'generated', 'openapi.json');
if (existsSync(snapshotPath)) {
  const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'));
  version = snapshot.spec?.info?.version ?? version;
}

mkdirSync(join(DIST, '.well-known'), { recursive: true });
const catalog = {
  catalog: 'https://spec.openapis.org/api-catalog/v1/schema.json#',
  apis: [
    {
      name: 'StampDEX public API',
      description: 'The public, read-only surface of the StampDEX backend, generated from the registered public controllers.',
      'entrypointUrl': `${SITE}${BASE}/api/`,
      openapi: `${SITE}${BASE}/api/downloads/openapi.json`,
      version,
    },
  ],
  documentation: [
    {
      name: 'StampDEX documentation',
      url: `${SITE}${BASE}/`,
      description: 'How a trade is built, where funds sit at every stage, and what the venue can and cannot do.',
    },
  ],
};
writeFileSync(join(DIST, '.well-known', 'api-catalog'), JSON.stringify(catalog, null, 2) + '\n');
console.log('Wrote dist/.well-known/api-catalog');

// Machine-readable inputs the MCP server and agents read from the built site.
const filesToPublish = [
  ['src/data/registry.json', 'registry.json'],
  ['screenshots.manifest.json', 'screens.manifest.json'],
  ['src/data/release.json', 'generated/release-state.json'],
  ['src/generated/wallet-matrix.json', 'generated/wallet-matrix.json'],
  ['src/generated/order-states.json', 'generated/order-states.json'],
  ['src/generated/fee-policy.json', 'generated/fee-policy.json'],
];
for (const [from, to] of filesToPublish) {
  const src = join(ROOT, from);
  if (existsSync(src)) {
    mkdirSync(dirname(join(DIST, to)), { recursive: true });
    writeFileSync(join(DIST, to), readFileSync(src));
    console.log(`Published dist/${to}`);
  }
}
