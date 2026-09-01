---
title: Frequently asked questions
description: "Short answers to the questions people ask most about StampDEX, from custody and fees to why a listing price cannot be edited, each linking to the full explanation."
source:
  path: across the marketplace, stamps, and market modules
  verified: "2026-09-01"
---

## Do I need a wallet to use StampDEX?

No. Markets, stamps, collections, activity, address holdings, and the API are open to
everyone. A wallet is needed only to buy, sell, or have the site know which address is
yours.

## Does StampDEX hold my funds?

For a stamp purchase, no: it is one Bitcoin transaction between you and the seller's
dispenser.

For an SRC-20 trade, yes, temporarily. Your payment sits in an escrow address StampDEX
controls until the tokens reach you. StampDEX says so before you sign. See
[Where your funds are](/docs-stampdex/concepts/custody/).

## Is StampDEX non-custodial?

Not for SRC-20 trades, and it does not claim to be. See
[Safety and trust](/docs-stampdex/safety/).

## What does StampDEX charge?

1.5% per side of an SRC-20 trade with a 500 sat minimum per side, so 3% in total.
A flat 1,500 sats on a mint, deploy, or transfer. Nothing on a stamp purchase beyond
the dispenser price. Network fees go to miners. See
[Fees](/docs-stampdex/reference/fees/).

## Why is the fee 50% on a tiny trade?

Because the 500 sat minimum per side dominates below about 33,000 sats, and the
smallest listing allowed is 2,000 sats. The table in [Fees](/docs-stampdex/reference/fees/)
shows exactly where the floor stops mattering.

## Can I change the price of a listing?

Not in place. The registry records `update-listing` as unsupported for both protocols,
because no atomic listing update is implemented: listings must be cancelled and
relisted. StampDEX offers a guided reprice that chains the two steps, and it still
produces a new order, a new signature, and a second network fee. See
[Change a listing price](/docs-stampdex/guides/change-a-listing-price/).

## Can I make an offer on something?

No. The registry records `make-offer` and `accept-offer` as unsupported for both
protocols. See [Offers](/docs-stampdex/concepts/offers/).

## Why does a number show as unknown?

Because the data source had no answer. StampDEX never replaces a missing value with 0.
See [Unknown is not zero](/docs-stampdex/concepts/unknown-is-not-zero/).

## Where does the data come from?

Bitcoin chain data comes from Universe-operated infrastructure. The Stamps and SRC-20
index currently comes from stampchain.io, a third party, and StampDEX says so on the
page and in its status endpoint. See
[Data provenance](/docs-stampdex/concepts/data-provenance/).

## Two tokens have the same ticker. Which is real?

Tickers are not identities. Check the deployment transaction and block on the token page
against the token you researched. See
[Asset identity](/docs-stampdex/concepts/asset-identity/).

## My trade is taking a while. Should I worry?

Usually not. Bitcoin confirmations set the pace, settlement waits for two blocks of
depth by default, and the order page names each state with its transaction id. See
[Order lifecycle](/docs-stampdex/concepts/order-lifecycle/) and
[Recovery](/docs-stampdex/concepts/recovery/).

## My order says Failed. Is my money gone?

No. It is in the listing's escrow address, which you can look up in any block explorer.
Settlement stopped there rather than releasing funds against a balance it could not
verify. See [Recovery](/docs-stampdex/concepts/recovery/).

## Is there an API?

Yes, the same one the site uses, with no key needed for reads. Start at the
[API quick start](/docs-stampdex/api/quickstart/).

## Can I call the API from my website's front end?

Not directly. Cross-origin browser access is allow-listed. Call it from your backend.
Media routes are open to any origin.

## How do I report a bug or a security problem?

Bugs: [GitHub issues](https://github.com/bitcoinuniverseio/stampdex/issues).
Security: email `legal@bitcoinuniverse.io` and do not open a public issue.
