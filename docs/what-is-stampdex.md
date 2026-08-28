# What is StampDEX

StampDEX is a marketplace and explorer for SRC-20 tokens and Bitcoin
Stamps at [stampdex.fun](https://stampdex.fun).

## What you can do there

- Browse every SRC-20 token with its market data, deployment identity, and
  mint progress. No wallet needed.
- Trade SRC-20 tokens against real signed listings, with every number
  shown before you sign.
- Explore Bitcoin Stamps and their collections: artwork stored directly in
  Bitcoin transactions.
- Track a wallet's holdings, open orders, and activity.

## What Bitcoin Stamps are

Bitcoin Stamps store artwork bytes inside Bitcoin transactions. The image
does not sit on a server that can vanish; it sits in the chain itself, in
every full copy of Bitcoin. That gives a stamp two properties collectors
care about: it cannot be altered, and it lasts as long as Bitcoin does.

SRC-20 is a token standard built on the same mechanism. A token's deploy,
its mints, and its transfers are all stamp transactions.

## What makes StampDEX different

- **Named sources.** Every market number names the service it came from,
  and a live status endpoint reports the index source, its freshness, and
  its operator. See [Data sources](data-sources.md).
- **Unknown is never zero.** A number the source did not answer shows as
  unknown. StampDEX does not fill gaps with zeros or invented values.
- **Full identity.** Tokens show their deployment transaction and block;
  stamps show their number, asset id, creator, and file hash. A name alone
  never stands in for identity. See [Asset identity](asset-identity.md).
- **You sign what you see.** Trades are transactions your own wallet
  reviews and signs. Your wallet keys never leave your wallet. See
  [Safety](safety.md).

## What StampDEX is not

It is not a custodial exchange, not a wallet, and not a financial advisor.
It shows facts and builds transactions; your wallet and your judgment do
the rest.

## Next

- [Start here](start-here.md)
- [Buy SRC-20 tokens](buy-src20.md)
- [Collect stamps](collect-stamps.md)
