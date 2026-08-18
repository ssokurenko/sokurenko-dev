---
title: React Basic
description: A gradual walk through client-side React — components, JSX rendering, the core hooks, and sharing state with context.
cheatsheet:
  slug: react
  section: frontend
  summary: A gradual walk through client-side React — components, lists and keys, the core hooks, and context-based state sharing.
  topicVersion: "19.2"
  verifiedAgainst:
    - label: React Reference — Hooks
      url: https://react.dev/reference/react/hooks
    - label: React Reference — useState
      url: https://react.dev/reference/react/useState
    - label: React Reference — useEffect
      url: https://react.dev/reference/react/useEffect
    - label: Rendering Lists
      url: https://react.dev/learn/rendering-lists
    - label: You Might Not Need an Effect
      url: https://react.dev/learn/you-might-not-need-an-effect
  lastVerified: 2026-08-11
  difficulty: beginner
  tags: [react, hooks, context, state, jsx]
  related:
    - frontend/react-advanced
    - frontend/nextjs
    - languages/typescript
  pdf: true
---

## Mental model

A component is a function that returns JSX describing the UI for the
current props and state. React re-renders by calling that function
again and diffing the result — never by mutating the DOM yourself.
State changes trigger a re-render; Effects exist to synchronize with
things outside React, not to compute values you render. Everything
here runs in the browser; the server half of React 19 is a separate
sheet.

## Components and props

| Syntax | Meaning |
|---|---|
| `function C(props)` | A component is a plain function |
| `<C name="x" />` | Props are passed like attributes |
| `props.children` | The JSX nested inside the tag |

Props are read-only inputs, exactly like function arguments. A
component re-renders when its own state changes or when its parent
re-renders and hands it new props — and its return value must be a
pure function of those two inputs, because React may call it more
often than you expect.

```tsx
function Greeting({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}
```

> **Gotcha:** Mutating a prop (`props.name = "x"`) changes nothing on
> screen and breaks the one-way data flow every other React feature
> assumes. Send a value up through a callback instead of writing
> downward.

## Rendering lists and conditionals

| Pattern | Renders |
|---|---|
| `cond && <A />` | `<A />`, or nothing |
| `cond ? <A /> : <B />` | One of two branches |
| `items.map(…)` | One keyed element per item |

JSX has no template language: conditionals and loops are ordinary
JavaScript expressions. Keys are how React matches elements across
renders once items can move, be inserted, or be deleted, so they must
be unique among siblings and must not change — never generate one
during render. A key is a hint to React, not a prop: components never
receive it, so pass the id separately if the child needs it.

```tsx
type Note = { id: string; title: string };

function Notes({ notes }: { notes: Note[] }) {
  if (notes.length === 0)
    return <p>Nothing yet.</p>;
  return (
    <ul>
      {notes.map(n => (
        <li key={n.id}>{n.title}</li>
      ))}
    </ul>
  );
}
```

> **Gotcha:** Array index as a key "often leads to subtle and confusing
> bugs". Insert a row at the front and every index shifts, so React
> reuses the wrong DOM nodes — the first row's typed input text stays
> behind on the row that took its place.

## useState

| Syntax | Meaning |
|---|---|
| `useState(initial)` | A `[value, setter]` pair |
| `setValue(v)` | Re-render with this value |
| `setValue(v => …)` | Next value from the previous one |

