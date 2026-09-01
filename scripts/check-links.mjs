// Checks every internal link and anchor in the built site. Run after
// `npm run build`. A link that 404s in documentation about where somebody's
// money is costs more than a broken link elsewhere, so this is a gate.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const DIST = join(ROOT, 'dist');
const BASE = '/docs-stampdex';

if (!existsSync(DIST)) {
  console.error('No dist directory. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'pagefind') continue;
      walk(p);
    } else if (name.endsWith('.html')) {
      htmlFiles.push(p);
    }
  }
};
walk(DIST);

/** Every id and name attribute a built page offers as an anchor target. */
const anchorsOf = (html) => {
  const ids = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) ids.add(match[1]);
  for (const match of html.matchAll(/\sname="([^"]+)"/g)) ids.add(match[1]);
  return ids;
};

const anchorCache = new Map();
const anchorsFor = (file) => {
  if (!anchorCache.has(file)) {
    anchorCache.set(file, anchorsOf(readFileSync(file, 'utf8')));
  }
  return anchorCache.get(file);
};

/** The file on disk a site-absolute path resolves to, or null. */
const fileFor = (pathname) => {
  if (!pathname.startsWith(BASE)) return null;
  const rel = pathname.slice(BASE.length) || '/';
  const direct = join(DIST, rel);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  const asIndex = join(DIST, rel, 'index.html');
  if (existsSync(asIndex)) return asIndex;
  const asHtml = join(DIST, `${rel.replace(/\/$/, '')}.html`);
  if (existsSync(asHtml)) return asHtml;
  return null;
};

const findings = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const where = file.slice(DIST.length + 1).replace(/\\/g, '/');

  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue;
    if (target.startsWith('#')) {
      const id = decodeURIComponent(target.slice(1));
      if (id !== '_top' && !anchorsFor(file).has(id)) {
        findings.push(`${where}: no anchor "#${id}" on this page`);
      }
      continue;
    }
    if (!target.startsWith('/')) {
      findings.push(`${where}: unexpected relative link "${target}"`);
      continue;
    }

    checked += 1;
    const [pathname, hash] = target.split('#');
    const resolved = fileFor(pathname);
    if (!resolved) {
      findings.push(`${where}: broken internal link "${target}"`);
      continue;
    }
    if (hash && resolved.endsWith('.html')) {
      const id = decodeURIComponent(hash);
      if (id !== '_top' && !anchorsFor(resolved).has(id)) {
        findings.push(`${where}: "${pathname}" has no anchor "#${id}"`);
      }
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join('\n'));
  console.error(`\n${findings.length} broken link(s) or anchor(s).`);
  process.exit(1);
}

console.log(
  `Checked ${checked} internal links across ${htmlFiles.length} pages. All resolve.`,
);
