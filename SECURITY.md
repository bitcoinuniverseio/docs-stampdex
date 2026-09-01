# Security policy

## Reporting a vulnerability

Email `legal@bitcoinuniverse.io`.

**Do not open a public issue for a suspected security problem**, in this repository or
in the application repository. A public issue about a live trading venue is a
disclosure, and it reaches attackers at the same moment it reaches us.

Include, where you can:

- what you found, and where
- the steps to reproduce it
- what an attacker could do with it
- any transaction ids, order ids, or addresses involved
- how you would like to be credited, if at all

## What is in scope for this repository

This repository holds documentation. A security problem here means documentation that
would lead a reader into losing funds, for example:

- a wrong address on a page that tells you to check it
- a wrong description of where funds sit during a trade
- an instruction that would have somebody sign something they should not
- a link to a domain that is not ours

All four are treated as security issues, not as typos.

## What is in scope for the product

Vulnerabilities in the StampDEX application, its API, or its settlement behaviour
belong to `bitcoinuniverseio/stampdex`. Report them to the same address.

## What StampDEX never asks for

StampDEX never asks for a private key or a recovery phrase, and no support process ever
will. Any message, page, or person asking for either is not us. If you have already
entered a recovery phrase somewhere, move your funds to a new wallet before doing
anything else.

## Verifying what is running

```bash
curl https://stamp.api.bitcoinuniverse.io/api/version
```

Returns the exact commit serving production.

## Our commitment

- We acknowledge reports.
- We do not take legal action against good-faith research that does not degrade the
  service or reach other people's data.
- We tell you when a fix ships.
