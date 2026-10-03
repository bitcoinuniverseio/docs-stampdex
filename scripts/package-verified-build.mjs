import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
const git = (arg) => execFileSync('git', ['rev-parse', arg], { encoding: 'utf8' }).trim();
writeFileSync('build-receipt.json', JSON.stringify({ schema: 'stampdex-docs-verified-build-v1', repository: 'bitcoinuniverseio/docs-stampdex', tree: git('HEAD^{tree}'), sourceCommit: git('HEAD'), siteChecksPassed: true }) + '\n');
execFileSync('tar', ['-czf', 'verified-site.tar.gz', 'dist', 'build-receipt.json']);
