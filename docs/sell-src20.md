# Sell SRC-20 tokens

How listing works, what it costs, and how to manage a live listing.

## Before you start

- A [supported wallet](wallets.md) holding the tokens, plus a little BTC
  for the network fee.
- Your price, in sats per token. The token page shows the current floor
  and order book so you can place yours against real listings.

## The steps

1. **Open the token page** and choose to sell.
2. **Set amount and price.** StampDEX shows the resulting total, the
   1.5% seller service fee (minimum 500 sats), and the network fee before
   anything is signed. See [Fees](fees.md).
3. **Sign the listing.** Your wallet shows the listing transaction. It
   places the tokens under escrow addresses created for this one listing.
   If your wallet lacks the small marker output the flow needs, StampDEX
   builds that first and your wallet signs it too.
4. **Your listing is live.** It appears in the order book at your exact
   price.

## While the listing is live

- The [portfolio page](portfolio.md) lists your open orders with their
  state.
- **Cancel any time before a sale.** Cancelling needs your signature, so
  nobody else can cancel or alter your listing.
- A listing that is never bought expires by itself; expiry is shown on the
  order.

## When it sells

The buyer pays, the payment confirms, and settlement delivers the tokens
and pays you the total minus the seller service fee. The order page shows
each state and transaction id; see
[Orders and settlement](orders-and-settlement.md).

## What can go wrong

- **A buyer locked the listing but never paid.** The lock releases by
  itself and the listing returns to the book. You do nothing.
- **You want a different price.** Cancel and relist. Both actions are
  yours to sign.
