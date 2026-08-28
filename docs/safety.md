# Safety and trust

What StampDEX can and cannot do with your funds, and how to check its
claims yourself.

## Your keys stay yours

StampDEX never asks for a private key or a recovery phrase. It builds
transactions as PSBTs; your wallet shows them and signs them, or refuses.
Nothing spends your funds without your signature in your wallet.

## What you sign is what you see

Before any signature, StampDEX shows the asset's identity, the amount, the
unit price, the total, the fees, and the addresses involved. The unit price
never contradicts the total: the API refuses to serve a listing whose
stored numbers disagree.

## Where funds sit during a trade

During a trade, tokens and the payment sit in escrow addresses created for
that one listing. StampDEX generates and holds those escrow keys server
side, encrypted, for the trade's duration; they are never sent to a
browser. The order page names each state, where the funds are, and the
transaction ids, so you can verify on any block explorer. See
[Orders and settlement](orders-and-settlement.md).

If settlement cannot verify the token balance, the order is marked Failed
and the BTC stays in escrow until an operator resolves it. It is not
swallowed silently.

## Honest numbers

- A value the data source did not answer shows as unknown, never as 0.
- Every market number names its source. Check the live source map at any
  time; see [Data sources](data-sources.md).
- StampDEX shows no fake urgency, no fake viewers, and no invented volume.
  A quiet market looks quiet.

## Verify the deployment

```bash
curl https://stamp.api.bitcoinuniverse.io/api/version
```

returns the exact git commit running in production. The code that commit
points to is what serves you.

## What StampDEX cannot promise

- Bitcoin confirmation times. Fees and network demand set them.
- The completeness of third-party index data. The
  [data sources page](data-sources.md) says which reads are third party.
- That a token or stamp is a good purchase. StampDEX shows identity and
  market facts; the decision is yours.

## Report a problem

A suspected security problem: email `legal@bitcoinuniverse.io` and do not
open a public issue. Anything else: open a
[GitHub issue](https://github.com/bitcoinuniverseio/stampdex/issues).
