# Freshness manifest

When each page was last verified, and what to recheck it against. A page
is stale when its related surface changes in the application repository.

| Page | Verified | Related surface | Recheck when |
| --- | --- | --- | --- |
| README | 2026-08-28 | The whole product | Any release |
| start-here | 2026-08-28 | Routes in `routeManifest.js` | A route changes |
| what-is-stampdex | 2026-08-28 | Product scope | Scope changes |
| buy-src20, sell-src20 | 2026-08-28 | `orders` module, trade flow | The order flow changes |
| collect-stamps | 2026-08-28 | `stamps` module, dispensers | Stamp trading changes |
| orders-and-settlement | 2026-08-28 | `OrderStatus` enum, settlement worker | A status or worker rule changes |
| fees | 2026-08-28 | `SERVICE_FEE_*` constants | Any fee constant changes |
| wallets | 2026-08-28 | `walletTypes.js`, desk embed contract | Wallet support changes |
| asset-identity | 2026-08-28 | Token and stamp detail pages | Identity fields change |
| market-data | 2026-08-28 | Market source labels | Source labeling changes |
| data-sources | 2026-08-28 | `STAMPCHAIN_BASE_URL`, indexer status | The index source moves |
| safety | 2026-08-28 | Escrow and signing flow | The trust model changes |
| portfolio | 2026-08-28 | Profile view | Portfolio surfaces change |
| troubleshooting, faq | 2026-08-28 | Throttle, settlement, media | Any of those change |
| glossary | 2026-08-28 | Product vocabulary | New terms appear |
| api/* | 2026-08-28 | `backend/API.md`, controllers | An endpoint changes |
| Screenshots in assets/ | 2026-08-28, from production | Live site | The UI changes visibly |
