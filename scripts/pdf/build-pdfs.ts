#!/usr/bin/env tsx
/**
 * Builds both Kindle PDFs for every cheat sheet. See
 * specs/03-pdf-generation.md#build-pipeline and specs/stories/epic-b-pdf.md
 * (B5 orchestrator, B6 manifest, B9 incremental cache — implemented
 * together since they share the same per-sheet loop).
 *
 * Usage:
 *   tsx scripts/pdf/build-pdfs.ts                  build into .pdf-cache/, write the manifest
 *   tsx scripts/pdf/build-pdfs.ts --dev --only ts   build one sheet into public/pdf/, no manifest
 *   tsx scripts/pdf/build-pdfs.ts --force           ignore the incremental cache
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { PDFDocument } from 'pdf-lib';
import { assertTypstInstalled, typstCompile, REPO_ROOT } from './typst-runner.ts';
import { prepareBody } from './prepare-body.ts';
import { cheatsheetSchema } from '../../src/config/cheatsheet-schema.ts';

const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const DEV = args.includes('--dev');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx !== -1 ? args[onlyIdx + 1] : undefined;
const outIdx = args.indexOf('--out');
const OUT_DIR = path.resolve(REPO_ROOT, outIdx !== -1 ? args[outIdx + 1] : DEV ? 'public/pdf' : '.pdf-cache');

const CONTENT_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const CACHE_DIR = path.join(REPO_ROOT, '.pdf-cache');
const BODY_DIR = path.join(CACHE_DIR, 'body');
const ENTRY_DIR = path.join(CACHE_DIR, 'entry');
const HASHES_PATH = path.join(CACHE_DIR, 'hashes.json');
const MANIFEST_PATH = path.join(REPO_ROOT, 'src/generated/pdf-manifest.json');
const TYPST_TEMPLATE_FILES = [
  'typst/cheatsheet.typ',
  'typst/theme/colors.typ',
  'typst/theme/eink.tmTheme',
];

const FORMATS = ['small', 'large'] as const;
type Format = (typeof FORMATS)[number];

interface ManifestEntry {
  path: string;
  bytes: number;
  pages: number;
  hash: string;
}

function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

function readTemplateFingerprint(): string {
  return TYPST_TEMPLATE_FILES.map((f) => readFileSync(path.join(REPO_ROOT, f), 'utf8')).join('\n---\n');
}

function loadHashes(): Record<string, string> {
  if (!existsSync(HASHES_PATH)) return {};
  return JSON.parse(readFileSync(HASHES_PATH, 'utf8'));
}

function saveHashes(hashes: Record<string, string>) {
  mkdirSync(CACHE_DIR, { recursive: true });
  writeFileSync(HASHES_PATH, JSON.stringify(hashes, null, 2));
}

function formatConfigSource(format: Format): string {
  return readFileSync(path.join(REPO_ROOT, `typst/formats/kindle-${format}.typ`), 'utf8');
}

async function countPages(pdfPath: string): Promise<number> {
  const bytes = readFileSync(pdfPath);
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  return doc.getPageCount();
}

async function main() {
  assertTypstInstalled();

  const files = await fg('**/*.md', { cwd: CONTENT_ROOT, absolute: true });
  mkdirSync(BODY_DIR, { recursive: true });
  mkdirSync(ENTRY_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const templateFingerprint = readTemplateFingerprint();
  const hashes = loadHashes();
  const manifest: Record<string, Record<Format, ManifestEntry>> = existsSync(MANIFEST_PATH)
    ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'))
    : {};

  let built = 0;
  let skipped = 0;

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const { data, content } = matter(raw);
    const parsed = cheatsheetSchema.safeParse(data);
    if (!parsed.success || !parsed.data.cheatsheet) continue; // not a sheet (e.g. a section index)

    const cs = parsed.data.cheatsheet;
    if (cs.pdf === false) continue;
    if (ONLY && cs.slug !== ONLY) continue;

    const preparedBody = prepareBody(content);
    const bodyPath = path.join(BODY_DIR, `${cs.slug}.md`);
    writeFileSync(bodyPath, preparedBody);

    const url = `https://sokurenko.dev/${cs.section}/${cs.slug}/`;
    const lastVerified = cs.lastVerified.toISOString().slice(0, 10);

    for (const format of FORMATS) {
      const cacheKey = `${cs.slug}:${format}`;
      const contentHash = sha256(
        [preparedBody, JSON.stringify(cs), templateFingerprint, formatConfigSource(format), 'typst:0.15.x'].join(
          '\n---\n',
        ),
      );

      const outFile = path.join(OUT_DIR, `${cs.slug}-kindle-${format}.pdf`);
      const cacheFile = path.join(CACHE_DIR, `${cs.slug}-kindle-${format}.pdf`);
      const targetFile = DEV ? outFile : cacheFile;

      if (!FORCE && hashes[cacheKey] === contentHash && existsSync(targetFile)) {
        skipped++;
        if (!DEV) {
          manifest[cs.slug] ??= {} as Record<Format, ManifestEntry>;
          manifest[cs.slug][format] = {
            path: `/pdf/${cs.slug}-kindle-${format}.pdf`,
            bytes: statSync(targetFile).size,
            pages: await countPages(targetFile),
            hash: contentHash,
          };
        }
        continue;
      }

      const entryPath = path.join(ENTRY_DIR, `${cs.slug}-${format}.typ`);
      // Root-relative paths: `typst compile` is invoked with `--root
      // REPO_ROOT` (see typst-runner.ts), under which an OS-absolute path
      // like `/Users/...` gets misread as `<root>/Users/...`. A leading
      // `/` here means "relative to --root", which is what we want.
      const rootRelativeBodyPath = '/' + path.relative(REPO_ROOT, bodyPath);
      const entrySource = [
        `#import "/typst/cheatsheet.typ": cheatsheet`,
        `#import "/typst/formats/kindle-${format}.typ": format`,
        '#cheatsheet(',
        '  format: format,',
        `  title: ${JSON.stringify(String((data as any).title ?? cs.slug))},`,
        `  summary: ${JSON.stringify(cs.summary)},`,
        `  url: ${JSON.stringify(url)},`,
        `  topic-version: ${JSON.stringify(cs.topicVersion)},`,
        `  last-verified: ${JSON.stringify(lastVerified)},`,
        `  body-path: ${JSON.stringify(rootRelativeBodyPath)},`,
        ')',
      ].join('\n');
      writeFileSync(entryPath, entrySource);

      try {
        typstCompile(entryPath, targetFile);
      } catch (err: any) {
        console.error(`\nFailed to compile ${cs.slug} (${format}):\n`);
        console.error(err.stderr ?? err.message);
        process.exit(1);
      }

      built++;
      hashes[cacheKey] = contentHash;

      if (!DEV) {
        manifest[cs.slug] ??= {} as Record<Format, ManifestEntry>;
        manifest[cs.slug][format] = {
          path: `/pdf/${cs.slug}-kindle-${format}.pdf`,
          bytes: statSync(targetFile).size,
          pages: await countPages(targetFile),
          hash: contentHash,
        };
      }
    }
  }

  saveHashes(hashes);

  if (!DEV) {
    mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });
    writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  }

  console.log(`PDF build: ${built} compiled, ${skipped} skipped (cached).`);
}

main();
