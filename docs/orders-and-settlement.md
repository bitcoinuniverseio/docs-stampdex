# Orders and settlement

This page explains what each order state means, where your BTC is during a
trade, and what to do when a trade stalls.

## How a StampDEX trade works

StampDEX uses the three-transaction SRC-20 listing flow. In plain words:

1. **The seller lists.** The seller signs a listing transaction that places
   the tokens under escrow addresses created for that one listing. The
   listing appears on the market with its exact amount, unit price, and
   total.
2. **The buyer pays.** The buyer signs a payment of the exact total, plus
   the network fee, to the listing's payment address. StampDEX shows every
   number before the wallet asks for a signature.
3. **Settlement sends the tokens.** After the payment confirms and the
   token balance is verified on the index, the settlement worker broadcasts
   the transfer that delivers the tokens to the buyer.

Your wallet signs every transaction that spends your funds. StampDEX never
holds your keys.

## The states, in order

| State | What it means | Where the BTC is |
| --- | --- | --- |
| Draft | The listing is prepared but the seller has not signed it. Buyers never see it. It expires on its own | Untouched in the seller's wallet |
| Open | The listing is live and buyable | No buyer funds involved yet |
| Pending | A buyer locked the listing and is paying. The lock releases on its own if the buyer stops | In the buyer's wallet until the payment broadcasts |
| Awaiting transfer | The payment is broadcast; StampDEX waits for confirmation and an index check before sending tokens | In the listing's escrow address |
| Settling | The settlement worker is verifying and broadcasting the token transfer | In the listing's escrow address |
| Awaiting confirmation | The token transfer is broadcast and needs one confirmation | In the listing's escrow address |
| Filled | The trade is settled. The buyer has the tokens; the seller has the BTC | Delivered |
| Cancelled | The seller cancelled the listing before a sale | Returned or never moved |
| Expired | The listing or the buyer's lock ran out of time | Never moved |
| Failed | The payment confirmed but the token balance could not be verified. An operator resolves it; the BTC stays in escrow until then | Held in escrow, not lost |

## When a trade stalls

- **Payment sent, still Pending or Awaiting transfer.** Bitcoin
  confirmation times vary with fees. The order page shows the transaction
  id; any block explorer shows its confirmations. Nothing more is needed
  from you.
- **Failed.** This means the payment confirmed but the index did not show
  the expected token balance in time. The BTC stays in the escrow address.
  An operator reviews and completes or refunds it. Open a
  [GitHub issue](https://github.com/bitcoinuniverseio/stampdex/issues) with
  the order id if a Failed order does not resolve.
- **Retrying is safe** for reads and for cancels. StampDEX refuses a
  duplicate fill of a locked listing.

## Next

- [Buy SRC-20 tokens](buy-src20.md)
- [Sell SRC-20 tokens](sell-src20.md)
- [Fees](fees.md)
