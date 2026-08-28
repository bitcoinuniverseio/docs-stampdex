# API quick start

The StampDEX API serves the same data the site shows. Read routes need no
key and no account.

Base URL: `https://stamp.api.bitcoinuniverse.io`

## Your first request

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/market/tokens?limit=2
```

You get JSON with a `data` array of SRC-20 tokens. Each token carries its
market numbers and a `sources` object naming where each number came from:

```json
{
  "tick": "MSKK",
  "floor_price": 1,
  "holders": 19090,
  "mint_progress": 100,
  "sources": {
    "price": "stampchain",
    "volume": "stampchain",
    "holders": "stampchain",
    "listings": "none"
  }
}
```

A field the source did not answer is absent or null, never 0. Render null
as unknown.

## Limits

- 300 requests per minute per IP address. Over the limit you get HTTP 429.
  Back off and retry after a pause.
- Stamp media routes do not count against the limit and are cacheable; see
  [Media](media.md).
- Responses over 1 KB are compressed when your client sends
  `Accept-Encoding`.

## Health and version

```bash
curl https://stamp.api.bitcoinuniverse.io/api/version
```

Returns the exact deployed git commit, release id, and build timestamp.
`/api/health` reports process and database readiness and answers HTTP 503
when the database is unavailable.

## Where next

- [Market endpoints](market.md) for SRC-20 tokens, prices, and trades
- [Stamps endpoints](stamps.md) for stamps, collections, and holdings
- [Orders endpoints](orders.md) for marketplace listings
- [Media endpoints](media.md) for stamp images and thumbnails

## Common failure

`HTTP 429 Too Many Requests` means you crossed the per-minute limit. Space
your requests or cache responses; market overview and ranking responses are
already cached server side for 20 to 60 seconds, so polling faster than
that returns the same data.
