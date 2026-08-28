# Market data

How to read the numbers on StampDEX: what each one means, where it comes
from, and what its absence means.

## The core numbers

| Number | Meaning |
| --- | --- |
| Floor | The lowest live listing price, in sats per token. No listings means no floor, shown as such |
| Listings | Real signed listings on the StampDEX order book |
| Volume | Traded value over the stated window, from the source named on the row |
| Holders | Addresses holding the token, from the stamp index |
| Mint progress | Minted supply against max supply |
| Market cap | Price times supply, computed from the stated source's price |

## Every number names its source

Market rows carry a source map. `stampchain` means the number came from the
stamp index. `stampdex` means it came from trades and listings made on
StampDEX itself. `none` means no source had an answer, and the page shows
unknown.

## Unknown is not zero

A dash or the word unknown means the source had no answer. A 0 means the
source answered zero. StampDEX keeps those separate everywhere: a token
with no listings shows no floor, not a floor of 0.

## Freshness

The [status endpoint](data-sources.md#check-it-live) reports how far the
index is behind the Bitcoin tip. Market overviews are cached for 20
seconds and discovery picks for 60 seconds, so numbers can trail live
trades by that much.

## Price history

Charts draw only recorded prices. StampDEX does not interpolate points or
fabricate a curve for a token with sparse trades; a thin market draws a
thin chart.
