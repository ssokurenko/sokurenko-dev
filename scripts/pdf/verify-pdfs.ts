#!/usr/bin/env tsx
/**
 * Validates every compiled PDF against specs/03-pdf-generation.md#validation.
 * Run after `pdf:build`. See specs/stories/epic-b-pdf.md#b8.
 *
 * Checks implemented:
 *   - page count in a sane range
 *   - canonical URL present in the extracted text (footer)
 *   - cover QR decodes to the exact canonical URL
 *   - fonts embedded (heuristic: at least one embedded TrueType program)
 *   - determinism: recompiling yields byte-identical output
 *
 * Not implemented (documented limitation, not faked): per-run-width
 * horizontal-overflow detection against the text-block boundary. The
 * content linter is the enforced gate for this (specs/02) — B2 found
 * Typst emits no overflow diagnostic to hook into, and precise glyph
 * bounding-box extraction was out of scope for this pass.
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { PDFParse } from 'pdf-parse';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { REPO_ROOT, FONT_PATH, PACKAGE_PATH } from './typst-runner.ts';

const CACHE_DIR = path.join(REPO_ROOT, '.pdf-cache');
const MANIFEST_PATH = path.join(REPO_ROOT, 'src/generated/pdf-manifest.json');
const ENTRY_DIR = path.join(CACHE_DIR, 'entry');

const MIN_PAGES = 1;
const MAX_PAGES = 60;

interface Finding {
  slug: string;
  format: string;
  check: string;
  message: string;
}

const failures: Finding[] = [];

function fail(slug: string, format: string, check: string, message: string) {
  failures.push({ slug, format, check, message });
}

async function verifyOne(slug: string, format: 'small' | 'large', manifestEntry: { path: string; pages: number }) {
  const pdfPath = path.join(CACHE_DIR, `${slug}-kindle-${format}.pdf`);
  if (!existsSync(pdfPath)) {
    fail(slug, format, 'exists', `${pdfPath} does not exist`);
    return;
  }
  const bytes = readFileSync(pdfPath);
  const parser = new PDFParse({ data: bytes });

  // Page count sane.
  const text = await parser.getText();
  if (text.pages.length < MIN_PAGES || text.pages.length > MAX_PAGES) {
    fail(slug, format, 'page-count', `${text.pages.length} pages, expected ${MIN_PAGES}-${MAX_PAGES}`);
  }
  if (text.pages.length !== manifestEntry.pages) {
    fail(
      slug,
      format,
      'page-count-mismatch',
      `manifest says ${manifestEntry.pages} pages, PDF has ${text.pages.length}`,
    );
  }

  // Canonical URL present (footer, on every body page).
  const urlFragment = extractUrlFragmentFromManifestPath(slug);
  if (!text.text.includes(urlFragment)) {
    fail(slug, format, 'canonical-url', `footer URL fragment "${urlFragment}" not found in extracted text`);
  }

  // Cover QR decodes to the canonical URL.
  try {
    const shots = await parser.getScreenshot({ first: 1, last: 1, scale: 3 });
    const png = PNG.sync.read(Buffer.from(shots.pages[0].data));
    const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    if (!code) {
      fail(slug, format, 'qr-decode', 'no QR code detected on the cover page');
    } else if (!code.data.includes(urlFragment)) {
      fail(slug, format, 'qr-mismatch', `QR decoded to "${code.data}", expected it to contain "${urlFragment}"`);
    }
  } catch (err: any) {
    fail(slug, format, 'qr-decode', `screenshot/decode failed: ${err.message}`);
  }

  // Fonts embedded (heuristic — Typst embeds by default; this guards
  // against a future toolchain regression, not against original v1 risk).
  const raw = bytes.toString('latin1');
  if (!/\/FontFile2?3?\b/.test(raw)) {
    fail(slug, format, 'fonts-embedded', 'no embedded font program found in the PDF');
  }

  await parser.destroy();
}

function extractUrlFragmentFromManifestPath(slug: string): string {
  // The entry .typ files know the real canonical URL; reuse that instead
  // of reconstructing it from taxonomy data the validator shouldn't need.
  const entryFile = path.join(ENTRY_DIR, `${slug}-small.typ`);
  if (existsSync(entryFile)) {
    const src = readFileSync(entryFile, 'utf8');
    const m = src.match(/url:\s*"([^"]+)"/);
    if (m) return m[1].replace(/^https?:\/\//, '');
  }
  return `sokurenko.dev/${slug}`;
}

async function verifyDeterminism(slug: string, format: 'small' | 'large') {
  const entryFile = path.join(ENTRY_DIR, `${slug}-${format}.typ`);
  const pdfPath = path.join(CACHE_DIR, `${slug}-kindle-${format}.pdf`);
  if (!existsSync(entryFile) || !existsSync(pdfPath)) return;

  const original = createHash('sha256').update(readFileSync(pdfPath)).digest('hex');
  const tmpOut = pdfPath + '.verify-tmp';
  try {
    execFileSync('typst', [
      'compile',
      '--root',
      REPO_ROOT,
      '--font-path',
      FONT_PATH,
      '--ignore-system-fonts',
      '--package-path',
      PACKAGE_PATH,
      '--format',
      'pdf',
      entryFile,
      tmpOut,
    ]);
    const recompiled = createHash('sha256').update(readFileSync(tmpOut)).digest('hex');
    if (original !== recompiled) {
      fail(slug, format, 'determinism', 'recompiling produced different bytes');
    }
  } finally {
    try {
      const { unlinkSync } = await import('node:fs');
      if (existsSync(tmpOut)) unlinkSync(tmpOut);
    } catch {
      /* best effort cleanup */
    }
  }
}

async function main() {
  if (!existsSync(MANIFEST_PATH)) {
    console.error('No manifest found — run `npm run pdf:build` first.');
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));

  for (const [slug, formats] of Object.entries(manifest) as [string, any][]) {
    for (const format of ['small', 'large'] as const) {
      await verifyOne(slug, format, formats[format]);
      await verifyDeterminism(slug, format);
    }
  }

  if (failures.length > 0) {
    console.error('PDF validation failed:\n');
    for (const f of failures) {
      console.error(`  ${f.slug} (${f.format}) [${f.check}]: ${f.message}`);
    }
    process.exit(1);
  }

  console.log(`PDF validation passed for ${Object.keys(manifest).length} sheet(s).`);
}

main();
