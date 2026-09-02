import { readFileSync, writeFileSync } from 'node:fs';

function addImportAfterFm(file, line) {
  let text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (text.includes(line)) return;
  const end = text.indexOf('\n---', 3);
  const close = text.indexOf('\n', end) + 1;
  text = text.slice(0, close) + '\n' + line + '\n' + text.slice(close);
  writeFileSync(file, text);
  console.log('import ->', file);
}

function insertAfterHeading(file, heading, insertion) {
  let text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (text.includes(insertion.trim().slice(0, 40))) return;
  const idx = text.indexOf(heading);
  if (idx === -1) { console.error('heading missing in', file, heading); process.exitCode = 1; return; }
  const after = text.indexOf('\n', idx) + 1;
  text = text.slice(0, after) + '\n' + insertion + '\n' + text.slice(after);
  writeFileSync(file, text);
  console.log('embedded ->', file);
}

// Custody explorer into the custody page.
addImportAfterFm('src/content/docs/concepts/custody.mdx', "import CustodyExplorer from '../../../components/explainers/CustodyExplorer.astro';");
insertAfterHeading(
  'src/content/docs/concepts/custody.mdx',
  '## SRC-20: your BTC passes through StampDEX',
  '<CustodyExplorer />',
);

// Order-state explorer into the order-states reference page.
addImportAfterFm('src/content/docs/reference/order-states.mdx', "import OrderStateExplorer from '../../../components/explainers/OrderStateExplorer.astro';");
insertAfterHeading(
  'src/content/docs/reference/order-states.mdx',
  '## The states',
  '<OrderStateExplorer />',
);

// Fee explorer into the fees page.
addImportAfterFm('src/content/docs/reference/fees.mdx', "import FeeExplorer from '../../../components/explainers/FeeExplorer.astro';");
insertAfterHeading(
  'src/content/docs/reference/fees.mdx',
  '## SRC-20 marketplace trades',
  '<FeeExplorer />',
);

// Wallet explorer into the wallets page.
addImportAfterFm('src/content/docs/reference/wallets.mdx', "import WalletExplorer from '../../../components/explainers/WalletExplorer.astro';");
insertAfterHeading(
  'src/content/docs/reference/wallets.mdx',
  '## What each wallet can do here',
  '<WalletExplorer />',
);

// Transaction anatomy into the PSBT review guide.
addImportAfterFm('src/content/docs/guides/psbt-review.mdx', "import TxAnatomy from '../../../components/explainers/TxAnatomy.astro';");
insertAfterHeading(
  'src/content/docs/guides/psbt-review.mdx',
  '## What to check on a buy',
  '<TxAnatomy />',
);
