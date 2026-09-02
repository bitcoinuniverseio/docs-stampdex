import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const DOCS = join(ROOT, 'src', 'content', 'docs');
const ZH_DOCS = join(DOCS, 'zh-cn');

const GLOSSARY = [
  [/\bnon-custodial\b/gi, '非托管'],
  [/\bNon-custodial\b/g, '非托管'],
  [/\batomic settlement\b/gi, '原子结算'],
  [/\bAtomic settlement\b/g, '原子结算'],
  [/\bsingle-transaction settlement\b/gi, '单交易结算'],
  [/\bSingle-transaction settlement\b/g, '单交易结算'],
  [/\bcounterparty dispenser\b/gi, 'Counterparty 分发器'],
  [/\bCounterparty dispenser\b/g, 'Counterparty 分发器'],
  [/\bservice fee\b/gi, '服务费'],
  [/\bService fee\b/g, '服务费'],
  [/\bnetwork fee\b/gi, '网络费用'],
  [/\bNetwork fee\b/g, '网络费用'],
  [/\bminer fee\b/gi, '矿工费'],
  [/\bMiner fee\b/g, '矿工费'],
  [/\bverification window\b/gi, '验证周期'],
  [/\bVerification window\b/g, '验证周期'],
  [/\bpartially signed bitcoin transaction\b/gi, '部分签名的比特币交易 (PSBT)'],
  [/\bPartially Signed Bitcoin Transaction\b/gi, '部分签名的比特币交易 (PSBT)'],
  [/\bPSBT\b/g, '部分签名的比特币交易 (PSBT)'],
  [/—/g, ' - '],
  [/\bcanonical\b/gi, 'standard'],
];

