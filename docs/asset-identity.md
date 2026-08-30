# Asset identity

Two different assets can share a name. This page shows which facts identify
an asset on StampDEX, so you always know what you are buying.

## SRC-20 tokens

A ticker alone does not identify a token. The deployment does. StampDEX
shows, for every token:

- the ticker
- the deployment transaction hash
- the deployment block
- the max supply and minted supply
- the holder count

The deployment transaction appears in three places, so you never have to
take a ticker on trust:

- the market board, in its own column beside the ticker
- every search result
- the token page, above the price

Before you buy, check the deployment transaction matches the token you
researched. A copycat deployment has a different transaction hash and block,
whatever its ticker says.

Search never merges two deployments that share a ticker. If two exist, you
see both rows with their own transactions, and you choose.

When no source reported a deployment for a row, the row says so. It does not
fall back to the ticker.

### The address of one deployment

A token page has a link that names its deployment:

```
https://stampdex.fun/trade/src20/KEVIN/23765f9bc6b87e078b1f93ed213f90b9004998336575f726e46f34ddbea5e5f3
```

That is the link Copy link gives you, the link the tab title and the shared
card describe, and the link a market row opens. Send it to somebody and they
open the token you were looking at.

The shorter `/trade/src20/KEVIN` still works. StampDEX resolves it before it
shows you a market, and it does one of five things:

| What StampDEX finds | What you see |
| --- | --- |
| one deployment | the address changes to the longer link, and the market opens |
| more than one | each deployment with its transaction, block, and creator, and you pick one |
| no deployment, and the index answered | "No deployment found". Nothing to price, nothing to trade |
| the index did not answer | "The index did not answer", with a retry |
| a link naming a transaction that belongs to a different ticker | a link to that ticker, and no market here |

Only the first opens a market. You cannot buy, sell, or sign anything from a
ticker StampDEX has not resolved to one deployment.

### Looking up a transaction

Paste a 64 character transaction id into search and StampDEX offers both
things it could be: the stamp with that transaction, and the SRC-20
deployment with that transaction. It picks neither for you.

## Bitcoin Stamps

A stamp's identity is a set of on-chain facts:

- the stamp number
- the Counterparty asset id (`cpid`)
- the transaction hash that created it
- the creator address
- the file hash and file size
- the supply, and whether issuance is locked

The artwork bytes live on the Bitcoin chain. The file hash on the stamp
page is the hash of those exact bytes.

## Collections

A collection is curated metadata grouping stamps. Collection membership
comes from the collection index, not from the chain itself, so StampDEX
names the source of collection data on the page. See
[Data sources](data-sources.md).

## The rule behind all of it

StampDEX shows identity facts next to price facts so a look-alike cannot
ride a real asset's reputation. When a fact is unavailable, the page says
unknown. It never guesses.
