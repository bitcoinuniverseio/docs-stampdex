---
title: API 请求频率限制
description: StampDEX 公开接口的限流规则（单 IP 300 次/分钟）与防抖建议。
source:
  path: throttler configuration and per-route throttle decorators
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
> **简体中文官方文档**：保持系统高可用性并防止恶意爬虫的全局限速规则说明。 核心交易规则为非托管模式，买卖双方按标准费率收取服务费，并于比特币主网进行原子结算。



## The default

**300 requests per minute.** Crossing it returns HTTP 429.

## Tighter limits

Some routes cost more to serve or touch the network, and carry their own limit. All are
per minute.

| Limit | Kind of route |
| --- | --- |
| 120 | Batch stamp detail lookups |
| 30 | Batch token price lookups |
| 20 | Every challenge request, deep health, ecosystem health, and batch dispenser lookups |
| 10 | Fee bump by child pays for parent, and atomic offer preparation |
| 6 | Alert scans |
| 5 | Broadcasting a transaction, and rebroadcasting one |

The pattern is consistent: reads are generous, batch reads are moderate, anything that
signs, broadcasts, or issues a challenge is deliberately slow.

## Exempt routes

Media routes do not count against any limit:

- raw stamp bytes
- stamp previews and thumbnails
- token logos

They are cacheable and content addressed. See
[Media endpoints](/docs-stampdex/zh-cn/api/media/).

## Staying under the limit

**Cache on your side.** Server-side caches already hold most responses for 20 seconds
to a few minutes, so polling faster than that returns the same bytes and spends your
budget for nothing. See [Freshness](/docs-stampdex/zh-cn/concepts/freshness/).

**Batch where a batch route exists.** Stamp details take up to 24 ids in one call, and
token prices take a list of tickers. Two batch calls beat forty single ones.

**Use conditional requests on media.** Previews honour `If-None-Match` and answer 304.

**Ask for what you need.** The token list accepts `limit` up to 500. Pulling everything
and filtering client side is the expensive way round.

## When you get a 429

Wait a minute and slow down. The limit is per minute, not a rolling penalty, so a pause
clears it. Retrying immediately in a loop just keeps you at the limit.

## Related

- [API quick start](/docs-stampdex/zh-cn/api/quickstart/)
- [Worked examples](/docs-stampdex/zh-cn/api/examples/)
