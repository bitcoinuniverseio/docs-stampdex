---
title: Rate limits
description: "The StampDEX API request limits, which routes are limited more tightly than the 300 per minute default, which routes are exempt, and how to stay under them."
source:
  path: throttler configuration and per-route throttle decorators
  verified: "2026-09-01"
---

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
[Media endpoints](/docs-stampdex/api/media/).

## Staying under the limit

**Cache on your side.** Server-side caches already hold most responses for 20 seconds
to a few minutes, so polling faster than that returns the same bytes and spends your
budget for nothing. See [Freshness](/docs-stampdex/concepts/freshness/).

**Batch where a batch route exists.** Stamp details take up to 24 ids in one call, and
token prices take a list of tickers. Two batch calls beat forty single ones.

**Use conditional requests on media.** Previews honour `If-None-Match` and answer 304.

**Ask for what you need.** The token list accepts `limit` up to 500. Pulling everything
and filtering client side is the expensive way round.

## When you get a 429

Wait a minute and slow down. The limit is per minute, not a rolling penalty, so a pause
clears it. Retrying immediately in a loop just keeps you at the limit.

## Related

- [API quick start](/docs-stampdex/api/quickstart/)
- [Worked examples](/docs-stampdex/api/examples/)
