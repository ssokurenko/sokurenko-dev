---
title: React Advanced
description: Server Components, the client boundary, Suspense, streaming, use(), Actions, optimistic UI and transitions — React 19's server-aware model.
cheatsheet:
  slug: react-advanced
  section: frontend
  summary: Server Components, the client boundary, Suspense, streaming, use(), Actions, optimistic UI and transitions — React 19 across two runtimes.
  topicVersion: "19.2"
  verifiedAgainst:
    - label: React Reference — Server Components
      url: https://react.dev/reference/rsc/server-components
    - label: React Reference — 'use client'
      url: https://react.dev/reference/rsc/use-client
    - label: React Reference — 'use server'
      url: https://react.dev/reference/rsc/use-server
    - label: React Reference — use
      url: https://react.dev/reference/react/use
    - label: React Reference — Suspense
      url: https://react.dev/reference/react/Suspense
    - label: React Reference — useActionState
      url: https://react.dev/reference/react/useActionState
    - label: React Reference — useOptimistic
      url: https://react.dev/reference/react/useOptimistic
    - label: React Reference — useTransition
      url: https://react.dev/reference/react/useTransition
    - label: React 19.2 release
      url: https://react.dev/blog/2025/10/01/react-19-2
  lastVerified: 2026-08-11
  difficulty: advanced
  tags: [react, server-components, suspense, actions, streaming, transitions]
  related:
    - frontend/react
    - languages/typescript
---

## Mental model

A React 19 tree can span two runtimes. Server Components render once,
away from the browser, and send their **output** rather than their
code; Client Components ship, hydrate, and hold state. `'use client'`
and `'use server'` are the two doors between those halves, Suspense
marks where output may arrive late, and Actions carry writes back
across. Every feature below is a rule about crossing that boundary.

## Server Components

| Server Component | Client Component |
|---|---|
| Renders once, ahead of the browser | Runs and re-renders in the browser |
| Can `await` data in the body | Has state, effects, event handlers |
| Ships no JavaScript | Ships its bundle and hydrates |
| No state, effects, or DOM APIs | No direct database or filesystem |

A Server Component "renders ahead of time, before bundling, in an
environment separate from your client app or SSR server" — at build
time or per request — and its result, not its source, reaches the
browser. Because they "do not re-render or hydrate", they have no
state, no effects, and no browser APIs, and in exchange they may be
`async` and await a query directly in the body. They need no directive:
in a Server Component tree, server is the default.

```tsx
declare const db: {
  byUser(id: string): Promise<{ id: string }[]>;
};

async function Notes({ id }: { id: string }) {
  const notes = await db.byUser(id);
  return (
    <ul>
      {notes.map(n => <li key={n.id}>{n.id}</li>)}
    </ul>
  );
}
```

> **Gotcha:** Server rendering and Server Components are different
> things. A Client Component is still rendered to HTML on the server
> for the first paint — then it hydrates and ships its JavaScript. Only
> a Server Component sends nothing to the browser at all.

## The client boundary

| Crosses the boundary | Does not |
|---|---|
| Primitives, plain objects, `Date` | Class instances |
| Arrays, `Map`, `Set` | Ordinary functions |
| JSX elements and Promises | Unregistered symbols |
| Server Functions | Null-prototype objects |

`'use client'` at the very top of a file "marks the boundary between
server and client code in the module dependency tree": that module and
everything it imports become client code, so the directive is declared
once at the seam, never in every file. Props crossing the seam are
serialized, which is the whole constraint — and since JSX elements and
Promises both serialize, a Server Component can render its own output
*into* a Client Component through `children` and keep it on the server.

```tsx
"use client";
import { useState, type ReactNode } from "react";

type Props = { children: ReactNode };
export function Expander({ children }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        More
      </button>
      {open && children}
    </div>
  );
}
```

> **Gotcha:** An inline callback prop cannot cross the boundary —
> ordinary functions do not serialize, so `onSelect={() => …}` from a
> Server Component throws. Move the handler into the client module, or
> pass a Server Function instead.

## Suspense and streaming

| Suspends | Does not suspend |
|---|---|
| `use()` on a pending promise | `fetch` inside an Effect |
| `lazy()` components | Data set in an event handler |
| Data streamed from the server | Anything awaited outside render |

