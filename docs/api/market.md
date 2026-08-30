# Market endpoints

SRC-20 token market data. Base path: `/api/v1/market`.

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/overview` | Market-wide summary |
| GET | `/tokens` | The token index: the stamp index merged with the StampDEX order book. `limit` caps at 500 |
| GET | `/tokens/priced` | A faster feed of tokens with live exchange prices |
| GET | `/tokens/:tick` | One token in detail |
| GET | `/tokens/:tick/context` | Token context including the order book |
| GET | `/tokens/:tick/prices` | Recorded price history |
| GET | `/tokens/:tick/trades` | Recent trades |
| GET | `/tokens/:tick/activity` | Per-token activity |
| GET | `/fees` | Recommended Bitcoin fee rates from the Universe node |

## Example

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/market/tokens/KEVIN"
```

## Reading the numbers

- Every market row carries a `sources` object naming the origin of each
  number (`stampchain`, `stampdex`, or `none`). See
  [Data sources](../data-sources.md) for what those origins mean.
- Every market row carries `deploy_tx`, `deploy_block`, `deploy_time`, and
  `creator`, which identify the deployment behind the ticker.
  `sources.identity` is `stampchain` when a source reported one and `none`
  when none did. `deploy_tx` is null in that case; the ticker is never used
  in its place. See [Asset identity](../asset-identity.md).
- `mint_progress` is minted supply against max supply, as a percentage.
- A null or absent value means the source had no answer. It is never
  silently replaced with 0.
- Listing prices come from real signed listings on StampDEX. A stored
  listing whose unit price contradicts its total is left off the book
  rather than shown at a wrong price.

## Common failure

An unknown ticker returns an empty result, not an error. Tickers are
uppercase; the API upcases what you send.
