# Collect stamps

How to find, judge, and buy Bitcoin Stamps on StampDEX.

## Finding stamps

[stampdex.fun/stamps](https://stampdex.fun/stamps) has four ways in:

- **The index**: every stamp, newest first, with fast thumbnails.
- **Collections**: curated sets with supply, owners, listings, and floor.
- **Listings and offers**: what is for sale right now.
- **Search**: by stamp number, collection, or text.

## Judging a stamp

A stamp page shows the facts that matter before a purchase:

- The artwork, rendered from the exact bytes on the Bitcoin chain.
- The identity: stamp number, Counterparty asset id, creator address,
  transaction hash, file hash, and file size.
- Supply, and whether issuance is locked. A locked stamp with supply 1 is
  one of one, forever.
- Open and closed dispensers with their prices.

The artwork bytes are on the chain. Nobody can swap the image after the
fact; the file hash proves it.

## Buying

Stamps sell through Counterparty dispensers. StampDEX composes the
dispense transaction, shows you the price, the dispenser address, and the
fees, and your wallet signs it. The stamp arrives at your address when the
transaction confirms.

The same signing rule applies everywhere: what StampDEX shows is what your
wallet signs. See [Safety](safety.md).

## Your collection

Your stamps appear on your [portfolio page](portfolio.md), grouped with
their collections, with the same identity facts every stamp page carries.

## Costs

Buying through a dispenser pays the dispenser's asking price plus the
Bitcoin network fee. Browsing costs nothing.
