---
name: writing-cheatsheets
description: Write or revise a cheat sheet for the sokurenko.dev reference catalog. Use when creating a new cheat sheet, editing an existing one, re-verifying a stale sheet, or when asked to document a technology as reference material. Covers the constrained-Markdown contract, the gradual (basics-to-advanced) structure, e-ink/PDF constraints, verification workflow, and the quality bar.
---

# Writing cheat sheets

You are writing reference material that renders to **three outputs from one source**: an HTML page, a PDF for a 6.8″ Kindle Paperwhite, and a PDF for a 10.2″ Kindle Scribe.

Almost every rule here exists because of the small PDF. A 4.12″ grayscale page that cannot scroll horizontally is an unforgiving target, and it is also the reason this catalog is worth using.

A sheet is a **short, guided walk through the topic** — basics first, harder material later — not a reference dump. A reader who stops halfway through should already have a correct, working mental model of everything before that point.

## Before you write

Do these in order. Skipping research is how confidently wrong sheets get made.

1. **Read the spec for the sheet** if one exists in `specs/` (e.g. `specs/08-typescript-cheatsheet.md`). It defines scope, and scope discipline is what separates a cheat sheet from a manual.
2. **Identify the primary sources.** Official docs, specs, RFCs, release notes. Never another cheat sheet, never a blog post, never your own recall.
3. **Pin the version** of the subject. Every claim is version-specific.
4. **Decide what is out of scope** and write it down. A TypeScript sheet excludes React patterns; a PostgreSQL sheet excludes SQL syntax. One sheet, one topic.
5. **Sequence the topics before writing a word of prose.** List every concept the sheet needs to cover, then order them so each one only depends on concepts already covered above it. This ordering *is* the sheet's structure — get it right here and the writing is easy; get it wrong and no amount of good prose fixes a section that assumes something the reader hasn't met yet.

## Structure

```markdown
## Mental model      ← required, must be FIRST. 2-4 sentences, no code, no table.
## <Topic 1>          ← basics
## <Topic 2>
## <Topic 3>          ← intermediate
...
## <Topic N>          ← advanced, or a short pointer if it's genuinely deep
## Further reading    ← required, must be LAST
```

4–9 topic sections. There is no "At a glance" mega-table and no separate "Common errors" section — see below for why, and where that content actually goes instead.

### `## Mental model` — the load-bearing idea, not a summary

2–4 sentences. No code, no table. The one thing a reader needs to already believe before the rest of the sheet stops being surprising.

Ask: "what do people get wrong because they're missing a concept?" That's the mental model — not an introduction, not a table of contents in prose form.

### Topic sections — table, then prose, then example, then (at most one) callout

Each topic section:

1. Opens with a **small quick-ref table, 2–6 rows**, for that concept only — right after the heading, before any prose.
2. Then 2–4 sentences of explanation, pitched at "the reader knows the topic exists but not this detail."
3. Then one short code example (rarely more than one — this is a cheat sheet, not a course).
4. Then, only if there's a genuine trap: **one callout**, no more. If a section doesn't have a real gotcha, it doesn't get one — a callout in every section trains readers to stop reading them.

There used to be one 10–20 row "At a glance" table at the top of the sheet, disconnected from the sections explaining it. That's gone: lookup and learning now happen in the same motion, because the table sits right next to what it's a lookup *for*.

### Where error codes go: folded into the section, not a separate table

There also used to be a "Common errors" section at the end with a 12-row error/cause/fix table. That's gone too. An error code belongs **inside the section that actually causes it**, as a `Gotcha` or `Warning` callout — `TS2532` goes next to the narrowing section, not in a disconnected list at the bottom that repeats what the sections above already said.

Not every section needs an error code. Fold in the ones that are genuinely common; don't manufacture one just to have something in the slot.

### Topic ordering, concretely

Order by dependency, not by how the official docs group things and not alphabetically:

- If explaining topic B requires forward-referencing topic A ("we'll cover generics later"), A goes first.
- Basics that unlock several later topics go early even if they're individually less interesting.
- The last section or two may be a **short pointer** rather than a full treatment — "this goes deeper than a cheat sheet should, see the handbook" is a legitimate whole section for a genuinely advanced topic. Depth has to earn its place in a compact sheet.

## The format contract

Read `references/format-contract.md` for the complete list. The essentials:

### Allowed

`##` and `###` headings · paragraphs · `**bold**` · `_italic_` · `` `code` `` · fenced code with a **required** language tag · GFM pipe tables of **≤ 3 columns, 2–6 rows** · lists with **one** level of nesting · `[text](url)` links · the four callouts

### The four callouts

```markdown
> **Gotcha:** `typeof null === "object"`. Check for `null` explicitly.
> **Note:** Requires TypeScript 5.0 or later.
> **Tip:** `satisfies` gives validation without widening.
> **Warning:** `as` silently disables type checking.
```

No other labels exist. `Gotcha` is the highest-value one and the main reason readers trust a sheet — prefer it. **At most one callout per section.**

### Forbidden

`#` H1 (the title comes from frontmatter) · `####` and deeper · images and diagrams · raw HTML · **any MDX or JSX component** · tables with > 3 columns or > 6 rows · nested tables · footnotes · emoji carrying meaning · bare URLs in prose

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
- **Max 15 lines per block** — in a compact sheet, most examples should be well under this. A block pushing the limit is a sign the section is trying to show too much at once.
- **Self-contained** — copy-pasteable without invisible setup. No importing from a fictional module; if you need two related pieces, define both in the same block.
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

Before writing a callout, ask: **would a competent person actually make this mistake?**

- ✅ `typeof null === "object"` — yes, everyone hits this
- ✅ Narrowing is lost after an `await` — yes, and it's baffling when it happens
- ❌ "Remember to close your brackets" — no

Fake gotchas are worse than none: they train readers to skim past the real ones. And since each section gets **at most one**, it has to be the single best one — not the first one that came to mind.

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

1. **Execute or compile every code sample.** Not "it looks right" — actually run it. `npm run verify:samples` does this for TypeScript in CI and will catch you.
2. **Trace every non-obvious claim** to a primary source, and list that source in `verifiedAgainst`.
3. **Verify every error code** reproduces the described error, with the exact trigger you describe.
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
- [ ] Reading top to bottom, no section assumes something introduced later

Full list in `references/quality-checklist.md`.

## Anti-patterns

| Don't | Why |
|---|---|
| Pad with prose to look thorough | Directly opposes the product's purpose |
| Copy from another cheat sheet | Propagates their errors and adds nothing |
| Aim for exhaustive API coverage | A cheat sheet is *curated*; completeness kills scannability |
| Use a component "just this once" | Breaks the PDFs, which is the whole differentiator |
| Widen a table to 4 columns, or past 6 rows | Overflows the Paperwhite, and stops being a glance |
| Put more than one callout in a section | Trains readers to skim past all of them |
| Bring back a single top-of-page mega-table | The exact thing this revision fixed — lookup belongs next to its explanation |
| Invent a plausible-sounding gotcha | Trains readers to distrust the real ones |
| Set `lastVerified` without verifying | Destroys the only signal that makes the catalog trustworthy |

## Reference files

- `references/format-contract.md` — complete allowed/forbidden list with rationale
- `references/quality-checklist.md` — the full pre-ship checklist
- `references/worked-example.md` — a short, complete sheet using every allowed construct
