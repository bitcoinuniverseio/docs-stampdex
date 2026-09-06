---
title: Release evidence
description: How StampDEX records what has been verified, what its release registry said at the last recorded snapshot, and what that means for anything you are about to trade.
source:
  repo: bitcoinuniverseio/stampdex release registry, and bitcoinuniverseio/core for the capability registry
  path: release registry and verifier, GET /api/version
  release: snapshot recorded 2026-08-31
  verified: "2026-09-01"
contentType: reference
audiences: [traders, collectors, developers]
products: [src20, stamps]
protocols: [src20, stamps, bitcoin]
difficulty: intro
estimatedMinutes: 5
lifecycle: stable
releaseStatus: preview
lastReviewedBy: docs-stampdex maintainers
---

## 2026-09-06: implementation program candidate

**Local candidate, 6 September 2026. NO-GO. Not deployed.** These source changes have no real-wallet, native-network or browser acceptance witness. Earlier captures do not verify this candidate.

Evidence format stampdex-stage-v2 computes comparisons against hash-checked raw JSON and binds stage-relevant operation, asset, actor, source and network identities. Wallet transactions, authenticated publications, anonymous reads and service jobs have different required stages. An anonymous API read does not invent a wallet signature. Old v1 evidence needs revalidation when it lacks these checks.

Selected unit and isolated MySQL checks cover invoice crash recovery, outbox leases, public launch filtering and stable market snapshots. Invoice settlement does not prove lease delivery or seller payment. Mandatory native contracts, inventory, wallet, mobile, accessibility and performance obligations remain open. Quality runs browser jobs, so the no-UI-CI boundary prevents PR integration. No deployment occurred.

## 2026-09-06: the GO verdict is withdrawn

**LOCAL UNRELEASED · FUNCTIONAL NO-GO.** The 2026-09-05 registry page that read
GO with 123 passing rows is withdrawn. Its verifier compared the registry with
itself, so it could not see the endpoints, routes, views, and protocol flags the
rows omitted, and it accepted one sentence reused across nine journey stages as
proof of a Signet transaction. Those ledgers are kept for audit and rejected by
the repaired verifier.

The repaired gate counts every declared surface, keeps one row per review-owned
operation (224 `SDX-` rows), and one variant per wallet per action. It reports
five outcomes: `PASS`, `FAIL`, `BLOCKED`, `NOT TESTED`, and
`NOT_APPLICABLE`, with the network as a separate field. A PASS proven on Signet
reads `PASS - SIGNET` and needs no mainnet run. A production read never turns a
row green. A journey needs typed stage records with a transaction id, the node's
broadcast answer, an authoritative confirmation, and protocol recognition.

Sample data was removed from the executable paths: protocol adapters answer only
from a configured authority, OP_NET lists no seeded contracts, tokens, or pools,
and the OP_NET pages say so. Lightning Direct seller offers are stored against the
saved request with a node-signed proof and a HODL invoice from the configured LND
node; without that node nothing can be offered or settled. Leather is now part of
the wallet network check, and its network read is marked not tested.

No native authority, Signet wallet, or Lightning node is configured where this
work ran. Every row that needs one stays BLOCKED or NOT TESTED. Nothing was
deployed.

## 2026-09-05: local, unreleased repairs

**LOCAL UNRELEASED · NO-GO.** These local changes repair only part of the execution
paths. They have not been deployed. Native protocol authorization, transaction
builders, persistence, recovery, and end-to-end evidence remain incomplete. Passing
focused tests does not verify a trading journey.

OPNet now reads configured native RPC observations and binds offline binary state
to stored intents. Swap uses the existing Atomic quote and purchase path with wallet
network checks. TAP reads paginated indexer journal updates. Maker RFQ publication
stores authorized terms and cancellation records; it does not reserve funds or
execute a trade. Native signing fixtures, isolated database tests, and local browser
checks cover parts of these paths. Live protocol execution remains unverified.

The local release verifier binds evidence to the tested source, specific workflow,
test command, environment, and network. It requires valid timestamps, kind-specific
freshness limits, and retained result files whose contents can be checked. Evidence
reuse across merge commits requires an explicit source-tree equivalence check.
Inverse checks also compare routes, product views, controller endpoints, adapters,
and protocol operations against the registry and reject unregistered entry points.

The Spark view now requests pools, wallet positions, quotes, operator checkpoints,
and exit previews through the existing API. Request failures show errors instead of
invented data or empty success results. An exit preview does not sign or submit a
transaction. A stored checkpoint does not prove current finality.

