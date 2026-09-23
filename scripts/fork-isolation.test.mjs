import assert from 'node:assert/strict';
import fs from 'node:fs';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
for (const file of ['docs-quality.yml', 'pr-preview.yml']) {
  test(`${file} rejects fork pull requests before self-hosted execution`, () => {
    const text = fs.readFileSync(new URL(`.github/workflows/${file}`, root), 'utf8');
    const jobs = text.split(/\n  [a-z][a-z0-9_-]*:\s*\r?\n/i).slice(1);
    const hostedJobs = jobs.filter(job => /runs-on:.*self-hosted/.test(job));
    assert.ok(hostedJobs.length > 0, 'Expected self-hosted jobs to validate');
    for (const job of hostedJobs) {
      const beforeSteps = job.split(/\n    steps:/)[0];
      assert.match('\n' + beforeSteps, /\n    if: .*github\.event\.pull_request\.head\.repo\.full_name == github\.repository/);
    }
  });
}
test('publishing the documentation remains opt-in', () => {
  const text = fs.readFileSync(new URL('.github/workflows/pages.yml', root), 'utf8');
  const triggers = text.split(/\non:\s*\r?\n/)[1]?.split(/\n[^ \r\n]/)[0];
  assert.match(triggers ?? '', /workflow_dispatch:/);
  assert.doesNotMatch(triggers ?? '', /(?:push|pull_request|workflow_run):/);
});
