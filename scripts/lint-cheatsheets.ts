#!/usr/bin/env tsx
/**
 * Content linter for cheat sheets. Enforces the constrained-Markdown
 * contract in specs/02-content-format.md by walking the remark AST —
 * never regex over raw Markdown, per that spec.
 *
 * Usage:
 *   tsx scripts/lint-cheatsheets.ts             human-readable output
 *   tsx scripts/lint-cheatsheets.ts --format json
 *   tsx scripts/lint-cheatsheets.ts --fix        mechanical fixes only (trailing whitespace)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { toString as mdastToString } from 'mdast-util-to-string';
import {
  MAX_CODE_LINE_LENGTH,
  WARN_CODE_LINE_LENGTH,
  MAX_CODE_BLOCK_LINES,
  MAX_TABLE_COLUMNS,
  MAX_HEADING_DEPTH,
  MAX_LIST_NESTING,
  WARN_SECTION_TABLE_ROWS,
  MIN_TOPIC_SECTIONS,
  MAX_TOPIC_SECTIONS,
  WARN_WORD_COUNT,
  STALENESS_WARNING_DAYS,
  CALLOUT_LABELS,
} from '../src/config/limits.ts';
import { cheatsheetSchema } from '../src/config/cheatsheet-schema.ts';

type Severity = 'error' | 'warning';

interface Finding {
  file: string;
  line: number;
  column: number;
  severity: Severity;
  rule: string;
  message: string;
}

const args = process.argv.slice(2);
const FIX = args.includes('--fix');
const FORMAT_JSON = args.includes('--format') && args[args.indexOf('--format') + 1] === 'json';
const rootIdx = args.indexOf('--root');
const CONTENT_ROOT =
  rootIdx !== -1 ? path.resolve(args[rootIdx + 1]) : path.resolve(import.meta.dirname, '../src/content/docs');
const findings: Finding[] = [];

function report(
  file: string,
  node: { position?: { start?: { line?: number; column?: number } } } | undefined,
  severity: Severity,
  rule: string,
  message: string,
) {
  findings.push({
    file,
    // `node` positions are relative to the frontmatter-stripped content
    // (gray-matter's `content` starts fresh at line 1), so the offset of
    // the frontmatter block itself must be added back to get a real,
    // clickable file:line — found via a 20-line-off report while
    // authoring the TypeScript sheet (D2).
    line: (node?.position?.start?.line ?? 1) + currentLineOffset,
    column: node?.position?.start?.column ?? 1,
    severity,
    rule,
    message,
  });
}

let currentLineOffset = 0;

const processor = unified().use(remarkParse).use(remarkGfm);

interface SheetInfo {
  file: string;
  slug: string;
  section: string;
  related: string[];
}

async function main() {
  const files = await fg('**/*.md', { cwd: CONTENT_ROOT, absolute: true });
  const sheets: SheetInfo[] = [];

  for (const file of files) {
    lintFile(file, sheets);
  }

  // Cross-file checks: duplicate slugs, dangling `related` references.
  const bySlug = new Map<string, string[]>();
  for (const s of sheets) {
    const list = bySlug.get(s.slug) ?? [];
    list.push(s.file);
    bySlug.set(s.slug, list);
  }
  for (const [slug, filesForSlug] of bySlug) {
    if (filesForSlug.length > 1) {
      for (const f of filesForSlug) {
        report(f, undefined, 'error', 'duplicate-slug', `slug "${slug}" is used by ${filesForSlug.length} sheets: ${filesForSlug.map((x) => path.relative(CONTENT_ROOT, x)).join(', ')}`);
      }
    }
  }
  const knownPaths = new Set(sheets.map((s) => `${s.section}/${s.slug}`));
  for (const s of sheets) {
    for (const rel of s.related) {
      if (!knownPaths.has(rel)) {
        report(s.file, undefined, 'error', 'dangling-related', `related entry "${rel}" does not match any sheet's section/slug`);
      }
    }
  }

  findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

  if (FORMAT_JSON) {
    console.log(JSON.stringify(findings, null, 2));
  } else {
    for (const f of findings) {
      const rel = path.relative(process.cwd(), f.file);
      console.log(`${rel}:${f.line}:${f.column}: ${f.severity} [${f.rule}] ${f.message}`);
    }
    const errors = findings.filter((f) => f.severity === 'error').length;
    const warnings = findings.filter((f) => f.severity === 'warning').length;
    console.log(`\n${errors} error(s), ${warnings} warning(s) across ${files.length} file(s).`);
  }

  const hasErrors = findings.some((f) => f.severity === 'error');
  process.exit(hasErrors ? 1 : 0);
}

