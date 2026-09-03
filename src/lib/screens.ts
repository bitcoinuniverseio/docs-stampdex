import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

import manifest from '../../screenshots.manifest.json';

// The build runs from the repository root, and Vite may virtualise module
// URLs, so resolve the public directory from the working directory.
const ROOT = process.cwd();
const WIDTHS = [640, 800, 960, 1400];

export interface Capture {
  id: string;
  page: string;
  guideLink?: string;
  productRoute?: string;
  expectedHeading?: string;
  source: 'production' | 'controlled-fixture';
  fixtureId?: string;
  theme: 'light' | 'dark';
  locale: string;
  viewport: { name: string; width: number; height: number; deviceScaleFactor: number };
  authenticated: boolean;
  appCommit: string;
  docsCommit: string;
  capturedAt: string;
  lifecycle: 'current' | 'historical';
  maxAgeDays: number;
  category: string;
  mask?: unknown[];
  crop?: { x: number; y: number; width: number; height: number };
  callouts?: { x: number; y: number; label: string }[];
  alt: string;
  caption: string;
}

export const SCREENS = manifest.captures as Capture[];

export function getCapture(id: string): Capture {
  const capture = SCREENS.find((c) => c.id === id);
  if (!capture) {
    throw new Error(
      `[screens] unknown screenshot id "${id}". Add it to screenshots.manifest.json (scripts/gen-screens-manifest.mjs) and capture it.`,
    );
  }
  return capture;
}

/** All widths this capture actually has, both formats, from the convention
 * public/screens/<id>.<width>w.<format>. Checked against the real files so a
 * broken pipeline fails the build instead of serving a missing image. */
export function variantsFor(capture: Capture) {
  const found = [];
  for (const width of WIDTHS) {
    for (const format of ['avif', 'webp'] as const) {
      const file = `screens/${capture.id}.${width}w.${format}`;
      if (existsSync(join(ROOT, 'public', file))) {
        found.push({ width, format, file });
      }
    }
  }
  if (found.length === 0) {
    throw new Error(
      `[screens] no generated variants for "${capture.id}". Run npm run make:responsive-screens.`,
    );
  }
  return found;
}

export function bestVariant(capture: Capture): { file: string; width: number } {
  const all = variantsFor(capture);
  const widest = Math.max(...all.map((v) => v.width));
  const webp = all.find((v) => v.width === widest && v.format === 'webp')!;
  return { file: webp.file, width: widest };
}

export function captureDate(capture: Capture): string {
  return capture.capturedAt.slice(0, 10);
}

export function shortCommit(commit: string): string {
  return commit.slice(0, 7);
}
