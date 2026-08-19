import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

function run(script: string, args: string[] = []) {
  // Call the local tsx binary directly rather than via `npx`, which
  // re-resolves the package on every invocation for no benefit here.
  const tsx = path.join(REPO_ROOT, 'node_modules/.bin/tsx');
  return execFileSync(tsx, [path.join(REPO_ROOT, script), ...args], {
    encoding: 'utf8',
    cwd: REPO_ROOT,
  });
}

// Generous timeouts, because the cost of these two tests grows linearly
// with the catalog: the build compiles every sheet × format with
// `typst compile`, and validation then RE-compiles each one to prove the
// output is byte-identical, on top of text extraction and QR decoding.
// At 34 sheets that is 136 typst invocations for a cold `.pdf-cache/`.
//
// Measured on an M-series laptop: ~14s warm, ~30s cold for the whole
// suite. A loaded or CI machine runs several times slower, and the two
// tests also compete with the tsc/lint test files vitest runs in
// parallel — a 60s ceiling was already being hit there. Raise this if
// the catalog doubles again; a real failure exits non-zero in seconds,
// so a high ceiling costs nothing when something is actually broken.
const PDF_TEST_TIMEOUT = 240_000;

describe('pdf pipeline', () => {
  it(
    "builds every sheet's PDFs without error",
    () => {
      expect(() => run('scripts/pdf/build-pdfs.ts')).not.toThrow();
    },
    PDF_TEST_TIMEOUT,
  );

  it(
    'passes PDF validation',
    () => {
      expect(() => run('scripts/pdf/verify-pdfs.ts')).not.toThrow();
    },
    PDF_TEST_TIMEOUT,
  );
});
