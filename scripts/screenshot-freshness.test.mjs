import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isStaleCurrentCapture } from './screenshot-freshness.mjs';
const old = { capturedAt: '2026-09-02T18:40:00Z', maxAgeDays: 30, lifecycle: 'current' };
const now = Date.parse('2026-10-04T00:00:00Z');
test('current screenshots still require a fresh capture', () => {
  assert.equal(isStaleCurrentCapture(old, now), true);
  assert.equal(isStaleCurrentCapture({ ...old, capturedAt: '2026-10-03T00:00:00Z' }, now), false);
});
test('historical screenshots retain their real date without claiming freshness', () => {
  assert.equal(isStaleCurrentCapture({ ...old, lifecycle: 'historical' }, now), false);
});
