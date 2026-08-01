#!/usr/bin/env tsx
/**
 * Executes every `graphql` code sample in every cheat sheet to check
 * its syntax validity using the graphql parser.
 * This ensures we do not ship confidently wrong reference material.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { parse } from 'graphql';

const REPO_ROOT = new URL('../', import.meta.url).pathname;
const CONTENT_ROOT = path.join(REPO_ROOT, 'src/content/docs');

const processor = unified().use(remarkParse).use(remarkGfm);

interface Sample {
  sourceFile: string;
  sourceLine: number;
  value: string;
}

async function main() {
  const files = await fg('**/*.md', { cwd: CONTENT_ROOT, absolute: true });
  const bySourceFile = new Map<string, Sample[]>();

  for (const file of files) {
    const raw = readFileSync(file, 'utf8');
    const { content } = matter(raw);
    const lineOffset = raw.slice(0, raw.indexOf(content)).split('\n').length - 1;
    const tree = processor.parse(content);

    visit(tree, 'code', (node: any) => {
      if (node.lang !== 'graphql') return;
      const list = bySourceFile.get(file) ?? [];
      list.push({
        sourceFile: file,
        sourceLine: (node.position?.start?.line ?? 1) + lineOffset,
        value: node.value,
      });
      bySourceFile.set(file, list);
    });
  }

  const totalSamples = [...bySourceFile.values()].reduce((n, s) => n + s.length, 0);
  if (totalSamples === 0) {
    console.log('No `graphql` code samples found.');
    return;
  }

  let hadErrors = false;

  for (const [file, samples] of bySourceFile) {
    for (const sample of samples) {
      try {
        parse(sample.value);
      } catch (err: any) {
        hadErrors = true;
        const rel = path.relative(REPO_ROOT, file);
        // Note: this uses the start of the block, specific lines inside
        // the block could be extracted from err if needed.
        console.log(`${rel}:${sample.sourceLine}: ${err.message}`);
      }
    }
  }

  if (hadErrors) {
    console.log(`\n${totalSamples} sample(s) checked — execution FAILED.`);
    process.exit(1);
  }

  console.log(`${totalSamples} sample(s) checked — all executed cleanly against graphql parser.`);
}

main();
