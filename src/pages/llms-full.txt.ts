import { getCollection } from 'astro:content';

/**
 * The complete documentation corpus as one Markdown document for AI agents
 * and offline readers. Sources and verification records are preserved;
 * navigation chrome and analytics are not part of page bodies, so they do
 * not appear here either.
 */
export async function GET({ site }) {
  const pages = (await getCollection('docs')).sort((a, b) =>
    a.id.localeCompare(b.id),
  );
  const lines: string[] = [
    '# StampDEX documentation (full corpus)',
    '',
    'The trading venue for Bitcoin Stamps and SRC-20: order lifecycle, custody at',
    'every step, fees, settlement, and the public read API.',
    '',
    `Base URL: ${site}`,
    `Pages: ${pages.length}`,
    '',
  ];
  for (const page of pages) {
    const data = page.data as any;
    lines.push('---');
    lines.push('');
    lines.push(`# ${data.title} (/${page.id.replace(/(^|\/)index$/, '$1')})`);
    if (data.description) lines.push('');
    lines.push(data.description);
    const source = data.source;
    if (source?.verified) {
      lines.push('');
      lines.push(
        `Source record: ${source.repo ?? 'bitcoinuniverseio/stampdex'}${source.path ? ` (${source.path})` : ''}, applicable release ${source.release ?? 'continuous'}, last verified ${source.verified}, chain ${source.chain ?? 'bitcoin'}/${source.network ?? 'mainnet'}.`,
      );
    }
    lines.push('');
    lines.push(page.body ?? '');
    lines.push('');
  }
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  });
}
