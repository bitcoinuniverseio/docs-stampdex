# Data sources

StampDEX names the source behind every number it shows. This page says
where each kind of data comes from, and how to check for yourself.

## The map

| Data | Source | Operated by |
| --- | --- | --- |
| Bitcoin chain data: UTXOs, fee rates, block height, transaction status, broadcast | Universe Bitcoin node API | Universe |
| Listings, orders, trades made on StampDEX | The StampDEX database | Universe |
| Stamps and SRC-20 index: deployments, supplies, holders, stamp metadata | stampchain.io | A third party |
| Collection and trait metadata | stampchain.io | A third party |
| Stamp artwork | stampchain.io, cached and thumbnailed by the StampDEX media cache | A third party, served through Universe |

## What the third-party dependence means

The Bitcoin Stamps index that StampDEX reads is stampchain.io, the index
run by the Bitcoin Stamps project. StampDEX does not hide this: market rows
carry a `sources` object naming the origin of each number, and the status
endpoint names the operator.

A Universe-operated Counterparty node is syncing now. Until it is ready and
a Universe stamps index runs on top of it, index reads stay on
stampchain.io. This page will change when that changes.

## Check it live

```bash
curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status
```

The answer names the mempool source, the stamp index source and its lag
behind the Bitcoin tip, the per-kind sources (index, collections, media),
and an `operator` field that reads `universe` only when every stamp source
is a Universe host. It also states the freshness in plain words.

## Freshness rules

- The status endpoint compares the index's last block against the Bitcoin
  tip and reports the lag in blocks.
- Market overview and ranking responses are cached 20 seconds; discovery
  picks 60 seconds.
- A value the source did not answer renders as unknown, never as 0 and
  never as a made-up number.
