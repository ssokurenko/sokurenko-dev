/**
 * Punctuation-heavy inline code that Pagefind's tokenizer would otherwise
 * drop entirely (its default tokenizer strips punctuation), so searching
 * `??` or `?.` returns nothing without this. See
 * specs/05-navigation-search.md#symbol-search.
 *
 * Keys are matched verbatim against inline-code text content.
 */
export const SYMBOL_ALIASES: Record<string, string> = {
  '??': 'nullish coalescing operator question question',
  '?.': 'optional chaining operator question dot',
  '===': 'strict equality triple equals',
  '!==': 'strict inequality not triple equals',
  '==': 'loose equality double equals',
  '!=': 'loose inequality not equals',
  '=>': 'arrow function fat arrow',
  '...': 'spread rest operator dots',
  '&&': 'logical and operator ampersand',
  '||': 'logical or operator pipe',
  'as const': 'as const assertion literal readonly',
  satisfies: 'satisfies operator type check',
  keyof: 'keyof operator key union',
  infer: 'infer keyword conditional type capture',
};
