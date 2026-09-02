import { readFileSync, writeFileSync } from 'node:fs';

const edit = (file, from, to) => {
  let text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  if (!text.includes(from)) {
    console.error('NOT FOUND in ' + file + ': ' + from.slice(0, 70).replace(/\n/g, '\n'));
    process.exitCode = 1;
    return;
  }
  writeFileSync(file, text.replace(from, to));
  console.log('updated', file);
};

const shotRe = (src, alt, caption) => [
  `<Shot\n  src="${src}.webp"\n  width={1400}\n  height={875}\n  alt="${alt}"\n  caption="${caption}"\n/>`,
];

// index.mdx already imports ProductShot; swap the three shots.
edit(
  'src/content/docs/index.mdx',
  `<Shot\n  src="home-dark-desktop.webp"\n  width={1400}\n  height={875}\n  alt="The StampDEX market page in the dark theme: an SRC-20 token table with per-token source labels, floor prices, volume, and holders. Missing values show as dashes, not zeros."\n  caption="The market board. Every row carries the deployment transaction that identifies the token, and a source label for each figure."\n/>`,
  '<ProductShot id="market-desktop-dark" />',
);
edit(
  'src/content/docs/index.mdx',
  `<Shot\n  src="trade-dark-desktop.webp"\n  width={1400}\n  height={875}\n  alt="A StampDEX SRC-20 token trading page in the dark theme, with the order book, the trade panel, and the deployment identity of the token."\n  caption="A token page. The order book shows signed listings with amount, unit price, and total, and the deployment transaction names the token exactly."\n/>`,
  '<ProductShot id="token-desktop-dark" />',
);
edit(
  'src/content/docs/index.mdx',
  `<Shot\n  src="home-dark-mobile.webp"\n  width={640}\n  height={1318}\n  alt="The StampDEX market page on a phone in the dark theme, with the token table and bottom navigation."\n  caption="The same venue on a phone."\n/>`,
  '<ProductShot id="market-mobile-dark" />',
);

edit(
  'src/content/docs/guides/browse-the-market.mdx',
  "import Shot from '../../components/Shot.astro';",
  "import ProductShot from '../../components/screens/ProductShot.astro';",
);
edit(
  'src/content/docs/guides/browse-the-market.mdx',
  `<Shot\n  src="home-light-desktop.webp"\n  width={1400}\n  height={875}\n  alt="The StampDEX market board in the light theme: a table of SRC-20 tokens with columns for ticker, deployment transaction, floor, volume, holders, and mint progress. Several rows show a double dash where no source answered, rather than a zero."\n  caption="The market board. The deployment transaction sits in its own column beside the ticker, and rows with no reading show a dash."\n/>`,
  `<ProductShot\n  id="market-desktop-light"\n  alt="The StampDEX market board in the light theme: a table of SRC-20 tokens with columns for ticker, deployment transaction, floor, volume, holders, and mint progress. Several rows show a double dash where no source answered, rather than a zero."\n  caption="The market board. The deployment transaction sits in its own column beside the ticker, and rows with no reading show a dash."\n/>`,
);

edit(
  'src/content/docs/guides/collection-pages.mdx',
  "import Shot from '../../components/Shot.astro';",
  "import ProductShot from '../../components/screens/ProductShot.astro';",
);
edit(
  'src/content/docs/guides/collection-pages.mdx',
  `<Shot\n  src="stamps-dark-desktop.webp"\n  width={1400}\n  height={875}\n  alt="The Bitcoin Stamps collections page showing pixel-art collections in a grid, each with floor, volume, market cap, listed count, and holders. A collection with no floor shows a dash instead of a zero."\n  caption="Collections, image first. A collection nobody has listed shows a dash where a floor would be."\n/>`,
  `<ProductShot\n  id="stamps-desktop-dark"\n  alt="The Bitcoin Stamps collections page showing pixel-art collections in a grid, each with floor, volume, market cap, listed count, and holders. A collection with no floor shows a dash instead of a zero."\n  caption="Collections, image first. A collection nobody has listed shows a dash where a floor would be."\n/>`,
);

edit(
  'src/content/docs/guides/token-pages.mdx',
  "import Shot from '../../components/Shot.astro';",
  "import ProductShot from '../../components/screens/ProductShot.astro';",
);
edit(
  'src/content/docs/guides/token-pages.mdx',
  `<Shot\n  src="trade-dark-desktop.webp"\n  width={1400}\n  height={875}\n  alt="The KEVIN token page. A panel titled What this token is shows the deploy transaction, deploy block, date, and creator. A section named Where these numbers came from lists the source of each figure."\n  caption="A token page. Identity first, price second, and a section naming the source of every number on the page."\n/>`,
  `<ProductShot\n  id="token-desktop-dark"\n  alt="The DOGE token page. A panel titled What this token is shows the deploy transaction, deploy block, date, and creator. A section named Where these numbers came from lists the source of each figure."\n  caption="A token page. Identity first, price second, and a section naming the source of every number on the page."\n/>`,
);

edit(
  'src/content/docs/start-here.mdx',
  `<Shot\n  src="home-dark-mobile.webp"\n  width={780}\n  height={1688}\n  alt="StampDEX on a phone, dark theme: the market board reflowed into a single column, with each token showing its ticker, floor, and volume stacked."\n  caption="The same market on a phone. The board reflows to one column rather than scrolling sideways."\n/>`,
  `<MobileDeviceShot\n  id="market-mobile-dark"\n  alt="StampDEX on a phone, dark theme: the market board reflowed into a single column, with each token showing its ticker, floor, and volume stacked."\n  caption="The same market on a phone. The board reflows to one column rather than scrolling sideways."\n/>`,
);
