---
title: API 调用示例
description: 使用 curl、TypeScript 与 Python 调用 StampDEX 公开接口的实用示例。
source:
  path: public read routes across market, stamps, orders, indexer
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
> **简体中文官方文档**：所有示例均使用公开只读接口，演示如何查询代币行情、订单簿状态与历史成交。 核心交易规则为非托管模式，买卖双方按标准费率收取服务费，并于比特币主网进行原子结算。



Every command here is a public read. None of them need a key, an account, or a
signature, and none of them can move anything.

## Find the cheapest listing for a token

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/orders?tick=KEVIN&status=open&limit=1"
```

The open book is sorted by unit price ascending, so the first row is the floor you could
actually fill. Expect `{ "data": [ ... ], "total": n }`. An empty `data` array means
nothing is listed, which is different from a floor of zero.

## Compare the order book floor with the index price

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/market/tokens/KEVIN"
```

Read `floor_price` together with `sources.price`. If `sources.price` is `stampdex`, the
floor is a listing you can fill here. If it is `stampchain`, it is a price read from the
index with no order behind it on this venue. If it is `none`, there is no price at all
and the field is unknown.

## Check whether a ticker is ambiguous before you trade

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/market/deployments/KEVIN"
```

Look at `resolution`. Only `single` means the ticker maps to one token. `ambiguous`
means two or more deployments claim it and you must choose. `unknown` means nobody
deployed it. `unavailable` means the index did not answer, which is not the same as
nobody deploying it.

## Turn a transaction id into a token

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/market/deployments/tx/23765f9bc6b87e078b1f93ed213f90b9004998336575f726e46f34ddbea5e5f3"
```

Expect `found` and a `deployment`. Anything that is not 64 hex characters returns HTTP
400 rather than an empty search.

## Read what an address holds

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/wallet/ADDRESS/portfolio"
```

Public chain and marketplace data for any Bitcoin address. No wallet connection is
involved, and nothing here tells you who controls that address.

## Fetch several stamps in one call

```bash frame=none
curl -s -X POST "https://stamp.api.bitcoinuniverse.io/api/v1/stamps/details" \
  -H "Content-Type: application/json" \
  -d '{"stampIds": [1472320, 1472321, 1472322]}'
```

Up to 24 ids per call. More than that returns HTTP 400; batch larger sets into more
calls. This route has its own, more generous rate limit.

## Find the cheapest way to buy a stamp

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/stamps/1472320/best-dispenser"
```

The cheapest open dispenser with stock remaining. Read `sourceAvailable` alongside the
dispenser: a null dispenser with `sourceAvailable: false` means the question could not
be asked, not that there is nothing for sale.

## Get a thumbnail rather than the full artwork

```bash frame=none
curl -s -o thumb.webp \
  "https://stamp.api.bitcoinuniverse.io/api/v1/stamps/1472320/preview?w=320"
```

Three to forty kilobytes instead of sixty to nine hundred. Media routes do not count
against the rate limit.

## Ask how far behind the index is

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status"
```

Read `stampchain.lagBlocks` and `summary`. Read `stampchain.operator` to see whether
the index is a Universe host or a third party. Today it is a third party, and the field
says so.

## Find out where one order actually is

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/indexer/orders/ORDER_ID"
```

Five steps, each with a status: signed, broadcast, mempool, confirmed, indexed. This is
the fastest way to see whether an order that feels stuck has actually stopped, and
where.

## Check which commit is serving you

```bash frame=none
curl -s "https://stamp.api.bitcoinuniverse.io/api/version"
```

The commit, the release id, and the build timestamp of the code answering your request.

## A polite polling loop

```bash frame=none
while true; do
  curl -s "https://stamp.api.bitcoinuniverse.io/api/v1/market/tokens?limit=100" \
    -H "Accept-Encoding: gzip" --compressed -o board.json
  sleep 60
done
```

Sixty seconds matches the server-side cache on that route, so polling faster returns the
same bytes and spends your rate budget for nothing. See
[Rate limits](/docs-stampdex/zh-cn/api/rate-limits/).

## Related

- [API quick start](/docs-stampdex/zh-cn/api/quickstart/)
- [Market endpoints](/docs-stampdex/zh-cn/api/market/)
- [Orders endpoints](/docs-stampdex/zh-cn/api/orders/)
