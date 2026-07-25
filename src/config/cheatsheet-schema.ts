import { z } from 'zod';
import { SECTION_SLUGS } from './taxonomy';
import { MAX_SUMMARY_LENGTH, STALENESS_WARNING_DAYS } from './limits';

/**
 * Frontmatter contract for a cheat sheet. See
 * specs/01-information-architecture.md#frontmatter-schema.
 *
 * `slug` is permanent once published — it's printed in every PDF footer
 * and encoded in the cover QR code, including copies already sideloaded
 * onto a reader. Renaming it orphans physical artifacts.
 */
export const cheatsheetSchema = z.object({
  cheatsheet: z
    .object({
      slug: z
        .string()
        .regex(
          /^[a-z0-9]+(-[a-z0-9]+)*$/,
          'slug must be lowercase, hyphenated (e.g. "typescript")',
        ),
      section: z.enum(SECTION_SLUGS),
      summary: z
        .string()
        .max(MAX_SUMMARY_LENGTH, `summary must be ≤ ${MAX_SUMMARY_LENGTH} characters`),
      topicVersion: z.string(),
      verifiedAgainst: z
        .array(
          z.object({
            label: z.string(),
            url: z.url(),
          }),
        )
        .min(1, 'verifiedAgainst must list at least one primary source'),
      lastVerified: z.coerce.date(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      tags: z.array(z.string()).min(1, 'tags must list at least one tag'),
      related: z.array(z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/)).optional(),
      pdf: z.boolean().default(true),
    })
    .optional(),
});

export type CheatsheetFrontmatter = z.infer<typeof cheatsheetSchema>['cheatsheet'];

export function isStale(lastVerified: Date): boolean {
  const ageMs = Date.now() - lastVerified.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays > STALENESS_WARNING_DAYS;
}