function lintFile(file: string, sheets: SheetInfo[]) {
  const raw = readFileSync(file, 'utf8');

  if (FIX) {
    const fixed = raw
      .split('\n')
      .map((l) => l.replace(/[ \t]+$/, ''))
      .join('\n');
    if (fixed !== raw) writeFileSync(file, fixed, 'utf8');
  }

  const { data, content } = matter(FIX ? readFileSync(file, 'utf8') : raw);
  const sourceForOffset = FIX ? readFileSync(file, 'utf8') : raw;
  currentLineOffset = sourceForOffset.slice(0, sourceForOffset.indexOf(content)).split('\n').length - 1;

  // Frontmatter validation.
  const parsed = cheatsheetSchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      report(file, undefined, 'error', 'frontmatter', `${issue.path.join('.')}: ${issue.message}`);
    }
  }

  const cheatsheet = parsed.success ? parsed.data.cheatsheet : undefined;
  const isSheet = Boolean(cheatsheet);

  if (cheatsheet) {
    sheets.push({
      file,
      slug: cheatsheet.slug,
      section: cheatsheet.section,
      related: cheatsheet.related ?? [],
    });

    const ageDays = (Date.now() - cheatsheet.lastVerified.getTime()) / (1000 * 60 * 60 * 24);
    if (ageDays > STALENESS_WARNING_DAYS) {
      report(file, undefined, 'warning', 'stale', `lastVerified is ${Math.round(ageDays)} days ago (> ${STALENESS_WARNING_DAYS})`);
    }
  }

  const tree = processor.parse(content);

  const h2Headings: { text: string; index: number; node: any }[] = [];
  let wordCount = 0;

  visit(tree, (node: any) => {
    switch (node.type) {
      case 'heading': {
        if (node.depth === 1) {
          report(file, node, 'error', 'forbidden-h1', 'H1 is owned by frontmatter `title` — use `##` instead');
        } else if (node.depth > MAX_HEADING_DEPTH) {
          report(file, node, 'error', 'heading-depth', `heading depth ${node.depth} exceeds the max of ${MAX_HEADING_DEPTH} (####+ is forbidden)`);
        }
        if (node.depth === 2) {
          h2Headings.push({ text: mdastToString(node), index: h2Headings.length, node });
        }
        break;
      }
      case 'html': {
        report(file, node, 'error', 'forbidden-html', 'raw HTML is forbidden — use an allowed Markdown construct');
        break;
      }
      case 'image': {
        report(file, node, 'error', 'forbidden-image', 'images/diagrams are forbidden — illegible on e-ink; use a table or code block');
        break;
      }
      case 'text': {
        wordCount += node.value.trim().split(/\s+/).filter(Boolean).length;
        break;
      }
      case 'code': {
        if (!node.lang) {
          report(file, node, 'error', 'missing-lang', 'fenced code block is missing a language tag');
        }
        const lines: string[] = node.value.split('\n');
        if (lines.length > MAX_CODE_BLOCK_LINES) {
          report(file, node, 'error', 'code-block-length', `code block has ${lines.length} lines, exceeding the max of ${MAX_CODE_BLOCK_LINES}`);
        }
        lines.forEach((line, i) => {
          if (line.length > MAX_CODE_LINE_LENGTH) {
            report(
              file,
              { position: { start: { line: (node.position?.start?.line ?? 1) + i + 1, column: 1 } } },
              'error',
              'code-line-length',
              `code line is ${line.length} chars, exceeding the max of ${MAX_CODE_LINE_LENGTH}`,
            );
          } else if (line.length > WARN_CODE_LINE_LENGTH) {
            report(
              file,
              { position: { start: { line: (node.position?.start?.line ?? 1) + i + 1, column: 1 } } },
              'warning',
              'code-line-length-warn',
              `code line is ${line.length} chars, approaching the ${MAX_CODE_LINE_LENGTH}-char limit`,
            );
          }
        });
        break;
      }
      case 'table': {
        const headerRow = node.children[0];
        const columns = headerRow?.children?.length ?? 0;
        if (columns > MAX_TABLE_COLUMNS) {
          report(file, node, 'error', 'table-columns', `table has ${columns} columns, exceeding the max of ${MAX_TABLE_COLUMNS}`);
        }
        // Every table is a per-section quick-ref now (no single "at a
        // glance" mega-table) — a table this big signals the section is
        // covering too much and should split. Warning, not an error:
        // some legitimate references (utility types, tsconfig flags)
        // reasonably run a bit longer.
        const rows = Math.max(0, node.children.length - 1);
        if (rows > WARN_SECTION_TABLE_ROWS) {
          report(file, node, 'warning', 'table-rows', `table has ${rows} rows, exceeding the ${WARN_SECTION_TABLE_ROWS}-row quick-ref guideline — consider splitting the section`);
        }
        break;
      }
      case 'link': {
        const linkText = mdastToString(node);
        if (/^https?:\/\//.test(linkText) && linkText === node.url) {
          report(file, node, 'error', 'bare-url', 'link text is a bare URL — use descriptive link text');
        }
        break;
      }
      case 'blockquote': {
        const text = mdastToString(node);
        const m = text.match(/^([A-Za-z]+):/);
        const label = m?.[1];
        if (!label || !(CALLOUT_LABELS as readonly string[]).includes(label)) {
          report(file, node, 'error', 'callout-label', `unrecognized callout label${label ? ` "${label}"` : ''} — must be one of ${CALLOUT_LABELS.join(', ')}`);
        }
        break;
      }
    }
  });

  // List nesting depth. A `list` node containing another `list` (via a
  // `listItem`) is depth+1; report once a list exceeds MAX_LIST_NESTING.
  function checkListNesting(node: any, depth = 0): void {
    if (node.type === 'list') {
      if (depth > MAX_LIST_NESTING) {
        report(file, node, 'error', 'list-nesting', `list nesting depth ${depth} exceeds the max of ${MAX_LIST_NESTING}`);
      }
      for (const child of node.children ?? []) checkListNesting(child, depth + 1);
    } else {
      for (const child of node.children ?? []) checkListNesting(child, depth);
    }
  }
  checkListNesting(tree);

  if (isSheet) {
    const firstH2 = h2Headings[0]?.text;
    const lastH2 = h2Headings[h2Headings.length - 1]?.text;

    // Structure per specs/02-content-format.md#structure: a short
    // `## Mental model` orients the reader, topic sections run simple
    // to complex (no fixed labels, no single "at a glance" mega-table —
    // each topic carries its own small quick-ref table), and
    // `## Further reading` closes it out. There is no mandated
    // "Common errors" section — error codes are folded into whichever
    // topic section they belong to, as callouts.
    if (firstH2 !== 'Mental model') {
      report(file, h2Headings[0]?.node, 'error', 'section-order', '`## Mental model` must be the first section');
    }
    if (lastH2 !== 'Further reading') {
      report(file, h2Headings[h2Headings.length - 1]?.node, 'error', 'section-order', '`## Further reading` must be the last section');
    }

    const topicCount = h2Headings.filter((h) => !['Mental model', 'Further reading'].includes(h.text)).length;
    if (topicCount < MIN_TOPIC_SECTIONS || topicCount > MAX_TOPIC_SECTIONS) {
      report(file, undefined, 'warning', 'topic-count', `${topicCount} topic sections; expected ${MIN_TOPIC_SECTIONS}-${MAX_TOPIC_SECTIONS}`);
    }

    if (wordCount > WARN_WORD_COUNT) {
      report(file, undefined, 'warning', 'word-count', `sheet is ${wordCount} words, exceeding the ${WARN_WORD_COUNT}-word guideline`);
    }
  }
}

main();
