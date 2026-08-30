# Wallets

You can browse everything on StampDEX without a wallet. Connect one when
you want to buy, sell, or see your holdings.

## Supported wallets

| Wallet | Where to get it |
| --- | --- |
| Universe Wallet | [Chrome Web Store](https://chromewebstore.google.com/detail/universe-bitcoin-wallet/fjalkkkbjffhgdoheannkodafhemfdba) |
| UniSat | [unisat.io](https://unisat.io) |
| Leather | [leather.io](https://leather.io) |
| Xverse | [xverse.app](https://www.xverse.app) |
| OKX Wallet | [okx.com/web3](https://www.okx.com/web3) |

Connect from the wallet button in the header. StampDEX sees your address
and asks your wallet to sign when you act; it never sees your keys.

## What each wallet can do here

Connecting a wallet is not the same as being able to do everything with
it. This table is generated from the code that talks to each wallet, so it
says what StampDEX actually does rather than what a wallet is generally
capable of.

**Yes** means the action has been run through that wallet on StampDEX.
**Not tested** means StampDEX can ask the wallet for it and nobody has run
it yet; StampDEX offers the action and says so on the screen. **No** means
the wallet exposes nothing that performs the action here, so StampDEX hides
it rather than showing a button that fails.

<!-- generated:wallet-capabilities -->
| Action | Universe Wallet | UniSat | Leather | Xverse | OKX Wallet |
| --- | --- | --- | --- | --- | --- |
| Detected in the browser | Yes | Yes | Yes | Yes | Yes |
| Connect | Yes | Yes | Yes | Yes | Yes |
| Reconnect after a reload | Yes | Yes | Yes | Yes | Yes |
| Read the current account | Yes | Yes | Yes | Yes | Yes |
| Report an account change | Yes | Yes | No | Yes | Yes |
| Report the network | Not tested | Not tested | Yes | Yes | Not tested |
| Sign a message | Yes | Yes | Not tested | Yes | Not tested |
| Sign a transaction | Yes | Yes | Not tested | Yes | Not tested |
| Sign a listing transaction | Yes | Yes | Not tested | Not tested | Not tested |
| Send BTC | Yes | Yes | Not tested | Yes | Not tested |
| Buy SRC-20 | Yes | Yes | Not tested | Not tested | Not tested |
| List SRC-20 | Yes | Yes | Not tested | Not tested | No |
| Cancel a listing | Yes | Yes | Not tested | Not tested | No |
| Transfer SRC-20 | Yes | Yes | Not tested | Not tested | Not tested |
| Buy from a dispenser | Yes | Yes | Not tested | Not tested | Not tested |
| Open a dispenser | Not tested | Not tested | No | No | No |
| Close a dispenser | Not tested | Not tested | No | No | No |
| Mint | Yes | Yes | Not tested | Not tested | No |
| Work inside Universe Wallet | Yes | No | No | No | No |
<!-- end:wallet-capabilities -->

### Does the wallet show Stamps and SRC-20 itself

This is about each wallet's own interface, not about StampDEX. Where the
answer is No, StampDEX shows your holdings and the wallet signs for them.

<!-- generated:wallet-native-display -->
| Wallet | Shows these assets |
| --- | --- |
| Universe Wallet | Yes |
| UniSat | No |
| Leather | No |
| Xverse | No |
| OKX Wallet | No |
<!-- end:wallet-native-display -->

Both tables come from `frontend/src/wallet/capabilities.js` in the
`stampdex` repository, printed by
`frontend/scripts/print-wallet-capabilities.mjs`. That build fails when the
code and the table disagree.

## Never do this

No wallet on this page needs your recovery phrase or a private key to work
with StampDEX, and StampDEX never asks for either. If any page, in any tab,
asks you to type a recovery phrase or import a seed into another wallet in
order to trade, close it. See [Safety](safety.md).

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
