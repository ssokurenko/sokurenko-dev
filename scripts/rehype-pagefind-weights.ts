/**
 * Rehype plugin: applies Pagefind relevance weighting and metadata/filter
 * attributes to a rendered cheat sheet, per
 * specs/05-navigation-search.md#relevance-tuning and #metadata-and-filters.
 * Authors never write `data-pagefind-*` attributes by hand — this plugin
 * derives them from document structure (headings, tables, inline code)
 * and frontmatter.
 *
 * Also implements symbol search (specs/05#symbol-search): punctuation-
 * heavy inline code gets a hidden, indexed alias span, since Pagefind's
 * tokenizer drops punctuation and would otherwise make `??` unsearchable.
 */
import { visit } from 'unist-util-visit';
import { toString as hastToString } from 'hast-util-to-string';
import { SYMBOL_ALIASES } from '../src/config/symbol-aliases.ts';

type HastNode = any;

// Every topic section carries its own small quick-ref table now (no
// single "at a glance" mega-table to special-case) — so every table
// gets the same high weight, since each one is the fast-answer content
// for its section.
const TABLE_WEIGHT = '8';
const HEADING_WEIGHT = '5';
const INLINE_CODE_WEIGHT = '4';

export function rehypePagefindWeights() {
  return (tree: HastNode, file: any) => {
    const frontmatter = file?.data?.astro?.frontmatter as
      | { cheatsheet?: { section?: string; difficulty?: string; tags?: string[]; topicVersion?: string } }
      | undefined;
    const cs = frontmatter?.cheatsheet;

    let metaAttached = false;

    for (const node of tree.children as HastNode[]) {
      if (node.type !== 'element') continue;

      if (node.tagName === 'h2' || node.tagName === 'h3') {
        setProp(node, 'dataPagefindWeight', HEADING_WEIGHT);
      } else if (node.tagName === 'table') {
        setProp(node, 'dataPagefindWeight', TABLE_WEIGHT);
      }

      // Attach section/difficulty/tag metadata + filters once, on the
      // first real element, so Pagefind's per-page facets are populated.
      if (!metaAttached && cs) {
        setProp(node, 'dataPagefindMeta', `section:${cs.section}, difficulty:${cs.difficulty}, version:${cs.topicVersion}`);
        const filterValues = [
          `section:${cs.section}`,
          `difficulty:${cs.difficulty}`,
          ...(cs.tags ?? []).map((t) => `tags:${t}`),
        ];
        setProp(node, 'dataPagefindFilter', filterValues.join(', '));
        metaAttached = true;
      }

      visit(node, 'element', (codeNode: HastNode, index, parent) => {
        if (codeNode.tagName !== 'code') return;
        setProp(codeNode, 'dataPagefindWeight', INLINE_CODE_WEIGHT);

        const text = hastToString(codeNode).trim();
        const alias = SYMBOL_ALIASES[text];
        if (alias && parent && typeof index === 'number') {
          const aliasNode: HastNode = {
            type: 'element',
            tagName: 'span',
            properties: { className: ['sr-only'], dataPagefindBody: true },
            children: [{ type: 'text', value: alias }],
          };
          parent.children.splice(index + 1, 0, aliasNode);
        }
      });
    }
  };
}

function setProp(node: HastNode, key: string, value: string) {
  node.properties = node.properties ?? {};
  node.properties[key] = value;
}
