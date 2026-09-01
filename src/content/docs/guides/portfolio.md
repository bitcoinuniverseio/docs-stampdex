---
title: Your portfolio
description: "How to see the SRC-20 balances, stamps, open orders, and activity an address holds on StampDEX, with a connected wallet or with no wallet at all."
source:
  path: profile view, wallet portfolio route, address holdings route
  verified: "2026-09-01"
---

**For:** anyone holding stamps or SRC-20. **Goal:** see holdings, open orders, and activity.
**Prerequisites:** an address. A wallet only if you want StampDEX to know which address is yours.
**Chain and network:** Bitcoin mainnet. **Safety:** reading only, nothing is signed.

## With a wallet

Open [stampdex.fun/profile](https://stampdex.fun/profile) with a wallet connected.
`/portfolio` opens the same page.

It shows:

- **SRC-20 balances**, with market data where a source has it.
- **Stamps you own**, grouped by collection, carrying the same identity facts every
  stamp page shows.
- **Open orders**: your live listings and in-progress purchases, each with its state.
  See [Order lifecycle](/docs-stampdex/concepts/order-lifecycle/).
- **Activity**: your trades and marketplace events.

## Without a wallet

The data behind the portfolio is public chain and marketplace data. Open
`https://stampdex.fun/address/<address>` for any Bitcoin address. Typing an address into
search opens the same page. Older `/shelf/<address>` links still work.

The page states plainly that StampDEX cannot tell who controls an address.

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/wallet/<address>/portfolio"
```

Connecting a wallet is only how the site learns which address is yours.

## Honest values

A value no source can answer shows as unknown, never as 0. Market surfaces apply that
rule fully today. Parts of the portfolio are still being brought up to it, so when a
price is missing there, treat the holding's value as unknown rather than as zero.

## Common failure states

| You see | Cause | Recovery |
| --- | --- | --- |
| Balances but no prices | No source priced those tokens | Nothing to fix |
| An order in a state you do not recognise | See [Order states](/docs-stampdex/reference/order-states/) | Match the state to its row |
| Nothing at all | The index did not answer for that address | Retry, and check [the status endpoint](/docs-stampdex/api/status/) |

## Related

- [Order lifecycle](/docs-stampdex/concepts/order-lifecycle/)
- [Wallets](/docs-stampdex/reference/wallets/)
