/**
 * Numeric limits shared by the content linter, the PDF pipeline, and the
 * authoring skill. Single source of truth — see AGENTS.md rule 2 and
 * specs/02-content-format.md#code-sample-rules.
 *
 * MAX_CODE_LINE_LENGTH is derived arithmetically (4.12in small-format page
 * minus margins, at 8pt JetBrains Mono) and MUST be corrected by story B2
 * once measured against a real compile. See specs/stories/epic-b-pdf.md#b2.
 */
export const MAX_CODE_LINE_LENGTH = 52;
export const WARN_CODE_LINE_LENGTH = 48;
export const MAX_CODE_BLOCK_LINES = 15;
export const MAX_TABLE_COLUMNS = 3;
export const MAX_HEADING_DEPTH = 3;
export const MAX_LIST_NESTING = 1;
export const MIN_AT_A_GLANCE_ROWS = 10;
export const MAX_AT_A_GLANCE_ROWS = 20;
export const MIN_TOPIC_SECTIONS = 4;
export const MAX_TOPIC_SECTIONS = 10;
export const MAX_SUMMARY_LENGTH = 160;
export const WARN_WORD_COUNT = 1200;
export const STALENESS_WARNING_DAYS = 180;

export const CALLOUT_LABELS = ['Gotcha', 'Note', 'Tip', 'Warning'] as const;
