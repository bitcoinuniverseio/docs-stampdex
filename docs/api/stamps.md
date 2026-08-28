# Stamps endpoints

Bitcoin Stamps and collections. Base path: `/api/v1`.

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/stamps` | The stamp index |
| GET | `/stamps/search` | Stamp search |
| GET | `/stamps/:id` | One stamp in detail |
| POST | `/stamps/details` | Up to 24 stamp details in one call (body: `{ "stampIds": [...] }`) |
| GET | `/stamps/balance/:address` | The stamps a wallet holds |
| GET | `/stamps/:id/dispensers` | Open and closed dispensers for a stamp |
| GET | `/stamps/market/overview` | Market overview, cached 20 seconds |
| GET | `/stamps/market/rankings` | Ranked listings, cached 20 seconds per page and sort |
| GET | `/stamps/discovery` | Discovery picks, cached 60 seconds |
| GET | `/collections` | Stamp collections; `includeMarketData=true` attaches cached per-collection market data |
| GET | `/collections/:id` | One collection in detail |

## Example

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/stamps?limit=1"
```

Each stamp row carries its number (`stamp`), the Counterparty asset id
(`cpid`), the creator address, supply, whether it is locked, the mime type,
the transaction hash, and the file hash and size. That combination is the
stamp's identity; see [Asset identity](../asset-identity.md).

## Common failure

`POST /stamps/details` refuses more than 24 ids per call. Batch larger sets
into more calls.