`<Suspense>` shows its `fallback` until *all* code and data its children
need have loaded — children under one boundary are revealed together,
so nesting boundaries is how a page is staged rather than gated. Under
streaming SSR the shell (everything outside every boundary) is flushed
first, then each boundary's HTML arrives as its data resolves, carrying
an inline script that swaps out the fallback. That progressive reveal
"does not need to wait for React itself to load in the browser". React
19.2 briefly batches those reveals so content lands in groups.

```tsx
import { Suspense, type ReactNode } from "react";

declare function Profile(): ReactNode;
declare function Posts(): ReactNode;

export function Page() {
  return (
    <Suspense fallback={<p>Loading page…</p>}>
      <Profile />
      <Suspense fallback={<p>Loading posts…</p>}>
        <Posts />
      </Suspense>
    </Suspense>
  );
}
```

> **Gotcha:** Suspense only reacts to reads that happen *during render*.
> A `fetch` in `useEffect` or an event handler will never trigger a
> fallback no matter how many boundaries wrap it — that data needs its
> own loading state, or a move to `use()`.

## use()

| `use()` | Hooks |
|---|---|
| Legal inside `if` and loops | Top level only |
| Reads a Promise or a Context | Context only, via `useContext` |
| Suspends until the value is ready | Never suspend |

`use` reads a promise or a context, and is the one React API exempt
from the rules of hooks: it may be called conditionally. Reading a
pending promise suspends the component, so it wants a Suspense boundary
above it and an error boundary for rejection — the docs are explicit
that `try`/`catch` around `use` does not work. The intended flow is that
a Server Component starts the request and passes the promise down,
letting the server begin work the client will finish awaiting.

```tsx
"use client";

import { use } from "react";

export function Message(
  { promise }: { promise: Promise<string> },
) {
  return <p>{use(promise)}</p>;
}
```

> **Gotcha:** `use(fetch(url))` in a Client Component creates a new
> promise on every render, so the component suspends forever and
> re-fetches endlessly. Client-side promises must come from a cache
> keyed by input, or from a Server Component's props.

## Actions and Server Functions

| Piece | Role |
|---|---|
| `'use server'` | Makes an async function callable from the client |
| `<form action={fn}>` | Runs it in a transition, with `FormData` |
| `formAction` on a button | A different action for one button |
| `startTransition` | Calling a Server Function outside a form |

`'use server'` marks **Server Functions**, not Server Components — the
opposite direction of travel from `'use client'`. Calling one from the
browser serializes the arguments, makes a network request, runs the
function on the server, and serializes the result back. Passing it to
`<form action>` wraps the call in a transition automatically; anywhere
else, wrap it in `startTransition` yourself.

```tsx
declare const db: { add(t: string): Promise<void> };

async function createNote(data: FormData) {
  "use server";
  // Arguments are client-controlled: authorize
  // and validate before touching the database.
  await db.add(String(data.get("title")));
}

export const NewNote = () => (
  <form action={createNote}>
    <input name="title" />
    <button>Save</button>
  </form>
);
```

> **Warning:** `'use server'` publishes a network endpoint. Arguments
> are "fully client-controlled" — anyone can call it with anything, in
> any order, regardless of what your UI allows. Authorize and validate
> inside the function; a check in the component proves nothing.

## Form state

| API | Gives you |
|---|---|
| `useActionState(fn, init)` | `[state, formAction, isPending]` |
| `useFormStatus()` | `{ pending, data, method, action }` |
| `permalink` argument | A working form before JS loads |

`useActionState` turns an action's return value into state: the wrapped
function receives the previous state as its first argument and the
payload as its second, and repeated dispatches queue rather than race.
`useFormStatus` reads the submission of the form *above* it — it "must
be called from a component rendered inside a `<form>`" — which is why a
submit button becomes its own small component. With Server Functions,
the optional `permalink` lets a form submitted before hydration
navigate instead of failing.

```tsx
"use client";
import { useFormStatus } from "react-dom";

// Rendered inside the <form>, never beside it.
export function Submit() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending}>
      {pending ? "Saving…" : "Save"}
    </button>
  );
}
```

> **Gotcha:** Calling `useFormStatus` in the component that renders the
> `<form>` returns `pending: false` forever. It reports on a parent
> form only, and there is no warning — the button simply never
> disables.

