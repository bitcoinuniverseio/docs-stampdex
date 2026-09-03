---
title: Cancel a listing
description: "How to take an SRC-20 listing off the StampDEX book, why cancelling needs your signature, when it is refused, and what happens to the tokens afterwards."
source:
  path: orders cancel route, wallet action challenge
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

**For:** a seller with a live listing.
**Goal:** the listing off the book, tokens back under your sole control.
**Chain and network:** Bitcoin mainnet. **Version:** continuous.

**Safety:** cancelling requires your signature. Nobody else can cancel your listing,
and StampDEX cannot cancel it for you without one.

## Prerequisites

- The wallet that created the listing, connected.
- The listing must not already have a payment against it.

## Steps

1. Open your [portfolio](/docs-stampdex/guides/portfolio/) or the token page and find
   the listing.
2. Choose to cancel.
3. Your wallet asks you to sign a short message. This is the one-time action challenge:
   it names the action, your address, and a hash of the exact request, and it can be
   used once. See [Review a PSBT before signing](/docs-stampdex/guides/psbt-review/).
4. The order moves to **Cancelled** and leaves the book.

## Expected result

The listing is gone from the book and from your open orders. Your tokens are yours
alone again.

## How to verify

```bash frame=none
curl "https://stamp.api.bitcoinuniverse.io/api/v1/orders/ORDER_ID"
```

The `status` reads `cancelled`.

## When cancelling is refused

| You see | What happened | What to do |
| --- | --- | --- |
| "Order already has a payment transaction and cannot be cancelled" | A buyer has paid | Nothing. Settlement owns the order now. Watch it reach Filled |
| "Order already has a payment transaction; settlement owns it now" | The same thing, said at a later point | Watch the order |
| "Order could not be cancelled, payment may have been submitted" | A payment arrived while you were cancelling | Refresh the order and read its state |
| "Wallet does not own this order" | You are connected as a different address | Connect the wallet that created the listing |
| "Wallet action challenge is invalid or expired" | The challenge outlived its five minute life | Try again. Nothing is stuck |

## Recovery path

A cancel that races a payment is decided in the payment's favour, deliberately: a buyer
who has already committed BTC is not left holding a cancelled order. If that happens,
the trade completes normally and you are paid.

## Related

- [Change a listing price](/docs-stampdex/guides/change-a-listing-price/)
- [Order lifecycle](/docs-stampdex/concepts/order-lifecycle/)
