#!/usr/bin/env tsx
/**
 * Executes every `sql` code sample in every cheat sheet against a real
 * SQLite database, so a broken or invalid statement fails CI instead of
 * shipping as confidently wrong reference material — the same
 * non-negotiable rule verify-samples.ts applies to ts/tsx (see
 * specs/09-quality-bar.md#content-accuracy, SKILL.md#verification).
 *
 * Examples assume a small fixture schema (see FIXTURE_SQL below) rather
 * than each showing its own CREATE TABLE — that's the realistic
 * cheat-sheet shape (queries against tables that already exist), so the
 * verifier supplies the schema instead of requiring every block to be
 * independently self-contained the way ts/tsx samples are.
 *
 * Blocks run in document order against one shared in-memory database per
 * file, since later sections' examples may rely on earlier ones' rows.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { DatabaseSync } from 'node:sqlite';

const REPO_ROOT = new URL('../', import.meta.url).pathname;
const CONTENT_ROOT = path.join(REPO_ROOT, 'src/content/docs');

const processor = unified().use(remarkParse).use(remarkGfm);

// Minimal schema covering the tables the catalog's SQL examples assume
// exist. Extend this as new SQL-containing sheets are added.
const FIXTURE_SQL = `
  CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);
  CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
  CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, total REAL);
  CREATE TABLE employees (name TEXT, dept TEXT, salary REAL);
  CREATE TABLE accounts (id INTEGER PRIMARY KEY, balance REAL);
  INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob');
  INSERT INTO orders VALUES (1, 1, 150), (2, 1, 40), (3, 2, 200);
  INSERT INTO employees VALUES
    ('Alice', 'Eng', 95000),
    ('Bob', 'Eng', 95000),
    ('Carol', 'Eng', 90000);
  INSERT INTO accounts VALUES (1, 500), (2, 300);
`;

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
      if (node.lang !== 'sql') return;
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
    console.log('No `sql` code samples found.');
    return;
  }

  let hadErrors = false;

  for (const [file, samples] of bySourceFile) {
    const db = new DatabaseSync(':memory:');
    db.exec('PRAGMA foreign_keys = ON;');
    db.exec(FIXTURE_SQL);

    for (const sample of samples) {
      try {
        db.exec(sample.value);
      } catch (err: any) {
        hadErrors = true;
        const rel = path.relative(REPO_ROOT, file);
        console.log(`${rel}:${sample.sourceLine}: ${err.message}`);
      }
    }
  }

  if (hadErrors) {
    console.log(`\n${totalSamples} sample(s) checked — execution FAILED.`);
    process.exit(1);
  }

  console.log(`${totalSamples} sample(s) checked — all executed cleanly against SQLite.`);
}

main();
