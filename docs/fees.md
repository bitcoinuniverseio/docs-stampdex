# Fees

Every fee, stated before you sign. There are no hidden fees.

## SRC-20 marketplace trades

| Fee | Amount | Who pays |
| --- | --- | --- |
| Service fee | 1.5% of the trade total, with a 500 sat minimum | The buyer pays it once and the seller pays it once |
| Network (miner) fee | Set by the fee rate you choose, in sat/vB | Whoever signs the transaction that pays it |

The service fee funds StampDEX. It is computed on the trade total, shown as
its own line before you sign, and included in the transaction outputs your
wallet displays.

Example: a 460,000 sat trade carries a service fee of 6,900 sats
(1.5 percent) from the buyer and 6,900 sats from the seller. A 20,000 sat
trade carries the 500 sat minimum from each side instead.

## SRC-20 mint, deploy, and transfer

Every SRC-20 transaction StampDEX builds outside the marketplace (a mint,
a deploy, or a plain transfer) carries a flat 1,500 sat platform fee, the
same fee the Universe Inscribe app charges. It appears as its own output
in the transaction your wallet shows.

## Network fees

Bitcoin transactions pay miners by size, not by value.
`GET /api/v1/market/fees` returns the current recommended rates from the
Universe Bitcoin node, and the site offers those rates before you sign.
Confirmation time depends on the rate you choose and network demand;
nobody can guarantee it.

## Dust outputs

Some steps of the listing flow need a small marker output of 548 sats.
This is part of how SRC-20 trades work on Bitcoin, it is shown in the
transaction review, and the recipient is you or the trade counterparty,
not StampDEX.

## Browsing is free

Exploring markets, stamps, collections, and the API costs nothing and
needs no wallet.
