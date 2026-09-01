// A flat sitemap at /sitemap.xml, listing every page.
//
// The Starlight build already emits sitemap-index.xml and sitemap-0.xml. Some
// crawlers and audit tools look for /sitemap.xml and nothing else, so this
// serves the same set of URLs at the name they expect.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const SITE = 'https://bitcoinuniverseio.github.io/docs-stampdex';

export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');

  const urls = docs
    .filter((entry) => entry.id !== '404')
    .map((entry) => (entry.id === 'index' ? `${SITE}/` : `${SITE}/${entry.id}/`))
    .sort();

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(
      (url) =>
        `  <url><loc>${url}</loc><changefreq>weekly</changefreq><priority>${
          url === `${SITE}/` ? '1.0' : '0.7'
        }</priority></url>`,
    ),
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
