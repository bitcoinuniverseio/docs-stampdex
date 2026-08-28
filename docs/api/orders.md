# Orders endpoints

Marketplace listings and their lifecycle. Base path: `/api/v1/orders`.

The read routes are open. The write routes build transactions your wallet
must sign; nothing moves without your signature. A mutation also proves
wallet ownership: request a challenge from `POST /api/v1/orders/challenges`
and send the signed answer in the `x-wallet-address`, `x-wallet-signature`,
`x-wallet-challenge-id`, and `x-wallet-challenge-nonce` headers.

| Method | Path | Does |
| --- | --- | --- |
| GET | `/` | List orders. Filters: `tick`, `status`, `walletAddress` |
| GET | `/:id` | One order in detail |
| POST | `/` | Create a listing |
| DELETE | `/:id` | Cancel a listing (needs the seller's signature) |
| POST | `/prepare-listing` | Build the listing PSBT and temporary addresses |
| POST | `/ensure-dust-utxo` | Build a dust UTXO PSBT when the seller has none |
| POST | `/:id/fill` | Start a buy |
| POST | `/:id/confirm-payment` | Confirm the BTC payment |
| POST | `/:id/release` | Release tokens after settlement |

## Example

```bash
curl "https://stamp.api.bitcoinuniverse.io/api/v1/orders?tick=SEX&status=open"
```

An open order looks like this (fields trimmed):

```json
{
  "id": "71933438-5fe7-424c-85cf-9ee52d22556d",
  "tick": "SEX",
  "amount": "10000",
  "priceSatsPerToken": "46",
  "totalPriceSats": "460000",
  "sellerAddress": "bc1q69m...",
  "status": "open"
}
```

`priceSatsPerToken * amount` always equals `totalPriceSats`. The API
refuses to serve a price the total contradicts.

## Order states

An order moves through preparing, open, filling, payment confirmation,
settlement, and then settled, cancelled, expired, or failed. The site shows
each state with what happened, where the BTC is, and what to do next; see
[Orders and settlement](../orders-and-settlement.md) for the user-level
walkthrough.
