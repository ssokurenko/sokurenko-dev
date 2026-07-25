---
name: writing-cheatsheets
description: Write or revise a cheat sheet for the sokurenko.dev reference catalog. Use when creating a new cheat sheet, editing an existing one, re-verifying a stale sheet, or when asked to document a technology as reference material. Covers the constrained-Markdown contract, progressive-density structure, e-ink/PDF constraints, verification workflow, and the quality bar.
---

# Writing cheat sheets

You are writing reference material that renders to **three outputs from one source**: an HTML page, a PDF for a 6.8″ Kindle Paperwhite, and a PDF for a 10.2″ Kindle Scribe.

Almost every rule here exists because of the small PDF. A 4.12″ grayscale page that cannot scroll horizontally is an unforgiving target, and it is also the reason this catalog is worth using.

## Before you write

Do these in order. Skipping research is how confidently wrong sheets get made.

1. **Read the spec for the sheet** if one exists in `specs/` (e.g. `specs/08-typescript-cheatsheet.md`). It defines scope, and scope discipline is what separates a cheat sheet from a manual.
2. **Identify the primary sources.** Official docs, specs, RFCs, release notes. Never another cheat sheet, never a blog post, never your own recall.
3. **Pin the version** of the subject. Every claim is version-specific.
4. **Decide what is out of scope** and write it down. A TypeScript sheet excludes React patterns; a PostgreSQL sheet excludes SQL syntax. One sheet, one topic.
5. **List the ten questions** a reader most often has about this topic. These become the top of the "At a glance" table. If you cannot list ten, the topic is too narrow for its own sheet.

## Structure

Every sheet has this shape. It is not a suggestion.

```markdown
## At a glance      ← required, must be FIRST
## Mental model     ← required, must be SECOND
## <Topic 1>        ← 4–10 topic sections
## <Topic 2>
...
## Common errors    ← where the topic has canonical errors
## Further reading  ← required, must be LAST
```

### `## At a glance` — the most important 15 lines

This is the product. A reader arriving from a search engine gets their answer here, in five seconds, without scrolling.

- **10–20 rows.** Fewer isn't a reference; more isn't scannable.
- **Two or three columns.** Column 1 is the thing the reader would *type*.
- **Ordered by frequency of need** — not alphabetically, not pedagogically.
- **Self-contained.** No forward references to prose further down.
- Each row should map to a topic section below, so the table doubles as navigation.

Build it by writing your ten questions, then answering each in one table row. If a row needs a sentence to make sense, it belongs in a topic section instead.

### `## Mental model`

Two or three paragraphs, **no code**. The load-bearing ideas someone needs before the details cohere — the things that, once understood, make a dozen surprises stop being surprising.

Not a summary. Not an introduction. Ask: "what do people get wrong because they're missing a concept?" That's the mental model.

### Topic sections

Prose → example → gotcha. Repeat.

Every topic section should carry at least one code sample and at least one callout — preferably a real gotcha, but a `Note`, `Tip` or `Warning` counts where that's the honest fit.

### `## Common errors`

Where the subject has canonical error codes or messages, this is one of the highest-traffic sections on the page, because people paste errors into search boxes.

Three columns: `Error` / `Cause` / `Fix`. Error codes as **literal text** so search finds them.

## The format contract

Read `references/format-contract.md` for the complete list. The essentials:

### Allowed

`##` and `###` headings · paragraphs · `**bold**` · `_italic_` · `` `code` `` · fenced code with a **required** language tag · GFM pipe tables of **≤ 3 columns** · lists with **one** level of nesting · `[text](url)` links · the four callouts

### The four callouts

```markdown
> **Gotcha:** `typeof null === "object"`. Check for `null` explicitly.
> **Note:** Requires TypeScript 5.0 or later.
> **Tip:** `satisfies` gives validation without widening.
> **Warning:** `as` silently disables type checking.
```

No other labels exist. `Gotcha` is the highest-value one and the main reason readers trust a sheet — prefer it.

### Forbidden

`#` H1 (the title comes from frontmatter) · `####` and deeper · images and diagrams · raw HTML · **any MDX or JSX component** · tables with > 3 columns · nested tables · footnotes · emoji carrying meaning · bare URLs in prose

**Why so narrow:** every construct has to render correctly in three renderers. Widening the vocabulary for one page is how the PDFs quietly become worse than the web page — which breaks the single promise this catalog makes.

## Code samples

### 52 characters, hard limit

E-ink cannot scroll horizontally. A line over the limit is a **correctness bug**, not a style issue.

```ts
// Bad — 71 chars, will overflow the Paperwhite
function process(input: Record<string, unknown>, options: Options): Result {}

// Good — same code, reformatted
function process(
  input: Record<string, unknown>,
  options: Options,
): Result {}
```

