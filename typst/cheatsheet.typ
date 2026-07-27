// Shared PDF template for every cheat sheet, in both Kindle formats.
// See specs/03-pdf-generation.md. Renders Markdown via cmarker so there is
// no custom Markdown→Typst transpiler to maintain (story B1 finding).
#import "@preview/cmarker:0.1.10"
#import "@preview/tiaoma:0.3.0"
#import "theme/colors.typ" as colors

#let theme-path = "theme/eink.tmTheme"

// --- Callouts -----------------------------------------------------------
// The four labels are distinguishable in grayscale by border weight/pattern
// and the label text itself, never by hue alone (specs/02, specs/09 —
// WCAG 1.4.1 use-of-color, satisfied for free).
#let callout-style = (
  Gotcha: (weight: 2pt, dash: none, label-bold: true, fg: colors.ink),
  Warning: (weight: 3pt, dash: none, label-bold: true, fg: colors.ink),
  Note: (weight: 1pt, dash: none, label-bold: true, fg: colors.ink-mid),
  Tip: (weight: 1pt, dash: "dashed", label-bold: true, fg: colors.ink-mid),
)

#let callout-block(kind, body) = {
  let style = callout-style.at(kind, default: callout-style.Note)
  let side-stroke = stroke(paint: style.fg, thickness: style.weight, dash: style.dash)
  block(
    fill: colors.panel,
    inset: 8pt,
    width: 100%,
    breakable: false,
    stroke: (left: side-stroke,),
    [#text(fill: style.fg, weight: "bold")[#kind:] #body],
  )
}

// --- Front matter ----------------------------------------------------------
// A compact header, not a dedicated cover page: QR beside the title/summary,
// immediately followed by Contents on the same page. Title uses the same
// heading font as the rest of the document (no display font) — this is a
// reference, not a poster.
#let frontmatter(format, title, summary, topic-version, last-verified, url) = {
  // Local, tight paragraph metrics — this column is ~2.5in of narrow
  // wrapped text next to the QR, not full-width body prose. Without this
  // override it inherits the document's body `leading` (1.35em, tuned for
  // wide single-column paragraphs) for the wrapped summary line, which
  // reads as an oversized gap next to the tight meta line above it.
  // Typst's own default leading is ~0.65em — that's the right scale here,
  // not the body-prose value the document sets globally.
  set par(leading: 0.55em, spacing: 0.6em, justify: false)
  grid(
    columns: (format.qr-size, 1fr),
    column-gutter: 12pt,
    align: (left + top, left + top),
    tiaoma.qrcode(url, options: (scale: 2.5), width: format.qr-size, height: format.qr-size),
    [
      #text(font: format.heading-font, weight: "bold", size: format.cover-title-size, fill: colors.ink)[#title]
      #v(0.4em, weak: true)
      #text(size: format.cover-meta-size, fill: colors.ink-mid)[
        Version #topic-version · verified #last-verified
      ]
      #v(0.35em, weak: true)
      #text(size: format.cover-meta-size, fill: colors.ink-mid)[#summary]
    ],
  )
}

// --- Staleness notice -----------------------------------------------------
#let staleness-notice(days) = block(
  fill: colors.panel,
  inset: 8pt,
  width: 100%,
  stroke: (left: 3pt + colors.ink),
  breakable: false,
  [#text(weight: "bold")[Warning:] Last verified #days days ago — may not reflect current behavior.],
)

// --- Main entry -----------------------------------------------------------
#let cheatsheet(
  format: none,
  title: "",
  summary: "",
  url: "",
  topic-version: "",
  last-verified: "",
  stale: false,
  stale-days: 0,
  body-path: none,
) = {
  set document(title: title, author: "sokurenko.dev", keywords: ("cheat sheet", title), date: none)

  set page(
    width: format.page-width,
    height: format.page-height,
    margin: (x: format.margin.x, top: format.margin.top, bottom: format.margin.bottom),
    footer: context {
      if counter(page).get().first() > 1 {
        set text(size: format.footer-size, fill: colors.ink-faint)
        grid(
          columns: (1fr, auto),
          align: (left, right),
          link(url)[#url],
          [#counter(page).display("1 / 1", both: true)],
        )
      }
    },
  )

  set text(font: format.body-font, size: format.body-size, lang: "en")
  set par(leading: format.body-leading, spacing: format.body-leading * 1.6, justify: false)

  show heading.where(level: 2): it => {
    set text(size: format.h2-size, font: format.heading-font, weight: "semibold", fill: colors.ink)
    block(above: 1.6em, below: 0.8em, breakable: false, it.body)
  }
  show heading.where(level: 3): it => {
    set text(size: format.h3-size, font: format.heading-font, weight: "semibold", fill: colors.ink-mid)
    block(above: 1.2em, below: 0.6em, breakable: false, it.body)
  }

  set raw(theme: theme-path)
  // Ligatures off: JetBrains Mono merges `===` into a single glyph that
  // reads as `≡`, which is actively misleading on a reference where the
  // reader needs to see the literal characters they'd type (found via
  // B3's fixture render — `==` was unaffected, `===` was not).
  show raw: set text(font: format.code-font, size: format.code-size, features: (calt: 0, liga: 0, dlig: 0))
  show raw.where(block: true): it => block(
    fill: colors.panel,
    inset: format.code-inset,
    width: 100%,
    radius: 2pt,
    stroke: (left: 2pt + colors.hairline),
    breakable: true,
    it,
  )
  show raw.where(block: false): it => box(
    fill: colors.panel,
    outset: (y: 2pt),
    inset: (x: 2pt),
    radius: 1.5pt,
    it,
  )

  show table: it => {
    set table(stroke: (bottom: 0.5pt + colors.hairline), inset: 5pt)
    it
  }

  show link: it => underline(text(fill: colors.ink, it))

  // --- Front matter + Contents, one page, no separate title page ---
  frontmatter(format, title, summary, topic-version, last-verified, url)
  v(1em)
  line(length: 100%, stroke: 0.5pt + colors.hairline)
  v(0.8em)
  text(font: format.heading-font, size: format.h3-size, weight: "semibold", fill: colors.ink-mid)[Contents]
  v(0.5em)
  outline(title: none, depth: 3)
  pagebreak()

  if stale {
    staleness-notice(stale-days)
    v(1em)
  }

  // The sheet's own Markdown already ends with a hand-authored
  // `## Further reading` section (specs/02-content-format.md) — the
  // template does not synthesize a second one.
  cmarker.render(
    read(body-path),
    html: (
      callout: ("normal", (attrs, body) => callout-block(attrs.at("kind"), body)),
    ),
  )
}
