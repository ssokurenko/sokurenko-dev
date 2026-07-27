# sokurenko.dev

A web-development **cheat-sheet reference catalog**. Astro 7 + Starlight 0.41.

Each cheat sheet is one Markdown file that renders to three outputs:

1. An HTML page
2. A PDF typeset for small Kindles (Paperwhite 6.8″)
3. A PDF typeset for large Kindles (Scribe 10.2″)

**One source, three outputs, zero divergence.** Most rules below exist to protect that guarantee.

## Read the specs first

`specs/` is authoritative. Before non-trivial work, read the relevant spec — do not infer intent from the code.

| Task | Read |
|---|---|
| Anything | [specs/00-product-overview.md](specs/00-product-overview.md) |
| Adding content, routes, or frontmatter | [specs/01-information-architecture.md](specs/01-information-architecture.md) |
| Writing or tooling a cheat sheet | [specs/02-content-format.md](specs/02-content-format.md) |
| PDF output | [specs/03-pdf-generation.md](specs/03-pdf-generation.md) |
| Front page | [specs/04-front-page.md](specs/04-front-page.md) |
| Search or navigation | [specs/05-navigation-search.md](specs/05-navigation-search.md) |
| Starlight overrides, page layout | [specs/06-cheatsheet-page-template.md](specs/06-cheatsheet-page-template.md) |
| Build or CI | [specs/07-build-and-deploy.md](specs/07-build-and-deploy.md) |
| Shipping anything | [specs/09-quality-bar.md](specs/09-quality-bar.md) |

Delivery backlog: [specs/stories/](specs/stories/).

## Writing a cheat sheet

**Use the `writing-cheatsheets` skill.** It encodes the full workflow, the format contract, and the quality bar. Do not write a sheet from memory of these rules.

## Hard rules

Violating any of these breaks the three-output guarantee or the site's credibility.

1. **No MDX components in cheat sheets.** Cheat sheets (anything with a `cheatsheet` frontmatter block) must be plain `.md` — Typst cannot render JSX, so a component in a sheet means the PDF silently loses content. Page-level UI on a sheet (the PDF download bar, badges) is injected via Starlight **component overrides**, never authored inline. Only the front page (`src/content/docs/index.mdx`) is exempt, to use `SectionGrid` for its dynamic card grid.

2. **No section index pages.** No `<section>/index.md` or `<section>/index.mdx`, ever — see [specs/01](specs/01-information-architecture.md#no-section-index-pages) for why this was tried and reversed. The sidebar's `autogenerate` already lists every sheet in a section; the homepage's `SectionGrid` card links straight to a sheet, not an index. Don't reintroduce conditional "index if it exists, else the sheet" logic.

3. **Code lines ≤ 52 characters.** E-ink cannot scroll horizontally, so overflow is a correctness bug. The limit lives in one exported constant; never hardcode it a second time.

4. **Constrained Markdown only.** Allowed: `##`/`###`, paragraphs, bold/italic/inline code, fenced code with a language tag, ≤ 3-column GFM tables, single-nested lists, links, and the four callout labels (`Gotcha:`, `Note:`, `Tip:`, `Warning:`). Everything else is forbidden — see spec 02 for the full list and the reasons.

5. **Never convey meaning by color alone.** Kindle is grayscale. This also satisfies WCAG 1.4.1.

6. **Slugs are permanent.** A sheet's URL is printed in every PDF footer and encoded in every cover QR code, including copies already sideloaded onto readers. Renaming a slug orphans physical artifacts. If it must change, 301-redirect the old path forever.

7. **`lastVerified` is a human assertion.** It means someone re-read the primary source. Never auto-bump it.

8. **Never commit generated artifacts.** `.pdf-cache/`, `src/generated/`, `public/pdf/` are gitignored.

9. **The taxonomy lives in one place.** `src/config/taxonomy.ts`. Anything hardcoding a section name a second time is a bug.

10. **No framework runtime, no third-party requests.** No React/Vue/Svelte island, no CDN, no embeds. Budgets in spec 09. (`react`/`react-dom` in `devDependencies` are test-only, for compiling React cheat-sheet samples — see `scripts/verify-samples.ts`. Nothing ships them to the site.)

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

### Commands

```bash
npm run dev                      # site only; no PDFs
npm run pdf:dev -- typescript     # build one sheet's PDFs into public/pdf/
npm run lint                     # content linter — run before committing content
npm run verify                   # everything CI runs
npm run build                    # lint → pdf:build → astro build → pdf:copy
```

`npm run build` phase order is load-bearing: PDFs must exist before `astro build` so the manifest can supply real page counts and file sizes to the download links. See [specs/03](specs/03-pdf-generation.md#build-pipeline).

### Typst

Required for `npm run build`. `brew install typst` (pin 0.15.x). Packages and fonts are vendored under `typst/`; always compile with:

```
--font-path typst/fonts --ignore-system-fonts --package-path typst/packages --root .
```

Without `--ignore-system-fonts`, locally installed fonts change the output and PDFs differ per machine.

## Layout

```
specs/                    authoritative specifications
.claude/skills/           writing-cheatsheets skill
src/
  components/             Starlight component overrides
  config/                 taxonomy.ts, popular.ts, symbol-aliases.ts
  content/docs/<section>/ cheat sheets, one .md each
  generated/              gitignored build products
  styles/custom.css       theming
scripts/
  lint-cheatsheets.mjs
  pdf/                    Typst orchestration
typst/                    templates, formats, theme, vendored fonts + packages
```

## Theming

Preserve the existing look — it is deliberate and distinctive.

- **System font stack** on the site title, `h1`, and `h2` (`system-ui, -apple-system, …`) — no web font request, nothing to preload.
- **LinkedIn blue ramp**: `#004182` / `#0a66c2` / `#dce6f1`, inverted for light mode.
- **Frosted-glass header** via `backdrop-filter`.
- PDFs use Inter (the same heading font as the web) throughout, including the front-matter title, plus a separate e-ink-optimized body/code type and grayscale colour system — see spec 03. Both web and PDF previously used a Borel display font; it was removed from both in favor of standard fonts everywhere, and the font itself was deleted from `typst/fonts/`.

## Documentation

Full documentation: https://docs.astro.build · Starlight: https://starlight.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Starlight component overrides](https://starlight.astro.build/guides/overriding-components/)
- [Typst reference](https://typst.app/docs/reference/) · [cmarker](https://typst.app/universe/package/cmarker/) · [tiaoma](https://typst.app/universe/package/tiaoma/)
- [Pagefind](https://pagefind.app)

Framework components and i18n guides are omitted deliberately: no framework runtime is permitted (rule 9), and i18n is an explicit non-goal (spec 00).
