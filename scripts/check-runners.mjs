// Refuses a GitHub-hosted runner in any workflow.
//
// `ubuntu-latest`, `windows-latest`, `macos-latest`, and their dated forms
// send the job to GitHub's runners, past the self-hosted fleet and past
// RunsOn. A `runs-on` here must be one of three things:
//
//   - a self-hosted label set, inline or as a list
//   - a target the shared capacity router resolved
//   - a RunsOn label, which provisions EC2 Spot under our own account
//
// Exits 1 with the file, the line, and the value.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(
  dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')),
  '..',
);
const WORKFLOWS = join(ROOT, '.github', 'workflows');
const NEWLINE = String.fromCharCode(10);
const HOSTED_LABEL = /^(?:ubuntu|windows|macos)-(?:latest|\d[\w.]*)$/i;

/** The individual labels in a `runs-on` value, list form or bare. */
function runnerLabels(target) {
  const inner = target.startsWith('[') ? target.replace(/^\[|\]$/g, '') : target;
  return inner
    .split(',')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

/** A `runs-on` target this organisation permits. */
function isApprovedTarget(target) {
  if (runnerLabels(target).includes('self-hosted')) return true;
  if (
    /^\$\{\{\s*fromJSON\(needs\.[A-Za-z0-9_-]+\.outputs\.targets\)\.[A-Za-z0-9_]+\s*\}\}$/.test(
      target,
    )
  ) {
    return true;
  }
  if (target.startsWith('runs-on=')) return true;
  return false;
}

const findings = [];

if (!existsSync(WORKFLOWS)) {
  console.log('No .github/workflows directory. Nothing to check.');
  process.exit(0);
}

const files = readdirSync(WORKFLOWS)
  .filter((name) => /\.ya?ml$/.test(name))
  .sort();

for (const file of files) {
  const workflow = readFileSync(join(WORKFLOWS, file), 'utf8');
  for (const [index, line] of workflow.split(NEWLINE).entries()) {
    const match = line.match(/^\s*runs-on:\s*(.+?)\s*$/);
    if (!match) continue;
    const target = match[1].replace(/\s+#.*$/, '');
    const where = `${file}:${index + 1}`;

    const hosted = runnerLabels(target).filter((label) => HOSTED_LABEL.test(label));
    if (hosted.length > 0) {
      findings.push(
        `${where}: "${hosted[0]}" is a GitHub-hosted runner and is not permitted. Use a self-hosted label set, a routed target, or a RunsOn label.`,
      );
      continue;
    }
    if (!isApprovedTarget(target)) {
      findings.push(
        `${where}: "${target}" is not an approved runner. Use a self-hosted label set, a routed target, or a RunsOn label.`,
      );
    }
  }
}

if (findings.length) {
  console.error(findings.join(NEWLINE));
  process.exit(1);
}
console.log(`Checked ${files.length} workflow file(s). No GitHub-hosted runner.`);
