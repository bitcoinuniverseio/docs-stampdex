---
title: Stamps endpoints
description: "Bitcoin Stamps, collections, dispensers, and wallet holdings from the StampDEX API, including how to tell nothing for sale apart from could not ask."
source:
  path: stamps controller, collections controller, stamps market service
  verified: "2026-09-01"
---

Base path: `/api/v1`.

## Stamps

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/stamps` | The stamp index |
| GET | `/stamps/search` | Stamp search, by `q` |
| GET | `/stamps/:id` | One stamp in detail |
| POST | `/stamps/details` | Up to 24 stamp details in one call, body `{ "stampIds": [...] }` |
| GET | `/stamps/balance/:address` | The stamps a wallet holds |
| GET | `/stamps/:id/holders` | Who holds a stamp |
| GET | `/stamps/:id/dispensers` | Open and closed dispensers for a stamp |
| GET | `/stamps/:id/dispenses` | Completed dispenses |
| GET | `/stamps/:id/best-dispenser` | The cheapest open dispenser with stock |
| POST | `/stamps/best-dispensers` | The same, for a batch of stamps |
| GET | `/stamps/wallet/:address/dispensers` | Every dispenser an address operates |
| GET | `/stamps/market/overview` | Market overview |
| GET | `/stamps/market/rankings` | Ranked listings |
| GET | `/stamps/discovery` | Discovery picks |

`/stamps` takes `page` and `limit`, with `limit` capped at 100.

## Collections

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/collections` | Stamp collections. `includeMarketData=true` attaches cached per-collection market data |
| GET | `/collections/:id` | One collection in detail |

## Example

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/stamps?limit=1"
```

Each stamp row carries its number as `stamp`, the Counterparty asset id as `cpid`, the
creator address, supply, whether it is locked, the mime type, the transaction hash, and
the file hash and size. That combination is the stamp's identity. See
[Asset identity](/docs-stampdex/concepts/asset-identity/).

## Best dispenser

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/stamps/1472320/best-dispenser"
```

The cheapest open dispenser that still has stock, by asking rate ascending. The batch
version returns, for each stamp, a `dispenser` and a `sourceAvailable` flag. Those two
are not the same thing:

| `sourceAvailable` | `dispenser` | Meaning |
| --- | --- | --- |
| `true` | an object | There is a dispenser at this price |
| `true` | `null` | There is genuinely nothing for sale |
| `false` | `null` | We could not ask. Do not read this as nothing for sale |

## Market figures

Collection figures carry a floor, volume, holders, market cap, and listed market cap.
An aggregate volume is accompanied by a coverage count of how many collections
reported, so a partial total cannot read as a whole one. An aggregate floor is a minimum
over the collections that reported a positive floor.

## Common failures

| Status | Meaning |
| --- | --- |
| 400 | More than 24 ids in a batch stamp detail call, or a malformed id |
| 404 | No stamp with that id |
| 429 | Over the rate limit |

## Related

- [Bitcoin Stamps](/docs-stampdex/concepts/bitcoin-stamps/)
- [Collection pages](/docs-stampdex/guides/collection-pages/)
- [Media endpoints](/docs-stampdex/api/media/)
