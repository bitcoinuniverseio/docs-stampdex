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

/**
 * The learning and classification model. Controlled values, validated here
 * and by scripts/check-content.mjs, so navigation, search metadata,
 * translation parity, and the release checks all read the same fields.
 */
const contentType = z
  .enum(['tutorial', 'how-to', 'concept', 'reference', 'safety', 'release', 'contribution'])
  .default('reference');
const audiences = z
  .array(z.enum(['traders', 'collectors', 'developers', 'operators']))
  .default([]);
const products = z.array(z.enum(['src20', 'stamps', 'desk', 'portfolio'])).default([]);
const protocols = z.array(z.enum(['src20', 'stamps', 'bitcoin'])).default([]);
const difficulty = z.enum(['intro', 'hands-on', 'advanced']).default('intro');
const estimatedMinutes = z.number().int().min(1).max(180).optional();
const lifecycle = z.enum(['stable', 'beta', 'preview', 'historical']).default('stable');
const releaseStatus = z.enum(['live', 'preview', 'historical', 'unknown']).default('live');
const searchAliases = z.array(z.string().min(2).max(60)).default([]);
const prerequisites = z.array(z.string()).default([]);
const related = z.array(z.string()).default([]);
const screenshots = z.array(z.string()).default([]);
const riskLevel = z.enum(['none', 'low', 'medium', 'high']).optional();
const lastReviewedBy = z.string().optional();
const appCommit = z.string().optional();
const docsCommit = z.string().optional();

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: z.object({
        source,
        contentType,
        audiences,
        products,
        protocols,
        difficulty,
        estimatedMinutes,
        lifecycle,
        releaseStatus,
        searchAliases,
        prerequisites,
        related,
        screenshots,
        riskLevel,
        lastReviewedBy,
        appCommit,
        docsCommit,
      }),
    }),
  }),
};
