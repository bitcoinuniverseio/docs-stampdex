---
title: Offers
description: What the ecosystem registry records about offer support on StampDEX, and why an offers surface existing is not the same as offers being a released way to trade.
source:
  repo: bitcoinuniverseio/core registry, with the application surface checked in bitcoinuniverseio/stampdex
  path: MARKETPLACE_PROTOCOL_REGISTRY offer actions, stamp-offers module, release registry
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

This page exists because the honest answer is more complicated than yes or no, and the
complicated version is the one that protects you.

## What the registry records

| Action | Bitcoin Stamps | SRC-20 |
| --- | --- | --- |
| `make-offer` | Not supported | Not supported |
| `accept-offer` | Not supported | Not supported |
| `cancel-offer` | Not supported | **Supported** |
| `sell` | Not supported | Not supported |

The recorded reason, for every one of those unsupported entries, is that the protocol
has no executable offer workflow on this marketplace surface.

`cancel-offer` being supported for SRC-20 while `make-offer` is not looks strange, and
it is worth stating plainly rather than smoothing over: the registry records the ability
to withdraw, not the ability to place.

## What exists in the product

StampDEX does carry an offers surface for stamps, with its own states and two
settlement modes: a broad demand signal that is explicitly not settleable, and a
targeted swap where the buyer pre-signs and the seller signs only their own stamp input.
That second mode holds no escrow at all.

None of that changes the answer above. Code presence is not released capability. The
platform registry is what records whether an action is a supported way to trade, and it
records these as unsupported.

Independently, the application's own release evidence records no controlled mainnet run
for the stamp offer lifecycle. See
[Release evidence](/docs-stampdex/project/release-evidence/).

## What this means for you

- **Do not plan a trade around making or accepting an offer.** Use listings.
- If you meet an offers screen, treat it as a surface under development rather than a
  released route to settlement.
- The supported ways to trade are: list, unlist, and buy, on both protocols. See
  [What you can and cannot do](/docs-stampdex/capabilities/).

## Related

- [What you can and cannot do](/docs-stampdex/capabilities/)
- [Release evidence](/docs-stampdex/project/release-evidence/)
- [Collect Bitcoin Stamps](/docs-stampdex/guides/collect-stamps/)
