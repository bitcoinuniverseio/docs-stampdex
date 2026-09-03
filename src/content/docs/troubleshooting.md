---
title: Troubleshooting
description: "The problems people actually hit on StampDEX, what causes each one, and what fixes it, from unknown values and rate limits to a stamp that will not relist."
source:
  path: error strings across orders, stamps, market, and media modules
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

If money is involved, start at [Recovery](/docs-stampdex/concepts/recovery/). This page
is for everything else.

## A number shows as unknown

The data source had no answer for that field. This is deliberate: StampDEX never
replaces a missing value with 0. Check
[Data provenance](/docs-stampdex/concepts/data-provenance/) for which service answers
which number, and the status endpoint for freshness.

## The site is up but data looks stale

```bash frame=none
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status
```

The `summary` field says in plain words whether the index is at the Bitcoin tip. When
the index lags, StampDEX shows the readings it has and their age rather than pretending
they are current. Server-side caches also hold responses for 20 seconds to a few
minutes; see [Freshness](/docs-stampdex/concepts/freshness/).

## I get HTTP 429 from the API

You crossed a rate limit. The default is 300 requests per minute, and some routes are
much tighter. Wait a minute and slow down. Media routes do not count. See
[Rate limits](/docs-stampdex/api/rate-limits/).

## My browser application cannot call the API

Cross-origin browser access is allow-listed rather than open, so an arbitrary origin
will not get a cross-origin response from the JSON API. Call it from your own backend.
Media routes are the exception and are served to any origin.

## My payment confirmed but the order is not Filled

Settlement waits for the payment to confirm, for the token balance to be verified, and
then for two blocks of depth on the settlement transaction. This usually resolves on its
own within a few blocks. The fastest way to see where it actually is:

```bash frame=none
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/orders/ORDER_ID
```

Five steps, each with a status. See
[Settlement lifecycle](/docs-stampdex/concepts/settlement-lifecycle/).

## An order shows Failed

The payment confirmed but the index did not show the expected token balance in time.
Your BTC stays in the listing's escrow address; it is not lost. See
[Recovery](/docs-stampdex/concepts/recovery/).

## A listing I wanted disappeared

Either it sold, or a collateral check proved it invalid and removed it. "Could not
verify the seller collateral right now" is a third thing: the index did not answer, and
the fill was blocked rather than guessed at. Try again in a few minutes.

## I cannot list, cancel, or mint with my wallet

Some wallets expose nothing that performs those actions here, and StampDEX hides the
action rather than showing a button that fails. OKX Wallet cannot list, cancel, or
mint. Nobody can open or close a dispenser through Leather, Xverse, or OKX Wallet. See
[Wallets](/docs-stampdex/reference/wallets/).

## My wallet signed but nothing happened

Signing a message and signing a transaction are different. A mutation asks for a short
message signature first, and that signature by itself moves nothing. If the action then
failed, the challenge may have expired: challenges live five minutes and work once.
Retry the action from the start.

## A stamp image does not load

Some stamps reference media the index cannot serve, and some are large files. StampDEX
shows a labelled missing-media state rather than a broken image. The raw bytes are still
on the Bitcoin chain, and the stamp page links the transaction.

## A stamp I delisted has not come back

Closing a Counterparty dispenser has a cooldown before the asset returns. It is protocol
behaviour and nothing at the marketplace layer can shorten it. See
[List and unlist a stamp](/docs-stampdex/guides/list-a-stamp/).

## A dispenser purchase would not build

If the data needed to describe the transaction's inputs could not be recovered, no
signable transaction is offered and you get a warning instead. That refusal is
deliberate: a transaction your wallet could not inspect is not one you should sign.
Try again later.

## Something else

Open a [GitHub issue](https://github.com/bitcoinuniverseio/stampdex/issues) with what
you did, what you expected, and what happened. For a suspected security problem, email
`legal@bitcoinuniverse.io` instead.
