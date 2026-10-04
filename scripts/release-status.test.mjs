import { test } from 'node:test';
import assert from 'node:assert/strict';
import { releaseStatus } from '../src/data/release-status.mjs';

test('matches the eight-character docs snapshot against a full commit', () => {
  assert.equal(releaseStatus('38bc2a0e' + 'a'.repeat(32), '38bc2a0e'), 'Matches');
  assert.equal(releaseStatus('38BC2A0E' + 'A'.repeat(32), '38bc2a0e'), 'Matches');
});
test('a different commit does not imply a newer release', () => {
  assert.equal(releaseStatus('47ae1dfa' + 'b'.repeat(32), '38bc2a0e'), 'Differs');
  assert.equal(releaseStatus('01'.repeat(20), '38bc2a0e'), 'Differs');
});
test('missing or malformed version data remains unknown', () => {
  for (const commit of [undefined, null, '', 'unknown', '38bc2a0e', 'z'.repeat(40)]) {
    assert.equal(releaseStatus(commit, '38bc2a0e'), 'Unknown');
  }
  assert.equal(releaseStatus('a'.repeat(40), undefined), 'Unknown');
});
