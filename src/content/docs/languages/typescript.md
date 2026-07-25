---
title: TypeScript
description: Type system, narrowing, generics, and utility types — with the gotchas that cost you an afternoon.
cheatsheet:
  slug: typescript
  section: languages
  summary: Everything you need to reason about TypeScript's type system, from narrowing to conditional types.
  topicVersion: "5.9"
  verifiedAgainst:
    - label: TypeScript Handbook
      url: https://www.typescriptlang.org/docs/handbook/
    - label: TypeScript 5.9 release notes
      url: https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/
  lastVerified: 2026-07-25
  difficulty: intermediate
  tags: [types, generics, narrowing, utility-types]
  pdf: true
---

## At a glance

| Syntax | Meaning |
|---|---|
| `as const` | Literal type, deeply `readonly` |
| `satisfies T` | Check against `T`, keep the narrow type |
| `keyof T` | Union of `T`'s keys |
| `typeof x` | Type of value `x` (type position) |
| `T[K]` | Indexed access |
| `T \| U` | Union — either shape |
| `T & U` | Intersection — both shapes |
| `T extends U ? A : B` | Conditional type |
| `infer U` | Capture a type in a conditional |
| `Partial<T>` | All properties optional |
| `Pick<T, K>` | Keep only keys `K` |
| `Omit<T, K>` | Drop keys `K` |
| `Record<K, V>` | Object with keys `K`, values `V` |
| `ReturnType<F>` | `F`'s return type |
| `x is T` | User-defined type guard |
| `asserts x is T` | Assertion function |
| `?.` / `??` | Optional chain / nullish coalesce |
| `unknown` vs `any` | Safe unknown vs checking off |

## Mental model

Types are erased. They exist only while `tsc` is checking your code —
nothing you write in a type annotation survives to runtime. This is why
validating a value at a boundary (an HTTP body, `JSON.parse` output)
needs a real runtime check, not a type annotation. A type is a promise
you're making to the compiler, not a guard that runs when your program
executes.

The type system is structural, not nominal. Compatibility is about
shape: two unrelated classes with identical members are interchangeable
wherever either is expected. Most "why did that assignment silently
work" surprises trace back to this one rule.

Inference is the default, and it's usually better than an explicit
annotation. Annotate boundaries — function parameters, exported return
types, empty containers — and let inference handle the rest. Annotating
everything just widens types and throws away information the compiler
already had.

## Types vs interfaces

Both describe shapes. `interface` can be extended and merges
declarations of the same name across files; `type` cannot merge but can
express unions, tuples, and mapped types that `interface` can't.

```ts
interface User {
  id: string;
}
type Id = string | number;
```

> **Gotcha:** Two `interface User { … }` declarations in
> different files silently merge into one. A stray
> declaration in a `.d.ts` file can widen your type
> without a single visible edit to your own code.

> **Tip:** Default to `type`. Reach for `interface` only
> when you specifically want declaration merging (common
> in library `.d.ts` files, rare in application code).

## Narrowing

TypeScript narrows a union to a more specific type inside a guarded
branch: `typeof`, `instanceof`, `in`, truthiness, equality checks, and
discriminated unions all narrow.

```ts
function len(x: string | string[]) {
  if (typeof x === "string") {
    return x.length; // x: string
  }
  return x.length; // x: string[]
}
```

Discriminated unions narrow on a shared literal field, which scales
better than a chain of `typeof` checks:

```ts
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "square"; side: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "square":
      return s.side ** 2;
  }
}
```

> **Gotcha:** `typeof null === "object"`. A `typeof x ===
> "object"` guard does not exclude `null` — check for
> `null` explicitly first.

> **Gotcha:** Narrowing does not survive a callback or an
> `await` boundary. TypeScript can't prove a captured
> variable wasn't reassigned before the callback runs, so
> it re-widens on the other side.

## Literals, `as const`, and `satisfies`

Without help, TypeScript widens literals: `let x = "a"` gets type
`string`, not `"a"`. Three tools narrow it back down, and they are not
interchangeable.

```ts
const a = "GET" as const;  // "GET"
const b = {} as { id: number }; // unchecked
const routes = {
  home: "/",
} satisfies Record<string, string>;
```

`as const` freezes a literal (and deeply `readonly`s an object or
array). `as T` is an assertion — it tells the compiler to trust you and
performs no check. `satisfies T` checks the value against `T` without
widening it to `T`, so `routes.home` keeps its literal `"/"` type
instead of widening to `string`.

> **Warning:** `as` silently disables type checking for
> that expression. `{} as { id: number }` compiles, and
> `b.id` is `number` — right up until it reads `undefined`
> at runtime. Prefer a type guard or `satisfies`.

## Generics

A generic function or type takes a type parameter the same way a
function takes a value parameter. Constraints (`extends`) narrow what's
allowed; defaults make a parameter optional.

```ts
function first<T>(items: T[]): T | undefined {
  return items[0];
}

function pluck<T, K extends keyof T>(
  obj: T,
  key: K,
): T[K] {
  return obj[key];
}
```

> **Gotcha:** Constraining a type parameter too early
> throws away inference. `<T extends object>` on a
> function that never uses the constraint just narrows
> what callers can pass, for no benefit.

