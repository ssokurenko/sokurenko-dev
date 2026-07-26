---
title: React
description: A gradual walk through modern React — function components, the basic hooks, and sharing state with context.
cheatsheet:
  slug: react
  section: frontend
  summary: A gradual, compact walk through modern React — components, hooks, and context-based state sharing.
  topicVersion: "19"
  verifiedAgainst:
    - label: React Reference — Hooks
      url: https://react.dev/reference/react/hooks
    - label: React Reference — useContext
      url: https://react.dev/reference/react/useContext
    - label: React Reference — useEffect
      url: https://react.dev/reference/react/useEffect
    - label: You Might Not Need an Effect
      url: https://react.dev/learn/you-might-not-need-an-effect
  lastVerified: 2026-07-26
  difficulty: intermediate
  tags: [react, hooks, context, state]
  related:
    - languages/typescript
  pdf: true
---

## Mental model

A component is a function that returns JSX describing the UI for the
current props and state. React re-renders by calling that function
again and diffing the result — never by mutating the DOM yourself.
State changes trigger a re-render; effects exist to synchronize with
things outside React, not to compute values you render.

## Components & props

| Syntax | Meaning |
|---|---|
| `function C(props)` | A component is a plain function |
| `<C name="x" />` | Props passed like HTML attributes |
| `props.children` | Nested JSX passed to a component |

A component's props are read-only inputs — the same rule as function
arguments in general. A component re-renders when its own state
changes, or when its parent re-renders and passes new props.

```tsx
function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}
```

> **Gotcha:** mutating a prop directly (`props.name = "x"`) doesn't
> trigger a re-render and breaks the one-way data flow every other
> React feature assumes. Treat props as read-only, always.

## useState

| Syntax | Meaning |
|---|---|
| `useState(initial)` | `[value, setter]` pair |
| `setValue(v => …)` | Updater form, based on prior value |

Calling the setter schedules a re-render with the new value; it does
not mutate the variable in place.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

> **Gotcha:** state updates in the same event handler are batched —
> reading `count` right after calling `setCount` still shows the old
> value. Use the updater form (`setCount(c => c + 1)`) whenever the
> next value depends on the previous one.

## useEffect

| Dependency array | Runs |
|---|---|
| *(omitted)* | After every render |
| `[]` | Once, after the first render |
| `[a, b]` | After a render where `a` or `b` changed |

An Effect synchronizes a component with something outside React —
a subscription, a timer, a non-React widget. It runs after the
browser paints, and its cleanup function runs before the next run
and on unmount.

```tsx
import { useState, useEffect } from "react";

function Ticker() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <p>{count}</p>;
}
```

> **Gotcha:** if you're calling `setState` inside an Effect just to
> derive a value from props or other state, you don't need an
> Effect — compute the value directly in the component body instead.
> This is the single most common Effect misuse React's own docs
> warn against.

## useRef

| Syntax | Meaning |
|---|---|
| `useRef(initial)` | Mutable box, `.current` holds the value |
| `ref={myRef}` | Attaches a ref to a DOM node |

Updating `ref.current` does not trigger a re-render — refs are for
values a component needs to remember without displaying them.

```tsx
import { useRef, useEffect } from "react";

function TextInput() {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return <input ref={ref} />;
}
```

> **Gotcha:** if the UI needs to reflect a value, that value belongs
> in state, not a ref — a ref change is invisible until something
> else causes a re-render.

## useMemo & useCallback

| Syntax | Caches |
|---|---|
| `useMemo(fn, deps)` | A computed **value** |
| `useCallback(fn, deps)` | A **function** reference |

Both skip recomputing until a dependency changes.
`useCallback(fn, deps)` is exactly `useMemo(() => fn, deps)` — the
same idea, specialized for functions passed to memoized children.

```tsx
import { useMemo } from "react";

function List({ items }: { items: string[] }) {
  const sorted = useMemo(
    () => items.slice().sort(),
    [items],
  );
  return <ul>{sorted.join(", ")}</ul>;
}
```

> **Tip:** memoize only what's actually expensive to recompute, or
> what's passed to a `memo()`-wrapped child. Wrapping everything adds
> overhead without a measured benefit.

## useReducer

| Syntax | Meaning |
|---|---|
| `useReducer(reducer, init)` | `[state, dispatch]` pair |
| `dispatch({ type: "…" })` | Sends an action to the reducer |

Prefer `useReducer` over several related `useState` calls once
updates depend on each other or on the previous state in more than
one place — one function then owns every transition.

```tsx
import { useReducer } from "react";

type Action = "inc" | "dec";
function reducer(n: number, action: Action) {
  return action === "inc" ? n + 1 : n - 1;
}
function Counter() {
  const [n, dispatch] = useReducer(reducer, 0);
  return (
    <button onClick={() => dispatch("inc")}>
      {n}
    </button>
  );
}
```

## Sharing state with context

| Syntax | Meaning |
|---|---|
| `createContext(default)` | Creates a context object |
| `<Context value={v}>` | Provides `v` to descendants |
| `useContext(Context)` | Reads the nearest provider's value |

Context lets a deeply nested component read a value without every
component in between passing it down as a prop. As of React 19,
`<Context>` itself can be rendered as the provider — `<Context.Provider>`
still works but is no longer required.

```tsx
import { createContext } from "react";
import { useContext } from "react";

const ThemeContext = createContext("light");
function Label() {
  return <p>{useContext(ThemeContext)}</p>;
}
function App() {
  return (
    <ThemeContext value="dark">
      <Label />
    </ThemeContext>
  );
}
```

> **Gotcha:** every component reading a context re-renders when its
> value changes — even ones wrapped in `memo()`. Wrap an object value
> in `useMemo` before providing it, or unrelated updates will
> re-render the whole subtree.

## Custom hooks

A custom hook is a function whose name starts with `use` that calls
other hooks. The naming convention is what lets the rules of hooks —
and React's own linter — apply to it like any built-in hook.

```tsx
import { useState } from "react";

function useToggle(initial: boolean) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn(v => !v)] as const;
}
```

> **Gotcha:** hooks must run in the same order on every render, so
> they can never sit inside a condition, loop, or early return —
> only at a component's or hook's top level.

## Further reading

- [React Reference — Hooks](https://react.dev/reference/react/hooks)
- [React Reference — useContext](https://react.dev/reference/react/useContext)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
