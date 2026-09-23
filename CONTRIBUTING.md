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

## 2026-09-16 local dependency repair

A scoped override under `@scalar/api-reference` pins `@ai-sdk/provider-utils` to 4.0.33. Its parent packages still pin the affected 4.0.5 release, including the latest Scalar agent-chat release reviewed for this change. This fixes [GHSA-866g-f22w-33x8](https://github.com/advisories/GHSA-866g-f22w-33x8), the resource-consumption advisory in JSON and error response handlers. The six affected audit entries came from this one advisory, not six independent exploits.

`npm run test:dependency-security` checks all three response handlers reject an oversized declared body before reading it, valid JSON remains compatible, and a chunked body respects a bounded byte limit. These tests form part of `npm test`. The upstream default cap remains 2 GiB; this repair does not claim a lower application-specific memory budget or demonstrated exploitability in this static documentation site. No AI request or remote model call runs in these tests.

After the override, npm audit reports zero advisories. Keep this override until the parent dependency resolves a patched version and repeat the checks before removal. This is a local candidate, not a published website update.

## Verification runtime and runner isolation

Use Node 24.19.0 and npm 11.17.0. The pinned Universe Node action restores or
installs the exact locked dependency graph; workflows do not run a second npm ci.
Pull requests from forks do not enter the self-hosted quality or preview jobs.
Run `node --test scripts/fork-isolation.test.mjs` to check both guards and the
manual-only publishing trigger. The publishing workflow remains opt-in.
