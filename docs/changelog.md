# Changelog

## 2026-08-30 (third release)

- Asset identity: a token page now has an address that names its deployment,
  `/trade/src20/<ticker>/<deploy transaction>`. That is what Copy link gives
  you and what a market row opens, so a link cannot open a different token
  for whoever receives it.
- Asset identity: the shorter `/trade/src20/<ticker>` still works and now
  resolves before it shows a market. One deployment moves you to the longer
  link. More than one shows you each deployment and asks. A ticker with no
  deployment says so. An index that did not answer says that instead, which
  is a different thing. Only the first opens a market.
- Search: a 64 character transaction id now offers the SRC-20 deployment
  alongside the stamp, and picks neither for you.
- Wallets: [the wallet page](wallets.md) now carries a table of what each
  wallet can actually do here, generated from the code that talks to it.
  OKX Wallet no longer appears to support listing, cancelling, or minting,
  because it does not.
- Wallets: Leather is supported for connecting and signing. StampDEX shows
  your Stamps and SRC-20 and Leather signs for them; Leather does not display
  those assets itself.
- Wallets: an Xverse session now ends when you switch accounts inside the
  wallet, instead of carrying on with the address you left.
- Market board: a token nobody has priced no longer sorts as though its price
  were zero, and a price range filter no longer returns it as a match. On
  2026-08-28, 258 of 500 rows had no price from any source.

## 2026-08-30 (second release)

- Asset identity: the market board and every search result now print the
  deployment transaction behind a ticker, in a column that used to hold three
  scores named Liquidity, Momentum, and Risk. Those scores came from a formula
  StampDEX never published and counted a missing reading as a zero, so they
  are gone.
- Search: two deployments that share a ticker no longer collapse into one
  result. Both appear, each with its own deployment transaction.
- Search: a result with no volume reading says unknown instead of 0, and a
  result with no listing reading no longer shows a Listed badge.
- Address holdings: `/address/<address>` shows what any Bitcoin address holds,
  read from the public index, with no wallet connection. The older
  `/shelf/<address>` links open the same page.
- Removed: the daily games, the pack-opening and battle hub, and the points,
  streaks, badges, and confetti that went with them. StampDEX is a market, and
  a market this thin cannot afford invented activity.

## 2026-08-30

- Buying: the buy panel says where your BTC goes before you sign, not only
  after settlement, and it says so whether or not you use the review step.
- Market data: a missing reading now prints a double dash that a screen
  reader announces as Unknown, and a real zero prints as 0. The source map
  decides which one you see.
- Market data: totals name their coverage, so a volume figure cannot be read
  as covering the whole board.


## 2026-08-28

First release of this documentation. Every page was verified against the
StampDEX repository and the live production site and API on this date.
Screenshots were captured from production the same day.

Covers: the market and token terminal, the stamps explorer, buying and
selling SRC-20, collecting stamps, orders and settlement, fees, wallets,
safety, data sources, the portfolio, troubleshooting, and the read API.
