// Contract tests for the MCP server tools, run against the built site.
//   node packages/stampdex-docs-mcp/test.mjs
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const DOCS = resolve(process.argv[2] ?? join(process.cwd(), 'dist'));
const serverPath = resolve(import.meta.dirname, 'index.mjs');

function callTool(payload) {
  const init = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'contract-test', version: '0' },
    },
  });
  const call = JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' });
  const req = JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: payload });
  const proc = spawnSync(process.execPath, [serverPath], {
    input: `${init}\n${call}\n${req}\n`,
    encoding: 'utf8',
    timeout: 30000,
    env: { ...process.env, DOCSDIR: DOCS },
  });
  const lines = proc.stdout.split('\n').filter((l) => l.trim());
  return JSON.parse(lines.at(-1));
}

const cases = [
  ['search', { name: 'stampdex_docs_search', arguments: { query: 'custody escrow' } }, (r) => r.includes('custody')],
  ['get_page', { name: 'stampdex_docs_get_page', arguments: { id: 'reference/fees' } }, (r) => r.includes('# Fees')],
  ['get_section', { name: 'stampdex_docs_get_section', arguments: { id: 'guides/psbt-review', heading: 'The service fee output' } }, (r) => r.includes('service fee')],
  ['get_api_operation', { name: 'stampdex_docs_get_api_operation', arguments: { path: '/api/v1/market/fees', method: 'get' } }, (r) => r.includes('operationId')],
  ['get_release', { name: 'stampdex_docs_get_release', arguments: {} }, (r) => r.length > 10],
  ['get_capability', { name: 'stampdex_docs_get_capability', arguments: { protocol: 'src20' } }, (r) => r.includes('buy')],
  ['get_wallet_support', { name: 'stampdex_docs_get_wallet_support', arguments: { wallet: 'UniSat' } }, (r) => r.includes('unisat')],
  ['get_screenshot_evidence', { name: 'stampdex_docs_get_screenshot_evidence', arguments: { id: 'market-desktop-dark' } }, (r) => r.includes('production')],
  ['mutation refused by absence', { name: 'stampdex_docs_get_api_operation', arguments: { path: '/api/v1/market/tokens/prices', method: 'delete' } }, (r) => /No delete/i.test(r)],
];

let failures = 0;
for (const [label, payload, check] of cases) {
  const response = callTool(payload);
  const text = response.result?.content?.[0]?.text ?? '';
  if (response.error || !check(text)) {
    console.error(`FAIL ${label}: ${JSON.stringify(response).slice(0, 200)}`);
    failures++;
  } else {
    console.log(`ok   ${label}`);
  }
}

if (failures) {
  console.error(`\n${failures} contract test(s) failed.`);
  process.exit(1);
}
console.log('\nAll MCP tool contract tests pass.');
