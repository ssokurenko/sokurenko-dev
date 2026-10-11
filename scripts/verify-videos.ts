#!/usr/bin/env tsx
/**
 * Checks that every companion video (`cheatsheet.video`) is still public
 * and still allows embedding, via YouTube's oEmbed endpoint. A video that
 * fails this still shows its card on the page, but pressing play opens a
 * player that says "Video unavailable". See
 * specs/06-cheatsheet-page-template.md#video-walkthrough.
 *
 * Deliberately not part of `npm run verify` or the deploy: it depends on a
 * third party, and spec 07 says a third-party outage must never block a
 * deploy. The weekly re-verification workflow runs it and opens an issue.
 *
 * Usage:
 *   tsx scripts/verify-videos.ts             report every video; exit 1 on a problem
 *   tsx scripts/verify-videos.ts --markdown  print only problems, as Markdown list items
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { cheatsheetSchema } from '../src/config/cheatsheet-schema.ts';

const MARKDOWN = process.argv.includes('--markdown');
const REPO_ROOT = path.resolve(import.meta.dirname, '..');

// What oEmbed's status codes say about a video. Anything else — a 5xx, a
// network error — says nothing about the video itself, so it is reported
// as unchecked rather than broken. (A well-formed but unknown ID gets 400,
// not 404.)
const PROBLEMS: Record<number, string> = {
  400: 'not found — removed, or the ID is wrong',
  401: 'embedding is disabled for this video',
  403: 'video is private',
  404: 'not found — removed, or the ID is wrong',
};

const files = await fg('src/content/docs/**/*.md', { cwd: REPO_ROOT, absolute: true });
let problems = 0;

for (const file of files.sort()) {
  const parsed = cheatsheetSchema.safeParse(matter(readFileSync(file, 'utf8')).data);
  const video = parsed.success ? parsed.data.cheatsheet?.video : undefined;
  if (!video) continue;

  const rel = path.relative(REPO_ROOT, file);
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtube}`;
  const oembed = `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(watchUrl)}`;

  let status: number | undefined;
  try {
    status = (await fetch(oembed, { signal: AbortSignal.timeout(10_000) })).status;
  } catch {
    // Network failure — falls through to "unchecked".
  }

  if (status === 200) {
    if (!MARKDOWN) console.log(`ok          ${rel}  ${video.youtube}`);
  } else if (status !== undefined && PROBLEMS[status]) {
    problems++;
    console.log(
      MARKDOWN
        ? `- \`${rel}\` — [${video.youtube}](${watchUrl}): ${PROBLEMS[status]}`
        : `PROBLEM     ${rel}  ${video.youtube}: ${PROBLEMS[status]}`,
    );
  } else if (!MARKDOWN) {
    console.log(`unchecked   ${rel}  ${video.youtube}: oEmbed answered ${status ?? 'nothing'}`);
  }
}

if (!MARKDOWN && problems > 0) process.exit(1);
