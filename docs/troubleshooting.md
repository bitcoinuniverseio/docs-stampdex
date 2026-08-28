# Troubleshooting

The most common problems, what causes them, and what fixes them.

## A number shows as unknown

The data source had no answer for that field. This is deliberate: StampDEX
never replaces a missing value with 0. Check
[data sources](data-sources.md) for which service answers which number, and
the status endpoint for freshness.

## I get HTTP 429 from the API

You crossed the limit of 300 requests per minute per IP. Wait a minute and
slow your request rate. Media routes (stamp images, thumbnails, logos) do
not count against the limit.

## My payment confirmed but the order is not Filled

Settlement waits for the payment to confirm and for the token balance to be
verified on the index before it sends the tokens. This usually resolves on
its own within a few blocks. The order page shows each transaction id;
check confirmations on any block explorer. See
[Orders and settlement](orders-and-settlement.md) for every state.

## An order shows Failed

The payment confirmed but the index did not show the expected token balance
in time. Your BTC stays in the listing's escrow address; it is not lost. An
operator resolves Failed orders. If one sits unresolved, open a
[GitHub issue](https://github.com/bitcoinuniverseio/stampdex/issues) with
the order id.

## A stamp image does not load

Some stamps reference media the index cannot serve, and some are large
files. StampDEX shows a labelled missing-media state rather than a broken
image. The raw bytes are still on the Bitcoin chain; the stamp page links
the transaction.

## The site is up but data looks stale

Check the index lag:

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status
```

The `summary` field says in plain words whether the index is at the Bitcoin
tip. When the index lags, StampDEX shows the readings it has and their age
rather than pretending they are current.

## Something else

Open a [GitHub issue](https://github.com/bitcoinuniverseio/stampdex/issues)
with what you did, what you expected, and what happened. For a suspected
security problem, email `legal@bitcoinuniverse.io` instead.
