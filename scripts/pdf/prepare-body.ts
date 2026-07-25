/**
 * Transforms a sheet's Markdown body into the text fed to `cmarker.render()`.
 *
 * The only transform needed is callouts: `> **Gotcha:** text` blockquotes
 * become `<callout kind="Gotcha">text</callout>` HTML blocks, which the
 * Typst template intercepts via cmarker's `html` tag-dispatch mechanism
 * (see typst/cheatsheet.typ) to render with weight/border styling instead
 * of Typst's default `quote()` — grayscale-safe per specs/03-pdf-generation.md.
 *
 * Verified empirically (story B3) that cmarker parses nested Markdown
 * inside a custom container tag's body, so inline code/bold/links inside
 * a callout still render correctly.
 */
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';
import { toString as mdastToString } from 'mdast-util-to-string';
import { CALLOUT_LABELS } from '../../src/config/limits.ts';

const parser = unified().use(remarkParse).use(remarkGfm);
const stringifier = unified().use(remarkStringify).use(remarkGfm);

export function prepareBody(markdown: string): string {
  const tree: any = parser.parse(markdown);

  visitAndReplace(tree, (node) => {
    if (node.type !== 'blockquote') return null;

    const firstParagraph = node.children?.[0];
    if (!firstParagraph || firstParagraph.type !== 'paragraph') return null;

    const text = mdastToString(firstParagraph);
    const match = text.match(/^([A-Za-z]+):/);
    const label = match?.[1];
    if (!label || !(CALLOUT_LABELS as readonly string[]).includes(label)) return null;

    // Strip the leading "**Label:**" strong node and any following space
    // from the first paragraph so the callout body doesn't repeat it.
    const children = [...firstParagraph.children];
    if (children[0]?.type === 'strong') {
      children.shift();
    }
    if (children[0]?.type === 'text') {
      children[0] = { ...children[0], value: children[0].value.replace(/^\s+/, '') };
    }

    const innerParagraphs = [{ ...firstParagraph, children }, ...node.children.slice(1)];
    const innerMarkdown = stringifier
      .stringify({ type: 'root', children: innerParagraphs } as any)
      .trim();

    return {
      type: 'html',
      value: `<callout kind="${label}">\n\n${innerMarkdown}\n\n</callout>`,
    };
  });

  return stringifier.stringify(tree).trim() + '\n';
}

function visitAndReplace(tree: any, transform: (node: any) => any | null) {
  function walk(node: any) {
    if (!node.children) return;
    for (let i = 0; i < node.children.length; i++) {
      const replacement = transform(node.children[i]);
      if (replacement) {
        node.children[i] = replacement;
      } else {
        walk(node.children[i]);
      }
    }
  }
  walk(tree);
}
