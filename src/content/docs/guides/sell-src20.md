---
title: Sell SRC-20
description: "How to list an SRC-20 token on StampDEX, what signing a listing commits, what it costs, how to manage it while it is live, and every way it can be refused."
source:
  path: orders prepare-listing and finalize, listing PSBT fingerprint validation
  verified: "2026-09-01"
contentType: reference
audiences: [traders, collectors, developers]
products: [src20]
protocols: [src20, stamps, bitcoin]
difficulty: intro
estimatedMinutes: 5
lifecycle: stable
releaseStatus: live
lastReviewedBy: docs-stampdex maintainers
---

**For:** a holder with a supported wallet.
**Goal:** a live listing on the book at your exact price.
**Chain and network:** Bitcoin mainnet. **Version:** continuous.

**Safety:** signing a listing commits those tokens to the listing escrow for as long as
the listing lives. It does not lock the rest of your wallet. Cancelling needs your
signature, so nobody else can cancel or alter your listing.

## Prerequisites

- A [supported wallet](/docs-stampdex/reference/wallets/) holding the tokens. Listing
  has been run end to end through Universe Wallet and UniSat. OKX Wallet cannot list
  here at all, and StampDEX hides the action rather than showing a button that fails.
- A little BTC for the network fee.
- A price in sats per token, and a total of at least 2,000 sats.

## Steps

1. **Open the token page** and choose to sell.
2. **Set amount and price.** StampDEX shows the resulting total, the 1.5% seller
   service fee with its 500 sat minimum, and the network fee, before anything is
   signed.
3. **Provide the marker output if you have none.** The listing flow needs a small
   anchor output of 548 sats. If your wallet has none, StampDEX builds that transaction
   first and your wallet signs it too.
4. **Sign the listing.** Your wallet shows the listing transaction. Your signature
   covers your own input only, using `SIGHASH_ALL | ANYONECANPAY`, which is why the
   rest of your wallet stays free while the listing sits on the book.
5. **The listing goes live** at your exact price.

StampDEX checks the signed transaction against a structural fingerprint of the one it
prepared, and the escrow addresses are read from the stored draft rather than accepted
from the browser. A transaction that does not match is refused rather than published.

## Expected result

An order in state **Open**, visible on the book and in your
[portfolio](/docs-stampdex/guides/portfolio/), with your amount and your price.

## How to verify

```bash frame=none
curl "https://stamp.api.bitcoinuniverse.io/api/v1/orders?tick=KEVIN&status=open"
```

Your listing appears with `sellerAddress` matching yours, and
`priceSatsPerToken * amount` equal to `totalPriceSats`.

## While the listing is live

- **Cancel any time before a sale.** It needs your signature. See
  [Cancel a listing](/docs-stampdex/guides/cancel-a-listing/).
- **You cannot edit the price in place.** See
  [Change a listing price](/docs-stampdex/guides/change-a-listing-price/).
- **A buyer who locks and does not pay costs you nothing.** The lock lapses within
  about half an hour and the listing returns to the book.
- **An unsigned draft disappears after 30 minutes.** If you prepared a listing and
  walked away, prepare it again.

## When it sells

The buyer pays, the payment confirms, the balance is verified, and settlement delivers
the tokens and pays you the total minus your service fee. The order page names each
state and each transaction id. See
[Settlement lifecycle](/docs-stampdex/concepts/settlement-lifecycle/).

## Common failure states

| You see | What happened | What to do |
| --- | --- | --- |
| "Minimum total payment is 2000 sats" | Amount times price is below the floor | Raise the amount or the price |
| "No stamp UTXO attached and no fallback dust UTXO (548 sats) available" | Your wallet has no anchor output and none could be built | Let StampDEX build the dust output first, then list |
| "Listing draft has expired" | More than 30 minutes passed between preparing and signing | Prepare the listing again |
| "signedListingPsbtHex does not match the prepared listing transaction" | What was signed is not what was prepared | Do not retry blindly. Reload and start again, and report it if it repeats |
| "The listing anchor is spent or missing" | You spent the anchor output elsewhere | Use the repair path, or cancel and relist |
| "Order already has a payment transaction and cannot be cancelled" | A buyer is already paying | Let settlement finish. The trade is in progress, not stuck |

## Recovery path

A listing whose anchor was spent, or whose backing balance moved, is not left on the
book to waste a buyer's time: the collateral check removes it when it proves invalid,
and a diagnosis route reports which specific condition failed rather than a generic
error. See [Recovery](/docs-stampdex/concepts/recovery/).

## Related

- [Cancel a listing](/docs-stampdex/guides/cancel-a-listing/)
- [Fees](/docs-stampdex/reference/fees/)
- [Where your funds are](/docs-stampdex/concepts/custody/)
