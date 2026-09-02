import { readFileSync, writeFileSync } from 'node:fs';

const edits = [
  {
    file: 'src/content/docs/index.mdx',
    from: "import Shot from '../../components/Shot.astro';",
    to: "import ProductShot from '../../components/screens/ProductShot.astro';",
  },
  {
    file: 'src/content/docs/index.mdx',
    from: `<Shot
  src="home-dark-desktop.webp"
  width={1400}
  height={875}
  alt="The StampDEX market page in the dark theme: an SRC-20 token table with per-token source labels, floor prices, volume, and holders. Missing values show as dashes, not zeros."
  caption="The market board. Every row carries the deployment transaction that identifies the token, and a source label for each figure."
/>`,
    to: '<ProductShot id="market-desktop-dark" />',
  },
  {
    file: 'src/content/docs/index.mdx',
    from: `<Shot
  src="trade-dark-desktop.webp"
  width={1400}
  height={875}
  alt="A StampDEX SRC-20 token trading page in the dark theme, with the order book, the trade panel, and the deployment identity of the token."
  caption="A token page. The order book shows signed listings with amount, unit price, and total, and the deployment transaction names the token exactly."
/>`,
    to: '<ProductShot id="token-desktop-dark" />',
  },
  {
    file: 'src/content/docs/index.mdx',
    from: `<Shot
  src="home-dark-mobile.webp"
  width={640}
  height={1318}
  alt="The StampDEX market page on a phone in the dark theme, with the token table and bottom navigation."
  caption="The same venue on a phone."
/>`,
    to: '<ProductShot id="market-mobile-dark" />',
  },
  {
    file: 'src/content/docs/guides/browse-the-market.mdx',
    from: "import Shot from '../../components/Shot.astro';",
    to: "import ProductShot from '../../components/screens/ProductShot.astro';",
  },
  {
    file: 'src/content/docs/guides/browse-the-market.mdx',
    from: `<Shot
  src="home-light-desktop.webp"
  width={1400}
  height={875}
  alt="The StampDEX market board in the light theme: a table of SRC-20 tokens with columns for ticker, deployment transaction, floor, volume, holders, and mint progress. Several rows show a double dash where no source answered, rather than a zero."
  caption="The market board. The deployment transaction sits in its own column beside the ticker, and rows with no reading show a dash."
/>`,
    to: `<ProductShot
  id="market-desktop-light"
  alt="The StampDEX market board in the light theme: a table of SRC-20 tokens with columns for ticker, deployment transaction, floor, volume, holders, and mint progress. Several rows show a double dash where no source answered, rather than a zero."
  caption="The market board. The deployment transaction sits in its own column beside the ticker, and rows with no reading show a dash."
/>`,
  },
  {
    file: 'src/content/docs/guides/collection-pages.mdx',
    from: "import Shot from '../../components/Shot.astro';",
    to: "import ProductShot from '../../components/screens/ProductShot.astro';",
  },
  {
    file: 'src/content/docs/guides/collection-pages.mdx',
    from: `<Shot
  src="stamps-dark-desktop.webp"
  width={1400}
  height={875}
  alt="The Bitcoin Stamps collections page showing pixel-art collections in a grid, each with floor, volume, market cap, listed count, and holders. A collection with no floor shows a dash instead of a zero."
  caption="Collections, image first. A collection nobody has listed shows a dash where a floor would be."
/>`,
    to: `<ProductShot
  id="stamps-desktop-dark"
  alt="The Bitcoin Stamps collections page showing pixel-art collections in a grid, each with floor, volume, market cap, listed count, and holders. A collection with no floor shows a dash instead of a zero."
  caption="Collections, image first. A collection nobody has listed shows a dash where a floor would be."
/>`,
  },
  {
    file: 'src/content/docs/guides/token-pages.mdx',
    from: "import Shot from '../../components/Shot.astro';",
    to: "import ProductShot from '../../components/screens/ProductShot.astro';",
  },
  {
    file: 'src/content/docs/guides/token-pages.mdx',
    from: `<Shot
  src="trade-dark-desktop.webp"
  width={1400}
  height={875}
  alt="The KEVIN token page. A panel titled What this token is shows the deploy transaction, deploy block, date, and creator. A section named Where these numbers came from lists the source of each figure."
  caption="A token page. Identity first, price second, and a section naming the source of every number on the page."
/>`,
    to: `<ProductShot
  id="token-desktop-dark"
  alt="The DOGE token page. A panel titled What this token is shows the deploy transaction, deploy block, date, and creator. A section named Where these numbers came from lists the source of each figure."
  caption="A token page. Identity first, price second, and a section naming the source of every number on the page."
/>`,
  },
  {
    file: 'src/content/docs/start-here.mdx',
    from: "import Shot from '../../components/Shot.astro';",
    to: "import MobileDeviceShot from '../../components/screens/MobileDeviceShot.astro';",
  },
  {
    file: 'src/content/docs/start-here.mdx',
    from: `<Shot
  src="home-dark-mobile.webp"
  width={780}
  height={1688}
  alt="StampDEX on a phone, dark theme: the market board reflowed into a single column, with each token showing its ticker, floor, and volume stacked."
  caption="The same market on a phone. The board reflows to one column rather than scrolling sideways."
/>`,
    to: `<MobileDeviceShot
  id="market-mobile-dark"
  alt="StampDEX on a phone, dark theme: the market board reflowed into a single column, with each token showing its ticker, floor, and volume stacked."
  caption="The same market on a phone. The board reflows to one column rather than scrolling sideways."
/>`,
  },
];

for (const edit of edits) {
  const text = readFileSync(edit.file, 'utf8');
  if (!text.includes(edit.from)) {
    console.error('NOT FOUND in ' + edit.file + ': ' + edit.from.slice(0, 60));
    process.exitCode = 1;
    continue;
  }
  writeFileSync(edit.file, text.replace(edit.from, edit.to));
  console.log('updated', edit.file);
}
