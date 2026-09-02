---
title: 生产发布证据与审计记录
description: 线上各微服务与智能合约部署哈希、测试结果与自动化流水线凭证。
source:
  repo: bitcoinuniverseio/stampdex release registry, and bitcoinuniverseio/core for the capability registry
  path: release registry and verifier, GET /api/version
  release: snapshot recorded 2026-08-31
  verified: "2026-09-01"
contentType: reference
audiences: [traders, collectors, developers]
products: [src20, stamps]
protocols: [src20, stamps, bitcoin]
difficulty: intro
estimatedMinutes: 5
lifecycle: stable
releaseStatus: live
lastReviewedBy: docs-stampdex maintainers
---

> [!NOTE]
> **简体中文官方文档**：供审计员与高阶开发者核验线上系统完整性的确凿证据链。 核心交易规则为非托管模式，买卖双方按标准费率收取服务费，并于比特币主网进行原子结算。



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

## The last recorded snapshot

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

## What that means for you, action by action

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

## What is switched off

Two gallery surfaces ship behind build flags and are off by default. A feature you
cannot see is not a feature you have.

## Where the platform record lives

Independently of the application's own registry, the Bitcoin Universe ecosystem
capability registry records which marketplace actions are supported and, for each one
that is not, the reason. That record is the authority on what counts as a supported way
to trade. See [What you can and cannot do](/docs-stampdex/zh-cn/capabilities/).

## Related

- [Status and version](/docs-stampdex/zh-cn/api/status/)
- [Changelog](/docs-stampdex/zh-cn/project/changelog/)
- [Safety and trust](/docs-stampdex/zh-cn/safety/)
