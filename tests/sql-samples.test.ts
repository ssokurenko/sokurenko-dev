import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

describe('verify-sql-samples', () => {
  it('every sql code sample in the catalog executes cleanly against SQLite', () => {
    const script = path.resolve(import.meta.dirname, '../scripts/verify-sql-samples.ts');
    expect(() =>
      execFileSync('npx', ['tsx', script], {
        encoding: 'utf8',
        env: { ...process.env, NODE_NO_WARNINGS: '1' },
      }),
    ).not.toThrow();
  });
});