> **Note:** In a `.tsx` file, `<T>` alone is ambiguous
> with JSX. Write `<T,>` (trailing comma) or add a
> constraint like `<T extends unknown>`.

## Utility types

The built-in set, grouped by what they operate on:

| Type | Result |
|---|---|
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties `readonly` |
| `Pick<T, K>` | Subset of keys `K` |
| `Omit<T, K>` | `T` minus keys `K` |
| `Record<K, V>` | Object with keys `K`, values `V` |
| `Exclude<T, U>` | Union members not assignable to `U` |
| `Extract<T, U>` | Union members assignable to `U` |
| `NonNullable<T>` | `T` minus `null`/`undefined` |
| `ReturnType<F>` | `F`'s return type |
| `Parameters<F>` | `F`'s parameter tuple |
| `Awaited<T>` | Unwraps a `Promise<T>` |

> **Gotcha:** `Omit<T, K>` does not validate that `K` is
> actually a key of `T`. A typo in the key silently
> passes and just does nothing.

## Type-level programming

Conditional types branch on a type relationship; `infer` captures part
of a type inside that branch. Mapped types transform every key of an
existing type.

```ts
type Elem<T> =
  T extends (infer U)[] ? U : never;

type ReadonlyOf<T> = {
  readonly [K in keyof T]: T[K];
};
```

Template literal types build string types the same way template
literals build strings:

```ts
type Event = `on${"Click" | "Hover"}`;
// "onClick" | "onHover"
```

> **Gotcha:** A conditional type over a union distributes
> over each member by default: `T extends U ? A : B` run
> on `T = X | Y` produces `(X extends U ? A : B) | (…Y…)`.
> Wrap the checked type in `[T]` to opt out when you want
> one decision, not one per union member.

## Functions

Overloads give a function multiple call signatures; the implementation
signature must be compatible with all of them but is not itself part of
the public API.

```ts
function pick(x: string): string;
function pick(x: number): number;
function pick(x: string | number) {
  return x;
}
```

> **Gotcha:** Under `strictFunctionTypes`, method-shorthand
> parameters (`{ f(x: Dog): void }`) are checked
> bivariantly, but property-syntax parameters (`{ f: (x:
> Dog) => void }`) are checked contravariantly. The same
> assignment can pass as a method and fail as a property.

## Classes

`public`/`protected`/`private` are compile-time only; `#field` is a
real, runtime-private field enforced by the JavaScript engine itself.

```ts
class Counter {
  private count = 0;
  #real = 0;

  increment() {
    this.count++;
    this.#real++;
  }
}
```

> **Gotcha:** `private` only stops the *compiler*. Cast
> past it (`(obj as any).count`) and it's plain, readable
> JavaScript. `#real` cannot be reached this way — the
> engine itself refuses access outside the class body.

## Modules and declarations

`import type` and `export type` mark a binding as type-only, so it can
be safely elided from the compiled output.

```ts
interface User {
  id: string;
}
export type { User }; // erased — types only
export function getUser(): User {
  return { id: "1" };  // kept — real code
}
```

> **Note:** With `verbatimModuleSyntax` enabled, a plain
> `import { User }` for a type-only binding is a compile
> error — it must say `import type`. This flag is what
> catches accidental runtime imports of type-only modules
> in an ESM/CJS interop setup.

## tsconfig that changes type-checking

`strict: true` is a bundle of independent flags — knowing which one
actually caused an error saves real debugging time.

| Flag | What it catches |
|---|---|
| `strictNullChecks` | `null`/`undefined` not in every type |
| `noImplicitAny` | Untyped parameters default to `any` |
| `strictFunctionTypes` | Parameter contravariance |
| `strictBindCallApply` | `.bind`/`.call`/`.apply` typing |
| `noUncheckedIndexedAccess` | `arr[i]` includes `undefined` |
| `exactOptionalPropertyTypes` | `?:` excludes explicit `undefined` |

> **Tip:** `noUncheckedIndexedAccess` is the single
> highest-value non-default flag. Without it, `arr[i]` is
> typed as if it always succeeds, even out of bounds.

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `TS2322` | Type not assignable to target | Widen the target or narrow the source |
| `TS2345` | Argument type mismatch | Check the parameter's declared type |
| `TS2532` | Object possibly `undefined` | Guard, `?.`, or narrow first |
| `TS18048` | Value possibly `undefined` | Guard, `?.`, or narrow first |
| `TS2339` | Property doesn't exist on type | Narrow the union before accessing |
| `TS7053` | Implicit `any` from an index | Type the key as `keyof T` |
| `TS2367` | Comparison has no overlap | The compared types can't be equal — check the logic |
| `TS2739` | Missing required properties | Add the properties the message lists |
| `TS18046` | Value is `unknown` | Narrow with a guard before use |
| `TS2589` | Type instantiation too deep | Simplify the recursive conditional type |
| `TS1361` | Used as a value but is a type | It was imported with `import type` |
| `TS2551` | Property doesn't exist; did you mean… | Usually a real typo — check the suggestion |

## Further reading

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [TypeScript 5.9 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-5-9/)
