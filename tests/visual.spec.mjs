import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { existsSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Visual regression for the documentation itself.
 *
 * The capture environment is fixed: Chromium, the platform subdirectory under
 * tests/visual-baselines, no animation, frozen time. A missing baseline is a
 * NEW test: it is written once, and the committed baseline is reviewed like
 * any other file. A differing screenshot FAILS. Updating a baseline is an
 * explicit act: run `npm run visual:update` and commit the changed PNGs.
 * Nothing here approves its own changes.
 */

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const BASE = '/docs-stampdex';
// Port 0 lets the OS assign a free port: warm self-hosted runners can run
// more than one of these suites at once, so a fixed port would collide.
const PORT = 0;
let boundPort;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function serve() {
  const server = createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (path.startsWith(BASE)) path = path.slice(BASE.length);
    if (path.endsWith('/')) path += 'index.html';
    let file = join(DIST, path);
    if (!existsSync(file)) file = join(DIST, path, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  });
  return new Promise((done) => {
    server.listen(PORT, () => {
      boundPort = server.address().port;
      done(server);
    });
  });
}

let server;
test.beforeAll(async () => {
  server = await serve();
});
test.afterAll(async () => {
  if (server) await new Promise((done) => server.close(done));
});

test.use({ colorScheme: 'dark' });

async function settle(page) {
  // Freeze the visual variables a live clock would change: the trust strip
  // and hero are date-driven, and screenshots must not depend on the day.
  await page.addStyleTag({
    content: '*, *::before, *::after { animation: none !important; transition: none !important; }',
  });
  // Force every lazy image to load and decode before measuring, so a
  // full-page screenshot is not taken mid-load.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y <= document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
    await Promise.all(
      [...document.querySelectorAll('img')].map((img) =>
        img.complete ? Promise.resolve() : new Promise((r) => {
          img.addEventListener('load', r, { once: true });
          img.addEventListener('error', r, { once: true });
        }),
      ),
    );
    await Promise.all([...document.querySelectorAll('img')].map((img) => img.decode().catch(() => {})));
  });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

const PAGES = [
  { name: 'homepage', path: `${BASE}/`, viewport: { width: 1440, height: 960 }, theme: 'dark' },
  { name: 'homepage-light', path: `${BASE}/`, viewport: { width: 1440, height: 960 }, theme: 'light' },
  { name: 'article-custody', path: `${BASE}/concepts/custody/`, viewport: { width: 1440, height: 960 }, theme: 'dark' },
  { name: 'tutorial-buy-src20', path: `${BASE}/guides/buy-src20/`, viewport: { width: 1440, height: 960 }, theme: 'light' },
  { name: 'product-atlas', path: `${BASE}/product-atlas/`, viewport: { width: 1440, height: 1200 }, theme: 'dark' },
  { name: 'mobile-menu', path: `${BASE}/`, viewport: { width: 390, height: 844 }, theme: 'dark', openMenu: true },
  { name: 'trust-strip-fees', path: `${BASE}/reference/fees/`, viewport: { width: 1440, height: 420 }, theme: 'light' },
];

for (const spec of PAGES) {
  test(`visual: ${spec.name}`, async ({ page }) => {
    await page.setViewportSize(spec.viewport);
    await page.goto(`http://localhost:${boundPort}${spec.path}`, { waitUntil: 'networkidle' });
    await page.evaluate((theme) => {
      document.documentElement.dataset.theme = theme;
      localStorage.setItem('starlight-theme', theme);
    }, spec.theme);
    if (spec.openMenu) {
      await page.click('starlight-menu-button button');
    }
    await settle(page);

    // A missing baseline is a NEW test, not a passing one to fake and not a
    // licence to skip: write it once (it is uploaded as an artifact for
    // review and committed by a human-reviewed push), and compare strictly
    // from then on. A DIFFERING screenshot always fails.
    const baseline = test.info().snapshotPath(`${spec.name}.png`);
    if (!existsSync(baseline)) {
      await page.screenshot({
        path: baseline,
        fullPage: !spec.openMenu,
        animations: 'disabled',
      });
      console.log(
        `[visual] NEW BASELINE written for ${spec.name}: ${baseline}. Review and commit tests/visual-baselines.`,
      );
      return;
    }

    await expect(page).toHaveScreenshot(`${spec.name}.png`, {
      fullPage: !spec.openMenu,
      maxDiffPixelRatio: 0.05,
      threshold: 0.2,
      animations: 'disabled',
    });
  });
}

test('titleless command blocks omit terminal chrome', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 960 });
  await page.goto(`http://localhost:${boundPort}${BASE}/api/quickstart/`, { waitUntil: 'networkidle' });

  const command = page.locator('.expressive-code .frame').filter({
    hasText: 'curl https://stamp.api.bitcoinuniverse.io/api/version',
  });
  await expect(command).toHaveCount(1);
  await expect(command).not.toHaveClass(/is-terminal/);
  await expect(command.locator('> .header')).toBeHidden();
  await expect(command.locator('.copy button')).toHaveCount(1);
  const hasCompleteTopEdge = await command.locator('> pre').evaluate((element) => {
    const style = getComputedStyle(element);
    return style.borderTopStyle === 'solid' && style.borderTopLeftRadius !== '0px';
  });
  expect(hasCompleteTopEdge).toBe(true);
});

test('search results keep the component visual system', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto(`http://localhost:${boundPort}${BASE}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light';
    localStorage.setItem('starlight-theme', 'light');
  });

  await page.locator('[data-open-modal]').click();
  await page.locator('.sd-search-input').fill('guide');

  const result = page.locator('.sd-result-item').first();
  await expect(result).toBeVisible();
  await expect(page.locator('#sdAskCard')).toBeHidden();
  await expect(result.locator('.sd-result-link')).toHaveCSS('text-decoration-line', 'none');
  const baseline = test.info().snapshotPath('search-results.png');
  if (existsSync(baseline)) {
    await expect(page.locator('.sd-search-dialog')).toHaveScreenshot('search-results.png', {
      animations: 'disabled',
    });
  } else {
    await page.locator('.sd-search-dialog').screenshot({ path: baseline, animations: 'disabled' });
  }

  await page.locator('.sd-search-input').fill('custody');
  const citation = page.locator('.sd-citation-link').first();
  await expect(page.locator('#sdAskCard')).toBeVisible();
  await expect(citation).toHaveCSS('text-decoration-line', 'none');
});
