# Portfolio

Your holdings, orders, and history in one place, for any connected wallet.

Open [stampdex.fun/profile](https://stampdex.fun/profile) with a wallet
connected. The old `/portfolio` path goes to the same page.

## What it shows

- **SRC-20 balances**: every token your address holds, with market data
  where a source has it.
- **Stamps**: the artwork you own, with collection grouping and the
  identity facts from each stamp page.
- **Open orders**: your live listings and in-progress purchases, each with
  its current state. See
  [Orders and settlement](orders-and-settlement.md).
- **Activity**: your trades and marketplace events.

## Honest values

The product rule is that a value no source can answer shows as unknown,
never as 0. Market surfaces apply it today; parts of the portfolio are
still being brought up to the same rule. When a price is missing, treat
the holding's value as unknown, not as zero.

## Reading it without connecting

The data behind the portfolio is public chain and marketplace data. The
API serves it for any address:

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/wallet/bc1qexample.../portfolio"
```

Connecting a wallet is only how the site learns which address is yours.
