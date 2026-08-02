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

/**
 * How old a verification is, in the unit the number actually means:
 * "805 days" makes a reader do arithmetic to learn what "2 years" says
 * outright. Lives here rather than in the page component because the PDF
 * prints the same sentence — and because the PDF cache keys on this
 * string, so a cached file rebuilds exactly when its wording changes.
 */
export function formatVerificationAge(days: number): string {
  if (days < 60) return `${days} days`;
  const months = Math.round(days / 30.44);
  if (months < 24) return `${months} months`;
  return `${Math.round(days / 365.25)} years`;
}

/**
 * Some subjects have no version to pin — REST, API concepts, HTTP. Those
 * sheets record `topicVersion: "N/A"`, which is honest frontmatter but a
 * bad badge: "vN/A" looks like a version string and answers the reader's
 * "is this current?" with noise. Treat those values as *absent* wherever
 * the version is displayed — the page badge, the PDF front matter, and
 * search metadata all import this rather than testing for "N/A" again.
 */
const NO_VERSION = new Set(['', 'n/a', 'na', 'none', 'not applicable', '-', '—', 'tbd']);

export function hasTopicVersion(topicVersion: string | undefined): boolean {
  return topicVersion != null && !NO_VERSION.has(topicVersion.trim().toLowerCase());
}

/**
 * `5.9` → `v5.9`, but `.NET 9`, `ES2026`, and `GraphQL Spec` are shown as
 * authored: the `v` prefix only reads as a version in front of a number,
 * and blanket-prefixing produced "vGraphQL Spec" and "v.NET 9".
 */
export function formatTopicVersion(topicVersion: string): string {
  const value = topicVersion.trim();
  return /^\d/.test(value) ? `v${value}` : value;
}
