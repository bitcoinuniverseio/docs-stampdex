---
title: 生产发布证据与审计记录
description: 线上各微服务与智能合约部署哈希、测试结果与自动化流水线凭证。
source:
  repo: bitcoinuniverseio/stampdex release registry, and bitcoinuniverseio/core for the capability registry
  path: release registry and verifier, GET /api/version
  release: snapshot recorded 2026-09-06
  verified: "2026-09-06"
contentType: reference
audiences: [traders, collectors, developers]
products: [src20, stamps]
protocols: [src20, stamps, bitcoin]
difficulty: intro
estimatedMinutes: 5
lifecycle: stable
releaseStatus: preview
lastReviewedBy: docs-stampdex maintainers
---

## 2026-09-23：仅支持 Stamps 与 SRC-20

**未部署。** [应用拉取请求 126](https://github.com/bitcoinuniverseio/stampdex/pull/126) 移除了 Bitcoin Stamps 与 SRC-20 以外的所有协议。Counterparty 仅作为 stamps 所依赖的底层保留。该拉取请求还移除了此前由构建开关控制的两个画廊页面。

2026-09-23 之前的各节提到的协议和页面已被此次改动移除。这些内容作为历史记录保留，不代表当前功能。

## 2026-09-18：来源健康状态开发候选版本

**尚未部署。原生功能发布状态仍为 NO-GO。** 应用提交
`b83dbcdce29e587fd56f23e94602cc5082040e08` 修改来源健康状态的读取、失败处理和恢复。
此变更不连接尚缺失的原生协议服务。

TAP、OPNet 或闪电网络的刷新失败不会再阻止返回其他来源的结果。
并发读取共享尚未完成的请求。单次来源等待在 30 秒后结束，不会重复启动仍未完成的请求。
公开错误消息不包含上游异常的原始细节。

每个原生来源保留自身的观测时间。未经观测的协议不会借用比特币链头的时间戳。
无效或超出允许时钟偏差的未来时间会被拒绝，并执行来源声明的有效期限制。
本地时钟回退会使受影响的缓存失效。

来源健康状态专项检查通过了两个套件中的 24 项测试。后端回归测试、类型检查和专项 lint
均以零状态码退出。这些是受控组件检查，不是钱包、原生交易或部署证据。

## 2026-09-18：所有权查询恢复候选版本

**尚未发布。原生流程验收仍为 NO-GO。** 应用提交
[af90d012](https://github.com/bitcoinuniverseio/stampdex/commit/af90d0121c5c030f8276347e7943bcb2d26d7d11)
区分“无法验证邮票所有权”和“钱包没有邮票”。查询失败时，NFT 绑定对话框会清除旧结果，
并显示 **Retry ownership check**（重试所有权查询）。此操作只重新读取所有权，
不会签名或广播交易。

已经广播的交易仍使用独立的 **Retry confirmation**（重试确认）操作。
切换钱包或关闭对话框会取消所有权重试；迟到的响应不能覆盖新钱包的状态。
未知的服务器错误详情不会直接显示给用户。

四组后端定向测试共 18 项通过，六项前端 HTTP 测试通过。这些是受控组件测试，
不代表完整的钱包或区块链流程验收。浏览器验证和完整 CI 状态见
[PR 122](https://github.com/bitcoinuniverseio/stampdex/pull/122)。此候选版本尚未部署，
也未执行主网功能测试交易。请查看[运行版本](https://stamp.api.bitcoinuniverse.io/api/version)，
不要把候选代码行为视为已上线行为。下文保留历史记录。

## 2026-09-17：权威服务传输与 CI 修复

**未发布的修复分支。功能验收仍为 NO-GO。未部署。** [应用拉取请求 117](https://github.com/bitcoinuniverseio/stampdex/pull/117) 保留 9 月 16 日的候选修复，并增加请求与响应大小限制、检查点身份检查及重定向拒绝。客户端还拒绝重复的交易输入，以及格式错误的警告或脚本类型字段。

客户端的 100 项检查通过，五种权威服务的 192 项回归检查通过。这些结果来自受控传输和组件检查，并非已获得资金的原生交易。协议识别、钱包结果、最终性及恢复仍须各自的证据。

CI 现在会在前面的原生命令失败时停止，不会用后续命令的成功掩盖失败。八项回归检查覆盖失败传播和已编译迁移程序的复用。本拉取请求的注册表及生产依赖检查已通过；这不代表整个应用已完成验收。

## 2026-09-16：本地权限响应与依赖修复

**本地候选版本。NO-GO。尚未部署。** 本节记录隔离应用分支 `codex/stampdex-go-20260916` 的修改，不改变运行服务的状态或此前的发布证据。

权限响应现在拒绝互相矛盾的验证和结算结果。验证通过必须同时满足清单匹配、具有交易 ID、错误列表为空。输入金额必须等于输出金额加矿工费。结算中的确认状态、区块和最终状态必须一致。回滚确认必须是空对象。无效交易产物返回结构化错误，不再绕过合约检查。

后端通过限定依赖范围的覆盖设置，将受影响的 TOML 解析器固定为 4.2.0。本地通过了八项解析器检查、七项原生 SDK 检查，以及 91 项交易与 OPNet 单元测试；后端构建通过。当次依赖扫描未发现已报告漏洞。这些结果不证明钱包流程、所提供网络上的结算或恢复。

费用面板将缺失或无效的估算显示为不可用，不显示零费用。测试网络或网络未确定的交易 ID 保持可见，但不附加主网浏览器链接。仅当操作明确属于主网时，才使用第一方浏览器链接。显示网络的配置本身不能证明数据来源的网络。

结算响应检查仅保证字段一致性，原生权限服务仍须负责协议自身的最终确认规则。候选版本也支持通过显式运营配置读取第一方 electrs 费用估算。此设置尚未上线，不能替代缺失的费用数据。

费用加速现在先检查节点创世区块和父交易输出脚本，再为配置的网络构建未签名的子交易。本地测试解码了主网、Signet、testnet 和 regtest 上的 SegWit 与 Taproot 输出。钱包签名及已注资网络流程仍未验证。费用监视计数将就绪和等待分开，并排除已结束的监视。未同意功能性 Cookie 时，页面使用“Watch for this visit”和“Watches for this visit”标签，说明刷新或导航会将其移除。已同意功能性 Cookie 的本地浏览器检查验证了保存、刷新、取消和重新打开行为。

原生权限服务、已注资钱包流程、协议读回和恢复证据仍需验收。上线仍待完成。这些本地检查不代表生产发布，也不代表主网交易。

## 2026-09-06：Arkade 与 BRC2 记录修复

**CI 检查通过。原生执行仍不可用。** 应用提交
[8b0d3467](https://github.com/bitcoinuniverseio/stampdex/commit/8b0d34678b120535564e0cfa8ec78bc3a4297814) 通过了
[Quality 运行 34043045580](https://github.com/bitcoinuniverseio/stampdex/actions/runs/34043045580)。
该运行覆盖 231 个套件中的 1,954 项后端单元测试、46 项 API 测试、迁移、前端检查、
179 项浏览器测试和路由测试数据。另有三项浏览器测试跳过。这些检查不证明原生交易。

Arkade 与 BRC2 不再返回固定的原生检查点或虚构的执行结果。原生写入在读取或更改已存记录前
返回 HTTP 503，不生成入金地址、已完成续期、结算或 VM 结果。页面读取 API，并将已存合约、
VTXO 和回执标记为未经验证的历史记录。已存状态不证明可花费余额或结算。

Arkade 持有者记录需要针对所请求地址的钱包访问签名。读取时精确比较地址，包括字母大小写。
原始路由及其版本化别名都执行这些检查。历史记录保持原样。更新使用旧响应格式的客户端前，
请阅读 [API 合约与限制](https://github.com/bitcoinuniverseio/stampdex/blob/main/docs/NATIVE_RECORDS_REPAIR_2026-09-06.md)。

源码清单包含 954 项 API 声明和 1,979 项未绑定声明。注册表仍有零个 PASS 行，
351 个必需钱包变体均缺少获认可的验证记录。原生权限来源、执行产物、恢复和真实钱包结果仍待完成，
其中也包括独立的 Spark 和闪电网络缺口。请读取[运行版本](https://stamp.api.bitcoinuniverse.io/api/version)
以确认已部署的提交。下方早期章节属于历史快照。

## 2026-09-06：事件访问修复与 CI 证据

**CI 检查通过。原生执行就绪状态仍为 NO-GO。** 应用提交
[83498787](https://github.com/bitcoinuniverseio/stampdex/commit/8349878769b5f969e02a57440af33bd0791ead0f) 通过了
[Quality 运行 34036927184](https://github.com/bitcoinuniverseio/stampdex/actions/runs/34036927184)。
记录包括 231 个后端单元测试套件中的 1,957 项测试、45 项 API 集成测试、版本化迁移、
前端检查、浏览器测试和生产运维检查。首次 MySQL 测试容器启动失败，后端任务重试后通过。
请读取[运行版本](https://stamp.api.bitcoinuniverse.io/api/version)以确认已部署的应用提交。
CI 不证明部署或原生执行。下方早期章节描述各次审阅记录时的状态。

公开活动仅包含获准的事件类型和字段。
Spark 持仓活动需要持有者的钱包签名证明。发行活动所属项目必须已公开且不再是草稿。
运营者审计结果仅检查已存检查点，不返回私有持仓数量或 ID。获准的检查点事件仍然公开。
七项隔离 API 和 MySQL 测试通过，覆盖公开数据过滤、持有者签名读取、重启、项目可见性
和仅检查检查点的运营者审计。
测试使用受控持仓输入和临时生成、未注资的密钥。这不证明已安装钱包的行为、
Spark 原生执行或整个应用已通过验收。

权限服务的注册和就绪检查不证明原生交易执行。缺失的原生交易构建器、结算来源和钱包验证
仍待完成。先前的测试报告不能验证这些后续修改。

当前源码清单包含 940 项 API 声明。新增的两个持有者事件路由别名使未绑定声明增至 1,965 项。
发布校验器记录的 PASS 行数为零，351 个必需钱包变体仍然缺少获认可的验证记录。

## 2026-09-06：撤回 GO 结论

**本地修改，尚未发布 · 功能性 NO-GO。** 2026-09-05 显示 GO、123 行通过的注册表页面已撤回。
当时的校验器把注册表与其自身比较，看不到行中遗漏的端点、路由、视图与协议标志；
它还把同一句话在九个阶段重复使用当作 Signet 交易的证明。这些账本保留供审计，并被修复后的校验器拒绝。

修复后的门禁统计每一个已声明的接口，为每个审阅登记的操作保留一行（224 个 `SDX-` 行），
并为每个钱包的每个动作保留一个变体。结果有五种：`PASS`、`FAIL`、`BLOCKED`、
`NOT TESTED`、`NOT_APPLICABLE`，网络单独记录。在 Signet 上证明的 PASS 显示为
`PASS - SIGNET`，不需要主网运行。生产环境读取不会让任何行变绿。一次旅程需要带交易 ID、
节点广播响应、权威确认与协议识别的结构化阶段记录。

可执行路径中的示例数据已移除：协议适配器仅从已配置的权限来源应答，OP_NET 不再列出
预置的合约、代币或池，OP_NET 页面会如实说明。闪电网络直接报价的卖方报价与已保存的请求绑定，
需要节点签名证明与已配置 LND 节点创建的 HODL 发票；没有该节点就无法报价或结算。
Leather 已纳入钱包网络检查，其网络读取标记为未测试。

本次工作运行的环境未配置任何原生权限来源、Signet 钱包或闪电网络节点。需要这些的每一行
仍为 BLOCKED 或 NOT TESTED。没有任何部署。

## 2026-09-05：本地修改，尚未发布

**LOCAL UNRELEASED · NO-GO。** 本次仅修复了部分执行缺陷，未部署到生产环境。
原生协议授权、交易构建器、持久化、恢复流程和端到端证据仍不完整。
局部测试通过不代表交易流程已获验证。

OPNet 现读取已配置的原生 RPC 观测，并将离线二进制状态绑定到已存储的交易意图。
兑换流程使用现有 Atomic 报价和购买路径，并检查钱包网络。TAP 读取分页索引日志。
做市商 RFQ 发布流程存储已授权的条款和撤销记录，不预留资金或执行交易。
原生签名样例、隔离数据库测试和本地浏览器检查仅覆盖部分流程，实际协议执行仍未验证。

本地发布验证器要求证据匹配所测源码、具体流程、测试命令、环境和网络。
时间戳必须有效，并满足该证据类型的时效限制；保留的结果文件必须存在且可核验。
只有明确验证源码树等价时，才能在不同合并提交之间复用证据。
验证器还反向检查路由、产品视图、控制器接口、适配器及协议操作清单，拒绝未登记的执行入口。

Spark 页面现通过现有 API 请求资金池、钱包持仓、报价、运营者检查点和退出预览。
请求失败会显示错误，不再生成虚构数据或空白成功结果。
退出预览不签署或提交交易；所存检查点不证明当前最终性。

Spark 持仓与退出预览现要求钱包签名证明。统一市场读取已索引的 SRC-20 发行记录及已存储的原子挂单，
分页绑定完整资产身份，缺失指标保持未知。隔离 MySQL 测试覆盖共享锁竞争、报价重放、
发件箱写入失败后的回滚及数据源重启。这些检查不证明原生协议执行或线上发布。

下方 2026-08-31 的计数和操作表属于历史记录，**不证明当前源码或线上版本通过验证**。





This page exists because "it is on the site" and "it has been verified" are different
claims, and you deserve to know which one applies to the thing you are about to do.

## What counts as a version

There is no version number in the application's package files that means anything.
Release identity is two things:

1. **Date-based git tags**, in the form `v2026.08.31.1`.
2. **The runtime answer** from `GET /api/version`: the application version, the release
   id, the git commit, the runtime, the build timestamp, and a hash of the dependency
   lockfile.

The second is the one to quote, because it is what is actually answering you right now.
See [Status and version](/docs-stampdex/zh-cn/api/status/).

## How verification is recorded

The application repository holds a release capability registry: one row per user job,
each naming the evidence that job depends on. Two things about it are worth knowing:

- **Rows carry no self-declared status.** A verifier derives one, from the evidence.
- **There are exactly three derived outcomes:** `PASS`, `NOT_APPLICABLE`, and
  `BLOCKED`. There is deliberately no "partial", no "beta", and no "planned". A row
  either has its evidence or it does not.

`BLOCKED` means required evidence is missing. It does not mean a defect was found.
Those are different things, and this page will not blur them.

## Historical snapshot: 2026-08-31

Recorded 2026-08-31, across 51 rows:

| Outcome | Rows |
| --- | --- |
| PASS | 27 |
| NOT_APPLICABLE | 3 |
| BLOCKED | 21 |
| **Recorded decision** | **NO-GO** |

Evidence that was recorded and passing at that snapshot included the backend test
suite, the frontend test suite, an end-to-end browser suite across desktop and mobile,
a route check confirming every route renders exactly one top-level heading, an
automated accessibility audit against WCAG 2.1 A and AA, and a production smoke run.

Evidence that was **not recorded** included controlled mainnet canary runs for SRC-20
mutations and for stamp mutations, live runs of each wallet extension through each
action it claims, a regtest chain exercise, a screen reader pass, and first-party data
provenance.

## Historical action evidence: 2026-08-31

| What you are doing | Evidence position |
| --- | --- |
| Browsing markets, tokens, stamps, collections, activity | Verified and passing |
| Reading the API | Verified and passing |
| Buying or transferring SRC-20 | Implemented, unit and integration tested, deployed. No controlled mainnet canary recorded |
| Buying a stamp, opening or closing a dispenser, sending a stamp | Implemented, unit tested, deployed. No controlled mainnet canary recorded |
| Anything in the stamp offer lifecycle | Implemented. No canary recorded, and the ecosystem registry records offers as an unsupported marketplace action. See [Offers](/docs-stampdex/zh-cn/concepts/offers/) |
| Relying on automatic reorg reversal | Implemented and unit tested. Not exercised end to end against a real reorg |
| Using a wallet marked "Not tested" on the [wallets page](/docs-stampdex/zh-cn/reference/wallets/) | StampDEX can ask that wallet for the action and nobody has run it |

None of that says an action will fail. It says nobody has recorded proof that it
succeeded on mainnet under controlled conditions. Trade accordingly, and start small
with anything in the lower half of that table.

## What is deliberately not implemented

- **An atomic swap for SRC-20.** The listing flow is a three-transaction escrow with a
  server-held intermediate key. See
  [Where your funds are](/docs-stampdex/zh-cn/concepts/custody/).
- **An in-place listing price update.** See
  [Change a listing price](/docs-stampdex/zh-cn/guides/change-a-listing-price/).
- **A local reorg rollback worker at the Universe layer.** The ecosystem registry
  records `reconcile` as unsupported for both protocols.

## Where the platform record lives

Independently of the application's own registry, the Bitcoin Universe ecosystem
capability registry records which marketplace actions are supported and, for each one
that is not, the reason. That record is the authority on what counts as a supported way
to trade. See [What you can and cannot do](/docs-stampdex/zh-cn/capabilities/).

## Related

- [Status and version](/docs-stampdex/zh-cn/api/status/)
- [Changelog](/docs-stampdex/zh-cn/project/changelog/)
- [Safety and trust](/docs-stampdex/zh-cn/safety/)

## 2026-09-17：检查点与费用提醒后续修复

[应用拉取请求 118](https://github.com/bitcoinuniverseio/stampdex/pull/118) 将每个链检查点的哈希绑定到所读取的高度。并发请求共享本次读取，但不保留过期结果。107 项内存池回归检查全部通过。实际服务的默认 Signet 读取结果与独立 Bitcoin Core 查询一致。这是只读集成证据，并非已获得资金的协议流程。

[应用拉取请求 120](https://github.com/bitcoinuniverseio/stampdex/pull/120) 阻止 Fee Watch 在刷新失败后继续使用缓存的低费率。保存的活动状态会重新计算，已完成和已取消的状态保持不变。修复前有三项组件渲染断言失败，修复后 16 项专项检查全部通过。浏览器恢复场景使用受控 API 响应。费用提醒不会发送付款，也不证明结算。

隔离应用在独立测试数据库完成全部 45 项迁移后启动。这并不证明所有原生权威服务、钱包或已索引协议的结果。功能 GO 仍未获得证据支持，这些更改也不会部署网站。
