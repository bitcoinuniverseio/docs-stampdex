# Frequently asked questions

## Do I need a wallet to use StampDEX?

No. Markets, stamps, collections, activity, and the API are open to
everyone. A wallet is needed only to buy, sell, or view your own holdings.

## Does StampDEX hold my funds?

No. It builds transactions; your wallet signs them. During a trade, funds
sit in escrow addresses created for that one listing, visible on-chain.
See [Safety](safety.md).

## What does StampDEX charge?

A 1.5% service fee per side of an SRC-20 trade, minimum 500 sats, shown
before you sign. Network fees go to Bitcoin miners. Browsing is free. See
[Fees](fees.md).

## Why does a number show as unknown?

Because the data source had no answer. StampDEX never replaces a missing
value with 0. See [Market data](market-data.md).

## Where does the data come from?

Bitcoin chain data comes from Universe-operated infrastructure. The
Stamps and SRC-20 index currently comes from stampchain.io, a third party,
and StampDEX says so on the page and in its status endpoint. See
[Data sources](data-sources.md).

## Two tokens have the same ticker. Which is real?

Tickers are not identities. Check the deployment transaction and block on
the token page against the token you researched. See
[Asset identity](asset-identity.md).

## My trade is taking a while. Should I worry?

Usually not: Bitcoin confirmations set the pace, and the order page shows
each state with its transaction id. See
[Orders and settlement](orders-and-settlement.md) and
[Troubleshooting](troubleshooting.md).

## Is there an API?

Yes, the same one the site uses, with no key needed for reads. Start at
the [API quick start](api/quickstart.md).

## How do I report a bug or a security problem?

Bugs: [GitHub issues](https://github.com/bitcoinuniverseio/stampdex/issues).
Security: email `legal@bitcoinuniverse.io` and do not open a public issue.