This constraint improves your code style anyway. Break long signatures, extract named types, shorten example identifiers (`user` not `currentlyAuthenticatedUser`).

### Other rules

- **Language tag required** — `ts`, `sql`, `bash`, `json`. Use `text` for plain output.
- **Max 15 lines per block.** Longer blocks don't survive pagination and stop being cheat-sheet material.
- **Self-contained** — copy-pasteable without invisible setup.
- **Two-space indent, no tabs**, so width is predictable.
- **No line numbers, diff markers, or highlight ranges** — not portable to Typst.
- **Show the result in a trailing comment** rather than in prose:
  ```ts
  type A = keyof { a: 1; b: 2 };  // "a" | "b"
  ```

## Grayscale-first

Kindle is grayscale. Anything carried by color alone is destroyed.

- Never "the items in red are deprecated."
- Never rely on syntax-highlight hue to make a point. If a distinction matters, state it in prose or a code comment.
- Callout **labels** carry meaning; their color is decoration.

This is the same discipline as WCAG 1.4.1, so it improves accessibility for free.

## Writing style

- **Terse.** Cut every word not carrying meaning. This is reference material.
- **Second person, present tense.** "Use `satisfies` when you want validation without widening."
- **No hedging.** "This may sometimes possibly cause issues" tells the reader nothing. Say what happens.
- **No filler.** Never "in this section we will explore". Start with the content.
- **Consistent terminology.** Adopt the primary source's vocabulary and never drift.
- **Explain the why for anything surprising.** "Interfaces merge across files" is a fact. "…which is why a stray `.d.ts` declaration can silently widen your type" is why the reader cares.

### The gotcha test

Before writing a gotcha, ask: **would a competent person actually make this mistake?**

- ✅ `typeof null === "object"` — yes, everyone hits this
- ✅ Narrowing is lost after an `await` — yes, and it's baffling when it happens
- ❌ "Remember to close your brackets" — no

Fake gotchas are worse than none: they train readers to skim past the real ones.

## Frontmatter

See `specs/01-information-architecture.md` for the full schema. Every field is validated at build time.

```yaml
---
title: TypeScript
description: Type system, narrowing, generics and utility types — with the gotchas.
cheatsheet:
  slug: typescript          # globally unique; PERMANENT (printed in PDFs)
  section: languages        # must match the taxonomy
  summary: One sentence, ≤ 160 chars, appears on cards and the PDF cover.
  topicVersion: "5.9"       # version of the SUBJECT
  verifiedAgainst:
    - label: TypeScript Handbook
      url: https://www.typescriptlang.org/docs/handbook/
  lastVerified: 2026-07-25
  difficulty: intermediate
  tags: [types, generics]
  related: [languages/javascript]
---
```

Two fields deserve care:

- **`slug` is permanent.** It's printed in every PDF footer and encoded in every cover QR code — including copies already sideloaded onto someone's reader. Renaming it orphans physical artifacts.
- **`lastVerified` is a human assertion** that someone re-read the primary source. Set it only after you actually did. Never bump it to silence the staleness badge.

## Verification

Non-negotiable. A wrong cheat sheet is worse than no cheat sheet, because it is *trusted*.

1. **Execute or compile every code sample.** Not "it looks right" — actually run it. Where a harness exists (`npm run test`), it does this in CI and will catch you.
2. **Trace every non-obvious claim** to a primary source, and list that source in `verifiedAgainst`.
3. **Verify every error code** reproduces the described error.
4. **Confirm version-gated claims** against release notes.
5. **Set `lastVerified`** only after 1–4 are complete.

## Before you finish

```bash
npm run lint                    # must be zero errors AND zero warnings
npm run pdf:dev -- <slug>       # build both PDFs
```

Then open both PDFs and check:

- [ ] No code clipped at the right edge — the small PDF is where this shows
- [ ] No heading orphaned at the foot of a page
- [ ] Tables read correctly across page breaks
- [ ] Code is comfortably legible, not merely present
- [ ] Cover QR code and footer URL are correct

Full list in `references/quality-checklist.md`.

## Anti-patterns

| Don't | Why |
|---|---|
| Pad with prose to look thorough | Directly opposes the product's purpose |
| Copy from another cheat sheet | Propagates their errors and adds nothing |
| Aim for exhaustive API coverage | A cheat sheet is *curated*; completeness kills scannability |
| Use a component "just this once" | Breaks the PDFs, which is the whole differentiator |
| Widen a table to 4 columns | Overflows the Paperwhite |
| Invent a plausible-sounding gotcha | Trains readers to distrust the real ones |
| Set `lastVerified` without verifying | Destroys the only signal that makes the catalog trustworthy |

## Reference files

- `references/format-contract.md` — complete allowed/forbidden list with rationale
- `references/quality-checklist.md` — the full pre-ship checklist
- `references/worked-example.md` — a short, complete sheet using every allowed construct
