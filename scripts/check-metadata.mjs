// Page metadata gate. Runs against dist/ after a build.
//
// Checks the things an external acceptance sweep checks, so a regression is
// caught here rather than after a deploy: exactly one h1 per page, a skip
// link, a language attribute, a title, a meta description in a useful length
// band, Open Graph tags, images with alt text, and the machine-readable files.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const DIST = join(ROOT, 'dist');

const DESCRIPTION_MIN = 120;
const DESCRIPTION_MAX = 200;

if (!existsSync(DIST)) {
  console.error('No dist directory. Run `npm run build` first.');
  process.exit(1);
}

const pages = [];
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'pagefind') continue;
      walk(p);
    } else if (name.endsWith('.html')) {
      pages.push(p);
    }
  }
};
walk(DIST);

const findings = [];
const note = (file, message) =>
  findings.push(`${file.slice(DIST.length + 1).replace(/\\/g, '/')}: ${message}`);

let redirects = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');

  // Redirect stubs are generated pages with no content of their own.
  if (/<meta http-equiv="refresh"/i.test(html)) {
    redirects += 1;
    continue;
  }

  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) note(file, `${h1s.length} h1 elements, expected exactly 1`);

  if (!/<html[^>]+lang="/i.test(html)) note(file, 'no lang attribute on html');
  if (!/Skip to content/i.test(html)) note(file, 'no skip link');

  const title = html.match(/<title>([^<]*)<\/title>/);
  if (!title || title[1].trim().length === 0) note(file, 'no title');

  const description = html.match(/<meta name="description" content="([^"]*)"/);
  if (!description) {
    note(file, 'no meta description');
  } else {
    const length = description[1].length;
    if (length < DESCRIPTION_MIN) {
      note(file, `meta description is ${length} characters, want at least ${DESCRIPTION_MIN}`);
    }
    if (length > DESCRIPTION_MAX) {
      note(file, `meta description is ${length} characters, want at most ${DESCRIPTION_MAX}`);
    }
  }

  for (const tag of ['og:title', 'og:description', 'og:image', 'og:url']) {
    if (!html.includes(`property="${tag}"`)) note(file, `no ${tag}`);
  }

  for (const match of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(match[0])) note(file, 'an img has no alt attribute');
  }
}

for (const required of ['llms.txt', 'robots.txt', 'sitemap.xml', 'sitemap-index.xml']) {
  const p = join(DIST, required);
  if (!existsSync(p) || statSync(p).size === 0) {
    findings.push(`${required} is missing or empty`);
  }
}

if (findings.length > 0) {
  console.error(findings.join('\n'));
  console.error(`\n${findings.length} metadata problem(s).`);
  process.exit(1);
}

console.log(
  `Checked ${pages.length - redirects} pages (plus ${redirects} redirect stubs): one h1 each, skip link, lang, title, description ${DESCRIPTION_MIN}-${DESCRIPTION_MAX} chars, Open Graph tags, alt text. All four machine-readable files present.`,
);
