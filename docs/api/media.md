# Media endpoints

Stamp artwork and token logos. These routes serve bytes, not JSON, and do
not count against the API rate limit.

| Method | Path | Serves |
| --- | --- | --- |
| GET | `/api/v1/stamps/assets/:file` | Raw stamp bytes by `<txhash>.<ext>`. Content addressed, so cached for a year as immutable |
| GET | `/api/v1/stamps/:id/preview` | A rendered preview. `?w=160`, `?w=320`, or `?w=640` returns a bounded WebP thumbnail; without `w` you get the original bytes |
| GET | `/api/v1/src20/logo/:tick` | The token logo, resolved once on the server. 404 when no source has one |

## Example

```bash
curl -o kevin-thumb.webp "https://stamp.api.bitcoinuniverse.io/api/v1/stamps/1472320/preview?w=320"
```

## Caching behavior

- Raw assets are content addressed and answer
  `Cache-Control: public, max-age=31536000, immutable`. Cache them forever.
- Previews answer `Cache-Control: public, max-age=86400,
  stale-while-revalidate=604800` and honor `If-None-Match` with 304.
- Every media response carries `Server-Timing: media-cache;desc=hit|miss`
  so you can see whether the server cache answered.

## Why thumbnails matter

Original stamp previews from the index run 60 KB to 900 KB. The `?w=`
WebP thumbnails run 3 KB to 40 KB. Use thumbnails in grids and lists, and
the original only in a focused view.
