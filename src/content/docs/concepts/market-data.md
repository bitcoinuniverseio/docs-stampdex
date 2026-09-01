---
title: Market data
description: What each number on StampDEX means, which source answered it, how it is derived, and the guards that stop an absurd figure being repeated.
source:
  path: market aggregation util, stamps market service, src20 hub map
  verified: "2026-09-01"
---

## The core numbers

| Number | Meaning |
| --- | --- |
| Floor | The lowest live listing price, in sats per token. No listings means no floor |
| Listings | Real signed listings on the StampDEX order book |
| Volume | Traded value over the stated window, from the source named on the row |
| Holders | Addresses holding the token, from the index |
| Mint progress | Minted supply against max supply |
| Market cap | Price times supply, from the stated source, with a sanity guard |
| Price change | Percentage over the window, from a source or derived from recorded trades |

## How a figure is chosen

Each figure has an order of preference, and it stops at the first source that answers.
For an SRC-20 token:

| Figure | Preference order |
| --- | --- |
| Floor | Market feed floor, then market feed price, then the index price, then the StampDEX order book's own lowest unit price |
| Volume | Market feed, then the index, then StampDEX's own recorded trades |
| Holders | Market feed, then the index, then StampDEX's own count |
| Market cap | Market feed, then the index, then price times minted supply |
| Price change | Market feed, then the index, then derived from StampDEX's recorded price history |

A zero or negative floor is treated as no answer, not as a price of zero. Supply
figures are carried as strings so a large number does not lose precision on the way to
your screen.

## The market cap guard

A computed market cap above the total supply of Bitcoin, 21,000,000 BTC, is reported as
unknown rather than repeated. This guard exists because of a real reading: a token
declaring a max supply of two to the power of sixty-four produced a reported cap of
over two hundred million BTC. That is not a market cap, it is a broken input.

## Totals name their coverage

An aggregate is only ever summed over the rows that answered, and the coverage is
stated beside it. `0.037 BTC (3/106)` means three of one hundred and six tokens had a
volume reading. It is not the volume of the whole board.

For stamps, an aggregate floor is a minimum over the collections that reported a
positive floor, never a zero standing in for silence, and the response carries a
coverage count of how many collections reported.

## Price history

Charts draw recorded prices only. StampDEX does not interpolate points or fabricate a
curve for a token with sparse trades. A thin market draws a thin chart, and that is the
correct picture of a thin market.

## Freshness

Market surfaces are cached server side. The shortest are around 20 seconds and the
longest a few minutes, so a number can trail a live trade by that much. See
[Freshness](/docs-stampdex/concepts/freshness/).

## Related

- [Unknown is not zero](/docs-stampdex/concepts/unknown-is-not-zero/)
- [Data provenance](/docs-stampdex/concepts/data-provenance/)
- [The market board](/docs-stampdex/guides/browse-the-market/)
