# Worked example

A short but complete sheet demonstrating every allowed construct and the required structure. Copy its shape, not its subject.

Subject chosen deliberately: **JavaScript equality** is small enough to show in full, and has genuine gotchas.

---

````markdown
---
title: JavaScript Equality
description: How ==, ===, Object.is and coercion actually behave — and where they surprise you.
cheatsheet:
  slug: javascript-equality
  section: languages
  summary: The three equality operators, the coercion table, and the cases that trip everyone up.
  topicVersion: "ES2024"
  verifiedAgainst:
    - label: ECMAScript specification — Abstract Equality
      url: https://tc39.es/ecma262/#sec-islooselyequal
    - label: MDN — Equality comparisons
      url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness
  lastVerified: 2026-07-25
  difficulty: beginner
  tags: [equality, coercion, operators]
  related:
    - languages/typescript
---

## At a glance

| Expression | Result |
|---|---|
| `1 === 1` | `true` |
| `1 == "1"` | `true` — string coerced to number |
| `1 === "1"` | `false` — no coercion |
| `null == undefined` | `true` — special-cased |
| `null === undefined` | `false` |
| `NaN === NaN` | `false` |
| `Object.is(NaN, NaN)` | `true` |
| `0 === -0` | `true` |
| `Object.is(0, -0)` | `false` |
| `[] == false` | `true` — both coerce to `0` |
| `[] === false` | `false` |
| `"" == 0` | `true` |
| `{} == {}` | `false` — different references |
| `typeof null` | `"object"` |

## Mental model

JavaScript has three equality operations, and they differ only in how much
work they do before comparing. `===` compares type and value with no
conversion. `==` converts operands to a common type first, using rules most
people never fully memorize. `Object.is` behaves like `===` except for two
special values.

Objects are compared by reference, never by content. Two objects with
identical properties are never equal to each other, which is the single most
common source of confused equality checks.

The practical consequence is that `===` is the default, `Object.is` is for
`NaN` and signed zero, and `==` has exactly one defensible use: checking for
`null` or `undefined` together.

## Strict equality

`===` returns `true` when both operands have the same type and the same
value. No coercion happens.

```js
1 === 1;        // true
1 === "1";      // false
true === 1;     // false
```

> **Gotcha:** `NaN === NaN` is `false`. `NaN` is the only value not
> equal to itself. Use `Number.isNaN(x)` to test for it.

## Loose equality

`==` coerces before comparing. The rules are specified but unintuitive.

```js
1 == "1";       // true
"" == 0;        // true
[] == false;    // true
```

> **Warning:** `==` with anything other than `null`/`undefined` hides
> bugs rather than preventing them. Most style guides ban it, and the
> ban is justified.

The one useful case is the combined nullish check:

```js
if (x == null) {
  // true for null AND undefined
}
```

## Object.is

Identical to `===` except for two values.

| Comparison | `===` | `Object.is` |
|---|---|---|
| `NaN`, `NaN` | `false` | `true` |
| `0`, `-0` | `true` | `false` |

```js
Object.is(NaN, NaN);   // true
Object.is(0, -0);      // false
```

> **Tip:** Reach for `Object.is` only when signed zero or `NaN`
> identity genuinely matters. Otherwise `===` reads better.

## Reference equality

Objects, arrays and functions compare by reference.

```js
const a = { x: 1 };
const b = { x: 1 };

a === b;        // false — different objects
a === a;        // true
```

To compare contents, compare the fields you care about, or use a
structural-equality helper:

```js
const same =
  a.x === b.x && a.y === b.y;
```

> **Gotcha:** `JSON.stringify(a) === JSON.stringify(b)` is a popular
> shortcut and a bad one — key order changes the result, and it throws
> on circular references.

## Common errors

| Symptom | Cause | Fix |
|---|---|---|
| `NaN` check always false | `x === NaN` | `Number.isNaN(x)` |
| Array equality fails | Reference comparison | Compare elements |
| `"0"` treated as falsy | Confusing `==` with truthiness | Use `===` |
| `undefined` slips past | `x === null` only | `x == null` |

## Further reading

- [ECMAScript specification — Abstract Equality](https://tc39.es/ecma262/#sec-islooselyequal)
- [MDN — Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
````

---

## What this example demonstrates

| Requirement | Where |
|---|---|
| `At a glance` first, 14 rows, frequency-ordered | Top |
| `Mental model` second, three paragraphs, no code | After the table |
| 4 topic sections, each with code and a callout | Strict / Loose / Object.is / Reference |
| `Common errors` with 3 columns | Near the end |
| `Further reading` last | Bottom |
| All four callout labels used correctly | Throughout |
| Every table ≤ 3 columns | All three tables |
| Every code line ≤ 52 chars | All blocks |
| Every fence tagged `js` | All blocks |
| Results in trailing comments | `// true`, `// false` |
| Real gotchas only | `NaN`, `JSON.stringify`, reference equality |
| No color-dependent information | Throughout |
| Complete, valid frontmatter | Top |

## Notes on the choices

- **The `Object.is` comparison table** is a case where a 3-column table beats prose. Two operators, two edge cases — a table shows the whole story in four lines.
- **`> **Warning:**` on `==`** rather than `Gotcha`, because using `==` carelessly causes real defects rather than momentary confusion.
- **The `JSON.stringify` gotcha** is included because it's a genuinely popular wrong answer. That's the bar: a mistake competent people actually make.
- **`typeof null` appears in "At a glance"** but has no topic section, because it's a one-line fact with nothing to explain. Not every row needs a section — but most should have one, so the table can deep-link.
- **Word count is ~380**, well under the 1,200 warning. A beginner topic should be short; padding it would be the anti-pattern.
