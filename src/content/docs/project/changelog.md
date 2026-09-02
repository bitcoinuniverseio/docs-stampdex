---
title: Changelog
description: "What changed in this documentation and in the StampDEX surfaces it describes, newest first, including corrections to facts previously published here."
source:
  repo: bitcoinuniverseio/docs-stampdex
  path: this repository
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

## 2026-09-02

The documentation experience release. The facts did not change; everything around
them did.

- A real visual system: design tokens with a 64-pair WCAG 2.2 AA contrast
  contract in both themes, self-hosted Inter and JetBrains Mono subsets, brand
  assets built from the perforated-plate mark, a custom header with the
  documentation sections and a visible release chip, and a trust strip on every
  material page showing lifecycle, applicable release, last verified date,
  chain, owning source, and verification state.
- A screenshot and evidence studio: captures declared in a strict manifest,
  taken by a runner that verifies the production commit before it shoots,
  masked for volatile regions, regenerated responsively, held to freshness
  windows and a secret scan. Production captures at app commit 38bc2a0e, plus
  controlled fixture recordings that never pass as production. The
  [Visual product atlas](/docs-stampdex/product-atlas/) indexes all of it.
- Interactive explainers generated from machine truth: the order-state explorer
  reads the application's OrderStatus enum, the wallet capability explorer reads
  the application's capability source, and the fee explorer computes from the
  released fee snapshot. Learning paths, a custody explorer, and a transaction
  anatomy explorer complete the set.
- An API developer hub: the public OpenAPI 3.1 document generated in the
  application repository, snapshotted here, rendered by a self-hosted Scalar
  reference, downloadable, and discoverable at /.well-known/api-catalog.
- Machine and agent access: llms-full.txt, a Markdown representation of every
  page with view and copy actions, a JSON page index, and the read-only
  stampdex-docs-mcp server with contract tests.
- Release truth: the header compares production against the commit these pages
  describe, pull request previews publish isolated and noindexed, and high-risk
  pages past their review window now fail the build instead of passing quietly.
---

Dates are the dates the change was verified against the product, not the dates it was
written.

## 2026-09-01

The documentation was rebuilt as a static site with local search, and re-grounded
against the Bitcoin Universe ecosystem capability registry rather than against product
copy alone.

New pages, each answering a question the previous set did not:

- [What you can and cannot do](/docs-stampdex/capabilities/) and the
  [capability matrix](/docs-stampdex/reference/capability-matrix/), generated from the
  registry so a supported or unsupported action cannot drift from the platform record.
- [Where your funds are](/docs-stampdex/concepts/custody/), with a custody ledger
  drawn stage by stage for both protocols.
- [Change a listing price](/docs-stampdex/guides/change-a-listing-price/), because
  `update-listing` is recorded as unsupported and the reason matters.
- [Offers](/docs-stampdex/concepts/offers/), which says plainly that an offers surface
  existing is not the same as offers being a released way to trade.
- [Release evidence](/docs-stampdex/project/release-evidence/), which states which
  actions have recorded mainnet evidence and which do not.
- [Recovery](/docs-stampdex/concepts/recovery/),
  [Settlement lifecycle](/docs-stampdex/concepts/settlement-lifecycle/),
  [Order states](/docs-stampdex/reference/order-states/),
  [Unknown is not zero](/docs-stampdex/concepts/unknown-is-not-zero/),
  [Deployment identity](/docs-stampdex/concepts/deployment-identity/),
  [Review a PSBT before signing](/docs-stampdex/guides/psbt-review/),
  [Rate limits](/docs-stampdex/api/rate-limits/),
  [Status and version](/docs-stampdex/api/status/), and
  [Worked examples](/docs-stampdex/api/examples/).

Corrections to what was previously published here:

- Settlement waits for **two** confirmations, not one. The earlier pages implied one.
- The service fee is 1.5% **per side**, so a trade carries **3% in total**. That total
  was previously left for the reader to compute, and the 500 sat per-side minimum
  reaches 50% of a trade at the 2,000 sat listing floor. See
  [Fees](/docs-stampdex/reference/fees/).
- Order states now carry their API values, such as `awaiting_tx3` and
  `awaiting_tx3_confirmation`, alongside the friendly names.
- The deployment gate has seven states, not five. `unknown` and `unavailable` were
  already distinguished; `loading`, `replace`, and `mismatch` are now named too.
- Cross-origin browser access to the JSON API is allow-listed, not open. The earlier
  API pages did not say so, which would have cost a developer an afternoon.

## 2026-08-30, third release

- Asset identity: a token page now has an address that names its deployment,
  `/trade/src20/<ticker>/<deploy transaction>`. That is what Copy link gives you and
  what a market row opens, so a link cannot open a different token for whoever
  receives it.
- Asset identity: the shorter `/trade/src20/<ticker>` still works and now resolves
  before it shows a market. One deployment moves you to the longer link. More than one
  shows you each deployment and asks. A ticker with no deployment says so. An index
  that did not answer says that instead, which is a different thing. Only the first
  opens a market.
- Search: a 64 character transaction id now offers the SRC-20 deployment alongside the
  stamp, and picks neither for you.
- Wallets: the [wallet page](/docs-stampdex/reference/wallets/) now carries a table of
  what each wallet can actually do here, generated from the code that talks to it. OKX
  Wallet no longer appears to support listing, cancelling, or minting, because it does
  not.
- Wallets: Leather is supported for connecting and signing. StampDEX shows your Stamps
  and SRC-20 and Leather signs for them; Leather does not display those assets itself.
- Wallets: an Xverse session now ends when you switch accounts inside the wallet,
  instead of carrying on with the address you left.
- Market board: a token nobody has priced no longer sorts as though its price were
  zero, and a price range filter no longer returns it as a match. On 2026-08-28, 258 of
  500 rows had no price from any source.

## 2026-08-30, second release

- Asset identity: the market board and every search result now print the deployment
  transaction behind a ticker, in a column that used to hold three scores named
  Liquidity, Momentum, and Risk. Those scores came from a formula StampDEX never
  published and counted a missing reading as a zero, so they are gone.
- Search: two deployments that share a ticker no longer collapse into one result. Both
  appear, each with its own deployment transaction.
- Search: a result with no volume reading says unknown instead of 0, and a result with
  no listing reading no longer shows a Listed badge.
- Address holdings: `/address/<address>` shows what any Bitcoin address holds, read
  from the public index, with no wallet connection. The older `/shelf/<address>` links
  open the same page.
- Removed: the daily games, the pack-opening and battle hub, and the points, streaks,
  badges, and confetti that went with them. StampDEX is a market, and a market this
  thin cannot afford invented activity.

## 2026-08-30

- Buying: the buy panel says where your BTC goes before you sign, not only after
  settlement, and it says so whether or not you use the review step.
- Market data: a missing reading now prints a double dash that a screen reader
  announces as Unknown, and a real zero prints as 0. The source map decides which one
  you see.
- Market data: totals name their coverage, so a volume figure cannot be read as
  covering the whole board.

## 2026-08-28

First release of this documentation. Every page was verified against the StampDEX
repository and the live production site and API on this date. Screenshots were captured
from production the same day.

Covers: the market and token terminal, the stamps explorer, buying and selling SRC-20,
collecting stamps, orders and settlement, fees, wallets, safety, data sources, the
portfolio, troubleshooting, and the read API.
