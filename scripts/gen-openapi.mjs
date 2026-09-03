// Pulls the generated public OpenAPI document from the StampDEX application
// repository into src/generated/openapi.json, with provenance.
//
// The document is produced by backend/scripts/generate-openapi.mjs in the
// application repository and drift-checked there by its own suite. This
// script only fetches and stamps it: the documentation never edits the
// contract.
//
//   STAMPDEX_GH_TOKEN=... node scripts/gen-openapi.mjs [ref]
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'generated');
const REPO = 'bitcoinuniverseio/stampdex';
const REF = process.argv[2] ?? process.env.STAMPDEX_OPENAPI_REF ?? 'main';
const token = process.env.STAMPDEX_GH_TOKEN;

const headers = {
  'user-agent': 'docs-stampdex-openapi-snapshot',
  accept: 'application/vnd.github.raw+json',
};
if (token) headers.authorization = `Bearer ${token}`;

const specUrl = `https://api.github.com/repos/${REPO}/contents/backend/openapi/public.json?ref=${REF}`;
const res = await fetch(specUrl, { headers, signal: AbortSignal.timeout(20000) });
if (!res.ok) {
  console.error(`OpenAPI fetch from ${REPO}@${REF} answered ${res.status}.`);
  process.exit(1);
}
const spec = await res.text();

// A document that is not OpenAPI 3.1 does not enter the build.
let parsed;
try {
  parsed = JSON.parse(spec);
} catch {
  console.error('The fetched document is not valid JSON.');
  process.exit(1);
}
if (parsed.openapi !== '3.1.0') {
  console.error(`Expected OpenAPI 3.1.0, got ${parsed.openapi}.`);
  process.exit(1);
}
const pathCount = Object.keys(parsed.paths ?? {}).length;
if (pathCount < 5) throw new Error(`implausibly few paths (${pathCount})`);
for (const [path, methods] of Object.entries(parsed.paths)) {
  if (/admin|operator|internal/i.test(path)) {
    console.error(`non-public path leaked into the document: ${path}`);
    process.exit(1);
  }
}

mkdirSync(OUT, { recursive: true });
writeFileSync(
  join(OUT, 'openapi.json'),
  JSON.stringify(
    {
      schema: 'stampdex.docs.openapi-snapshot/1',
      provenance: {
        repository: REPO,
        sourcePath: 'backend/openapi/public.json',
        sourceRef: REF,
        fetchedAt: new Date().toISOString(),
        generator: 'scripts/gen-openapi.mjs',
      },
      spec: parsed,
    },
    null,
    2,
  ) + '\n',
);
console.log(`openapi.json: ${pathCount} paths from ${REPO}@${REF.slice(0, 7)}`);
