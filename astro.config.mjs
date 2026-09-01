// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const SITE = 'https://bitcoinuniverseio.github.io';
const BASE = '/docs-stampdex';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // The flat page names this documentation used before it became a site. Kept
  // so a link somebody saved still lands on the page that replaced it. The
  // same map is in docs.manifest.json for the central platform.
  redirects: {
    '/buy-src20/': '/docs-stampdex/guides/buy-src20/',
    '/sell-src20/': '/docs-stampdex/guides/sell-src20/',
    '/collect-stamps/': '/docs-stampdex/guides/collect-stamps/',
    '/portfolio/': '/docs-stampdex/guides/portfolio/',
    '/orders-and-settlement/': '/docs-stampdex/concepts/order-lifecycle/',
    '/asset-identity/': '/docs-stampdex/concepts/asset-identity/',
    '/market-data/': '/docs-stampdex/concepts/market-data/',
    '/data-sources/': '/docs-stampdex/concepts/data-provenance/',
    '/freshness/': '/docs-stampdex/concepts/freshness/',
    '/fees/': '/docs-stampdex/reference/fees/',
    '/wallets/': '/docs-stampdex/reference/wallets/',
    '/glossary/': '/docs-stampdex/reference/glossary/',
    '/changelog/': '/docs-stampdex/project/changelog/',
    '/contributing/': '/docs-stampdex/project/contributing/',
  },
  integrations: [
    starlight({
      title: 'StampDEX docs',
      description:
        'How the StampDEX trading venue for Bitcoin Stamps and SRC-20 works: order lifecycle, custody at every step, fees, settlement, and the public read API.',
      tagline: 'The trading venue for Bitcoin Stamps and SRC-20.',
      favicon: '/favicon.svg',
      customCss: ['./src/styles/floor.css'],
      lastUpdated: false,
      pagination: true,
      credits: false,
      editLink: {
        baseUrl: 'https://github.com/bitcoinuniverseio/docs-stampdex/edit/main/',
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/bitcoinuniverseio/docs-stampdex',
        },
      ],
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: `${SITE}${BASE}/og.png` },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: `${SITE}${BASE}/og.png` },
        },
        {
          tag: 'meta',
          attrs: { name: 'theme-color', content: '#0b0e13' },
        },
      ],
      components: {
        Footer: './src/components/Footer.astro',
        PageTitle: './src/components/PageTitle.astro',
      },
      sidebar: [
        {
          label: 'Start',
          items: [
            { label: 'Start here', slug: 'start-here' },
            { label: 'What StampDEX is', slug: 'what-is-stampdex' },
            { label: 'What you can and cannot do', slug: 'capabilities' },
            { label: 'Bitcoin Stamps', slug: 'concepts/bitcoin-stamps' },
            { label: 'SRC-20', slug: 'concepts/src20' },
          ],
        },
        {
          label: 'Browse',
          items: [
            { label: 'The market board', slug: 'guides/browse-the-market' },
            { label: 'Token pages', slug: 'guides/token-pages' },
            { label: 'Collection pages', slug: 'guides/collection-pages' },
            { label: 'Your portfolio', slug: 'guides/portfolio' },
          ],
        },
        {
          label: 'Trade',
          items: [
            { label: 'Buy SRC-20', slug: 'guides/buy-src20' },
            { label: 'Sell SRC-20', slug: 'guides/sell-src20' },
            { label: 'Cancel a listing', slug: 'guides/cancel-a-listing' },
            { label: 'Change a listing price', slug: 'guides/change-a-listing-price' },
            { label: 'Collect Bitcoin Stamps', slug: 'guides/collect-stamps' },
            { label: 'List and unlist a stamp', slug: 'guides/list-a-stamp' },
            { label: 'Review a PSBT before signing', slug: 'guides/psbt-review' },
          ],
        },
        {
          label: 'How settlement works',
          items: [
            { label: 'Where your funds are', slug: 'concepts/custody' },
            { label: 'Order lifecycle', slug: 'concepts/order-lifecycle' },
            { label: 'Settlement lifecycle', slug: 'concepts/settlement-lifecycle' },
            { label: 'Offers', slug: 'concepts/offers' },
            { label: 'Recovery', slug: 'concepts/recovery' },
          ],
        },
        {
          label: 'Identity and data',
          items: [
            { label: 'Asset identity', slug: 'concepts/asset-identity' },
            { label: 'Deployment identity', slug: 'concepts/deployment-identity' },
            { label: 'Market data', slug: 'concepts/market-data' },
            { label: 'Unknown is not zero', slug: 'concepts/unknown-is-not-zero' },
            { label: 'Data provenance', slug: 'concepts/data-provenance' },
            { label: 'Freshness', slug: 'concepts/freshness' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Fees', slug: 'reference/fees' },
            { label: 'Wallets', slug: 'reference/wallets' },
            { label: 'Capability matrix', slug: 'reference/capability-matrix' },
            { label: 'Order states', slug: 'reference/order-states' },
            { label: 'Glossary', slug: 'reference/glossary' },
          ],
        },
        {
          label: 'API',
          items: [
            { label: 'Quick start', slug: 'api/quickstart' },
            { label: 'Rate limits', slug: 'api/rate-limits' },
            { label: 'Market', slug: 'api/market' },
            { label: 'Stamps', slug: 'api/stamps' },
            { label: 'Orders', slug: 'api/orders' },
            { label: 'Media', slug: 'api/media' },
            { label: 'Status and version', slug: 'api/status' },
            { label: 'Worked examples', slug: 'api/examples' },
          ],
        },
        {
          label: 'Safety and support',
          items: [
            { label: 'Safety and trust', slug: 'safety' },
            { label: 'Troubleshooting', slug: 'troubleshooting' },
            { label: 'FAQ', slug: 'faq' },
          ],
        },
        {
          label: 'Project',
          items: [
            { label: 'Changelog', slug: 'project/changelog' },
            { label: 'Release evidence', slug: 'project/release-evidence' },
            { label: 'Page freshness', slug: 'project/page-freshness' },
            { label: 'Contributing', slug: 'project/contributing' },
          ],
        },
      ],
    }),
  ],
});
