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

describe('pdf pipeline', () => {
  it('builds every sheet\'s PDFs without error', () => {
    expect(() => run('scripts/pdf/build-pdfs.ts')).not.toThrow();
  });

  it('passes PDF validation', () => {
    expect(() => run('scripts/pdf/verify-pdfs.ts')).not.toThrow();
  });
});