State behaves like a snapshot: calling the setter does not change the
variable in the render that is already running, it requests the next
one. React batches the updates in an event handler and re-renders once
they have all been queued. State is tied to a component's position in
the tree, which is why changing a component's `key` is the supported
way to reset all of its state.

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(c => c + 1)}>
      {count}
    </button>
  );
}
```

> **Gotcha:** `setCount(count + 1)` twice in one handler increments by
> one, not two — both calls read the same snapshot. The updater form
> `setCount(c => c + 1)` queues functions that each see the pending
> value, so use it whenever the next value depends on the previous.

## useEffect

| Dependency array | Setup runs |
|---|---|
| *(omitted)* | After every render |
| `[]` | Once, after the first render |
| `[a, b]` | After any render where `a` or `b` changed |

An Effect synchronizes a component with an external system — a
subscription, a timer, a non-React widget. It runs after the browser
paints, and its cleanup runs before the next setup and on unmount.
Every reactive value the Effect reads must appear in the dependency
array; removing one to stop a loop hides the bug rather than fixing it.

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

> **Gotcha:** In development, Strict Mode runs setup, cleanup, then
> setup again on mount. A "double" request or a doubled subscription is
> the point of that, not a bug — it proves the cleanup mirrors the
> setup, which is what makes the Effect correct in production.

## useRef

| Syntax | Meaning |
|---|---|
| `useRef(initial)` | A mutable box; `.current` holds it |
| `ref={myRef}` | Attaches the box to a DOM node |

Writing `ref.current` never triggers a re-render, so refs hold what a
component needs to remember but not display: a timer id, a previous
value, a DOM node to focus. Read or write them in handlers and Effects,
never during render — that is what makes rendering repeatable.

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

> **Gotcha:** If the UI must reflect a value, it belongs in state, not
> a ref. A ref change is invisible until something else happens to
> re-render the component, which makes the bug look intermittent.

## useMemo and useCallback

| Syntax | Caches |
|---|---|
| `useMemo(fn, deps)` | A computed **value** |
| `useCallback(fn, deps)` | A **function** reference |

Both skip work until a dependency changes, and `useCallback(fn, deps)`
is exactly `useMemo(() => fn, deps)` — the same tool specialized for
functions passed to memoized children. They are performance
adjustments, not correctness tools: an app should be correct with every
one of them deleted.

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

> **Tip:** Memoize what you have measured to be expensive, or what
> feeds a `memo()`-wrapped child. Wrapping everything adds allocation
> and dependency-array bugs for no gain — and the React Compiler now
> does most of this automatically.

## useReducer

| Syntax | Meaning |
|---|---|
| `useReducer(reducer, init)` | A `[state, dispatch]` pair |
| `dispatch({ type: "…" })` | Sends an action to the reducer |

Reach for a reducer once several pieces of state change together, or
the same transition is written in more than one handler: one function
then owns every transition and each handler only names what happened.
The reducer must be pure — it may run twice in development — so build
a new state object instead of editing the one you were given.

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

> **Gotcha:** Dispatching does not update `n` for the rest of the
> handler, for the same reason `useState` does not — you are reading
> this render's snapshot. Compute the value you need locally if you
> also have to act on it now.

## Sharing state with context

| Syntax | Meaning |
|---|---|
| `createContext(default)` | Creates a context object |
| `<Context value={v}>` | Provides `v` to descendants |
| `useContext(Context)` | Reads the nearest provider |

Context lets a deep component read a value without every layer in
between forwarding it as a prop. From React 19, `<Context>` is itself
the provider — `<Context.Provider>` still works but is no longer
required. Context solves prop drilling, not state management: the value
still lives in some component's state.

```tsx
import { createContext, useContext } from "react";

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

> **Gotcha:** Every consumer re-renders when the value changes, even
> ones wrapped in `memo()`. An object literal in the provider is a new
> value on every parent render, so wrap it in `useMemo` or the whole
> subtree re-renders for unrelated reasons.

## Custom hooks

| Rule | Why |
|---|---|
| Name starts with `use` | Lint and the compiler rely on it |
| Calls other hooks | That is what makes it a hook |
| Returns values, not JSX | Sharing logic, not markup |

A custom hook is a function that calls other hooks, and the naming
convention is what lets the rules of hooks apply to it. It shares
stateful *logic*, never state itself: two components calling the same
hook each get their own independent state.

```tsx
import { useState } from "react";

function useToggle(initial: boolean) {
  const [on, setOn] = useState(initial);
  return [on, () => setOn(v => !v)] as const;
}
```

> **Gotcha:** Hooks must run in the same order on every render, so they
> can never sit inside a condition, a loop, or after an early return —
> only at the top level of a component or another hook. React tracks
> them by call order, not by name.

## Further reading

- [React Reference — Hooks](https://react.dev/reference/react/hooks)
- [Rendering Lists](https://react.dev/learn/rendering-lists)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Removing Effect Dependencies](https://react.dev/learn/removing-effect-dependencies)
- [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)
