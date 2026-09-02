#!/usr/bin/env node
// StampDEX docs MCP server. Read-only: search, read, and inspect. The tools
// deliberately cannot connect a wallet, sign, broadcast, create a listing,
// execute a purchase, import a seed, read private repositories, expose admin
// documentation, or claim an unreleased feature is live.
//
// Transport: stdio. Point it at a built copy of the documentation site
// (dist/) or an extracted mirror containing index.json, llms-full.txt,
// markdown/, api/downloads/openapi.json, and generated/.
//
// Usage: DOCSDIR=/path/to/dist npx @bitcoinuniverse/stampdex-docs-mcp
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(process.env.DOCSDIR ?? 'dist');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const has = (p) => existsSync(join(ROOT, p));

function loadIndex() {
  if (!has('index.json')) {
    throw new Error(
      `no index.json under ${ROOT}. Point DOCSDIR at a built docs site (npm run build in docs-stampdex produces dist/index.json).`,
    );
  }
  return JSON.parse(read('index.json')).pages;
}

function loadSpec() {
  const p = join('api', 'downloads', 'openapi.json');
  if (!has(p)) throw new Error('no OpenAPI snapshot in this docs build');
  return JSON.parse(read(p));
}

function pageText(id) {
  const md = join('markdown', id === '' ? 'index' : id);
  if (!has(md)) return null;
  return read(md);
}

function textResult(body) {
  return { content: [{ type: 'text', text: body }] };
}

