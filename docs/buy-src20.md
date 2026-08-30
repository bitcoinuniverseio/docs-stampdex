# Buy SRC-20 tokens

What happens at each step of a buy, and what to check before you sign.

## Before you start

- A [supported wallet](wallets.md) with enough BTC for the trade total,
  the 1.5% service fee, and the network fee. See [Fees](fees.md).
- Know the token's identity, not just its ticker. See
  [Asset identity](asset-identity.md).

## The steps

1. **Open the token page.** From the market list, or directly at
   `stampdex.fun/trade/src20/TICKER`. Check the deployment transaction and
   block match the token you researched.
2. **Pick a listing.** The order book shows real signed listings: amount,
   unit price in sats per token, and total. The unit price times the
   amount always equals the total; StampDEX refuses listings whose stored
   numbers disagree.
3. **Review the trade.** Before your wallet opens, StampDEX shows the
   token, amount, unit price, total, service fee, network fee rate, and
   the payment address. Read it. It is exactly what you will sign.
   The same panel says where the BTC goes: into a trade address StampDEX
   controls, released to the seller only when the tokens reach you. That
   line is on the buy panel whether or not you use the review step, so
   turning on quick trade does not hide it.
4. **Sign in your wallet.** Your wallet displays the same transaction.
   If the numbers differ from what StampDEX showed, refuse and report it.
5. **Wait for settlement.** Your payment confirms on Bitcoin, the token
   balance is verified, and the settlement worker delivers the tokens.
   The order page shows each state and each transaction id. See
   [Orders and settlement](orders-and-settlement.md).

## What can go wrong

- **The listing was taken.** Another buyer locked it first. Pick another
  listing; your funds never moved.
- **Confirmation is slow.** Bitcoin fees set the pace. The order page
  links the transaction so you can watch confirmations.
- **The order shows Failed.** Rare: the payment confirmed but token
  verification did not complete. Your BTC sits in the trade's escrow
  address until an operator resolves it. It is not lost. See
  [Troubleshooting](troubleshooting.md).

## Next

- [Track your holdings](portfolio.md)
- [Sell SRC-20 tokens](sell-src20.md)
