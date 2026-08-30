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

A double dash means the source had no answer, and a screen reader hears the
word Unknown in its place. A 0 means the source answered zero. StampDEX keeps
those separate everywhere: a token with no listings shows no floor, not a
floor of 0, and a token that traded nothing in the last day shows 0, not a
blank.

Which source answered decides this, not the number that happened to arrive.
The market API sends a `sources` map beside every row; when it reports `none`
for a field, that field is unknown even if a nested block carries a zero.

## Totals name their coverage

The market volume total sums only the tokens a source could answer for, and
the chip says how many that is. `0.037 BTC (3/106)` means three of the one
hundred and six tokens on the board had a volume reading. It is not the
volume of the whole board.

Under the counts, the market page says the same thing in words: how many
tokens have a listing you can fill on StampDEX, and how many carry a price
read from the index with no order behind it.

## Freshness

The [status endpoint](data-sources.md#check-it-live) reports how far the
index is behind the Bitcoin tip. Market overviews are cached for 20
seconds and discovery picks for 60 seconds, so numbers can trail live
trades by that much.

## Price history

Charts draw only recorded prices. StampDEX does not interpolate points or
fabricate a curve for a token with sparse trades; a thin market draws a
thin chart.
