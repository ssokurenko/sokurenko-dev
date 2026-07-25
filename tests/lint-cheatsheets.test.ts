import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const SCRIPT = path.resolve(import.meta.dirname, '../scripts/lint-cheatsheets.ts');

function runLint(root: string) {
  try {
    const out = execFileSync('npx', ['tsx', SCRIPT, '--root', root, '--format', 'json'], {
      encoding: 'utf8',
    });
    return { exitCode: 0, findings: JSON.parse(out) as { rule: string; severity: string }[] };
  } catch (e: any) {
    return { exitCode: e.status ?? 1, findings: JSON.parse(e.stdout) as { rule: string; severity: string }[] };
  }
}

const VALID_FRONTMATTER = `---
title: Widgets
description: A test sheet.
cheatsheet:
  slug: widgets
  section: languages
  summary: A test sheet about widgets.
  topicVersion: "1.0"
  verifiedAgainst:
    - label: Widget Spec
      url: https://example.com/widgets
  lastVerified: 2026-01-01
  difficulty: beginner
  tags: [widgets]
---
`;

function quickRefTable(rows: number): string {
  const header = '| Key | Value |\n|---|---|\n';
  const body = Array.from({ length: rows }, (_, i) => `| \`k${i}\` | v${i} |`).join('\n');
  return header + body;
}

let root: string;

beforeAll(() => {
  root = mkdtempSync(path.join(tmpdir(), 'lint-fixture-'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('lint-cheatsheets', () => {
  it('passes a clean, well-formed sheet', () => {
    const dir = path.join(root, 'clean', 'languages');
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      path.join(dir, 'widgets.md'),
      `${VALID_FRONTMATTER}
## Mental model

Widgets are simple. This paragraph explains the mental model without
any code, as required.

## Basics

${quickRefTable(3)}

Some prose about widgets.

\`\`\`js
const w = createWidget();
\`\`\`

> **Gotcha:** Widgets are zero-indexed.

## Intermediate

${quickRefTable(2)}

More prose, building on the basics above.

## Further reading

- [Widget Spec](https://example.com/widgets)
`,
    );
    const { exitCode, findings } = runLint(path.join(root, 'clean'));
    const errors = findings.filter((f) => f.severity === 'error');
    expect(errors).toEqual([]);
    expect(exitCode).toBe(0);
  });

  it('flags every category of violation in a broken sheet', () => {
    const dir = path.join(root, 'broken', 'languages');
    mkdirSync(dir, { recursive: true });
    writeFileSync(
      path.join(dir, 'broken.md'),
      `${VALID_FRONTMATTER.replace('slug: widgets', 'slug: broken')}
# A forbidden H1

## Not mental model first

\`\`\`
const line = "this line is deliberately way way way too long to fit";
\`\`\`

| A | B | C | D |
|---|---|---|---|
| 1 | 2 | 3 | 4 |

${quickRefTable(9)}

> **NotARealLabel:** this callout label is invalid

Visit https://example.com/bare for more.

## Further reading
`,
    );
    const { exitCode, findings } = runLint(path.join(root, 'broken'));
    const rules = new Set(findings.map((f) => f.rule));

    expect(exitCode).toBe(1);
    expect(rules).toContain('forbidden-h1');
    expect(rules).toContain('section-order'); // Mental model not first
    expect(rules).toContain('table-rows'); // 9-row quick-ref, over the 6-row guideline
    expect(rules).toContain('missing-lang'); // untagged fence
    expect(rules).toContain('code-line-length'); // long line
    expect(rules).toContain('table-columns'); // 4 columns
    expect(rules).toContain('callout-label'); // bad label
    expect(rules).toContain('bare-url'); // bare URL
  });

  it('flags duplicate slugs and dangling related references', () => {
    const dir = path.join(root, 'cross', 'languages');
    mkdirSync(dir, { recursive: true });
    const base = (slug: string, related?: string) => `---
title: T
description: D
cheatsheet:
  slug: ${slug}
  section: languages
  summary: S
  topicVersion: "1.0"
  verifiedAgainst:
    - label: L
      url: https://example.com
  lastVerified: 2026-01-01
  difficulty: beginner
  tags: [t]
${related ? `  related:\n    - ${related}\n` : ''}---

## Mental model

Prose.

## Topic

Prose.

\`\`\`js
1;
\`\`\`

## Further reading
`;
    writeFileSync(path.join(dir, 'dup-a.md'), base('duplicate-slug'));
    writeFileSync(path.join(dir, 'dup-b.md'), base('duplicate-slug'));
    writeFileSync(path.join(dir, 'dangler.md'), base('dangler', 'languages/does-not-exist'));

    const { findings } = runLint(path.join(root, 'cross'));
    const rules = new Set(findings.map((f) => f.rule));
    expect(rules).toContain('duplicate-slug');
    expect(rules).toContain('dangling-related');
  });
});
