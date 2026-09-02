// Adds the learning/classification frontmatter fields to every content page,
// mechanically, from the page's path. Values here are initial triage; a page
// can always override by hand afterwards.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content/docs';
const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.mdx?$/.test(name)) files.push(p);
  }
};
walk(ROOT);

const EST = { tutorial: 15, 'how-to': 8, concept: 6, reference: 5, safety: 5, release: 4, contribution: 6 };

for (const file of files) {
  let text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (!text.startsWith('---\n')) continue;
  const end = text.indexOf('\n---', 3);
  const fm = text.slice(4, end);
  if (fm.includes('contentType:')) continue; // already classified

  const id = file.replace(/^src\/content\/docs\//, '').replace(/\.mdx?$/, '');
  let contentType = 'reference';
  let audiences = ['traders', 'collectors', 'developers'];
  let products = ['src20', 'stamps'];
  let protocols = ['src20', 'stamps', 'bitcoin'];
  let riskLevel;
  let difficulty = 'intro';

  if (id.startsWith('guides/')) {
    contentType = 'how-to';
    difficulty = 'hands-on';
    audiences = ['traders', 'collectors'];
  }
  if (id === 'guides/buy-src20' || id === 'guides/sell-src20' || id === 'guides/psbt-review') {
    contentType = 'tutorial';
    riskLevel = 'high';
  }
  if (id.startsWith('concepts/')) contentType = 'concept';
  if (id === 'concepts/custody' || id === 'concepts/recovery') riskLevel = 'high';
  if (id.startsWith('reference/')) { contentType = 'reference'; audiences = ['traders', 'collectors', 'developers', 'operators']; }
  if (id === 'reference/wallets' || id === 'reference/fees') riskLevel = 'high';
  if (id.startsWith('api/')) { contentType = 'reference'; audiences = ['developers']; products = ['src20', 'stamps']; }
  if (id === 'safety' || id === 'troubleshooting') { contentType = 'safety'; riskLevel = 'high'; }
  if (id.startsWith('project/')) { contentType = id === 'project/changelog' || id === 'project/release-evidence' ? 'release' : 'contribution'; audiences = ['operators']; products = []; protocols = []; }
  if (id === 'index' || id === 'start-here' || id === 'what-is-stampdex' || id === 'capabilities' || id === 'faq' || id === '404') { contentType = 'reference'; products = ['src20', 'stamps']; }
  if (id.includes('stamp') || id === 'guides/collect-stamps' || id === 'concepts/bitcoin-stamps') products = ['stamps'];
  if (id.includes('src20')) products = ['src20'];

  const add = [
    `contentType: ${contentType}`,
    `audiences: [${audiences.join(', ')}]`,
    ...(products.length ? [`products: [${products.join(', ')}]`] : []),
    ...(protocols.length ? [`protocols: [${protocols.join(', ')}]`] : []),
    `difficulty: ${difficulty}`,
    `estimatedMinutes: ${EST[contentType]}`,
    `lifecycle: stable`,
    `releaseStatus: live`,
    ...(riskLevel ? [`riskLevel: ${riskLevel}`] : []),
    `lastReviewedBy: docs-stampdex maintainers`,
  ];
  text = '---\n' + fm + '\n' + add.join('\n') + text.slice(end);
  writeFileSync(file, text);
  console.log('classified', id);
}