const server = new Server(
  { name: 'stampdex-docs-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'stampdex_docs_search',
      description:
        'Search the StampDEX documentation by keyword. Matches titles, descriptions, content types, and page bodies. Returns matching pages with ids and URLs.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', minLength: 2 },
          contentType: {
            type: 'string',
            description: 'Optional filter: tutorial, how-to, concept, reference, safety, release, contribution.',
          },
        },
        required: ['query'],
      },
    },
    {
      name: 'stampdex_docs_get_page',
      description: 'Read one documentation page as clean Markdown, including its source verification record.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', description: 'Page id, e.g. concepts/custody. Empty string is the homepage.' } },
        required: ['id'],
      },
    },
    {
      name: 'stampdex_docs_get_section',
      description: 'Read one section of a page: from a heading (## or deeper) to the next heading of the same level.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          heading: { type: 'string', description: 'The heading text, e.g. "What to check on a buy".' },
        },
        required: ['id', 'heading'],
      },
    },
    {
      name: 'stampdex_docs_get_api_operation',
      description: 'Read one operation from the public OpenAPI 3.1 document by path and method.',
      inputSchema: {
        type: 'object',
        properties: {
          path: { type: 'string', example: '/api/v1/market/tokens/{tick}' },
          method: { type: 'string', enum: ['get', 'post', 'head'] },
        },
        required: ['path', 'method'],
      },
    },
    {
      name: 'stampdex_docs_get_release',
      description: 'The release identity this documentation describes: application version, release id, commit, and the version endpoint to verify against.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'stampdex_docs_get_capability',
      description: 'What the platform records a protocol can do on each surface (from the capability registry).',
      inputSchema: {
        type: 'object',
        properties: { protocol: { type: 'string', enum: ['stamps', 'src20'] } },
        required: ['protocol'],
      },
    },
    {
      name: 'stampdex_docs_get_wallet_support',
      description: 'What each wallet can do here: works (supported and tested), untested, or no. From the application capability source.',
      inputSchema: {
        type: 'object',
        properties: { wallet: { type: 'string', description: 'Optional wallet name filter, e.g. UniSat.' } },
      },
    },
    {
      name: 'stampdex_docs_get_screenshot_evidence',
      description: 'The capture record for one product screenshot: source kind, commits, capture date, and the guide that explains the screen.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', example: 'market-desktop-dark' } },
        required: ['id'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  try {
    switch (name) {
      case 'stampdex_docs_search': {
        const query = String(args.query).toLowerCase();
        const terms = query.split(/\s+/).filter(Boolean);
        const results = loadIndex()
          .map((page) => {
            const haystack = `${page.title} ${page.description} ${page.contentType}`.toLowerCase();
            const score = terms.reduce((n, t) => n + (haystack.includes(t) ? 1 : 0), 0);
            return { page, score };
          })
          .filter(({ score }) => score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 8);
        if (args.contentType) {
          for (const r of [...results]) {
            if (r.page.contentType !== args.contentType) results.splice(results.indexOf(r), 1);
          }
        }
        if (results.length === 0) {
          return textResult('No documentation page matches. Try custody, fees, orders, wallets, or an endpoint path.');
        }
        return textResult(
          results
            .map(({ page }) => `- ${page.title} (${page.id || 'index'}) ${page.url}\n  ${page.description}`)
            .join('\n'),
        );
      }
      case 'stampdex_docs_get_page': {
        const body = pageText(String(args.id ?? ''));
        if (body == null) return textResult(`No page with id "${args.id}". Use stampdex_docs_search first.`);
        return textResult(body);
      }
      case 'stampdex_docs_get_section': {
        const body = pageText(String(args.id ?? ''));
        if (body == null) return textResult(`No page with id "${args.id}".`);
        const headingLine = body.split('\n').findIndex(
          (line) => line.startsWith('##') && line.toLowerCase().includes(String(args.heading).toLowerCase()),
        );
        if (headingLine === -1) return textResult(`No heading containing "${args.heading}" on ${args.id}.`);
        const level = body.split('\n')[headingLine].match(/^#+/)[0].length;
        const rest = body.split('\n').slice(headingLine + 1);
        const end = rest.findIndex((line) => line.match(new RegExp(`^#{1,${level}} `)));
        return textResult(
          [body.split('\n')[headingLine], ...(end === -1 ? rest : rest.slice(0, end))].join('\n').trim(),
        );
      }
      case 'stampdex_docs_get_api_operation': {
        const spec = loadSpec();
        const op = spec.paths?.[args.path]?.[args.method];
        if (!op) {
          const available = Object.keys(spec.paths ?? {});
          return textResult(`No ${String(args.method).toUpperCase()} ${args.path}. Public paths:\n${available.join('\n')}`);
        }
        return textResult(JSON.stringify({ path: args.path, method: args.method, ...op }, null, 2));
      }
      case 'stampdex_docs_get_release': {
        if (!has(join('generated', 'release-state.json'))) {
          const index = loadIndex();
          const home = index.find((p) => p.id === '');
          return textResult(
            `Release model: continuous. Verify with GET /api/version and compare the commit. Homepage: ${home?.url}`,
          );
        }
        return textResult(read(join('generated', 'release-state.json')));
      }
      case 'stampdex_docs_get_capability': {
        if (!has('registry.json')) return textResult('Capability registry not present in this build.');
        const registry = JSON.parse(read('registry.json'));
        const entry = registry.protocols?.[args.protocol];
        if (!entry) return textResult(`Unknown protocol ${args.protocol}. Known: ${Object.keys(registry.protocols ?? {}).join(', ')}`);
        return textResult(JSON.stringify({ displayName: entry.displayName, surfaces: entry.surfaces }, null, 2));
      }
      case 'stampdex_docs_get_wallet_support': {
        if (!has(join('generated', 'wallet-matrix.json'))) {
          return textResult('Wallet matrix not present in this build.');
        }
        const matrix = JSON.parse(read(join('generated', 'wallet-matrix.json')));
        const wallets = args.wallet
          ? matrix.wallets.filter((w) => w.name.toLowerCase().includes(String(args.wallet).toLowerCase()))
          : matrix.wallets;
        return textResult(
          `States: ${JSON.stringify(matrix.states)}\nSource: ${matrix.provenance.sourcePath} at ${matrix.provenance.sourceCommit.slice(0, 7)}\n` +
            wallets.map((w) => `\n${w.name} (${w.id}):\n${JSON.stringify(w.actions)}`).join('\n'),
        );
      }
      case 'stampdex_docs_get_screenshot_evidence': {
        if (!has('screens.manifest.json')) return textResult('Screenshot manifest not present in this build.');
        const manifest = JSON.parse(read('screens.manifest.json'));
        const capture = manifest.captures.find((c) => c.id === args.id);
        if (!capture) {
          return textResult(`No capture "${args.id}". Known ids:\n${manifest.captures.map((c) => c.id).join('\n')}`);
        }
        return textResult(JSON.stringify(capture, null, 2));
      }
      default:
        return textResult(`Unknown tool ${name}.`);
    }
  } catch (error) {
    return textResult(`Error: ${error.message}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(`stampdex-docs-mcp ready, serving ${ROOT}`);
