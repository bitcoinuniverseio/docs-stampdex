// Converts the production screenshots in assets/ into the WebP files the site
// serves from public/screens/. The PNG originals stay in assets/ because the
// README renders on GitHub, which does not run this build.
//
// Run after adding or replacing a screenshot. Output is committed, so the site
// build needs no image pipeline.
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const SOURCE = join(ROOT, 'assets');
const OUT = join(ROOT, 'public', 'screens');
const MAX_WIDTH = 1400;
const MAX_KB = 200;

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const files = readdirSync(SOURCE).filter((name) => name.endsWith('.png'));
let failed = false;

for (const name of files) {
  const out = join(OUT, name.replace(/\.png$/, '.webp'));
  const info = await sharp(join(SOURCE, name))
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  const kb = statSync(out).size / 1024;
  console.log(
    `${name} -> ${out.slice(ROOT.length + 1)} ${info.width}x${info.height} ${kb.toFixed(1)} KB`,
  );
  if (kb > MAX_KB) {
    console.error(`  over the ${MAX_KB} KB budget. Lower the quality or the width.`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`Converted ${files.length} screenshot(s).`);
