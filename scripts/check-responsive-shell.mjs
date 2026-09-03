// Exercises the shared documentation shell at the sidebar transition. A
// persistent sidebar must never leave tablet readers with a narrow or shifted
// article column.
import { createServer } from 'node:http';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const DIST = join(ROOT, 'dist');
const BASE = '/docs-stampdex';
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

if (!existsSync(DIST)) {
  console.error('No dist directory. Run `npm run build` first.');
  process.exit(1);
}

const server = createServer((request, response) => {
  let pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (pathname.startsWith(BASE)) pathname = pathname.slice(BASE.length);
  if (pathname.endsWith('/')) pathname += 'index.html';
  let file = join(DIST, pathname);
  if (!existsSync(file)) file = join(DIST, pathname, 'index.html');
  if (!existsSync(file)) return response.writeHead(404).end('not found');
  response.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  response.end(readFileSync(file));
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const port = server.address().port;
const browser = await chromium.launch({ headless: true });

try {
  for (const path of ['/guides/buy-src20/', '/api/quickstart/', '/']) {
    const page = await browser.newPage({ viewport: { width: 800, height: 900 } });
    await page.goto(`http://127.0.0.1:${port}${BASE}${path}`, { waitUntil: 'networkidle' });
    const layout = await page.evaluate(() => {
      const content = document.querySelector('.content-panel')?.getBoundingClientRect();
      const menu = document.querySelector('starlight-menu-button button');
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        contentLeft: content?.left ?? null,
        contentRight: content?.right ?? null,
        menuVisible: menu instanceof HTMLElement && getComputedStyle(menu).display !== 'none',
      };
    });
    await page.close();

    if (
      layout.scrollWidth > layout.clientWidth ||
      layout.contentLeft !== 0 ||
      layout.contentRight !== layout.clientWidth ||
      !layout.menuVisible
    ) {
      throw new Error(`${path} has an unsafe 800px shell: ${JSON.stringify(layout)}`);
    }
  }
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}

console.log('Checked the shared tablet shell on guide, API, and splash pages.');
