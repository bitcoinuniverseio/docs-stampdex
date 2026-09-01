---
title: SRC-20
description: What SRC-20 is, how a token is deployed and minted, and how the three-transaction listing flow makes a trade work on Bitcoin.
source:
  path: src20 marketplace service, src20 PSBT service
  verified: "2026-09-01"
---

SRC-20 is a token standard built on Bitcoin Stamps. A token's deploy, its mints, and
its transfers are all stamp transactions, which an index reads to know who holds what.

Because the ledger is derived from stamp transactions rather than from a smart
contract, an SRC-20 trade cannot be a single atomic swap. That fact shapes everything
below.

## Token facts

| Fact | Meaning |
| --- | --- |
| Ticker | The short name, such as KEVIN. Not an identity |
| Deployment transaction | The transaction that created the token. This is the identity |
| Deployment block and time | When it happened |
| Creator | The deploying address |
| Max supply and minted supply | Together these give mint progress |
| Mint limit | The maximum a single mint may claim |
| Holders | Addresses holding a balance, from the index |

Two tokens can share a ticker. StampDEX never merges them. See
[Deployment identity](/docs-stampdex/concepts/deployment-identity/).

## The three-transaction listing flow

An SRC-20 sale on StampDEX is three Bitcoin transactions, in this order.

| | What it does | Who signs |
| --- | --- | --- |
| **TX1** | The buyer sends the exact total in BTC to a per-listing address | The buyer |
| **TX2** | Moves the seller's tokens into the per-listing escrow, funded by TX1 | The seller pre-signed their input at listing time; StampDEX signs the funding input |
| **TX3** | Delivers the tokens to the buyer, pays the seller, and pays the service fee | StampDEX, from the escrow key |

The seller's input in TX2 is signed with `SIGHASH_ALL | ANYONECANPAY` at the moment
they create the listing. That signature commits the seller to their side and to nothing
else, which is why a listing can sit on the book without locking the rest of the
seller's wallet.

The escrow keys for the per-listing addresses are generated server side, stored
encrypted, never returned by any API, and nulled when a draft expires.

**This is not an atomic swap and StampDEX does not describe it as one.** See
[Where your funds are](/docs-stampdex/concepts/custody/).

## Listing constraints

| Rule | Value |
| --- | --- |
| Minimum trade total | 2,000 sats |
| Amount and unit price | Positive integers, and their product must stay exact |
| Anchor UTXO | The seller needs a small marker output. StampDEX builds one if you have none |
| Unsigned draft lifetime | 30 minutes |
| Buyer lock lifetime | 30 minutes |

A trade at the 2,000 sat minimum pays 500 sats of service fee from each side, because
the per-side floor dominates at that size. Read [Fees](/docs-stampdex/reference/fees/)
before listing anything small.

## What is not available for SRC-20

The ecosystem registry records these as unsupported, with reasons:

- `update-listing`: listings must be cancelled and relisted, because no atomic listing
  update is implemented.
- `make-offer`, `accept-offer`, `sell`: there is no executable offer workflow on this
  marketplace surface.
- `reconcile`: this surface has no reconcile authority.

`cancel-offer` and `settle` are supported for SRC-20 and are not supported for stamps.
See [What you can and cannot do](/docs-stampdex/capabilities/).

## Related

- [Buy SRC-20](/docs-stampdex/guides/buy-src20/)
- [Sell SRC-20](/docs-stampdex/guides/sell-src20/)
- [Order lifecycle](/docs-stampdex/concepts/order-lifecycle/)
