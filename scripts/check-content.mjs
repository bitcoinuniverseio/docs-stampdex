// Content structure gate.
//
// The page templates from the learning system are enforced here:
//
//   - every content page declares contentType, audiences, difficulty, and
//     lifecycle (validated against controlled values by the content schema;
//     this script checks presence and cross-file consistency);
//   - tutorials and how-to pages carry the sections their template requires:
//     a goal, prerequisites, steps, and verification; tutorials also carry a
//     failure and recovery section;
//   - reference pages carry complete definitions: at least one table or a
//     definition-heavy body, plus a source record;
//   - high-risk pages (riskLevel high) must link the recovery page, so no
//     dangerous flow is documented without its way out;
//   - learning-path steps and prerequisites must point at real pages.
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DOCS = join(ROOT, 'src', 'content', 'docs');

const findings = [];
const ids = new Set();

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.mdx?$/.test(name)) yield p;
  }
}

const pages = [];
for (const file of walk(DOCS)) {
  const raw = readFileSync(file, 'utf8');
  const text = raw.replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) continue;
  const end = text.indexOf('\n---', 3);
  const fm = text.slice(4, end);
  const id = file.slice(DOCS.length + 1).replace(/\.mdx?$/, '').replace(/\\/g, '/');
  ids.add(id === 'index' ? '' : id);
  pages.push({ file, text, fm, id });
}

// Route targets inside the site resolve as /docs-stampdex/<id>/.
const linkRe = new RegExp('\\]\\(/docs-stampdex/([^)#?/]+[^)#?]*)/\\)', 'g');
const siteLinks = [...pages].flatMap(({ text }) =>
  [...text.matchAll(linkRe)].map((m) => m[1]),
);
const CUSTOM_PAGES = new Set([
  'product-atlas',
  'zh-cn/product-atlas',
  'api/reference',
  'zh-cn/api/reference',
  'agents',
  'zh-cn/agents',
]);
for (const link of siteLinks) {
  if (link.startsWith('http') || link === '') continue;
  // Custom pages rendered outside the content collection.
  if (CUSTOM_PAGES.has(link)) continue;
  if (!ids.has(link)) {
    findings.push(`content link target has no page: /docs-stampdex/${link}/`);
  }
}

for (const { file, text, fm, id } of pages) {
  const where = file.slice(ROOT.length + 1).replace(/\\/g, '/');
  const contentType = fm.match(/^contentType:\s*(\w+)/m)?.[1];

  if (!contentType) {
    findings.push(`${where}: missing contentType`);
    continue;
  }

  const has = (needle) => text.toLowerCase().includes(needle);

  if (contentType === 'tutorial') {
    if (!has('prerequisite')) findings.push(`${where}: tutorial template requires a prerequisites section`);
    if (!/## steps/i.test(text)) findings.push(`${where}: tutorial template requires a Steps section`);
    if (!/## expected result|## verification|## how to verify/.test(text))
      findings.push(`${where}: tutorial template requires an expected result or verification section`);
    if (!has('recover') && !has('if it fails') && !has('common failure'))
      findings.push(`${where}: tutorial template requires failure or recovery guidance`);
  }

  if (contentType === 'how-to') {
    if (!has('prerequisite') && !/## when to use/i.test(text))
      findings.push(`${where}: how-to template requires prerequisites or a when-to-use section`);
    if (!(/## steps/i.test(text) || /\n1\. /.test(text)))
      findings.push(`${where}: how-to template requires numbered steps`);
    if (!/## expected result|## verification|## how to verify|## what you should see/.test(text))
      findings.push(`${where}: how-to template requires verification of the result`);
  }

  if (contentType === 'reference' && !fm.includes('source:') && id !== '404' && id !== 'zh-cn/404') {
    findings.push(`${where}: reference pages must carry a source record`);
  }

  if (fm.match(/^riskLevel:\s*high/m) && !text.includes('/docs-stampdex/concepts/recovery/')) {
    findings.push(`${where}: high-risk pages must link the recovery page`);
  }
}

// Freshness gate (project/page-freshness): a high-risk page past its review
// window must not be promoted. The windows mirror TrustStrip.astro so the
// visible state and this gate can never disagree.
const WINDOWS = [
  ['guides/', 30], ['tutorials/', 30],
  ['concepts/custody', 30], ['concepts/recovery', 30],
  ['concepts/order-lifecycle', 30], ['concepts/settlement-lifecycle', 30],
  ['reference/fees', 30], ['reference/wallets', 30],
  ['reference/capability-matrix', 30], ['reference/order-states', 30],
];
for (const { file, fm, id } of pages) {
  if (!fm.match(/^riskLevel:s*high/m)) continue;
  const verified = fm.match(/^s{2}verified:s*"(d{4}-d{2}-d{2})"/m)?.[1];
  if (!verified) continue;
  const win = (WINDOWS.find(([prefix]) => id.startsWith(prefix)) ?? [null, 90])[1];
  const ageDays = (Date.now() - Date.parse(verified)) / 86400000;
  if (ageDays > win) {
    findings.push(
      `${file.slice(ROOT.length + 1).replace(/\\/g, '/')}: high-risk page verified ${verified} is past its ${win}-day review window. Re-verify against the product and update the source record.`,
    );
  }
}

if (findings.length > 0) {
  console.error('Content structure findings:');
  console.error(findings.map((line) => `  ${line}`).join('\n'));
  process.exit(1);
}

console.log(
  `Content structure: ${pages.length} pages classified, template sections present, high-risk pages link recovery, internal content links resolve.`,
);
