# Format contract

The complete constrained-Markdown vocabulary. Authoritative source: `specs/02-content-format.md`.

## Allowed constructs

| Construct | Syntax | Constraints |
|---|---|---|
| H2 heading | `## Text` | Section level |
| H3 heading | `### Text` | Deepest permitted level |
| Paragraph | plain text | |
| Bold | `**text**` | |
| Italic | `_text_` | |
| Inline code | `` `code` `` | |
| Fenced code | ```` ```ts ```` | Language tag required; ≤ 15 lines; lines ≤ 52 chars |
| Table | GFM pipe table | ≤ 3 columns; header row required |
| Unordered list | `- item` | ≤ 1 nesting level |
| Ordered list | `1. item` | ≤ 1 nesting level |
| Link | `[text](url)` | Descriptive text, never "here" |
| Callout | `> **Gotcha:** …` | Four labels only |
| Horizontal rule | `---` | Sparingly |

## Forbidden constructs

| Construct | Why forbidden | Use instead |
|---|---|---|
| `#` H1 | Owned by frontmatter `title`; two H1s break document outline and PDF ToC | `##` |
| `####`, `#####`, `######` | Unnavigable; won't fit a small-Kindle ToC; signals the sheet needs restructuring | Restructure into H2/H3 |
| MDX / JSX components | Typst cannot render JSX — the PDF silently loses the content | An allowed construct, or a Starlight component override |
| Images, diagrams, screenshots | Illegible at 4.12″ grayscale; unsearchable; uncopyable; inaccessible | A table or a code block |
| Raw HTML | Bypasses the linter and breaks Typst | An allowed construct |
| Tables > 3 columns | Overflows the 253 pt small-format text block | Split into two tables, or a definition-style list |
| Nested tables | No reliable Typst mapping | Restructure |
| Tables inside lists | No reliable Typst mapping | Lift the table out |
| Footnotes | Poor e-ink UX — no back-navigation from the note | Inline parenthetical, or a callout |
| Emoji carrying meaning | Inconsistent glyph coverage on e-ink; unreadable to screen readers | Callout labels |
| Bare URLs in prose | Unreadable in print, unhelpful in HTML | `[descriptive text](url)` |
| Line numbers / diff markers / highlight ranges | Not portable to Typst | Trailing comments |
| Tabs for indentation | Width is renderer-dependent, breaking the 52-char guarantee | Two spaces |

## The four callouts

Exactly four labels exist. They map to distinct Starlight asides and distinct Typst blocks, and are distinguishable in grayscale by border weight and label text rather than color.

```markdown
> **Gotcha:** A surprising behavior that costs people time.
> **Note:** Neutral context, usually a version or platform requirement.
> **Tip:** A better way to do something the reader already can do.
> **Warning:** Something with a real cost — data loss, silent unsafety.
```

Any other label is a lint error.

### Choosing between them

- **Gotcha** — the reader's mental model is wrong and reality will surprise them.
- **Note** — the reader's mental model is fine but incomplete.
- **Tip** — the reader will succeed either way; one path is better.
- **Warning** — the reader may cause damage.

If you're unsure between Gotcha and Warning: does it cost time (Gotcha) or cause harm (Warning)?

## Required section order

```
## At a glance      FIRST, mandatory
## Mental model     SECOND, mandatory
## <topics>         4–10 sections
## Common errors    where canonical errors exist
## Further reading  LAST, mandatory
```

The linter enforces first/last position and the presence of all three mandatory sections.

## Numeric limits

| Limit | Value | Severity |
|---|---|---|
| Code line length | 52 chars | error |
| Code line length | 48 chars | warning |
| Code block length | 15 lines | error |
| Table columns | 3 | error |
| Heading depth | `###` | error |
| List nesting | 1 level | error |
| "At a glance" rows | 10–20 | error |
| Topic sections | 4–10 | warning |
| Total words | 1,200 | warning |
| `lastVerified` age | 180 days | warning |
| `summary` length | 160 chars | error |

The 52-character limit derives from the small format's geometry: 4.12″ page − 0.6″ margins = 253 pt, at 8 pt JetBrains Mono with a 0.6 em advance. It lives in one exported constant in the linter — if it changes, it changes there.

## Linter errors

All fail the build:

1. Forbidden construct present
2. Code line > 52 chars
3. Code fence without a language tag
4. Table with > 3 columns
5. Missing required section, or wrong first/last position
6. "At a glance" outside 10–20 rows
7. Frontmatter fails the Zod schema
8. Duplicate `cheatsheet.slug`
9. Dangling `related` reference
10. Bare URL in prose
11. Code block > 15 lines
12. Unrecognized callout label

## Linter warnings

1. Code line 48–52 chars
2. `lastVerified` > 180 days ago
3. Sheet > 1,200 words
4. Topic section with no code sample
5. "At a glance" row key that doesn't resolve to a heading (breaks deep-linking)

Ship with zero errors **and** zero warnings.
