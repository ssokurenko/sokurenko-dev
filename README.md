# sokurenko.dev

A web-development cheat-sheet reference catalog. Each sheet is one Markdown
file that renders to an HTML page and two Kindle-tuned PDFs — one source,
zero divergence.

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).
PDFs are typeset with [Typst](https://typst.app).

## Documentation

Start with [`AGENTS.md`](AGENTS.md), then [`specs/`](specs/README.md) —
the specs are authoritative for anything non-trivial.

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server at `localhost:4321` (no PDFs) |
| `npm run pdf:dev -- <slug>` | Build one sheet's PDFs into `public/pdf/` |
| `npm run lint` | Run the content linter |
| `npm run verify` | Everything CI runs (lint, types, tests, PDF validation) |
| `npm run build` | Full production build: lint → PDFs → site → copy PDFs |
| `npm run preview` | Preview the production build locally |

## Requirements

- Node (see `.nvmrc`)
- [Typst](https://typst.app) — `brew install typst`, needed for `npm run build`
