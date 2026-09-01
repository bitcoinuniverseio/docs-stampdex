import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://bitcoinuniverseio.github.io/docs-stampdex';

const SECTIONS: Array<{ title: string; match: (id: string) => boolean }> = [
  {
    title: 'Start',
    match: (id) => ['start-here', 'what-is-stampdex', 'capabilities'].includes(id),
  },
  { title: 'Protocols', match: (id) => ['concepts/bitcoin-stamps', 'concepts/src20'].includes(id) },
  { title: 'Guides', match: (id) => id.startsWith('guides/') },
  { title: 'Settlement and custody', match: (id) => [
      'concepts/custody',
      'concepts/order-lifecycle',
      'concepts/settlement-lifecycle',
      'concepts/offers',
      'concepts/recovery',
    ].includes(id) },
  { title: 'Identity and data', match: (id) => [
      'concepts/asset-identity',
      'concepts/deployment-identity',
      'concepts/market-data',
      'concepts/unknown-is-not-zero',
      'concepts/data-provenance',
      'concepts/freshness',
    ].includes(id) },
  { title: 'Reference', match: (id) => id.startsWith('reference/') },
  { title: 'API', match: (id) => id.startsWith('api/') },
  { title: 'Safety and support', match: (id) => ['safety', 'troubleshooting', 'faq'].includes(id) },
  { title: 'Project', match: (id) => id.startsWith('project/') },
];

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  const byId = new Map(docs.map((entry) => [entry.id, entry]));

  const url = (id: string) => (id === 'index' ? `${SITE}/` : `${SITE}/${id}/`);

  const lines: string[] = [
    '# StampDEX documentation',
    '',
    '> Public documentation for StampDEX, the marketplace and explorer for Bitcoin',
    '> Stamps and SRC-20 at https://stampdex.fun. Bitcoin mainnet only. Lifecycle:',
    '> stable, continuously deployed. Trades execute at StampDEX rather than inside',
    '> other Bitcoin Universe products.',
    '',
    'Two facts shape most of this documentation.',
    '',
    '1. An SRC-20 trade routes the buyer payment through escrow addresses StampDEX',
    '   controls until the tokens reach the buyer. A Bitcoin Stamps purchase does not:',
    '   it settles in one Bitcoin transaction through a Counterparty dispenser.',
    '2. Neither protocol supports an in-place listing price update. The ecosystem',
    '   capability registry records update-listing as unsupported for both, because no',
    '   atomic listing update is implemented and listings must be cancelled and',
    '   relisted.',
    '',
  ];

  const used = new Set<string>();
  for (const section of SECTIONS) {
    const entries = docs
      .filter((entry) => section.match(entry.id))
      .sort((a, b) => a.id.localeCompare(b.id));
    if (entries.length === 0) continue;
    lines.push(`## ${section.title}`, '');
    for (const entry of entries) {
      used.add(entry.id);
      const description = entry.data.description ?? '';
      lines.push(`- [${entry.data.title}](${url(entry.id)}): ${description}`);
    }
    lines.push('');
  }

  const home = byId.get('index');
  if (home) {
    lines.splice(
      lines.indexOf('## Start'),
      0,
      '## Home',
      '',
      `- [${home.data.title}](${url('index')}): ${home.data.description ?? ''}`,
      '',
    );
    used.add('index');
  }

  const leftovers = docs.filter((entry) => !used.has(entry.id) && entry.id !== '404');
  if (leftovers.length > 0) {
    lines.push('## Other', '');
    for (const entry of leftovers) {
      lines.push(`- [${entry.data.title}](${url(entry.id)}): ${entry.data.description ?? ''}`);
    }
    lines.push('');
  }

  lines.push(
    '## Source',
    '',
    `- Product: https://stampdex.fun`,
    `- Documentation repository: https://github.com/bitcoinuniverseio/docs-stampdex`,
    `- Application issues: https://github.com/bitcoinuniverseio/stampdex/issues`,
    `- Public API base: https://stamp.api.bitcoinuniverse.io`,
    `- Deployed commit: https://stamp.api.bitcoinuniverse.io/api/version`,
    `- Index freshness: https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status`,
    `- Central platform: https://docs.bitcoinuniverse.io`,
    '',
  );

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
