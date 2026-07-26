#!/usr/bin/env tsx
/**
 * Compiles every `ts`/`tsx` code sample in every cheat sheet with
 * `tsc --strict`, so an uncompilable snippet fails CI instead of shipping
 * as confidently wrong reference material. See
 * specs/08-typescript-cheatsheet.md#verification and
 * specs/stories/epic-d-content.md#d4.
 *
 * `tsx` samples (React/JSX cheat sheets) compile with `--jsx react-jsx`.
 * `react`/`react-dom`/their `@types` packages are devDependencies used
 * ONLY by this harness — the site itself ships no framework runtime
 * (AGENTS.md rule 9); this doesn't change that, it just lets a cheat
 * sheet *about* React have its examples actually compiler-checked
 * instead of skipped for lack of a harness.
 *
 * A sample that intentionally demonstrates an error can use TypeScript's
 * own `// @ts-expect-error` comment — tsc enforces that the next line
 * really does error, and fails if it doesn't. No extra tooling needed.
 *
 * Each sample compiles in its own file (module-scoped via a trailing
 * `export {}`) so unrelated snippets can reuse identifiers like `const a`
 * without colliding.
 */
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const REPO_ROOT = new URL('../', import.meta.url).pathname;
const CONTENT_ROOT = path.join(REPO_ROOT, 'src/content/docs');
const OUT_DIR = path.join(REPO_ROOT, '.ts-sample-cache');

const processor = unified().use(remarkParse).use(remarkGfm);

interface Sample {
  sourceFile: string;
  sourceLine: number;
  tempFile: string;
  isTsx: boolean;
}

async function main() {
  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const files = await fg('**/*.md', { cwd: CONTENT_ROOT, absolute: true });
  const samples: Sample[] = [];
  let index = 0;

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const { content } = matter(raw);
    const lineOffset = raw.slice(0, raw.indexOf(content)).split('\n').length - 1;
    const tree = processor.parse(content);

    visit(tree, 'code', (node: any) => {
      const isTsx = node.lang === 'tsx';
      const isTs = node.lang === 'ts' || node.lang === 'typescript';
      if (!isTs && !isTsx) return;
      index++;
      const ext = isTsx ? 'tsx' : 'ts';
      const tempFile = path.join(OUT_DIR, `sample-${index}.${ext}`);
      writeFileSync(tempFile, node.value + '\nexport {};\n');
      samples.push({
        sourceFile: file,
        sourceLine: (node.position?.start?.line ?? 1) + lineOffset,
        tempFile,
        isTsx,
      });
    });
  }

  if (samples.length === 0) {
    console.log('No `ts`/`tsx` code samples found.');
    return;
  }

  const tsSamples = samples.filter((s) => !s.isTsx);
  const tsxSamples = samples.filter((s) => s.isTsx);

  let hadErrors = false;
  const byTempFile = new Map(samples.map((s) => [path.resolve(s.tempFile), s]));

  function runBatch(batch: Sample[], extraFlags: string[]) {
    if (batch.length === 0) return;
    try {
      execFileSync(
        path.join(REPO_ROOT, 'node_modules/.bin/tsc'),
        [
          '--noEmit',
          '--strict',
          '--target',
          'es2022',
          '--module',
          'esnext',
          '--moduleResolution',
          'bundler',
          '--pretty',
          'false',
          ...extraFlags,
          ...batch.map((s) => s.tempFile),
        ],
        // cwd is the isolated sample dir, not REPO_ROOT — otherwise tsc
        // picks up the repo's tsconfig.json (extends astro/tsconfigs/strict,
        // include: **/*) and type-checks unrelated project files too.
        { encoding: 'utf8', cwd: OUT_DIR },
      );
    } catch (err: any) {
      hadErrors = true;
      reportErrors(err.stdout ?? '', byTempFile);
    }
  }

  // Two separate tsc invocations: plain `ts` samples exclude @types/react's
  // ambient JSX namespace (whitelisted to `node` only, same as before);
  // `tsx` samples need `--jsx react-jsx` plus `@types/react` to resolve
  // JSX at all. Mixing them in one invocation would relax both.
  runBatch(tsSamples, ['--types', 'node']);
  runBatch(tsxSamples, ['--jsx', 'react-jsx', '--types', 'react']);

  if (hadErrors) {
    console.log(`\n${samples.length} sample(s) checked — compilation FAILED.`);
    process.exit(1);
  }

  console.log(`${samples.length} sample(s) checked — all compiled cleanly under tsc --strict.`);
}

function reportErrors(output: string, byTempFile: Map<string, Sample>) {
  for (const line of output.split('\n')) {
    const m = line.match(/^(.+?)\((\d+),(\d+)\): (error .+)$/);
    if (!m) {
      if (line.trim()) console.log(line);
      continue;
    }
    const [, tempPath, tsLine, , message] = m;
    const sample = byTempFile.get(path.resolve(tempPath));
    if (!sample) {
      console.log(line);
      continue;
    }
    const rel = path.relative(REPO_ROOT, sample.sourceFile);
    const realLine = sample.sourceLine + Number(tsLine); // +1 for the fence line, offset by tsLine's own 1-index
    console.log(`${rel}:${realLine}: ${message}`);
  }
}

main();
