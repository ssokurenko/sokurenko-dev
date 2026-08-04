# Worked example

A short but complete sheet demonstrating every allowed construct and the gradual (basics → advanced) structure. Copy its shape, not its subject.

Subject chosen deliberately: **JavaScript equality** is small enough to show in full, has a natural simple → complex order, and has genuine gotchas.

---

````markdown
---
title: JavaScript Equality
description: How ==, ===, Object.is and reference equality actually behave — and where they surprise you.
cheatsheet:
  slug: javascript-equality
  section: languages
  summary: The equality operators, their coercion and reference rules, and the cases that trip everyone up.
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

## Mental model

JavaScript has three equality operations, and they differ only in how
much work they do before comparing: `===` does none, `==` coerces
first, `Object.is` is `===` plus two special cases. Objects always
compare by reference, never by content, regardless of which operator
you use.

## Strict equality

| Expression | Result |
|---|---|
| `1 === 1` | `true` |
| `1 === "1"` | `false` — no coercion |
| `NaN === NaN` | `false` |

`===` compares type and value with no conversion — the default choice,
and the right one unless you have a specific reason to reach for
another operator.

```js
1 === 1;        // true
1 === "1";      // false
```

> **Gotcha:** `NaN` is the only value not equal to itself, so
> `x === NaN` never works as a check. Use `Number.isNaN(x)` instead.

## Loose equality

| Expression | Result |
|---|---|
| `1 == "1"` | `true` — string coerced to number |
| `"" == 0` | `true` |
| `null == undefined` | `true` — special-cased |

`==` converts both operands to a common type first, using rules most
people never fully memorize.

```js
1 == "1";       // true
[] == false;    // true — both coerce to 0
```

> **Warning:** `==` with anything other than `null`/`undefined` hides
> bugs rather than preventing them. The one defensible use is
> `x == null`, which catches both `null` and `undefined` at once.

## Object.is and signed zero

| Comparison | `===` | `Object.is` |
|---|---|---|
| `NaN`, `NaN` | `false` | `true` |
| `0`, `-0` | `true` | `false` |

`Object.is` behaves like `===` except for `NaN` and signed zero —
the two cases the spec calls out as "SameValue" rather than
"SameValueZero" semantics.

```js
Object.is(NaN, NaN);   // true
Object.is(0, -0);      // false
```

> **Tip:** Reach for `Object.is` only when `NaN` or signed-zero
> identity genuinely matters. Otherwise `===` reads better and does
> the same thing for every other value.

## Reference equality

Objects, arrays, and functions compare by reference — content is
never inspected by any equality operator.

```js
const a = { x: 1 };
const b = { x: 1 };
a === b;   // false — different objects
```

To compare contents, compare the fields that matter, or use a real
deep-equality helper.

> **Gotcha:** `JSON.stringify(a) === JSON.stringify(b)` is a popular
> shortcut and a bad one — key order changes the result, and it
> throws on circular references.

## Further reading

- [ECMAScript specification — Abstract Equality](https://tc39.es/ecma262/#sec-islooselyequal)
- [MDN — Equality comparisons](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
````

---

## What this example demonstrates

| Requirement | Where |
|---|---|
| `Mental model` first, 3 sentences, no code, no table | Top |
| 4 topic sections, ordered simple → complex | Strict → Loose → Object.is → Reference |
| Each section opens with its own small quick-ref table | All four (2–3 rows each) |
| At most one callout per section | Every section has exactly one |
| No separate "Common errors" section | The `NaN` check mistake and the `JSON.stringify` trap are folded into the sections that cause them |
| `Further reading` last | Bottom |
| Every table ≤ 3 columns, ≤ 6 rows | All three tables |
| Every code line ≤ 52 chars | All blocks |
| Every fence tagged `js` | All blocks |
| Results in trailing comments | `// true`, `// false` |
| Complete, valid frontmatter | Top |

## Notes on the choices

- **No table on "Reference equality."** A quick-ref table isn't mandatory per section — this one has nothing worth tabulating (there's exactly one rule: objects compare by reference), so it goes straight to prose and an example instead of forcing a table that would just restate the sentence above it.
- **`Object.is` gets a 2-row, 3-column comparison table** rather than prose, because two operators × two edge cases is exactly what a table is for — four facts, instantly scannable.
- **`> **Warning:**` on `==`**, not `Gotcha`, because using `==` carelessly causes real defects rather than momentary confusion — matches the "does it cost time or cause harm" test in `SKILL.md`.
- **The old version of this example** had a fifth section, "Common errors," with a 4-row table repeating the `NaN` and reference-equality mistakes already covered above. It's gone — those exact facts now live as callouts in the sections that cause them, which is the whole point of this revision.
- **Word count is ~230**, comfortably under the 1000-word guideline. A beginner topic this size should be short; padding it out would be the anti-pattern the skill warns against.
