/**
 * Site-level navigation and release state shared by the header, the mobile
 * menus, and the footer. One list, so the desktop header, the mobile section
 * menu, and the page-tree menu can never disagree about destinations.
 */
export interface SectionLink {
  label: string;
  href: string;
}

export const SECTION_LINKS: SectionLink[] = [
  { label: 'Learn', href: '/docs-stampdex/start-here/' },
  { label: 'Trade', href: '/docs-stampdex/guides/buy-src20/' },
  { label: 'Collect', href: '/docs-stampdex/guides/collect-stamps/' },
  { label: 'Protocols', href: '/docs-stampdex/concepts/bitcoin-stamps/' },
  { label: 'API', href: '/docs-stampdex/api/quickstart/' },
  { label: 'Safety', href: '/docs-stampdex/safety/' },
  { label: 'Changelog', href: '/docs-stampdex/project/changelog/' },
];

export const STAMPDEX_URL = 'https://stampdex.fun';
export const RELEASE_EVIDENCE_URL = '/docs-stampdex/project/release-evidence/';

export const RELEASE = {
  releaseId: '20260831T185153Z-38bc2a0e',
  shortCommit: '38bc2a0e',
  applicationVersion: '0.0.1',
  versionEndpoint: 'https://stamp.api.bitcoinuniverse.io/api/version',
  evidenceHref: RELEASE_EVIDENCE_URL,
};