Wallet proof now protects Spark positions and exit previews. Universal Markets reads
indexed SRC-20 deployments and stored atomic listings with identity-bound pagination;
missing metrics remain unknown. Isolated MySQL tests cover shared lock contention,
quote replay, rollback after an outbox failure, and datasource restart. These checks
do not prove native protocol execution or a deployed release.

The 2026-08-31 counts and action table below are historical records. **They do not
prove that the current source or deployed version passes verification.**


This page exists because "it is on the site" and "it has been verified" are different
claims, and you deserve to know which one applies to the thing you are about to do.

## What counts as a version

There is no version number in the application's package files that means anything.
Release identity is two things:

1. **Date-based git tags**, in the form `v2026.08.31.1`.
2. **The runtime answer** from `GET /api/version`: the application version, the release
   id, the git commit, the runtime, the build timestamp, and a hash of the dependency
   lockfile.

The second is the one to quote, because it is what is actually answering you right now.
See [Status and version](/docs-stampdex/api/status/).

## How verification is recorded

The application repository holds a release capability registry: one row per user job,
each naming the evidence that job depends on. Two things about it are worth knowing:

- **Rows carry no self-declared status.** A verifier derives one, from the evidence.
- **There are exactly five derived outcomes:** `PASS`, `FAIL`, `BLOCKED`,
  `NOT TESTED`, and `NOT_APPLICABLE`, with the network recorded beside them.
  There is deliberately no "partial", no "beta", and no "planned". A row either
  has its evidence or it does not.

`BLOCKED` means required evidence is missing. It does not mean a defect was found.
Those are different things, and this page will not blur them.

## Historical snapshot: 2026-08-31

Recorded 2026-08-31, across 51 rows:

| Outcome | Rows |
| --- | --- |
| PASS | 27 |
| NOT_APPLICABLE | 3 |
| BLOCKED | 21 |
| **Recorded decision** | **NO-GO** |

Evidence that was recorded and passing at that snapshot included the backend test
suite, the frontend test suite, an end-to-end browser suite across desktop and mobile,
a route check confirming every route renders exactly one top-level heading, an
automated accessibility audit against WCAG 2.1 A and AA, and a production smoke run.

Evidence that was **not recorded** included controlled mainnet canary runs for SRC-20
mutations and for stamp mutations, live runs of each wallet extension through each
action it claims, a regtest chain exercise, a screen reader pass, and first-party data
provenance.

## Historical action evidence: 2026-08-31

| What you are doing | Evidence position |
| --- | --- |
| Browsing markets, tokens, stamps, collections, activity | Verified and passing |
| Reading the API | Verified and passing |
| Buying or transferring SRC-20 | Implemented, unit and integration tested, deployed. No controlled mainnet canary recorded |
| Buying a stamp, opening or closing a dispenser, sending a stamp | Implemented, unit tested, deployed. No controlled mainnet canary recorded |
| Anything in the stamp offer lifecycle | Implemented. No canary recorded, and the ecosystem registry records offers as an unsupported marketplace action. See [Offers](/docs-stampdex/concepts/offers/) |
| Relying on automatic reorg reversal | Implemented and unit tested. Not exercised end to end against a real reorg |
| Using a wallet marked "Not tested" on the [wallets page](/docs-stampdex/reference/wallets/) | StampDEX can ask that wallet for the action and nobody has run it |

None of that says an action will fail. It says nobody has recorded proof that it
succeeded on mainnet under controlled conditions. Trade accordingly, and start small
with anything in the lower half of that table.

## What is deliberately not implemented

- **An atomic swap for SRC-20.** The listing flow is a three-transaction escrow with a
  server-held intermediate key. See
  [Where your funds are](/docs-stampdex/concepts/custody/).
- **An in-place listing price update.** See
  [Change a listing price](/docs-stampdex/guides/change-a-listing-price/).
- **A local reorg rollback worker at the Universe layer.** The ecosystem registry
  records `reconcile` as unsupported for both protocols.

## What is switched off

Two gallery surfaces ship behind build flags and are off by default. A feature you
cannot see is not a feature you have.

## Where the platform record lives

Independently of the application's own registry, the Bitcoin Universe ecosystem
capability registry records which marketplace actions are supported and, for each one
that is not, the reason. That record is the authority on what counts as a supported way
to trade. See [What you can and cannot do](/docs-stampdex/capabilities/).

## Related

- [Status and version](/docs-stampdex/api/status/)
- [Changelog](/docs-stampdex/project/changelog/)
- [Safety and trust](/docs-stampdex/safety/)
