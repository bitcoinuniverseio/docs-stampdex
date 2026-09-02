import { getCollection } from 'astro:content';

/**
 * A clean Markdown representation of every documentation page, at
 * /docs-stampdex/markdown/<id>.md. Bodies keep headings, warnings, code,
 * tables, links, and the source verification record; navigation chrome is
 * not part of a page body, so it cannot leak in.
 */
export async function getStaticPaths() {
  const pages = await getCollection('docs');
  return pages.map((page) => {
    let slug = page.id;
    if (slug === '' || slug === 'index') slug = 'index';
    else if (slug === 'zh-cn') slug = 'zh-cn/index';
    return {
      params: { page: slug },
      props: { page },
    };
  });
}

export function GET({ props }) {
  const page = props.page;
  const data = page.data as any;
  const lines: string[] = [];
  lines.push(`# ${data.title}`);
  lines.push('');
  if (data.description) {
    lines.push(data.description);
    lines.push('');
  }
  const source = data.source;
  if (source?.verified) {
    lines.push(
      `> Source: ${source.repo ?? 'bitcoinuniverseio/stampdex (private application source)'}${source.path ? `, ${source.path}` : ''}. Applicable release ${source.release ?? 'continuous'}. Last verified ${source.verified}. Chain ${source.chain ?? 'bitcoin'}/${source.network ?? 'mainnet'}.`,
    );
    lines.push('');
  }
  lines.push(page.body ?? '');
  return new Response(lines.join('\n'), {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
