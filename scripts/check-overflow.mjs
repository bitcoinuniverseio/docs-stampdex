// Guards the 320px reflow requirement against the one thing that reliably
// breaks it: a long string with no space, slash, or hyphen in it, which a
// browser cannot break onto a second line.
//
// Three places are already safe and are excluded:
//   - inside <pre>, because code blocks scroll in their own container
//   - inside a table cell, and inside the ledger panels, because floor.css
//     gives code in both `overflow-wrap: anywhere`
//   - inside an <a>, where the href text is a link the theme already wraps
//
// Anything left is a real risk and fails the build.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const DIST = join(ROOT, 'dist');

// Roughly what fits on a 320px screen at the body monospace size.
const LIMIT = 34;

if (!existsSync(DIST)) {
  console.error('No dist directory. Run `npm run build` first.');
  process.exit(1);
}

const files = [];
const walk = (dir) => {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, name.name);
    if (name.isDirectory()) {
      if (name.name === 'pagefind') continue;
      walk(p);
    } else if (name.name.endsWith('.html')) {
      files.push(p);
    }
  }
};
walk(DIST);

const findings = [];
let scanned = 0;

for (const file of files) {
  const html = readFileSync(file, 'utf8');

  const scannable = html
    // Code blocks scroll inside their own container.
    .replace(/<pre[\s\S]*?<\/pre>/g, '')
    // Table cells and the ledger panels wrap long runs, see floor.css.
    .replace(/<t[dh][\s\S]*?<\/t[dh]>/g, '')
    .replace(/<a\b[\s\S]*?<\/a>/g, '');

  for (const match of scannable.matchAll(/<code[^>]*>([^<]+)<\/code>/g)) {
    scanned += 1;
    const longest = match[1]
      .trim()
      .split(/[\s/\-_.]+/)
      .reduce((a, b) => (b.length > a.length ? b : a), '');
    if (longest.length > LIMIT) {
      findings.push(
        `${file.slice(DIST.length + 1).replace(/\\/g, '/')}: unbreakable ${longest.length} character run in inline code: ${longest.slice(0, 60)}`,
      );
    }
  }
}

if (findings.length > 0) {
  console.error(findings.join('\n'));
  console.error(
    `\n${findings.length} string(s) that could push a 320px screen sideways. Put it in a code block, or give its container overflow-wrap.`,
  );
  process.exit(1);
}

console.log(
  `Checked ${scanned} inline code spans across ${files.length} pages. Nothing unbreakable over ${LIMIT} characters outside a scrolling or wrapping container.`,
);
