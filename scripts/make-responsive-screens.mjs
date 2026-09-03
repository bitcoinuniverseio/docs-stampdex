// Generates the responsive variants the site serves from the committed
// masters in assets/screens/, following the manifest.
//
//   public/screens/<id>.<width>w.webp   640 / 960 / 1400
//   public/screens/<id>.<width>w.avif   where the master is at least that wide
//
// Masters are not served directly: a capture is only referenced through its
// variants, so a screenshot page can never exceed the image budget by
// accident. Every variant must stay under the 200 KB public-image budget;
// interface legibility beats compression, so lower the width in the manifest
// viewport rather than crushing quality here.
import { readFileSync, existsSync, mkdirSync, readdirSync, statSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MASTERS = join(ROOT, 'assets', 'screens');
const OUT = join(ROOT, 'public', 'screens');
const WIDTHS = [640, 960, 1400];
const MAX_KB = 200;

const manifest = JSON.parse(
  readFileSync(join(ROOT, 'screenshots.manifest.json'), 'utf8'),
);

mkdirSync(OUT, { recursive: true });

// Screens that are no longer in the manifest must not linger in the public
// directory: the atlas and the components would be the only places that could
// still reference them, and none of them do, by construction.
const validIds = new Set(manifest.captures.map((c) => c.id));
for (const name of readdirSync(OUT)) {
  const id = name.replace(/\.[0-9]+w\.(webp|avif)$/, '');
  if (!validIds.has(id)) {
    rmSync(join(OUT, name));
    console.log(`removed stale public/screens/${name}`);
  }
}

let failures = 0;
let count = 0;

for (const capture of manifest.captures) {
  const master = join(MASTERS, `${capture.id}.png`);
  if (!existsSync(master)) {
    console.error(`missing master for ${capture.id}: assets/screens/${capture.id}.png`);
    failures++;
    continue;
  }
  const meta = await sharp(master).metadata();
  const crop = capture.crop;
  if (
    crop &&
    (crop.x < 0 || crop.y < 0 || crop.width <= 0 || crop.height <= 0 ||
      crop.x + crop.width > meta.width || crop.y + crop.height > meta.height)
  ) {
    console.error(`${capture.id}: crop is outside assets/screens/${capture.id}.png`);
    failures++;
    continue;
  }
  const sourceWidth = crop?.width ?? meta.width;
  for (const name of readdirSync(OUT)) {
    const match = name.match(new RegExp(`^${capture.id}\\.(\\d+)w\\.(webp|avif)$`));
    if (match && Number(match[1]) > sourceWidth) {
      rmSync(join(OUT, name));
      console.log(`removed oversized variant public/screens/${name}`);
    }
  }
  const widths = crop
    ? [...new Set([...WIDTHS, sourceWidth])].sort((a, b) => a - b)
    : WIDTHS;
  for (const width of widths) {
    if (sourceWidth < width) continue;
    const source = crop
      ? sharp(master).extract({
          left: crop.x,
          top: crop.y,
          width: crop.width,
          height: crop.height,
        })
      : sharp(master);
    const resize = source.resize({ width, withoutEnlargement: true });
    for (const [ext, pipe] of [
      ['webp', () => resize.clone().webp({ quality: 84, effort: 5 })],
      ['avif', () => resize.clone().avif({ quality: 60, effort: 5 })],
    ]) {
      const out = join(OUT, `${capture.id}.${width}w.${ext}`);
      const info = await pipe().toFile(out);
      const kb = statSync(out).size / 1024;
      count++;
      if (kb > MAX_KB) {
        console.error(
          `${capture.id}.${width}w.${ext} is ${kb.toFixed(1)} KB, over the ${MAX_KB} KB budget`,
        );
        failures++;
      }
    }
  }
  console.log(
    `${capture.id}: ${meta.width}x${meta.height}${crop ? ` cropped to ${crop.width}x${crop.height}` : ''} -> variants written`,
  );
}

if (failures) {
  console.error(`\n${failures} problem(s). Fix the budget or the manifest.`);
  process.exit(1);
}
console.log(`\nWrote ${count} variant(s) into public/screens/.`);
