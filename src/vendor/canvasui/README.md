# Canvas UI — vendored

`PeelVanilla.ts` is the vanilla-TypeScript build of the Canvas UI **Peel** component, fetched from
the project's shadcn registry and checked in rather than installed:

- Upstream: <https://canvasui.dev/docs/components/peel>
- Source of truth: <https://canvasui.dev/r/peel-vanilla.json> (`files[0].content`)
- Fetched: 2026-08-23

Vendored, not installed via `npx shadcn@latest add @canvas-ui/peel-vanilla`, for two reasons. The
CLI writes to `components/canvasui/`, which is not this project's layout; and the file it writes
does not compile — see below.

## Local modifications

1. The import on line 1 was rewritten from `../rect-cache` to `./rect-cache`.
2. `rect-cache.ts` is **ours**. Upstream's file imports `createRectCache` from a module the registry
   never publishes: `https://canvasui.dev/r/rect-cache.json` returns 404 and no such item exists in
   the 210-entry `registry.json`. The component as shipped therefore has an unresolvable import. Our
   implementation covers the whole surface Peel consumes — `{ current, destroy }`.

Nothing else is changed. Keep it that way: on an upstream refresh, re-fetch the registry JSON, apply
modification 1, and diff.

## Browser support — read this before debugging

Peel renders through the **HTML-in-Canvas API** (`<canvas layoutsubtree>`, `ctx.drawElementImage`,
`canvas.requestPaint`) plus WebGL2. That API is Chrome-only and **not in stable** — it needs
`chrome://flags/#canvas-draw-element`, or an origin-trial token, which this site deliberately does
not carry. Firefox and Safari have announced no implementation.

So the effect is invisible to essentially every real visitor, by design. `HomeHero.astro` probes for
support before it even downloads this module, and everyone else gets the plain hero. If you are
looking at the home page and see no peel, that is the expected path, not a bug — enable the flag.
