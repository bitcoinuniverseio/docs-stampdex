---
title: Freshness
description: How far behind live a StampDEX number can be, what the status endpoint reports, and what Universe does and does not enforce about lag.
source:
  path: indexer status service, cache key constants
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

Every number here has an age. This page says how old it can be and how to find out.

## The lag report

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status
```

The response compares the index's last block against the Bitcoin tip and reports the
difference in blocks, with a plain-word summary.

| Lag | Reported freshness |
| --- | --- |
| Up to 2 blocks | `ok` |
| Up to 12 blocks | `stale` |
| More than 12 blocks | `delayed` |
| Not readable | `missing` |

Those thresholds are StampDEX's own reporting. They describe the number, they do not
gate it.

## What Universe does not enforce

The ecosystem registry records, for both protocols:

> Universe does not enforce a StampDEX-versus-chain lag threshold.

And, for confirmation policy:

> Confirmation policy is delegated to StampDEX and Counterparty.
> Confirmation policy is delegated to the StampDEX fill workflow.

Read together: nothing at the Universe layer refuses to show you a figure because it is
too old, and nothing at the Universe layer sets the confirmation depth. The venue
decides, and the venue reports. Your check is the status endpoint.

## Cache ages

Server-side caches mean a fresh index reading can still reach you a little late. The
ranges you should assume:

| Surface | Typical cache |
| --- | --- |
| Balances | About 20 seconds |
| Stamps market overview and rankings | 20 seconds |
| Transfers, individual stamps, stamp lists, searches | 30 to 60 seconds |
| Token lists and individual tokens | 60 seconds |
| Fee rates | 60 seconds |
| Discovery picks | 60 seconds |
| Collections | About 2 minutes |
| The whole-market aggregate | About 5 minutes |

Polling faster than the cache returns the same answer. If you are building against the
API, cache on your side too. See [Rate limits](/docs-stampdex/api/rate-limits/).

## Fee rates are all-or-nothing

Fee estimates arrive as five tiers. If any tier is missing or not a number, the whole
response is rejected and an error is returned instead. Partial fee data is never
served, because a partial fee table invites a transaction built at a rate nobody quoted.

## What a stale reading looks like

When the index lags, StampDEX shows the readings it has and their age rather than
pretending they are current. A number does not silently become unknown because it is
old, and it does not silently become current because it is displayed.

## Related

- [Data provenance](/docs-stampdex/concepts/data-provenance/)
- [Status and version](/docs-stampdex/api/status/)
- [Market data](/docs-stampdex/concepts/market-data/)