## Optimistic UI

| Moment | What the user sees |
|---|---|
| Action starts | The optimistic value, immediately |
| Action resolves | Real state replaces it, one render |
| Action rejects | The value disappears, rolled back |

`useOptimistic(value, reducer?)` returns state that equals `value` when
idle and the reducer's result while an action is in flight. The setter
must be called inside an Action or `startTransition`; called outside
one it warns and does nothing useful. Rollback is not something you
write: when the action settles, the optimistic layer is dropped and
whatever the real state now says is displayed, so a failure reverts by
construction.

```tsx
"use client";
import { useOptimistic } from "react";

type Todo = { id: string; text: string };
type Props = { todos: Todo[] };

export function List({ todos }: Props) {
  const [shown, add] = useOptimistic(
    todos,
    (cur: Todo[], t: Todo) => [...cur, t],
  );
  const rows = shown.map(t =>
    <li key={t.id}>{t.text}</li>);
  return <ul>{rows}</ul>;
}
```

> **Gotcha:** The optimistic value lives only for the duration of the
> action. If the action succeeds but the underlying state never
> actually changes — a missed revalidation, a stale cache — the item
> vanishes at the exact moment the user is told it worked.

## Transitions

| API | Reach for it when |
|---|---|
| `useTransition` | You own the `set` call |
| `startTransition` | You are outside a component |
| `useDeferredValue` | You only receive the value |
| `isPending` | Progress belongs in the control |

A transition marks updates non-urgent: the old UI stays interactive,
and the work is interruptible, so a newer update wins and the previous
one restarts. The second effect matters more than the first — during a
transition React will not replace already-visible content with a
Suspense fallback, which is what separates a navigation from a flash of
skeletons. The function passed to `startTransition` must be
synchronous for its updates to be marked.

```tsx
"use client";
import { useState, useTransition } from "react";

export function Tabs() {
  const [tab, setTab] = useState("home");
  const [isPending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => setTab("posts"))}
    >
      {isPending ? "Loading…" : tab}
    </button>
  );
}
```

> **Gotcha:** After an `await` inside `startTransition(async …)`, the
> code is no longer in the transition — updates made there are urgent
> again and will flash a fallback. Wrap the post-await `set` calls in a
> second `startTransition`.

## Further ground

| API | Since | Purpose |
|---|---|---|
| `cache(fn)` | 19 | Dedupe a fetch per request, RSC only |
| `<Activity>` | 19.2 | Keep a subtree mounted but hidden |
| `useEffectEvent` | 19.2 | Non-reactive logic inside an Effect |
| `cacheSignal()` | 19.2 | Abort work when a cache lifetime ends |
| `prerender`, `resume` | 19.2 | Partial pre-rendering of a static shell |

`cache` memoizes per server request, and only within components —
"calling a memoized function outside of a component will not use the
cache" — so export one instance and import it everywhere rather than
calling `cache()` per module. React 19.2 (1 October 2025) adds the
`<Activity>` boundary, `useEffectEvent`, `cacheSignal`, partial
pre-rendering, and Chrome DevTools performance tracks. Alongside it,
the React Compiler removes most hand-written `useMemo` and
`useCallback`, with compiler-powered lint rules in
`eslint-plugin-react-hooks` v6.

```tsx
import { cache } from "react";

declare function fetchUser(
  id: string,
): Promise<string>;

// One shared instance — import this everywhere.
export const getUser = cache(fetchUser);
```

> **Note:** `cache` is for Server Components only. The Client Component
> equivalent is the module-level `Map` keyed by input that `use()`
> already requires, which is a cache you own and must invalidate
> yourself.

## Further reading

- [Server Components](https://react.dev/reference/rsc/server-components)
- ['use client'](https://react.dev/reference/rsc/use-client)
- ['use server'](https://react.dev/reference/rsc/use-server)
- [use](https://react.dev/reference/react/use)
- [Suspense](https://react.dev/reference/react/Suspense)
- [useActionState](https://react.dev/reference/react/useActionState)
- [useOptimistic](https://react.dev/reference/react/useOptimistic)
- [React 19.2 release notes](https://react.dev/blog/2025/10/01/react-19-2)
