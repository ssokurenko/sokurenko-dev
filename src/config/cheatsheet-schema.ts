import { z } from 'zod';
import { SECTION_SLUGS } from './taxonomy';
import { MAX_SUMMARY_LENGTH, MAX_VIDEO_TITLE_LENGTH, STALENESS_WARNING_DAYS } from './limits';

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com', 'youtube-nocookie.com']);

/**
 * Authors paste whatever YouTube gave them — a share link, the address
 * bar, an embed URL — so `cheatsheet.video.youtube` accepts any of those
 * and normalizes to the bare 11-character ID. Everything downstream (the
 * page, the PDF line, the availability check) sees only the ID. Returns
 * null for anything that isn't recognizably one video.
 */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (YOUTUBE_ID.test(value)) return value;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, '');
  let id: string | null | undefined;
  if (host === 'youtu.be') {
    id = url.pathname.slice(1);
  } else if (YOUTUBE_HOSTS.has(host)) {
    id =
      url.pathname === '/watch'
        ? url.searchParams.get('v')
        : url.pathname.match(/^\/(?:embed|shorts|live|v)\/([^/]+)\/?$/)?.[1];
  }
  return id && YOUTUBE_ID.test(id) ? id : null;
}

/**
 * Optional companion video, shown on the page as a click-to-play card and
 * mentioned in the PDF front matter. It is a companion, never a source —
 * primary sources stay in `verifiedAgainst`. See
 * specs/06-cheatsheet-page-template.md#video-walkthrough.
 */
const videoSchema = z.object({
  youtube: z
    .string()
    .refine((v) => parseYouTubeId(v) !== null, 'youtube must be a video ID or a YouTube video URL')
    .transform((v) => parseYouTubeId(v)!),
  title: z
    .string()
    .min(1)
    .max(MAX_VIDEO_TITLE_LENGTH, `video title must be ≤ ${MAX_VIDEO_TITLE_LENGTH} characters`),
  duration: z
    .string()
    .regex(/^(?:\d+:[0-5]\d|\d{1,2}):[0-5]\d$/, 'duration must be m:ss or h:mm:ss, as YouTube shows it'),
});

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
      video: videoSchema.optional(),
    })
    .optional(),
});

export type CheatsheetFrontmatter = z.infer<typeof cheatsheetSchema>['cheatsheet'];
export type CheatsheetVideo = z.infer<typeof videoSchema>;

/**
 * The video's name on every surface — the page card and the PDF front
 * matter — so the two outputs describe it in the same words.
 */
export const VIDEO_LABEL = 'Video walkthrough';

/**
 * Whole minutes, never less than one. A reader deciding whether to press
 * play wants "5 min", not "4:31" — the exact length is YouTube's to show.
 */
export function videoMinutes(duration: string): number {
  const seconds = duration.split(':').reduce((total, part) => total * 60 + Number(part), 0);
  return Math.max(1, Math.round(seconds / 60));
}

export function formatVideoDuration(duration: string): string {
  return `${videoMinutes(duration)} min`;
}

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
