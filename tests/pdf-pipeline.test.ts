import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');

function run(script: string, args: string[] = []) {
  return execFileSync('npx', ['tsx', path.join(REPO_ROOT, script), ...args], {
    encoding: 'utf8',
    cwd: REPO_ROOT,
  });
}

// Generous timeouts: these shell out to `typst compile` (per sheet ×
// format) and, for validation, also do PDF text extraction, cover-page
// screenshot rendering, and QR decoding — well within vitest's default
// 5s on a warm local machine, but a cold CI runner can comfortably
// exceed that (observed: a passing 6.4s run killed at the 5s default).
const PDF_TEST_TIMEOUT = 120_000;

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
