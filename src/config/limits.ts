/**
 * Numeric limits shared by the content linter, the PDF pipeline, and the
 * authoring skill. Single source of truth — see AGENTS.md rule 2 and
 * specs/02-content-format.md#code-sample-rules.
 *
 * MAX_CODE_LINE_LENGTH is derived arithmetically (4.12in small-format page
 * minus margins, at 8pt JetBrains Mono) and confirmed by measurement in
 * story B2. See specs/03-pdf-generation.md#page-geometry.
 */
export const MAX_CODE_LINE_LENGTH = 52;
export const WARN_CODE_LINE_LENGTH = 48;
export const MAX_CODE_BLOCK_LINES = 15;
export const MAX_TABLE_COLUMNS = 3;
export const MAX_HEADING_DEPTH = 3;
export const MAX_LIST_NESTING = 1;

/**
 * Per-section quick-reference tables (specs/02-content-format.md#quick-ref-tables).
 * There is no single "at a glance" mega-table — each topic section opens
 * with a small lookup table for just that concept. A table bigger than
 * this is a sign the section is trying to cover too much; split it.
 */
export const WARN_SECTION_TABLE_ROWS = 6;

export const MIN_TOPIC_SECTIONS = 4;
export const MAX_TOPIC_SECTIONS = 9;
export const MAX_SUMMARY_LENGTH = 160;

/**
 * A cheat sheet is compact by design — see specs/00-product-overview.md.
 * This is a warning, not a hard cap: cut before padding, but don't force
 * garbled prose, and never drop a section the topic needs, just to hit a
 * number. Raised from 800 once sheets with 7+ topic sections landed — at
 * the skill's prescribed shape (table + prose + callout per section) 800
 * only ever fit six sections, so the number was pushing structure rather
 * than trimming padding.
 */
export const WARN_WORD_COUNT = 1000;

export const STALENESS_WARNING_DAYS = 180;

export const CALLOUT_LABELS = ['Gotcha', 'Note', 'Tip', 'Warning'] as const;
