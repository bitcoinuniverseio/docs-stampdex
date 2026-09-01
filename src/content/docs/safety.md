---
title: Safety and trust
description: What StampDEX can and cannot do with your funds, which claims it refuses to make about itself, and how to check every one of them.
source:
  path: legal/custodyClaims, escrow key handling, terms of service copy
  verified: "2026-09-01"
---

## Your keys stay yours

StampDEX never asks for a private key or a recovery phrase. It builds transactions;
your wallet shows them and signs them, or refuses. Nothing spends from your address
without your signature made in your wallet.

## The claim StampDEX refuses to make

StampDEX is not a non-custodial exchange, and it does not describe itself as one. The
application repository carries a test that fails the build if product copy calls it a
non-custodial marketplace or a trustless exchange, so the claim cannot creep back in
through a marketing edit.

What it says instead, in its own terms:

> StampDEX is a software interface. We never hold your private keys, your seed phrase,
> or your Stamps.
>
> An SRC-20 purchase is different. Your payment goes to a trade address StampDEX
> controls and is released to the seller when the tokens move to you. If the token
> transfer fails, that payment stays in the trade address until an operator finishes
> the trade or returns it.

Both halves are true at once. That is why
[Where your funds are](/docs-stampdex/concepts/custody/) exists as its own page.

## Where funds sit during a trade

**SRC-20:** tokens and payment sit in escrow addresses created for that one listing.
StampDEX generates and holds those keys server side, encrypted, for the trade's
duration; they are never sent to a browser and never returned by any API, and they are
discarded when an unsigned draft expires.

**Bitcoin Stamps:** nothing sits with StampDEX. A dispenser purchase is one Bitcoin
transaction between you and the seller's dispenser.

## What you sign is what you see

Before any signature, StampDEX shows the asset's identity, the amount, the unit price,
the total, the fees, and the addresses involved. The unit price never contradicts the
total: the API refuses to serve a listing whose stored numbers disagree.

If your wallet shows numbers that differ from the review screen, sign nothing and
report it. See [Review a PSBT before signing](/docs-stampdex/guides/psbt-review/).

## Honest numbers

- A value the source did not answer shows as unknown, never as 0. See
  [Unknown is not zero](/docs-stampdex/concepts/unknown-is-not-zero/).
- Every market number names its source, and the source map is in the API response. See
  [Data provenance](/docs-stampdex/concepts/data-provenance/).
- No fake urgency, no fake viewers, no invented volume. A quiet market looks quiet.
- A market cap that arithmetic makes absurd is reported as unknown rather than
  repeated.

## Verify the deployment yourself

```bash
curl https://stamp.api.bitcoinuniverse.io/api/version
```

Returns the exact commit running in production. The code that commit points to is what
serves you.

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status
```

Names the index source, its operator, and how far behind the Bitcoin tip it is.

## What StampDEX cannot promise

- **Bitcoin confirmation times.** Fees and network demand set them.
- **The completeness of third-party index data.** The
  [provenance page](/docs-stampdex/concepts/data-provenance/) says which reads are
  third party.
- **That a token or stamp is a good purchase.** StampDEX shows identity and market
  facts. The decision is yours, and nothing here is financial advice.
- **That every action has been exercised on mainnet.** Read
  [Release evidence](/docs-stampdex/project/release-evidence/) before trusting an
  action with something valuable.

## Report a problem

- **A suspected security problem:** email `legal@bitcoinuniverse.io`. Do not open a
  public issue.
- **Anything else:** open a
  [GitHub issue](https://github.com/bitcoinuniverseio/stampdex/issues).
- **A mistake in these docs:** see
  [Contributing](/docs-stampdex/project/contributing/).

## Related

- [Where your funds are](/docs-stampdex/concepts/custody/)
- [Recovery](/docs-stampdex/concepts/recovery/)
- [Wallets](/docs-stampdex/reference/wallets/)
