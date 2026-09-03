import { getCollection } from 'astro:content';

/** A compact machine-readable index of every documentation page. */
export async function GET() {
  const pages = await getCollection('docs');
  const index = pages.map((page) => {
    const d = page.data as any;
    return {
      id: page.id === 'index' ? '' : page.id,
      title: d.title,
      description: d.description,
      url: `/docs-stampdex/${page.id === 'index' ? '' : page.id + '/'}`,
      markdown: `/docs-stampdex/markdown/${page.id === 'index' ? 'index' : page.id}`,
      contentType: d.contentType,
      audiences: d.audiences,
      products: d.products,
      protocols: d.protocols,
      difficulty: d.difficulty,
      estimatedMinutes: d.estimatedMinutes,
      lifecycle: d.lifecycle,
      releaseStatus: d.releaseStatus,
      riskLevel: d.riskLevel ?? null,
      source: d.source ?? null,
    };
  });
  index.sort((a, b) => a.id.localeCompare(b.id));
  return new Response(
    JSON.stringify(
      { schema: 'stampdex.docs.page-index/1', pages: index },
      null,
      2,
    ) + '\n',
    { headers: { 'content-type': 'application/json; charset=utf-8' } },
  );
}
