#!/usr/bin/env tsx
/** Phase 3 of the build (specs/03-pdf-generation.md#build-pipeline): copy
 * compiled PDFs from the cache into the Astro output directory. */
import { mkdirSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';

const REPO_ROOT = new URL('../../', import.meta.url).pathname;
const CACHE_DIR = path.join(REPO_ROOT, '.pdf-cache');
const DIST_PDF_DIR = path.join(REPO_ROOT, 'dist/pdf');

async function main() {
  if (!existsSync(CACHE_DIR)) {
    console.log('No .pdf-cache/ directory — nothing to copy.');
    return;
  }
  const files = await fg('*.pdf', { cwd: CACHE_DIR, absolute: true });
  mkdirSync(DIST_PDF_DIR, { recursive: true });
  for (const file of files) {
    copyFileSync(file, path.join(DIST_PDF_DIR, path.basename(file)));
  }
  console.log(`Copied ${files.length} PDF(s) to dist/pdf/.`);
}

main();
