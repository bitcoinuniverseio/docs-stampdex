---
title: Deployment identity
description: How StampDEX resolves an SRC-20 ticker to exactly one deployment before it will show you a market, and the four answers it can give.
source:
  path: deployment resolution, market deployments endpoints
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

A deployment is the transaction that created an SRC-20 token: its rules, its max
supply, and its mint limit. That transaction hash is the token's identity. The ticker
is a label.

## The address form

```
https://stampdex.fun/trade/src20/KEVIN/23765f9bc6b87e078b1f93ed213f90b9004998336575f726e46f34ddbea5e5f3
```

Ticker plus deployment transaction. This is the link Copy link gives you, the link the
tab title and the shared card describe, and the link a market row opens.

Two shorter forms resolve to it:

| Form | What StampDEX does |
| --- | --- |
| `/trade/src20/KEVIN` | Resolves the ticker before showing a market |
| `/trade/src20/by-tx/<deploy transaction>` | Looks up the transaction and replaces the URL with the full form |

## The four answers to "which deployment"

The deployments endpoint reports its answer in a `resolution` field, and the site's
gate follows it:

| `resolution` | Meaning | What you get |
| --- | --- | --- |
| `single` | Exactly one deployment claims the ticker | The market, at the full URL |
| `ambiguous` | More than one does | Each deployment with its transaction, block, and creator. No market until you pick |
| `unknown` | The index answered, and holds no deployment for the ticker | Nothing to price, nothing to trade |
| `unavailable` | The index did not answer | A retry. No market |

`unknown` and `unavailable` are different answers and are never rendered as each other.
One means nobody deployed this ticker. The other means StampDEX could not ask.

## Reading it yourself

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/market/deployments/KEVIN"
```

The response carries `resolution`, `source`, `source_available`, `observed_at`, and a
`deployments` array. Each entry names `tick`, `deploy_tx`, `deploy_block`,
`deploy_time`, `creator`, `max_supply`, and `mint_limit`.

Going the other way, from a transaction to a token:

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/market/deployments/tx/23765f9bc6b87e078b1f93ed213f90b9004998336575f726e46f34ddbea5e5f3"
```

That returns `found` and the deployment. A value that is not 64 hex characters is
rejected rather than searched for.

## Why the gate exists

You cannot buy, sell, or sign anything from a ticker StampDEX has not resolved to
exactly one deployment. A market shown under an ambiguous ticker would be a market in
something unspecified.

## Related

- [Asset identity](/docs-stampdex/concepts/asset-identity/)
- [Token pages](/docs-stampdex/guides/token-pages/)
- [Market endpoints](/docs-stampdex/api/market/)
