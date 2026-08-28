# Glossary

Plain-word meanings for the terms StampDEX uses.

**Bitcoin Stamps.** Artwork stored directly in Bitcoin transactions. The
image bytes live on the chain itself, so the artwork exists as long as
Bitcoin does.

**SRC-20.** A token standard built on Bitcoin Stamps. Deploys, mints, and
transfers are stamp transactions the index reads.

**SRC-101.** A name standard in the same family, used for on-chain domain
names.

**Ticker.** The short name of an SRC-20 token, such as KEVIN. A ticker is
not an identity; see [Asset identity](asset-identity.md).

**Deployment.** The transaction that created an SRC-20 token: its rules,
max supply, and mint limit. The deployment transaction hash identifies the
token.

**Mint progress.** How much of a token's max supply has been minted, as a
percentage. At 100 percent, minting is over.

**CPID.** The Counterparty asset id of a stamp. Stamps are issued as
Counterparty assets; this id is part of a stamp's identity.

**Dispenser.** A Counterparty vending contract: send it the asking BTC and
it dispenses the asset. StampDEX shows a stamp's open and closed
dispensers.

**PSBT.** A partially signed Bitcoin transaction. StampDEX builds the
transaction; your wallet reviews and signs it. Nothing moves without your
signature.

**UTXO.** An unspent output, the unit of Bitcoin ownership a transaction
spends.

**Dust UTXO.** A small output some listing flows need as an input marker.
StampDEX builds one for you when your wallet has none.

**Escrow addresses.** Addresses created for one listing that hold the
tokens during the trade. See
[Orders and settlement](orders-and-settlement.md).

**Floor.** The lowest live listing price. When no listing exists there is
no floor, and StampDEX says so instead of showing 0.

**Sat, sats.** The smallest Bitcoin unit. 100,000,000 sats equal 1 BTC.
Listing prices on StampDEX are quoted in sats per token.

**Fee rate.** What a transaction pays the Bitcoin network per virtual
byte, in sat/vB. It goes to miners, not to StampDEX.

**Confirmation.** A transaction included in a block. Each further block is
another confirmation and makes reversal less likely.

**Index.** The service that reads the Bitcoin chain and answers questions
like who holds what. See [Data sources](data-sources.md) for which index
StampDEX reads.
