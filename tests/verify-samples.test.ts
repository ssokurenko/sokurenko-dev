import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const TSX = path.join(REPO_ROOT, 'node_modules/.bin/tsx');

describe('verify-samples', () => {
  it(
    'every ts code sample in the catalog compiles under tsc --strict',
    () => {
      const script = path.join(REPO_ROOT, 'scripts/verify-samples.ts');
      expect(() => execFileSync(TSX, [script], { encoding: 'utf8' })).not.toThrow();
    },
    // Shells out to tsc across every sample; ran close to the 5s default
    // locally, so give a cold CI runner real headroom (see pdf-pipeline.test.ts).
    60_000,
  );
});
