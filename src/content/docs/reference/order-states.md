---
title: Order states
description: "Every SRC-20 order state on StampDEX, the value the API returns for it, what it means, where the funds are in it, and what ends it."
source:
  path: OrderStatus enum, orders list filtering, expiry crons
  verified: "2026-09-01"
---

The values in the first column are what the API returns in an order's `status` field.
The friendly names are what the site shows.

| API value | Shown as | Meaning | Where the BTC is | What ends it |
| --- | --- | --- | --- | --- |
| `draft` | Draft | Prepared, not signed. Buyers never see it | Untouched in the seller's wallet | The seller signs, or 30 minutes pass |
| `open` | Open | Live on the book | No buyer funds involved | A buyer locks it, or the seller cancels |
| `pending` | Pending | Locked by one buyer who is paying | In the buyer's wallet until the payment broadcasts | The buyer pays, or 30 minutes pass |
| `awaiting_tx3` | Awaiting transfer | The payment is broadcast, waiting on confirmation and an index check | In the listing escrow | The check passes, or the grace period expires |
| `settling_tx3` | Settling | A worker is verifying and broadcasting the token transfer | In the listing escrow | The transfer broadcasts, or the order fails |
| `awaiting_tx3_confirmation` | Awaiting confirmation | The transfer is broadcast and needs two blocks of depth, the default | In the listing escrow | Two confirmations |
| `filled` | Filled | Settled | Delivered to the seller, less their fee | Nothing. It is final |
| `cancelled` | Cancelled | The seller cancelled before a sale | Returned, or never moved | Nothing |
| `expired` | Expired | A draft or a buyer lock ran out of time | Never moved | Nothing |
| `failed` | Failed | The payment confirmed but the token balance was not verified in time | Held in the listing escrow, not lost | An operator |

## Which states a listing query returns

- With no `status` filter, the open book is returned.
- `pending` rows are excluded from the public book, so a listing somebody is mid-way
  through buying does not appear as available inventory.
- An open row must have its signed listing and its escrow details recorded. An
  incomplete listing is never shown as inventory.
- Rows past their expiry are excluded.
- The public book sorts by unit price ascending, then newest first.
- Filtering by a wallet address returns that address's orders in `open`,
  `awaiting_tx3`, `settling_tx3`, `awaiting_tx3_confirmation`, and `filled`, sorted
  newest first.

## Replacement links

An order created by repricing, splitting, or repairing another carries the link between
them:

| Field | Meaning |
| --- | --- |
| `replacesOrderId` | The order this one was created to replace |
| `replacedByOrderId` | The order that replaced this one |
| `replacementGroupId` | The group, when one listing was split into several |
| `replacementKind` | `price`, `split`, or `repair` |

None of these make a replacement an in-place edit. The old order is cancelled and the
new one is a new order. See
[Change a listing price](/docs-stampdex/guides/change-a-listing-price/).

## Related

- [Order lifecycle](/docs-stampdex/concepts/order-lifecycle/)
- [Where your funds are](/docs-stampdex/concepts/custody/)
- [Orders endpoints](/docs-stampdex/api/orders/)
