---
title: Status and version
description: "The StampDEX health, version, index freshness, and per-transaction truth endpoints, what every field means, and how to check which commit is serving you."
source:
  path: health controller, version controller, indexer truth service
  verified: "2026-09-01"
---

These endpoints exist so you never have to take a claim about StampDEX on trust.

## Which commit is serving you

```bash
curl https://stamp.api.bitcoinuniverse.io/api/version
```

Returns the application version, the release id, the git commit, the runtime, the build
timestamp, and a hash of the dependency lockfile. A value that could not be recorded
reads as the literal string `unrecorded` rather than being omitted or faked.

Release identifiers are date based, in the form `v2026.08.31.1`, and the runtime
release id combines a build timestamp with a short commit.

This is the answer to "what version is this documentation about". See
[Release evidence](/docs-stampdex/project/release-evidence/).

## Is it up

| Path | Answers |
| --- | --- |
| `/api/live` | Whether the process is alive |
| `/api/health` | Whether it is ready to serve, including the database. HTTP 503 when it is not |
| `/api/health/deep` | A fuller diagnostic including upstream sources. Rate limited |

Health payloads carry a schema version, the kind of probe, an `ok` boolean, a
machine-readable status, and named checks. They are always sent with `Cache-Control:
no-store`, so what you read is now, not a cached now.

## How fresh is the index

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status
```

| Field | What it says |
| --- | --- |
| `generatedAt` | When this answer was produced |
| `status` | The overall verdict |
| `mempool` | Whether the Bitcoin source is reachable, its tip height, and its name |
| `stampchain` | Whether the index is reachable, its last block, its lag in blocks, a freshness word, its source, its operator, and the per-kind sources |
| `backend` | Whether the application itself is healthy |
| `summary` | The same answer in a plain sentence, naming the source |

Status values are `ok`, `stale`, `delayed`, `pending`, `missing`, and `error`.
Freshness thresholds are in [Freshness](/docs-stampdex/concepts/freshness/).

`operator` reads `universe` only when every stamp source is a Universe host. Otherwise
it reads `external`, which is what it reads today.

## Where is one transaction

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/tx/TXID
```

Traces one transaction through five steps: `signed`, `broadcast`, `mempool`,
`confirmed`, `indexed`. Each carries a status, whether it is done, a detail string, a
block height where relevant, and a timestamp.

The order version answers the same shape for a whole order:

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/orders/ORDER_ID
```

This is the endpoint to use when an order feels stuck. It says which of the five steps
has actually happened. See [Recovery](/docs-stampdex/concepts/recovery/).

## Related

- [Freshness](/docs-stampdex/concepts/freshness/)
- [Data provenance](/docs-stampdex/concepts/data-provenance/)
- [Release evidence](/docs-stampdex/project/release-evidence/)
