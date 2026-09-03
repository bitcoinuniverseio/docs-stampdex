import { defineConfig } from '@playwright/test';

// Visual regression runs against the built site, in one fixed browser, with
// baselines scoped per platform so a Windows development machine and the
// Linux CI runner never fight over each other's pixels.
export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  reportSlowTests: null,
  snapshotPathTemplate: 'tests/visual-baselines/{platform}/{arg}{ext}',
  use: {
    browserName: 'chromium',
    headless: true,
    video: 'off',
    trace: 'off',
  },
  expect: { toHaveScreenshot: { animations: 'disabled', threshold: 0.2 } },
});
