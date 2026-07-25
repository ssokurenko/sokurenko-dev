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

const ZONE_WEIGHTS: Record<string, string> = {
  'at-a-glance': '10',
  'common-errors': '8',
};

export function rehypePagefindWeights() {
  return (tree: HastNode, file: any) => {
    const frontmatter = file?.data?.astro?.frontmatter as
      | { cheatsheet?: { section?: string; difficulty?: string; tags?: string[]; topicVersion?: string } }
      | undefined;
    const cs = frontmatter?.cheatsheet;

    let zone = 'other';
    let metaAttached = false;

    for (const node of tree.children as HastNode[]) {
      if (node.type !== 'element') continue;

      if (node.tagName === 'h2' || node.tagName === 'h3') {
        const text = hastToString(node).trim();
        if (node.tagName === 'h2') {
          zone = text === 'At a glance' ? 'at-a-glance' : text === 'Common errors' ? 'common-errors' : 'other';
        }
        setProp(node, 'dataPagefindWeight', '5');
      } else if (node.tagName === 'table' && ZONE_WEIGHTS[zone]) {
        setProp(node, 'dataPagefindWeight', ZONE_WEIGHTS[zone]);
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
        setProp(codeNode, 'dataPagefindWeight', '4');

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
