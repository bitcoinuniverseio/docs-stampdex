---
title: 什么是 StampDEX
description: 面向比特币 Stamps 与 SRC-20 资产的专业交易平台，提供非托管订单撮合与原子结算。
sidebar:
  order: 2
source:
  path: product scope, legal/custodyClaims, terms of service copy
  verified: "2026-09-01"
contentType: reference
audiences: [traders, collectors, developers]
products: [stamps]
protocols: [src20, stamps, bitcoin]
difficulty: intro
estimatedMinutes: 5
lifecycle: stable
releaseStatus: live
lastReviewedBy: docs-stampdex maintainers
---

> [!NOTE]
> **简体中文官方文档**：深入介绍 StampDEX 产生背景、架构设计、技术原理以及与传统中心化交易所的区别。 核心交易规则为非托管模式，买卖双方按标准费率收取服务费，并于比特币主网进行原子结算。



StampDEX is a marketplace and explorer for two Bitcoin protocols, at
[stampdex.fun](https://stampdex.fun).

## What you can do there

- Browse every SRC-20 token with its market data, deployment identity, and mint
  progress. No wallet needed.
- Trade SRC-20 tokens against real signed listings, with every number shown before you
  sign.
- Explore Bitcoin Stamps and their collections, and buy through Counterparty
  dispensers.
- Track a wallet's holdings, open orders, and activity.
- Read the same data the site reads, from a public API with no key.

## What it is not

**It is not a custodial exchange.** You do not have a StampDEX account, a StampDEX
balance, or a deposit address. There is nothing to withdraw.

**It is also not fully 非托管, and StampDEX does not claim to be.** An SRC-20
purchase routes your payment through an escrow address StampDEX controls until the
tokens reach you. The application repository carries a test that fails the build if
product copy calls StampDEX a 非托管 exchange or a trustless marketplace,
precisely so the claim cannot creep back in. The
[custody page](/docs-stampdex/zh-cn/concepts/custody/) draws exactly where the money sits at
every stage.

**It is not a wallet.** It never holds your keys or your recovery phrase, and it never
asks for either.

**It is not a financial advisor.** It shows identity and market facts and builds
transactions. The decision is yours.

## What makes it different

- **Named sources.** Every market number names the service it came from, and a live
  status endpoint reports the index source, its lag behind the Bitcoin tip, and its
  operator. See [Data provenance](/docs-stampdex/zh-cn/concepts/data-provenance/).
- **Unknown is never zero.** A number no source answered shows as unknown. See
  [Unknown is not zero](/docs-stampdex/zh-cn/concepts/unknown-is-not-zero/).
- **Full identity.** Tokens show their deployment transaction and block. Stamps show
  their number, asset id, creator, and file hash. A name alone never stands in for
  identity.
- **You sign what you see.** Trades are PSBTs your own wallet reviews and signs.
- **A quiet market looks quiet.** No invented volume, no countdown theatre, no fake
  urgency.

## Where it sits in Bitcoin Universe

The Bitcoin Universe ecosystem registry records both `stamps` and `src20` as
marketplace-owned by StampDEX, `availability: enabled`, `mode: external-execution`.
Other Universe products can display a stamp or a token balance; the order book, the
matching, and the settlement are StampDEX's. See
[What you can and cannot do](/docs-stampdex/zh-cn/capabilities/).

## Next

- [Start here](/docs-stampdex/zh-cn/start-here/)
- [Bitcoin Stamps](/docs-stampdex/zh-cn/concepts/bitcoin-stamps/)
- [SRC-20](/docs-stampdex/zh-cn/concepts/src20/)
