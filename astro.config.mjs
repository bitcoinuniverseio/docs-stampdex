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
      defaultLocale: 'root',
      locales: {
        root: {
          label: 'English',
          lang: 'en',
        },
        'zh-cn': {
          label: '简体中文',
          lang: 'zh-CN',
        },
      },
      tagline: 'The trading venue for Bitcoin Stamps and SRC-20.',
      favicon: '/favicon.svg',
      customCss: [
        './src/styles/tokens.css',
        './src/styles/shell.css',
        './src/styles/content.css',
        './src/styles/components.css',
        './src/styles/screenshots.css',
        './src/styles/api-reference.css',
        './src/styles/motion.css',
        './src/styles/print.css',
      ],
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
        Header: './src/components/brand/Header.astro',
        SiteTitle: './src/components/brand/SiteTitle.astro',
        PageFrame: './src/components/brand/PageFrame.astro',
        MobileMenuFooter: './src/components/brand/MobileMenuFooter.astro',
        Hero: './src/components/home/Hero.astro',
        Footer: './src/components/Footer.astro',
        PageTitle: './src/components/PageTitle.astro',
        Search: './src/components/search/Search.astro',
      },
      sidebar: [
        {
          label: 'Start',
          items: [
            { label: 'Start here', slug: 'start-here' },
            { label: 'What StampDEX is', slug: 'what-is-stampdex' },
            { label: 'What you can and cannot do', slug: 'capabilities' },
            { label: 'Learning paths', slug: 'tutorials/learning-paths' },
            { label: 'Visual product atlas', link: '/product-atlas/' },
          ],
        },
        {
          label: 'Tutorials',
          items: [
            { label: 'Buy SRC-20', slug: 'guides/buy-src20' },
            { label: 'Sell SRC-20', slug: 'guides/sell-src20' },
            { label: 'Collect Bitcoin Stamps', slug: 'guides/collect-stamps' },
            { label: 'Review a PSBT before signing', slug: 'guides/psbt-review' },
          ],
        },
        {
          label: 'How-to guides',
          items: [
            { label: 'Browse the market', slug: 'guides/browse-the-market' },
            { label: 'Token pages', slug: 'guides/token-pages' },
            { label: 'Collection pages', slug: 'guides/collection-pages' },
            { label: 'Your portfolio', slug: 'guides/portfolio' },
            { label: 'Cancel a listing', slug: 'guides/cancel-a-listing' },
            { label: 'Change a listing price', slug: 'guides/change-a-listing-price' },
            { label: 'List and unlist a stamp', slug: 'guides/list-a-stamp' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'Bitcoin Stamps', slug: 'concepts/bitcoin-stamps' },
            { label: 'SRC-20', slug: 'concepts/src20' },
            { label: 'Where your funds are', slug: 'concepts/custody' },
            { label: 'Order lifecycle', slug: 'concepts/order-lifecycle' },
            { label: 'Settlement lifecycle', slug: 'concepts/settlement-lifecycle' },
            { label: 'Offers', slug: 'concepts/offers' },
            { label: 'Asset identity', slug: 'concepts/asset-identity' },
            { label: 'Deployment identity', slug: 'concepts/deployment-identity' },
            { label: 'Market data', slug: 'concepts/market-data' },
            { label: 'Unknown is not zero', slug: 'concepts/unknown-is-not-zero' },
            { label: 'Data provenance', slug: 'concepts/data-provenance' },
            { label: 'Freshness', slug: 'concepts/freshness' },
          ],
        },
        {
          label: 'Safety and recovery',
          items: [
            { label: 'Safety and trust', slug: 'safety' },
            { label: 'Recovery', slug: 'concepts/recovery' },
            { label: 'Troubleshooting', slug: 'troubleshooting' },
            { label: 'FAQ', slug: 'faq' },
          ],
        },
        {
          label: 'API and developers',
          items: [
            { label: 'Quick start', slug: 'api/quickstart' },
            { label: 'Interactive reference', link: '/api/reference/' },
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
          label: 'Reference',
          items: [
            { label: 'Fees', slug: 'reference/fees' },
            { label: 'Wallets', slug: 'reference/wallets' },
            { label: 'Capability matrix', slug: 'reference/capability-matrix' },
            { label: 'Emerging markets & settlement', slug: 'reference/emerging-markets' },
            { label: 'Order states', slug: 'reference/order-states' },
            { label: 'Glossary', slug: 'reference/glossary' },
          ],
        },
        {
          label: 'Releases',
          items: [
            { label: 'Changelog', slug: 'project/changelog' },
            { label: 'Release evidence', slug: 'project/release-evidence' },
            { label: 'Page freshness', slug: 'project/page-freshness' },
          ],
        },
        {
          label: 'Contribute',
          items: [{ label: 'Contributing', slug: 'project/contributing' }],
        },
      ],
    }),
  ],
});
