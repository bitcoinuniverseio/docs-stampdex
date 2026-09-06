# Execution and recovery, 6 September 2026

**Native readiness remains NO-GO.** The previous GO report remains withdrawn.
The later consolidation request authorizes CI and deployment. Application commit
`3e1a9f5cdcb98c40940049fadaed5d1934386b28` passes 1,907 backend unit tests,
45 API integration tests, 393 frontend unit tests and 173 browser tests.
Those checks do not establish real-wallet settlement or native protocol coverage.

| Flow | Behavior in the candidate | Evidence still needed |
| --- | --- | --- |
| Lightning Direct | A saved operation owns one invoice hash. Preparing, held, confirming, invoice settled, canceled and recovery required remain distinct. Refresh reads the saved offer. | Real LND and wallet execution; lease delivery, seller receipt and private-channel proof |
| Market launches | Public campaigns appear in launch discovery and open the existing campaign page. Unknown inventory stays unavailable. | Browser navigation and native participation |
| Market pages | A page cursor keeps the same network, filters and snapshot. Expiry asks the user to restart with the same filters. Unknown metrics remain unknown. | Local endpoint and browser measurements |
| SRC-20 orders | One execution summary separates payment, token transfer and delivery. A recorded payment remains attached during recovery. Each batch lot retains its own result. | Real payment, buyer holding and seller receipt through the existing engine |
| Seller preparation | The review keeps its exact deployment. Signing stays blocked while first-party classification cannot verify every selected input. | Inscription, Runes and other native-asset protection; each offered wallet |
| Pro terminal | The route keeps the selected asset identity and shows the missing candles/depth source. It does not display generated feeds as a real market. | A qualified native data contract and browser readback |
| Wallets | Provider signing, wallet display, input protection and completed StampDEX actions have separate evidence. | The inherited 351 wallet variants |

After a payment or uncertain submission, reopen the saved order or offer. Read its
status before retrying. A lost response does not prove payment failure. Do not start
a new purchase to resolve an existing payment. A canceled invoice does not prove a
refund of a settled invoice. An operator invoice settling does not prove the seller
was paid or the lease was delivered.

The qualified identity includes chain, network, protocol and deployment. A ticker
alone cannot identify a listing. Old rows with missing identity or receipt evidence
remain unresolved; a historical Filled label does not create current proof.

Local unit and isolated MySQL checks cover selected comparisons, crash boundaries,
leases, filtering and paging. They are not real-wallet or native-network journeys.
The browser suite includes automated layout and accessibility checks. Full native
protocol, inventory, manual accessibility and performance obligations remain open. The registry, seed rows,
unbound declarations and wallet variants overlap and must not be added together.

The application status report and per-step acceptance ledger retain the source
revision and test results. Native transactions still need their own evidence.
The `pages` workflow publishes a checked artifact after an explicit dispatch on
`main`. PR previews are downloadable workflow artifacts. The publication history
remains in Git; publishing no longer needs a `gh-pages` branch.

Read the existing [order lifecycle](https://bitcoinuniverseio.github.io/docs-stampdex/concepts/order-lifecycle/),
[wallet reference](https://bitcoinuniverseio.github.io/docs-stampdex/reference/wallets/),
and [orders API](https://bitcoinuniverseio.github.io/docs-stampdex/api/orders/) with this candidate status in mind.
