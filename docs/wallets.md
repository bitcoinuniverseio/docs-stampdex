# Wallets

You can browse everything on StampDEX without a wallet. Connect one when
you want to buy, sell, or see your holdings.

## Supported wallets

| Wallet | Kind |
| --- | --- |
| [Universe Wallet](https://chromewebstore.google.com/detail/universe-bitcoin-wallet/fjalkkkbjffhgdoheannkodafhemfdba) | Browser extension by Universe, with StampDEX built into its trading desk |
| UniSat | Browser extension |
| Xverse | Browser extension |
| OKX Wallet | Browser extension |

Connect from the wallet button in the header. StampDEX sees your address
and asks your wallet to sign when you act; it never sees your keys.

## Universe Wallet integration

Universe Wallet embeds the StampDEX trading desk. From the wallet you land
on `/desk` with your wallet already connected, and token links open the
matching StampDEX pages. The desk works the same in the wallet and in a
browser tab.

## What connecting shares

Your address, and nothing else. StampDEX reads your SRC-20 balances,
stamps, open orders, and activity for that address from its own API, the
same data anyone could read for any address.

## What signing shows

Every action that spends funds produces a transaction your wallet
displays before signing: the asset, amount, price, total, service fee,
network fee, and addresses. If your wallet shows numbers that disagree
with the StampDEX review screen, sign nothing and report it. See
[Safety](safety.md).

## Disconnecting

Disconnect from the wallet menu. StampDEX never has your wallet keys, so
disconnecting just stops the site reading your address. The only funds
StampDEX ever operates are the per-listing escrow addresses during an
active trade; see [Safety](safety.md).
