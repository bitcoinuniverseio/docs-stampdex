import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

/**
 * Every material page declares where its facts were checked. The fields are
 * rendered under the page title by src/components/PageTitle.astro, so a
 * reader never has to trust a claim without knowing its origin.
 */
const source = z
  .object({
    repo: z.string().default('bitcoinuniverseio/stampdex (private application source)'),
    path: z.string().optional(),
    release: z.string().default('continuous deployment, verify with GET /api/version'),
    chain: z.string().default('bitcoin'),
    network: z.string().default('mainnet'),
    lifecycle: z.string().default('stable'),
    verified: z.string(),
  })
  .optional();

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.object({ source }) }),
  }),
};
