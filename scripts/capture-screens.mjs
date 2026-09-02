// The StampDEX screenshot capture runner.
//
// Two modes, declared per capture in screenshots.manifest.json:
//
//   production          public, read-only screens of the live venue. Before a
//                       pixel is taken the runner fetches the production
//                       version endpoint and refuses to continue unless the
//                       commit matches the one the manifest expects.
//   controlled-fixture  deterministic local pages under scripts/fixtures.
//                       Never presented as production capture: the fixture
//                       page itself carries a visible banner, and the
//                       manifest records the fixture id.
//
// Masters are written to assets/screens/<id>.png and committed. Run
// `npm run make:responsive-screens` afterwards to produce the served
// variants, then `npm run check:screens` to hold everything to the manifest.
//
// Usage:
//   node scripts/capture-screens.mjs                # every capture
//   node scripts/capture-screens.mjs id1 id2 ...    # just these ids
//   STAMPDEX_ORIGIN=https://stampdex.fun node scripts/capture-screens.mjs
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, existsSync, writeFile } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { chromium } from 'playwright';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'screens');
const writeFileAsync = promisify(writeFile);

const manifest = JSON.parse(
  readFileSync(join(ROOT, 'screenshots.manifest.json'), 'utf8'),
);
const only = process.argv.slice(2);
const ORIGIN = process.env.STAMPDEX_ORIGIN ?? 'https://stampdex.fun';
const VERSION_URL =
  process.env.STAMPDEX_VERSION_URL ??
  (ORIGIN === 'https://stampdex.fun'
    ? 'https://stamp.api.bitcoinuniverse.io/api/version'
    : `${ORIGIN.replace(/\/$/, '')}/api/version`);
const FIXTURE_PORT = 4653;

const captures = only.length
  ? manifest.captures.filter((c) => only.includes(c.id))
  : manifest.captures;

