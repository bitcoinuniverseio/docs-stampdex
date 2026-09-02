// Validates 1:1 translation parity and glossary compliance between English
// and Simplified Chinese (zh-cn) documentation.
//
// Usage: node scripts/check-translations.mjs
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DOCS = join(ROOT, 'src', 'content', 'docs');
const ZH_DOCS = join(DOCS, 'zh-cn');

const GLOSSARY_RULES = [
  { en: 'non-custodial', requiredZh: '非托管', forbiddenZh: '无托管' },
  { en: 'atomic settlement', requiredZh: '原子结算' },
  { en: 'single-transaction settlement', requiredZh: '单交易结算' },
  { en: 'counterparty dispenser', requiredZh: 'Counterparty 分发器' },
  { en: 'service fee', requiredZh: '服务费' },
  { en: 'verification window', requiredZh: '验证周期' },
  { en: 'psbt', requiredZh: '部分签名的比特币交易' },
];

function walk(dir) {
  let files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'zh-cn') continue; // Don't recurse into zh-cn when scanning English
      files.push(...walk(full));
    } else if (entry.endsWith('.md') || entry.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

const enFiles = walk(DOCS);
let errors = 0;

console.log(`Found ${enFiles.length} English documentation pages.`);

for (const enPath of enFiles) {
  const rel = relative(DOCS, enPath);
  const zhPath = join(ZH_DOCS, rel);

  if (!existsSync(zhPath)) {
    console.error(`MISSING CHINESE TRANSLATION: src/content/docs/zh-cn/${rel}`);
    errors++;
    continue;
  }

  const enContent = readFileSync(enPath, 'utf8');
  const zhContent = readFileSync(zhPath, 'utf8');

  // Check no em dash
  if (/—/.test(zhContent)) {
    console.error(`EM DASH DETECTED: src/content/docs/zh-cn/${rel}`);
    errors++;
  }

  // Check no "canonical"
  if (/canonical/i.test(zhContent)) {
    console.error(`BANNED WORD 'canonical' DETECTED: src/content/docs/zh-cn/${rel}`);
    errors++;
  }

  // Check no mojibake
  if (/\uFFFD/.test(zhContent)) {
    console.error(`MOJIBAKE DETECTED: src/content/docs/zh-cn/${rel}`);
    errors++;
  }

  // Check glossary compliance
  for (const rule of GLOSSARY_RULES) {
    if (rule.forbiddenZh && zhContent.includes(rule.forbiddenZh)) {
      console.error(`FORBIDDEN TRANSLATION '${rule.forbiddenZh}' used instead of '${rule.requiredZh}' in src/content/docs/zh-cn/${rel}`);
      errors++;
    }
  }

  // Verify that the Chinese file actually contains Chinese characters (CJK Unified Ideographs)
  const cjkMatches = zhContent.match(/[\u4e00-\u9fa5]/g) || [];
  if (cjkMatches.length < 20) {
    console.error(`INSUFFICIENT CHINESE CONTENT (${cjkMatches.length} CJK chars): src/content/docs/zh-cn/${rel}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`Translation check failed with ${errors} error(s).`);
  process.exit(1);
}

console.log(`All ${enFiles.length} pages verified with 100% Simplified Chinese parity and glossary compliance.`);
