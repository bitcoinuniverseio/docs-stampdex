---
title: Glossary
description: "Plain-word meanings for the terms StampDEX uses, from CPID and dispenser to the per-listing escrow addresses and the signature type a listing is signed with."
source:
  path: product vocabulary across the marketplace and stamps modules
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

**Anchor UTXO.** The small marker output a seller's listing spends and returns. 548
sats. StampDEX builds one when your wallet has none.

**Bitcoin Stamps.** Artwork stored directly in Bitcoin transactions. The image bytes
live on the chain itself, so the artwork exists as long as Bitcoin does.

**Confirmation.** A transaction included in a block. Each further block is another
confirmation. StampDEX settles an SRC-20 order at two.

**CPID.** The Counterparty asset id of a stamp. Stamps are issued as Counterparty
assets, and this id is part of a stamp's identity.

**Deployment.** The transaction that created an SRC-20 token: its rules, max supply,
and mint limit. The deployment transaction hash identifies the token.

**Dispenser.** A Counterparty vending contract. Send it the asking BTC and it dispenses
the asset. Closing one has a protocol cooldown before the asset returns.

**Dust output.** A small output that carries structure rather than value. SRC-20 data
chunks are 330 sats each; the seller anchor is 548.

**Escrow addresses.** Addresses created for one listing that hold the tokens and the
buyer's payment during an SRC-20 trade. StampDEX controls their keys, server side and
encrypted, for the length of that trade.

**Execution mode.** How a trade is executed. `external-execution` means the trade runs
at StampDEX rather than inside another Bitcoin Universe product.

**Fee rate.** What a transaction pays the Bitcoin network per virtual byte, in sat/vB.
It goes to miners, not to StampDEX.

**Floor.** The lowest live listing price. When no listing exists there is no floor, and
StampDEX says so instead of showing 0.

**Index.** The service that reads the Bitcoin chain and answers questions like who
holds what. See [Data provenance](/docs-stampdex/concepts/data-provenance/).

**Mint progress.** How much of a token's max supply has been minted, as a percentage.
At 100 percent, minting is over.

**One-time action challenge.** A short message your wallet signs before a mutation. It
names the action, your address, and a hash of the exact request, expires in five
minutes, and works exactly once.

**PSBT.** A partially signed Bitcoin transaction. StampDEX builds it; your wallet
reviews and signs it. Nothing moves without your signature.

**Reorg.** A chain reorganisation, in which a block that was part of the chain is
replaced. StampDEX re-checks trades settled in the last 24 hours against it.

**Sat, sats.** The smallest Bitcoin unit. 100,000,000 sats equal 1 BTC. Listing prices
here are quoted in sats per token.

**Service fee.** StampDEX's own fee: 1.5% per side of an SRC-20 trade with a 500 sat
minimum per side, or a flat 1,500 sats on a mint, deploy, or transfer. See
[Fees](/docs-stampdex/reference/fees/).

**SIGHASH_ALL | ANYONECANPAY.** The signature type a seller uses on their listing
input. It commits to that one input and to all the outputs, which is why a listing can
sit on the book without locking the rest of the seller's wallet.

**Source map.** The object beside every market row naming where each figure came from:
`stampchain`, `stampdex`, or `none`.

**SRC-20.** A token standard built on Bitcoin Stamps. Deploys, mints, and transfers are
stamp transactions the index reads.

**SRC-101.** A name standard in the same family, used for on-chain domain names.

**Ticker.** The short name of an SRC-20 token, such as KEVIN. A ticker is not an
identity. See [Asset identity](/docs-stampdex/concepts/asset-identity/).

**Unavailable.** We could not ask the source. Different from unknown.

**Unknown.** The source had no answer. Never rendered as 0.

**UTXO.** An unspent output, the unit of Bitcoin ownership a transaction spends.
