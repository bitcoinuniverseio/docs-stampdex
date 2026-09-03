// Generates checked-in truth snapshots under src/generated/.
//
//   order-states.json  the OrderStatus enum, extracted verbatim from
//                      backend/src/orders/order.entity.ts in the stampdex
//                      application repository, with provenance.
//   fee-policy.json    the released fee snapshot from the public fees
//                      endpoint, the same one the venue's own fee page
//                      reads.
//
// Run: STAMPDEX_GH_TOKEN=... node scripts/gen-truth.mjs
// The token needs read access to the private application repository; CI
// validates only the committed snapshots against the pages that render
// them, and regeneration happens wherever a token exists.
import { writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src', 'generated');
mkdirSync(OUT, { recursive: true });

const APP_REPO = 'bitcoinuniverseio/stampdex';
const APP_REF = 'main';
const token = process.env.STAMPDEX_GH_TOKEN;
const APP_COMMIT_ENDPOINT = `https://api.github.com/repos/${APP_REPO}/commits/${APP_REF}`;

async function appCommit() {
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'docs-stampdex-truth-pipeline',
  };
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(APP_COMMIT_ENDPOINT, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`app commit lookup answered ${res.status}`);
  const body = await res.json();
  return { sha: body.sha, committedAt: body.commit?.committer?.date ?? null };
}

async function fetchEntitySource() {
  const headers = { 'user-agent': 'docs-stampdex-truth-pipeline' };
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(
    `https://api.github.com/repos/${APP_REPO}/contents/backend/src/orders/order.entity.ts?ref=${APP_REF}`,
    { headers, signal: AbortSignal.timeout(15000) },
  );
  if (!res.ok) throw new Error(`order.entity.ts answered ${res.status}`);
  const body = await res.json();
  return Buffer.from(body.content, 'base64').toString('utf8');
}

function extractEnum(source) {
  const block = source.match(/export enum OrderStatus \{([\s\S]*?)\}/);
  if (!block) throw new Error('OrderStatus enum not found in order.entity.ts');
  const states = [];
  const re = new RegExp("([A-Z_0-9]+)\\s*=\\s*'([a-z0-9_]+)'\\s*,?((?:\\s*//[^\\n]*)?)", 'g');
  for (const match of block[1].matchAll(re)) {
    states.push({
      constName: match[1],
      value: match[2],
      comment: (match[3] ?? '').replace(/^\s*\/\/\s*/, '').trim(),
    });
  }
  if (states.length < 5) throw new Error('implausibly few states extracted');
  return states;
}

// The reader-facing model: which states a buyer or seller can see, where the
// funds sit, and what happens next. The enum values above are the machine
// truth; these human rows are keyed by that truth and a drift check in CI
// fails if an enum value has no row or a row names a vanished value.
const READER_MODEL = {
  draft: { public: false, label: 'Preparing', btc: 'Not committed anywhere', asset: 'Seller still holds the tokens', next: ['open', 'expired'] },
  open: { public: true, label: 'Open', btc: 'Nothing committed by anyone', asset: 'In listing escrow, locked to this listing', next: ['pending', 'cancelled', 'expired'] },
  pending: { public: true, label: 'Pending', btc: "Buyer's payment in listing escrow", asset: 'In listing escrow', next: ['awaiting_tx3', 'pending', 'failed', 'expired'] },
  awaiting_tx3: { public: true, label: 'Awaiting transfer', btc: 'In listing escrow', asset: 'Transfer transaction broadcast, waiting for confirmations', next: ['settling_tx3', 'awaiting_tx3_confirmation', 'failed'] },
  settling_tx3: { public: false, label: 'Settling', btc: 'In listing escrow', asset: 'A settlement worker is verifying and broadcasting the transfer', next: ['awaiting_tx3_confirmation', 'failed'] },
  awaiting_tx3_confirmation: { public: true, label: 'Awaiting confirmation', btc: 'In listing escrow until confirmations land', asset: 'In the transfer transaction, one confirmation away', next: ['filled', 'failed'] },
  filled: { public: true, label: 'Filled', btc: "Paid to the seller, fee deducted", asset: "In the buyer's wallet", next: [] },
  cancelled: { public: true, label: 'Cancelled', btc: 'Nothing was committed', asset: 'Returned to the seller', next: [] },
  expired: { public: true, label: 'Expired', btc: 'Nothing committed, or already recovered', asset: 'Back with the seller', next: [] },
  failed: { public: true, label: 'Failed', btc: 'In escrow, recoverable by the recovery flow', asset: 'In escrow, recoverable by the recovery flow', next: [] },
};

const commit = await appCommit();
const entity = await fetchEntitySource();
const states = extractEnum(entity);

for (const state of states) {
  if (!READER_MODEL[state.value]) {
    throw new Error(`enum value ${state.value} has no reader model row: update gen-truth.mjs`);
  }
}
for (const key of Object.keys(READER_MODEL)) {
  if (!states.some((s) => s.value === key)) {
    throw new Error(`reader model row ${key} no longer exists in the enum: update gen-truth.mjs`);
  }
}

