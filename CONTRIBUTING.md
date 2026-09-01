# Contributing

Corrections and improvements are welcome. A wrong sentence about where somebody's money
is costs more than a missing one, so corrections are the most valuable contribution
here.

The reader-facing version of this page is
[Contributing](https://bitcoinuniverseio.github.io/docs-stampdex/project/contributing/).

## Getting set up

```bash
npm install
npm run dev
```

Before opening a pull request:

```bash
npm test              # runner policy, copy guard, manifest validation
npm run build         # builds the site and the search index
npm run check:links   # internal links and anchors across the built site
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/docs/` | Every page. Markdown, or MDX where a page uses a diagram component |
| `src/components/` | Diagrams, the provenance panel, and the registry-driven tables |
| `src/data/registry.json` | The ecosystem capability snapshot the capability tables are generated from |
| `src/styles/floor.css` | The palette and the four semantic colours |
| `public/screens/` | Real screenshots, converted from `assets/` by `scripts/make-screens.mjs` |
| `scripts/` | The copy guard, the link checker, the manifest validator, the runner policy |
| `schemas/` | The vendored documentation manifest schema |

## Writing rules

- Short, plain sentences. One idea per sentence.
- State facts you can verify against the live product, the public API, or the ecosystem
  capability registry. If you cannot verify a claim, do not write it.
- **Never use a long dash.** The copy guard fails the build on one.
- Say authoritative, owning, official, or the source of truth. One near synonym for
  those is banned in prose and the copy guard rejects it.
- No marketing vocabulary. `scripts/check-docs.mjs` holds the rejected list.
- Test every command before committing it, and say what to expect back.
- A missing value is unknown, not zero.

## Every page needs

```yaml
title: The page title
description: One sentence, used for search results and social previews.
source:
  path: what this page was checked against
  verified: "2026-09-01"
```

That `source` block renders as the **Source and verification** panel under the title. A
page without it is a page a reader cannot check.

Task guides additionally state: the intended reader, the goal, prerequisites, chain and
network, safety considerations, the exact steps, the expected result, how to verify,
common failure states, and a recovery path.

## The colour rule

Four colours carry meaning, and nothing else is coloured:

| Token | Meaning |
| --- | --- |
| `--sd-bid` | Held by the buyer, or delivered to the buyer |
| `--sd-ask` | Held by the seller, or delivered to the seller |
| `--sd-venue` | Held by StampDEX for the length of one trade |
| `--sd-chain` | Settled on Bitcoin, final |

A reader who learned the legend on one page should not have to relearn it on the next.

## Diagrams

Inline SVG, drawn from computed geometry rather than hand-placed coordinates, with a
title and a description that explain the mechanism rather than the shapes. Both themes
must be legible, and a wide diagram scrolls inside its own container rather than the
page.

## The grounding rule

Code presence is not released capability. A route existing is not production
availability. A parser existing is not wallet support. When the ecosystem capability
registry records an action as unsupported, quote the registry's own reason.

## What does not belong here

- Credentials, keys, internal host names, private ports, or operator procedure.
- Documentation for features that are not live.
- Fabricated screenshots. If no real capture exists, draw a diagram and describe the
  interface in words.

## Commits and pull requests

One idea per pull request. Say what changed and what you verified it against. If you
corrected a fact, say where the old version was wrong, because that belongs in the
changelog.