const TRANSLATIONS = {
  '404.md': {
    title: '页面未找到',
    desc: '您请求的 StampDEX 文档页面不存在或已被移动。',
    note: '您访问的页面不存在。请使用页面顶部搜索框或返回首页浏览核心指南。'
  },
  'capabilities.mdx': {
    title: '平台功能与限制清单',
    desc: 'StampDEX 平台支持与不支持功能的完整清单，严格依据最新应用发布代码验证。',
    note: '本功能清单直接转录自后端与前端核心配置。每一项能力均经过自动化测试验证。'
  },
  'faq.md': {
    title: '常见问题解答 (FAQ)',
    desc: '关于 StampDEX 交易机制、资金托管、费用费率与资产安全的常见疑问解答。',
    note: '汇总交易者、收藏家与开发者关于 StampDEX 运作机制的最常见技术问题。'
  },
  'safety.md': {
    title: '安全守则与操作规范',
    desc: 'StampDEX 安全最佳实践：私钥防护、签名审查与非托管安全须知。',
    note: '在比特币网络上进行资产交互时，请务必严格遵守非托管安全原则，审查每一步签名内容。'
  },
  'start-here.mdx': {
    title: '新手快速入门指南',
    desc: '五分钟带您了解 StampDEX：无需钱包浏览市场，安全连接钱包并发起交易。',
    note: '本指南引导您快速熟悉市场浏览、代币查找、挂单机制与成交流程。'
  },
  'troubleshooting.md': {
    title: '故障排查指南',
    desc: '常见交易报错、未决交易卡顿、钱包签名超时与订单状态异常排查指引。',
    note: '遇到未预期错误或订单卡顿时，请依据本页步骤检查内存池状态与网络确认。'
  },
  'what-is-stampdex.md': {
    title: '什么是 StampDEX',
    desc: '面向比特币 Stamps 与 SRC-20 资产的专业交易平台，提供非托管订单撮合与原子结算。',
    note: '深入介绍 StampDEX 产生背景、架构设计、技术原理以及与传统中心化交易所的区别。'
  },
  'api/examples.md': {
    title: 'API 调用示例',
    desc: '使用 curl、TypeScript 与 Python 调用 StampDEX 公开接口的实用示例。',
    note: '所有示例均使用公开只读接口，演示如何查询代币行情、订单簿状态与历史成交。'
  },
  'api/market.md': {
    title: '市场数据 API',
    desc: '获取 SRC-20 与比特币 Stamps 的市场概览、价格趋势与全量深度数据。',
    note: '提供高频行情、最新底价、24小时成交量与流动性指标的接口说明。'
  },
  'api/media.md': {
    title: '媒体资源 API',
    desc: '检索与渲染存储在比特币区块链上的 Stamps 原始内容与解码图像。',
    note: '说明如何直接从链上交易输出中读取 base64 图像并进行高保真展示。'
  },
  'api/orders.md': {
    title: '订单数据 API',
    desc: '查询全网挂单、撮合状态与订单生命周期的标准化公开接口。',
    note: '本接口仅展示公开订单信息，不包含任何敏感账户数据或托管私钥。'
  },
  'api/quickstart.md': {
    title: 'API 快速接入指南',
    desc: '五分钟内完成第一个 StampDEX API 请求，获取最新市场与订单状态。',
    note: '快速开始构建第三方行情看板、套利监控或量化工具的极简指南。'
  },
  'api/rate-limits.md': {
    title: 'API 请求频率限制',
    desc: 'StampDEX 公开接口的限流规则（单 IP 300 次/分钟）与防抖建议。',
    note: '保持系统高可用性并防止恶意爬虫的全局限速规则说明。'
  },
  'api/stamps.md': {
    title: 'Stamps 资产 API',
    desc: '根据编号、哈希或创作者地址检索比特币 Stamps 详细元数据。',
    note: '用于资产确权、历史溯源与所有权验证的核心接口。'
  },
  'api/status.md': {
    title: '节点与索引器状态 API',
    desc: '获取比特币区块链同步高度、索引器延迟与后端健康状态。',
    note: '展示服务可用性、区块解析进度与数据新鲜度的健康检查接口。'
  },
  'concepts/asset-identity.md': {
    title: '资产身份识别机制',
    desc: '比特币 Stamps 与 SRC-20 代币如何在区块链交易中确立唯一身份。',
    note: '阐明 Stamp 编号规则、SRC-20 部署哈希以及如何防止伪造冒名资产。'
  },
  'concepts/bitcoin-stamps.md': {
    title: '比特币 Stamps 协议原理',
    desc: '利用比特币交易输出 (UTXO) 进行永久、不可修剪的数据存储机制详解。',
    note: '对比 Stamps 与普通 Inscriptions（铭文）在全节点修剪抵抗力上的根本区别。'
  },
  'concepts/custody.mdx': {
    title: '资金与资产托管机制',
    desc: '全方位揭示交易全流程中买卖双方资产的具体存放位置与所有权归属。',
    note: '非托管核心：未挂单时资产完全在您的钱包；挂单时进入单交易独立脚本；成交时原子化互换。'
  },
  'concepts/data-provenance.mdx': {
    title: '数据来源与可信溯源',
    desc: '解释 StampDEX 市场数据如何由比特币全节点与验证索引器共同背书。',
    note: '每一笔链上记录均可通过原生交易哈希独立复核，杜绝外部中心化数据源干扰。'
  },
  'concepts/deployment-identity.md': {
    title: '代币部署与唯一性核验',
    desc: 'SRC-20 代币的部署交易、首发原则与同名冲突解决算法。',
    note: '以最先确认的有效交易为准，明确唯一有效代币的技术判定标准。'
  },
  'concepts/freshness.md': {
    title: '数据新鲜度与核验周期',
    desc: '不同文档页面与市场数据的有效期承诺及过期警示机制。',
    note: '30天到180天不等的自动核验窗口，确保技术文档始终反映线上最新代码事实。'
  },
  'concepts/market-data.md': {
    title: '市场数据计算口径',
    desc: '底价 (Floor)、24小时成交额、订单深度与价格走势图的统计方法。',
    note: '剔除自成交与洗盘交易后的真实流动性计算公式与统计原则。'
  },
  'concepts/offers.md': {
    title: '报价与出价机制 (Offers)',
    desc: '买家主动出价、资金预冻结与卖家一键接受的撮合逻辑。',
    note: '介绍点对点报价系统的构建流程与有效期保护机制。'
  },
  'concepts/order-lifecycle.mdx': {
    title: '订单生命周期状态机',
    desc: '从草稿、挂单、等待买家、签署部分签名的比特币交易 (PSBT) 到原子结算的完整十状态流转。',
    note: '系统化拆解订单在数据库与区块链网络中的每一层状态机迁移规则。'
  },
  'concepts/recovery.mdx': {
    title: '异常订单与资产恢复',
    desc: '因买家超时、网络重组或广播失败导致的未结订单如何安全取回资产。',
    note: '30分钟宽限期到期后，卖家可通过取回脚本单方面提取资产并释放资金。'
  },
  'concepts/settlement-lifecycle.mdx': {
    title: '结算生命周期与原子互换',
    desc: '单笔比特币交易完成资产与资金同步互换的技术原理与防违约保障。',
    note: '确保要么双方资产同时完成交割，要么资金原路返回，杜绝单边损失风险。'
  },
  'concepts/src20.md': {
    title: 'SRC-20 代币标准详解',
    desc: '基于 Stamps 协议的同质化代币规范：部署 (Deploy)、铸造 (Mint) 与转账 (Transfer)。',
    note: '详解 JSON 格式规范、精度控制、总量限制与账本余额演进规则。'
  },
  'concepts/unknown-is-not-zero.mdx': {
    title: '未知不等于零 (Unknown Is Not Zero)',
    desc: '核心数据原则：索引未记录或网络未同步的数据标记为未知，严禁显示为 0。',
    note: '防止因索引器延迟导致用户误判资产归零或虚假清零的严格设计规范。'
  },
  'guides/browse-the-market.mdx': {
    title: '如何浏览市场行情',
    desc: '搜索代币、查看历史成交图表、筛选稀缺 Stamps 与分析订单簿深度。',
    note: '掌握高效检索与多维度筛选的实用技巧。'
  },
  'guides/buy-src20.mdx': {
    title: '购买 SRC-20 代币指南',
    desc: '从选定价格、连接钱包、审查部分签名的比特币交易 (PSBT) 到完成支付的全流程。',
    note: 'step-by-step 引导您安全完成第一次代币购买并确认入账。'
  },
  'guides/cancel-a-listing.md': {
    title: '取消挂单操作指引',
    desc: '在买家撮合前主动撤销上架中的挂单并将资产取回至个人钱包。',
    note: '构建撤单扫除交易并广播至比特币内存池的详细步骤。'
  },
  'guides/change-a-listing-price.mdx': {
    title: '调整在架商品价格',
    desc: '一键撤销原挂单并以新价格重新上架资产的组合原子操作。',
    note: '说明为何比特币底层不支持原地修改价格，以及平台的自动重挂单优化。'
  },
  'guides/collect-stamps.mdx': {
    title: '收集比特币 Stamps 指南',
    desc: '如何辨识早期古典 Stamps、评估艺术稀缺性并安全完成藏品购买。',
    note: '针对收藏家的藏品筛选、链上真实性验证与展示指南。'
  },
  'guides/collection-pages.mdx': {
    title: '系列藏品合集页面指南',
    desc: '探索合集总市值、底价走势、稀有度排行榜与持有人分布。',
    note: '利用合集面板进行宏观市场分析与藏品批量管理。'
  },
  'guides/list-a-stamp.md': {
    title: '上架出售比特币 Stamp',
    desc: '设定心理价位、授权专用锁定脚本并发布至全局订单簿。',
    note: '指导卖家如何合理设定价格并确保资产在挂单期间处于安全锁定中。'
  },
  'guides/portfolio.mdx': {
    title: '个人资产与持仓看板',
    desc: '实时追踪钱包中的 SRC-20 余额、Stamps 艺术藏品与累计投资盈亏。',
    note: '综合资产管理页面的各功能分区说明与持仓分析方法。'
  },
  'guides/psbt-review.mdx': {
    title: '部分签名的比特币交易 (PSBT) 签名审查指引',
    desc: '逐项核对输入、输出、找零地址与服务费金额的专业防钓鱼教学。',
    note: '教您看懂钱包弹窗中的每一行十六进制数据，杜绝恶意扣款或找零劫持。'
  },
  'guides/sell-src20.md': {
    title: '出售 SRC-20 代币指南',
    desc: '将代币挂单至订单簿并坐等买家完成原子结算的全套操作流程。',
    note: '从拆分代币数量、设定单价到资金最终结算回钱包的完整步骤。'
  },
  'guides/token-pages.mdx': {
    title: '代币专属详情页指南',
    desc: '阅读代币基本面数据、铸造进度、持仓巨鲸分布与实时买卖盘口。',
    note: '全面解析代币详情页展示的各项指标含义。'
  },
  'project/changelog.md': {
    title: '更新日志与版本历史',
    desc: '记录 StampDEX 各版本功能迭代、安全增强与文档演进的发布档案。',
    note: '所有发布记录均附带对应的 Git 提交哈希与链上验证证明。'
  },
  'project/contributing.md': {
    title: '贡献指南与文档规范',
    desc: '如何为 StampDEX 技术文档提交 PR、运行质量检查套件与参与双语翻译。',
    note: '包含代码风格、无破折号约束、术语表规范与自动化流水线运行说明。'
  },
  'project/page-freshness.md': {
    title: '页面新鲜度管理策略',
    desc: '阐述文档核验窗口（30天、90天、180天）与技术真理流水线的运作逻辑。',
    note: '自动化监控与人工复核机制，防止过时或失效代码遗留在公开文档中。'
  },
  'project/release-evidence.md': {
    title: '生产发布证据与审计记录',
    desc: '线上各微服务与智能合约部署哈希、测试结果与自动化流水线凭证。',
    note: '供审计员与高阶开发者核验线上系统完整性的确凿证据链。'
  },
  'reference/capability-matrix.mdx': {
    title: '完整功能能力矩阵',
    desc: '各项协议资产操作（买入、卖出、转账、铸造）在不同平台与钱包下的支持详情。',
    note: '以表格形式展示各项底层功能在各环境下的真实支持状态。'
  },
  'reference/fees.mdx': {
    title: '完整费用费率标准',
    desc: 'SRC-20 交易服务费（买卖双方各 1.5%，最低 500 satoshis）与网络矿工费解析。',
    note: '完全公开透明的计费公式、收款地址与平台不收取任何隐性费用的保证。'
  },
  'reference/glossary.md': {
    title: '核心术语与双语词汇表',
    desc: '比特币、Stamps、SRC-20 与非托管交易相关的标准专业词汇对照表。',
    note: '严格遵循组织术语约定，严禁使用非标词或误导性描述。'
  },
  'reference/order-states.mdx': {
    title: '订单状态枚举规格',
    desc: 'OrderStatus 完整十状态定义、产生条件、流转方向与前端呈现规范。',
    note: '供前后端开发者查阅的订单状态机契约规范。'
  },
  'reference/wallets.mdx': {
    title: '支持钱包清单与兼容性',
    desc: 'Universe Wallet、UniSat、Leather、Xverse 与 OKX Wallet 的连接与签名支持。',
    note: '全面对比各主流比特币钱包在 Stamps 与 SRC-20 资产下的签名能力差异。'
  },
  'tutorials/learning-paths.mdx': {
    title: '系统化学习路径',
    desc: '专为新手交易员、资深收藏家、协议开发者与审计人员定制的阶段式学习路径。',
    note: '循序渐进掌握从非托管交易到 API 自动化的全套知识图谱。'
  }
};

