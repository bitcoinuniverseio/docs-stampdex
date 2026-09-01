// Validates docs.manifest.json against the Bitcoin Universe documentation
// manifest schema, vendored at schemas/docs.manifest.schema.json from
// bitcoinuniverseio/docs-platform (packages/content-schema). Vendored so this
// check runs without the platform repository checked out beside us.
//
// Also enforces two things the schema cannot: that docsRoot exists, and that
// every path the manifest points at is really in the repository.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);

const manifestPath = process.argv[2]
  ? resolve(process.cwd(), process.argv[2])
  : join(ROOT, 'docs.manifest.json');

const schema = JSON.parse(
  readFileSync(join(ROOT, 'schemas', 'docs.manifest.schema.json'), 'utf8'),
);
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const findings = [];

if (!validate(manifest)) {
  for (const error of validate.errors ?? []) {
    findings.push(`${error.instancePath || '/'} ${error.message}`);
  }
}

const docsRoot = join(ROOT, manifest.docsRoot ?? '.');
if (!existsSync(docsRoot) || !statSync(docsRoot).isDirectory()) {
  findings.push(`docsRoot "${manifest.docsRoot}" is not a directory in this repository`);
}

if (manifest.capabilityManifest && !existsSync(join(ROOT, manifest.capabilityManifest))) {
  findings.push(`capabilityManifest "${manifest.capabilityManifest}" does not exist`);
}

for (const path of manifest.specifications ?? []) {
  if (!existsSync(join(ROOT, path))) {
    findings.push(`specifications entry "${path}" does not exist`);
  }
}

if (findings.length > 0) {
  console.error('docs.manifest.json is not valid:');
  console.error(findings.map((line) => `  ${line}`).join('\n'));
  process.exit(1);
}

console.log(
  `docs.manifest.json is valid. id=${manifest.id} lifecycle=${manifest.lifecycle} docsRoot=${manifest.docsRoot}`,
);
