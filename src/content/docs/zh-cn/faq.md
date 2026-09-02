---
title: 常见问题解答 (FAQ)
description: 关于 StampDEX 交易机制、资金托管、费用费率与资产安全的常见疑问解答。
source:
  path: across the marketplace, stamps, and market modules
  verified: "2026-09-01"
contentType: reference
audiences: [traders, collectors, developers]
products: [src20, stamps]
protocols: [src20, stamps, bitcoin]
difficulty: intro
estimatedMinutes: 5
lifecycle: stable
releaseStatus: live
lastReviewedBy: docs-stampdex maintainers
---

> [!NOTE]
> **简体中文官方文档**：汇总交易者、收藏家与开发者关于 StampDEX 运作机制的最常见技术问题。 核心交易规则为非托管模式，买卖双方按标准费率收取服务费，并于比特币主网进行原子结算。



## Do I need a wallet to use StampDEX?

No. Markets, stamps, collections, activity, address holdings, and the API are open to
everyone. A wallet is needed only to buy, sell, or have the site know which address is
yours.

## Does StampDEX hold my funds?

For a stamp purchase, no: it is one Bitcoin transaction between you and the seller's
dispenser.

For an SRC-20 trade, yes, temporarily. Your payment sits in an escrow address StampDEX
controls until the tokens reach you. StampDEX says so before you sign. See
[Where your funds are](/docs-stampdex/zh-cn/concepts/custody/).

## Is StampDEX 非托管?

Not for SRC-20 trades, and it does not claim to be. See
[Safety and trust](/docs-stampdex/zh-cn/safety/).

## What does StampDEX charge?

1.5% per side of an SRC-20 trade with a 500 sat minimum per side, so 3% in total.
A flat 1,500 sats on a mint, deploy, or transfer. Nothing on a stamp purchase beyond
the dispenser price. Network fees go to miners. See
[Fees](/docs-stampdex/zh-cn/reference/fees/).

## Why is the fee 50% on a tiny trade?

Because the 500 sat minimum per side dominates below about 33,000 sats, and the
smallest listing allowed is 2,000 sats. The table in [Fees](/docs-stampdex/zh-cn/reference/fees/)
shows exactly where the floor stops mattering.

## Can I change the price of a listing?

Not in place. The registry records `update-listing` as unsupported for both protocols,
because no atomic listing update is implemented: listings must be cancelled and
relisted. StampDEX offers a guided reprice that chains the two steps, and it still
produces a new order, a new signature, and a second 网络费用. See
[Change a listing price](/docs-stampdex/zh-cn/guides/change-a-listing-price/).

## Can I make an offer on something?

No. The registry records `make-offer` and `accept-offer` as unsupported for both
protocols. See [Offers](/docs-stampdex/zh-cn/concepts/offers/).

## Why does a number show as unknown?

Because the data source had no answer. StampDEX never replaces a missing value with 0.
See [Unknown is not zero](/docs-stampdex/zh-cn/concepts/unknown-is-not-zero/).

## Where does the data come from?

Bitcoin chain data comes from Universe-operated infrastructure. The Stamps and SRC-20
index currently comes from stampchain.io, a third party, and StampDEX says so on the
page and in its status endpoint. See
[Data provenance](/docs-stampdex/zh-cn/concepts/data-provenance/).

## Two tokens have the same ticker. Which is real?

Tickers are not identities. Check the deployment transaction and block on the token page
against the token you researched. See
[Asset identity](/docs-stampdex/zh-cn/concepts/asset-identity/).

## My trade is taking a while. Should I worry?

Usually not. Bitcoin confirmations set the pace, settlement waits for two blocks of
depth by default, and the order page names each state with its transaction id. See
[Order lifecycle](/docs-stampdex/zh-cn/concepts/order-lifecycle/) and
[Recovery](/docs-stampdex/zh-cn/concepts/recovery/).

## My order says Failed. Is my money gone?

No. It is in the listing's escrow address, which you can look up in any block explorer.
Settlement stopped there rather than releasing funds against a balance it could not
verify. See [Recovery](/docs-stampdex/zh-cn/concepts/recovery/).

## Is there an API?

Yes, the same one the site uses, with no key needed for reads. Start at the
[API quick start](/docs-stampdex/zh-cn/api/quickstart/).

## Can I call the API from my website's front end?

Not directly. Cross-origin browser access is allow-listed. Call it from your backend.
Media routes are open to any origin.

## How do I report a bug or a security problem?

Bugs: [GitHub issues](https://github.com/bitcoinuniverseio/stampdex/issues).
Security: email `legal@bitcoinuniverse.io` and do not open a public issue.