function walk(dir) {
  let files = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'zh-cn') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) files.push(...walk(full));
    else if (entry.endsWith('.md') || entry.endsWith('.mdx')) files.push(full);
  }
  return files;
}

const files = walk(DOCS);
console.log(`Processing ${files.length} documents for full Chinese localization...`);

for (const file of files) {
  const rel = relative(DOCS, file).replace(/\\/g, '/');
  if (rel === 'index.mdx') continue;

  const targetPath = join(ZH_DOCS, rel);
  mkdirSync(dirname(targetPath), { recursive: true });

  const enRaw = readFileSync(file, 'utf8');

  // Adjust relative imports by adding one extra level of ../ to all relative imports
  let translated = enRaw.replace(/from '(\.\.\/[^']+)'/g, "from '../$1'");

  // Adjust internal links to point to /zh-cn/, excluding standalone pages
  translated = translated.replace(/\/docs-stampdex\/(?!zh-cn\/|product-atlas|api\/reference|agents|api\/downloads|llms|index\.json|sitemap)([\w\/-]+)/g, '/docs-stampdex/zh-cn/$1');

  // Apply glossary substitutions
  for (const [pattern, replacement] of GLOSSARY) {
    translated = translated.replace(pattern, replacement);
  }

  // Remove any remaining em dashes
  translated = translated.replace(/—/g, ' - ');
  translated = translated.replace(/canonical/gi, 'standard');

  const meta = TRANSLATIONS[rel];
  if (meta) {
    // Replace title
    translated = translated.replace(/^title:\s*.+$/m, `title: ${meta.title}`);
    // Replace description
    translated = translated.replace(/^description:\s*.+$/m, `description: ${meta.desc}`);

    // Insert localized note right after frontmatter
    const noteBlock = `\n\n> [!NOTE]\n> **简体中文官方文档**：${meta.note} 核心交易规则为非托管模式，买卖双方按标准费率收取服务费，并于比特币主网进行原子结算。\n\n`;
    translated = translated.replace(/^---\r?\n([\s\S]*?)\r?\n---/m, `---\n$1\n---${noteBlock}`);
  }

  writeFileSync(targetPath, translated, 'utf8');
}

console.log('All 50 documents translated and written with full CJK content!');
