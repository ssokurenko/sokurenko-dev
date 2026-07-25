# Pre-ship checklist

Work top to bottom. Do not set `lastVerified` until everything above it passes.

## 1. Scope

- [ ] The sheet covers exactly one topic
- [ ] Out-of-scope areas were consciously decided and belong to other sheets
- [ ] Topics are sequenced so each one only depends on concepts already covered above it
- [ ] Topic is narrow enough to stay under ~800 words

## 2. Structure

- [ ] `## Mental model` is the first section — 2–4 sentences, no code, no table
- [ ] 4–9 topic sections, ordered simple → complex
- [ ] No single "At a glance" mega-table anywhere — lookup lives inside each section instead
- [ ] No separate "Common errors" section — error codes are folded into the section that causes them
- [ ] `## Further reading` is the last section
- [ ] No heading deeper than `###`
- [ ] Every topic section has at least one code sample
- [ ] No section has more than one callout

## 3. Per-section quick-ref tables

- [ ] Each topic section's table covers only that section's concept, not the whole sheet
- [ ] 2–6 rows per table
- [ ] 2–3 columns; column 1 is what the reader would type
- [ ] Table comes immediately after the heading, before the prose
- [ ] Ordered by frequency of need within that concept
- [ ] Self-contained — no forward references to a later section

## 4. Code

- [ ] Every line ≤ 52 characters
- [ ] Every block ≤ 15 lines
- [ ] Every fence has a language tag
- [ ] Two-space indentation, no tabs
- [ ] Every block copy-pasteable without invisible setup
- [ ] Results shown in trailing comments, not prose
- [ ] **Every sample actually compiles or runs** (or is asserted to fail as described)

## 5. Accuracy

- [ ] Every claim traced to a primary source
- [ ] `verifiedAgainst` lists those sources
- [ ] `topicVersion` matches the version documented
- [ ] Version-gated claims confirmed against release notes
- [ ] Every error code folded into a section reproduces the described error, with the exact trigger given
- [ ] Nothing copied from another cheat sheet
- [ ] No claim resting only on recall

## 6. Writing

- [ ] Terse — no word that isn't carrying meaning
- [ ] Second person, present tense
- [ ] No hedging ("may sometimes possibly")
- [ ] No filler openers ("in this section we will…")
- [ ] Terminology consistent throughout, matching the primary source
- [ ] Every surprising fact is followed by why it matters
- [ ] Every gotcha passes the gotcha test: a competent person would really make this mistake

## 7. Grayscale safety

- [ ] No information conveyed by color alone
- [ ] No reliance on syntax-highlight hue to make a point
- [ ] Callout labels carry the meaning, not their color
- [ ] Desaturating a screenshot loses nothing

## 8. Format contract

- [ ] No forbidden constructs (H1, `####`, images, HTML, MDX, footnotes, emoji semantics)
- [ ] No table over 3 columns or 6 rows
- [ ] Lists nested at most one level
- [ ] No bare URLs in prose
- [ ] Only the four recognized callout labels

## 9. Frontmatter

- [ ] `slug` globally unique — and understood to be permanent
- [ ] `section` matches the taxonomy
- [ ] `summary` ≤ 160 chars, one sentence
- [ ] `topicVersion` set
- [ ] `verifiedAgainst` has at least one entry
- [ ] `difficulty` set
- [ ] `tags` has at least one entry
- [ ] `related` entries all resolve

## 10. Tooling

```bash
npm run lint              # zero errors AND zero warnings
npm run pdf:dev -- <slug>
npm run verify:samples    # sample compilation, where a harness exists
```

- [ ] `npm run lint` clean
- [ ] Both PDFs build with no Typst warnings
- [ ] Sample-verification tests pass

## 11. PDF inspection

Open **both** PDFs. The small one is where problems show.

- [ ] No code clipped at the right edge
- [ ] No `↪` wrap markers (they mean a line slipped past the linter)
- [ ] No heading orphaned at the foot of a page
- [ ] Each small per-section table reads correctly on its own page — it should never need to break across a page
- [ ] No callout split across pages
- [ ] Code comfortably legible, not merely present
- [ ] Contents page links work
- [ ] Footer URL correct on every body page
- [ ] Cover QR scans to the live page — test from an e-ink panel, not an LCD
- [ ] No trailing blank page
- [ ] Text selectable (not rasterized)

## 12. Page

- [ ] Renders correctly in light and dark themes
- [ ] Readable at 320 px viewport width
- [ ] Copy buttons work on every code block
- [ ] Download bar shows correct page counts and file sizes
- [ ] Canonical URL matches the PDF footer character for character
- [ ] Lighthouse ≥ 95 in all categories
- [ ] Zero axe violations

## 13. Review

- [ ] Reviewed by someone fluent in the topic
- [ ] Every correction applied
- [ ] Reviewer opened the actual PDFs, not just the diff

## 14. Finally

- [ ] `lastVerified` set to today — because you actually verified today
