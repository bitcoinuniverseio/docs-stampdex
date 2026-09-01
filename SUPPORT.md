# Support

## Read this first

Most questions are answered on the documentation site.

| Question | Page |
| --- | --- |
| Where is my money during a trade | [Where your funds are](https://bitcoinuniverseio.github.io/docs-stampdex/concepts/custody/) |
| My order says Failed | [Recovery](https://bitcoinuniverseio.github.io/docs-stampdex/concepts/recovery/) |
| My trade is slow | [Settlement lifecycle](https://bitcoinuniverseio.github.io/docs-stampdex/concepts/settlement-lifecycle/) |
| What does it cost | [Fees](https://bitcoinuniverseio.github.io/docs-stampdex/reference/fees/) |
| Why can I not change my listing price | [Change a listing price](https://bitcoinuniverseio.github.io/docs-stampdex/guides/change-a-listing-price/) |
| Why does my wallet not offer an action | [Wallets](https://bitcoinuniverseio.github.io/docs-stampdex/reference/wallets/) |
| Anything else | [Troubleshooting](https://bitcoinuniverseio.github.io/docs-stampdex/troubleshooting/) and the [FAQ](https://bitcoinuniverseio.github.io/docs-stampdex/faq/) |

## Where to ask

| What | Where |
| --- | --- |
| A mistake, a gap, or a broken link in the documentation | [Issues in this repository](https://github.com/bitcoinuniverseio/docs-stampdex/issues) |
| A bug in the product, or a stuck order | [Issues in the application repository](https://github.com/bitcoinuniverseio/stampdex/issues) |
| A suspected security problem | `legal@bitcoinuniverse.io`, never a public issue. See [SECURITY.md](SECURITY.md) |

## What to include for a stuck order

- The order id.
- The transaction ids the order page shows.
- What the order state said, and when.
- The output of:

  ```bash
  curl https://stamp.api.bitcoinuniverse.io/api/v1/indexer/orders/ORDER_ID
  ```

  That traces the order through signed, broadcast, mempool, confirmed, and indexed, and
  it usually says where the trade actually stopped.

**Never post a recovery phrase or a private key**, in an issue or anywhere else. No
support process needs one.

## Response

This is documentation for a live venue maintained by a small team. Security reports are
prioritised. Documentation corrections are welcome as pull requests and are usually
faster than issues.

## Status endpoints

| What | Where |
| --- | --- |
| Deployed commit | `https://stamp.api.bitcoinuniverse.io/api/version` |
| Index freshness | `https://stamp.api.bitcoinuniverse.io/api/v1/indexer/status` |
| Readiness | `https://stamp.api.bitcoinuniverse.io/api/health` |
