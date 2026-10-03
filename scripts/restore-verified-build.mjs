import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Reuse an already checked site through the existing Pages upload and deploy steps.
const [tag, expectedHash] = process.argv.slice(2);
if (!/^codex-docs-artifact-[a-f0-9]{40}$/.test(tag ?? '') || !/^[a-f0-9]{64}$/.test(expectedHash ?? ''))
  throw new Error('Supply the exact artifact tag and SHA256.');
const repository = 'bitcoinuniverseio/docs-stampdex';
const headers = { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' };
const release = await fetch(`https://api.github.com/repos/${repository}/releases/tags/${tag}`, { headers });
if (!release.ok) throw new Error(`Artifact release lookup failed: ${release.status}`);
const asset = (await release.json()).assets.find((entry) => entry.name === 'verified-site.tar.gz');
if (!asset) throw new Error('The verified site artifact is missing.');
const response = await fetch(asset.url, { headers: { ...headers, Accept: 'application/octet-stream' } });
if (!response.ok) throw new Error(`Artifact download failed: ${response.status}`);
const bytes = Buffer.from(await response.arrayBuffer());
if (createHash('sha256').update(bytes).digest('hex') !== expectedHash)
  throw new Error('The site artifact checksum differs.');
const temporary = mkdtempSync(join(tmpdir(), 'verified-docs-'));
try {
  const archive = join(temporary, 'verified-site.tar.gz');
  writeFileSync(archive, bytes);
  const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/);
  if (entries.some((entry) => !/^(?:dist\/|build-receipt\.json$)/.test(entry) || /(?:^|\/)\.\.(?:\/|$)|\\|:/.test(entry)))
    throw new Error('The site archive contains an unsafe path.');
  const types = execFileSync('tar', ['-tvzf', archive], { encoding: 'utf8' }).trim().split(/\r?\n/);
  if (types.some((entry) => !/^[d-]/.test(entry)))
    throw new Error('The site archive contains a link or special file.');
  execFileSync('tar', ['-xzf', archive, '-C', temporary]);
  const receipt = JSON.parse(readFileSync(join(temporary, 'build-receipt.json'), 'utf8'));
  const tree = execFileSync('git', ['rev-parse', 'HEAD^{tree}'], { encoding: 'utf8' }).trim();
  if (receipt.schema !== 'stampdex-docs-verified-build-v1' || receipt.repository !== repository || receipt.tree !== tree || receipt.siteChecksPassed !== true)
    throw new Error('The checked site does not match this source tree.');
  cpSync(join(temporary, 'dist'), 'dist', { recursive: true, force: false, errorOnExist: true });
  console.log(`Reused checked site for ${repository} at tree ${tree}.`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
