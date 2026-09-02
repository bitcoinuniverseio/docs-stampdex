---
title: API 快速接入指南
description: 五分钟内完成第一个 StampDEX API 请求，获取最新市场与订单状态。
source:
  path: backend API surface, app setup, throttler configuration
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
> **简体中文官方文档**：快速开始构建第三方行情看板、套利监控或量化工具的极简指南。 核心交易规则为非托管模式，买卖双方按标准费率收取服务费，并于比特币主网进行原子结算。



The StampDEX API serves the same data the site shows. Read routes need no key and no
account.

**Base URL:** `https://stamp.api.bitcoinuniverse.io`

Almost every route lives under `/api/v1/`. Health and version also answer without the
prefix.

## Your first request

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/market/tokens?limit=2"
```

You get JSON with a `data` array of SRC-20 tokens. Each token carries its market
numbers and a `sources` object naming where each number came from:

```json
{
  "tick": "MSKK",
  "floor_price": 1,
  "holders": 19090,
  "mint_progress": 100,
  "sources": {
    "identity": "stampchain",
    "price": "stampchain",
    "volume": "stampchain",
    "holders": "stampchain",
    "listings": "none"
  }
}
```

A field the source did not answer is absent or null, never 0. Render null as unknown.
See [Unknown is not zero](/docs-stampdex/zh-cn/concepts/unknown-is-not-zero/).

## What needs no authentication

Everything on the [market](/docs-stampdex/zh-cn/api/market/),
[stamps](/docs-stampdex/zh-cn/api/stamps/), [media](/docs-stampdex/zh-cn/api/media/), and
[status](/docs-stampdex/zh-cn/api/status/) pages, plus reading orders.

## What needs a wallet signature

There are no API keys and no accounts. Two signature schemes exist, both proving
control of a Bitcoin address:

**A read-scope proof** for a handful of seller-only diagnostics, sent in a single
header. It is a signed message naming the scope, the address, and an issue time, and it
is valid for ten minutes.

**A one-time action challenge** for every mutation. You request a challenge, your
wallet signs the message it returns, and you send the mutation with four headers
carrying the address, the signature, the challenge id, and the nonce. The challenge
names the action and a hash of the exact request body, expires in five minutes, and can
be consumed once. Changing the body after signing invalidates it.

Mutations build transactions your wallet must sign. Nothing moves without your
signature. See [Orders endpoints](/docs-stampdex/zh-cn/api/orders/).

## Calling from a browser

Cross-origin browser access is allow-listed, not open. Server-to-server calls work
normally; a page on an arbitrary origin will not get a cross-origin response from the
JSON API. Stamp media routes are the exception and are served to any origin.

If you are building a browser application, proxy the JSON API through your own backend.

## Limits

- 300 requests per minute, with tighter limits on specific routes. See
  [Rate limits](/docs-stampdex/zh-cn/api/rate-limits/).
- Media routes do not count against the limit.
- JSON responses over 1 KB are compressed when your client sends `Accept-Encoding`.

## Health and version

```bash
curl https://stamp.api.bitcoinuniverse.io/api/version
```

Returns the exact deployed commit, release id, runtime, and build timestamp.
`/api/health` reports process and database readiness and answers HTTP 503 when the
database is unavailable. See [Status and version](/docs-stampdex/zh-cn/api/status/).

## Where next

- [Rate limits](/docs-stampdex/zh-cn/api/rate-limits/)
- [Market endpoints](/docs-stampdex/zh-cn/api/market/)
- [Stamps endpoints](/docs-stampdex/zh-cn/api/stamps/)
- [Orders endpoints](/docs-stampdex/zh-cn/api/orders/)
- [Media endpoints](/docs-stampdex/zh-cn/api/media/)
- [Worked examples](/docs-stampdex/zh-cn/api/examples/)