if (captures.length === 0) {
  console.error('No matching captures in screenshots.manifest.json.');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

// ------------------------------------------------------------ fixture server

function startFixtureServer() {
  return new Promise((done) => {
    const server = createServer((req, res) => {
      const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      const name = path.replace(/^\//, '').replace(/\.html$/, '');
      const file = join(ROOT, 'scripts', 'fixtures', `${name}.html`);
      const cssFile = join(ROOT, 'scripts', 'fixtures', name);
      if (path.endsWith('.css') && existsSync(cssFile)) {
        res.writeHead(200, { 'content-type': 'text/css; charset=utf-8' });
        res.end(readFileSync(cssFile));
        return;
      }
      if (!existsSync(file)) {
        res.writeHead(404).end('no such fixture');
        return;
      }
      res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
      res.end(readFileSync(file));
    });
    server.listen(FIXTURE_PORT, () => done(server));
  });
}

// ------------------------------------------------------------------- helpers

async function productionCommit() {
  const res = await fetch(VERSION_URL, {
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`version endpoint answered ${res.status}`);
  const body = await res.json();
  return { commit: body.gitCommit, releaseId: body.releaseId };
}

/** Overlay declared volatile regions so masks are part of the capture. */
async function applyMasks(page, capture) {
  if (!capture.mask?.length) return;
  await page.evaluate((regions) => {
    for (const r of regions) {
      const el = document.createElement('div');
      el.dataset.captureMask = r.reason;
      el.style.cssText = [
        'position:fixed',
        `left:${r.x}%`,
        `top:${r.y}%`,
        `width:${r.width}%`,
        `height:${r.height}%`,
        'background:#0b0e13',
        'color:#9aa7b8',
        'display:flex',
        'align-items:center',
        'justify-content:center',
        'font:600 11px ui-monospace, monospace',
        'letter-spacing:0.08em',
        'z-index:2147483647',
        'border:1px dashed #3a4452',
        'box-sizing:border-box',
      ].join(';');
      el.textContent = r.reason.toUpperCase();
      document.body.appendChild(el);
    }
  }, capture.mask);
}

async function settle(page, capture) {
  if (capture.expectedHeading) {
    const heading = capture.expectedHeading;
    const locator = page
      .locator('h1, h2, [role="heading"]')
      .filter({ hasText: heading })
      .first();
    await locator.waitFor({ state: 'visible', timeout: 30000 });
  } else {
    await page.waitForLoadState('networkidle', { timeout: 30000 });
  }
  // A capture that still shows a spinner, a skeleton, or a raw key is not
  // stable. Those markers must be gone from the rendered text.
  await page.waitForFunction(
    () =>
      !/loading|skeleton|undefined|NaN%/.test(
        document.querySelector('[id="root"], [id="app"], body')?.innerText ?? '',
      ),
    undefined,
    { timeout: 30000 },
  );
  await page.waitForTimeout(700);
}

// ---------------------------------------------------------------------- main

const fixtureServer = captures.some((c) => c.source === 'controlled-fixture')
  ? await startFixtureServer()
  : null;

const browser = await chromium.launch();
const results = [];
const failures = [];

// The manifest may pin several app commits; production captures must all
// match whatever production actually serves, so resolve the commit once.
let live = null;
if (captures.some((c) => c.source === 'production')) {
  live = await productionCommit();
  console.log(`production reports commit ${live.commit} (${live.releaseId})`);
}

for (const capture of captures) {
  const label = `${capture.id} [${capture.source}]`;
  try {
    if (capture.source === 'production') {
      const expected = capture.appCommit.slice(0, 7);
      const serving = live.commit.slice(0, 7);
      if (expected !== serving) {
        throw new Error(
          `expected app commit ${expected}, production serves ${serving}. Update the manifest and recapture.`,
        );
      }
    }

    const context = await browser.newContext({
      viewport: {
        width: capture.viewport.width,
        height: capture.viewport.height,
      },
      deviceScaleFactor: capture.viewport.deviceScaleFactor,
      colorScheme: capture.theme,
      locale: capture.locale === 'zh-cn' ? 'zh-CN' : 'en-US',
    });
    await context.addInitScript((theme) => {
      try {
        localStorage.setItem('theme', theme);
        localStorage.setItem('starlight-theme', theme);
      } catch {}
    }, capture.theme);
    const page = await context.newPage();

    if (capture.source === 'production') {
      await page.goto(ORIGIN + capture.productRoute, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
    } else {
      await page.goto(
        `http://localhost:${FIXTURE_PORT}/${capture.fixtureId}.html`,
        { waitUntil: 'networkidle', timeout: 15000 },
      );
    }

    await settle(page, capture);

    // A cookie consent overlay is a legal notice, not product state. The
    // runner accepts it so the capture shows the interface. The consent
    // lives and dies with this throwaway browser context.
    await page
      .locator('button, a')
      .filter({ hasText: /accept all/i })
      .first()
      .click({ timeout: 4000 })
      .catch(() => {});
    await page.waitForTimeout(400);

    await applyMasks(page, capture);

    const shot = {
      type: 'png',
      fullPage: false,
      ...(capture.crop
        ? {
            clip: {
              x: capture.crop.x,
              y: capture.crop.y,
              width: capture.crop.width,
              height: capture.crop.height,
            },
          }
        : {}),
    };
    const buffer = await page.screenshot(shot);
    const file = join(OUT, `${capture.id}.png`);
    await writeFileAsync(file, buffer);
    const kb = (buffer.length / 1024).toFixed(1);
    console.log(`${label} -> assets/screens/${capture.id}.png (${kb} KB)`);
    results.push({ id: capture.id, file, bytes: buffer.length });
    await context.close();
  } catch (error) {
    failures.push(`${label}: ${error.message.split('\n')[0]}`);
    console.error(`${label} FAILED: ${error.message.split('\n')[0]}`);
  }
}

await browser.close();
if (fixtureServer) fixtureServer.close();

if (failures.length) {
  console.error(`\n${failures.length} capture(s) failed.`);
  process.exit(1);
}
console.log(`\nCaptured ${results.length} master(s) into assets/screens/.`);
console.log('Next: npm run make:responsive-screens');
