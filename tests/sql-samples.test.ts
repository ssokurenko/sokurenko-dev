import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const TSX = path.join(REPO_ROOT, 'node_modules/.bin/tsx');

describe('verify-sql-samples', () => {
  it(
    'every sql code sample in the catalog executes cleanly against SQLite',
    () => {
      const script = path.join(REPO_ROOT, 'scripts/verify-sql-samples.ts');
      expect(() =>
        execFileSync(TSX, [script], {
          encoding: 'utf8',
          env: { ...process.env, NODE_NO_WARNINGS: '1' },
        }),
      ).not.toThrow();
    },
    // ~1s standalone, but it runs in parallel with the tsc and typst
    // test files, and the 5s default was already flaking under that
    // load. Same reasoning as pdf-pipeline.test.ts.
    30_000,
  );
});
