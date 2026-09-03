import type { APIRoute } from 'astro';
import snapshot from '../../../generated/openapi.json';

/** The OpenAPI 3.1 snapshot, downloadable and stable per docs build. */
export const GET: APIRoute = () => {
  return new Response(JSON.stringify(snapshot.spec, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