const merged = states.map((s) => ({
  value: s.value,
  constName: s.constName,
  sourceComment: s.comment,
  ...READER_MODEL[s.value],
}));

writeFileSync(
  join(OUT, 'order-states.json'),
  JSON.stringify(
    {
      schema: 'stampdex.docs.order-states/1',
      provenance: {
        repository: APP_REPO,
        sourcePath: 'backend/src/orders/order.entity.ts',
        sourceRef: APP_REF,
        sourceCommit: commit.sha,
        generatedAt: new Date().toISOString(),
        generator: 'scripts/gen-truth.mjs',
      },
      states: merged,
    },
    null,
    2,
  ) + '\n',
);
console.log(`order-states.json: ${merged.length} states at app commit ${commit.sha.slice(0, 7)}`);

// ------------------------------------------------------------ fee policy

const feeRes = await fetch('https://stamp.api.bitcoinuniverse.io/api/v1/market/fees', {
  signal: AbortSignal.timeout(15000),
});
if (!feeRes.ok) throw new Error(`fees endpoint answered ${feeRes.status}`);
const fees = await feeRes.json();
writeFileSync(
  join(OUT, 'fee-policy.json'),
  JSON.stringify(
    {
      schema: 'stampdex.docs.fee-policy/1',
      provenance: {
        repository: APP_REPO,
        sourcePath: 'GET /api/v1/market/fees',
        sourceRef: APP_REF,
        sourceCommit: commit.sha,
        generatedAt: new Date().toISOString(),
        generator: 'scripts/gen-truth.mjs',
      },
      networkFeeRatesSatVb: fees,
    },
    null,
    2,
  ) + '\n',
);
console.log(`fee-policy.json: rates ${JSON.stringify(fees)}`);

// -------------------------------------------------------- wallet matrix

async function fetchCapabilitiesSource() {
  const headers = { 'user-agent': 'docs-stampdex-truth-pipeline' };
  if (token) headers.authorization = `Bearer ${token}`;
  const res = await fetch(
    `https://api.github.com/repos/${APP_REPO}/contents/frontend/src/wallet/capabilities.js?ref=${APP_REF}`,
    { headers, signal: AbortSignal.timeout(15000) },
  );
  if (!res.ok) throw new Error(`capabilities.js answered ${res.status}`);
  const body = await res.json();
  return Buffer.from(body.content, 'base64').toString('utf8');
}

function extractWalletMatrix(source) {
  // Per-wallet const blocks: const UNIVERSE = { action: WORKS|UNTESTED|NO, ... }.
  const blocks = {};
  const blockRe = new RegExp(
    "const ([A-Z]+) = \\{([^}]*)\\}",
    'g',
  );
  for (const block of source.matchAll(blockRe)) {
    const name = block[1];
    if (!['UNIVERSE', 'UNISAT', 'LEATHER', 'XVERSE', 'OKX'].includes(name)) continue;
    const actions = {};
    for (const action of block[2].matchAll(/(\w+):\s*(WORKS|UNTESTED|NO)/g)) {
      actions[action[1]] = { WORKS: 'works', UNTESTED: 'untested', NO: 'no' }[action[2]];
    }
    blocks[name] = actions;
  }

  // The export maps product ids and display names to those blocks.
  const exportBlock = source.match(
    /export const WALLET_CAPABILITIES = Object\.freeze\(\{([\s\S]*?)\n\}\);/,
  );
  if (!exportBlock) throw new Error('WALLET_CAPABILITIES export not found');
  const wallets = [];
  const entryRe = new RegExp(
    "id: '([a-z]+)',\\s*name: '([^']+)',\\s*nativeAssetDisplay: (true|false),\\s*actions: Object\\.freeze\\(([A-Z]+)\\)",
    'g',
  );
  for (const entry of exportBlock[1].matchAll(entryRe)) {
    const [, id, name, nativeDisplay, constName] = entry;
    const actions = blocks[constName];
    if (!actions) throw new Error(`wallet ${name} references unknown block ${constName}`);
    wallets.push({ id, name, nativeAssetDisplay: nativeDisplay === 'true', actions });
  }
  if (wallets.length < 4) throw new Error('implausibly few wallets extracted');
  return wallets;
}

const capsSource = await fetchCapabilitiesSource();
const wallets = extractWalletMatrix(capsSource);
writeFileSync(
  join(OUT, 'wallet-matrix.json'),
  JSON.stringify(
    {
      schema: 'stampdex.docs.wallet-matrix/1',
      provenance: {
        repository: APP_REPO,
        sourcePath: 'frontend/src/wallet/capabilities.js',
        sourceRef: APP_REF,
        sourceCommit: commit.sha,
        generatedAt: new Date().toISOString(),
        generator: 'scripts/gen-truth.mjs',
      },
      states: { works: 'supported and tested', untested: 'untested', no: 'unavailable' },
      wallets,
    },
    null,
    2,
  ) + '\n',
);
console.log(`wallet-matrix.json: ${wallets.length} wallets`);
