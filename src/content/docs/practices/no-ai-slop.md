---
title: No AI Slop Manifesto
description: The No AI Slop Manifesto from AIE Code Summit 2026 — what slop is, why it happens, and the practices that keep it out of your code, docs and messages.
cheatsheet:
  slug: no-ai-slop
  section: practices
  summary: Slop is output that costs its reader more effort than its author spent. Five values, nine beliefs and twelve resolutions, turned into daily practice.
  topicVersion: "2026"
  verifiedAgainst:
    - label: No AI Slop — A Manifesto
      url: https://www.slopmanifesto.com/
    - label: Ghostty — AI Usage Policy
      url: https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md
  lastVerified: 2026-11-24
  difficulty: beginner
  tags: [ai, agents, code-review, quality, writing, collaboration]
  related:
    - practices/ai-coding-agents
    - practices/code-review
    - practices/software-factory
    - career/technical-writing
    - career/feedback
---

## Mental model

Slop is an effort imbalance, not a tool choice: something is slop when
its author spent less effort producing it than its reader must spend
understanding it. AI makes that imbalance nearly free to create — a
thousand-line PR costs almost nothing to generate and exactly as much
to review as before. So the manifesto never says "don't use AI". It
says whoever sends the output owns it, and that human attention is
the scarce resource to protect.

## What counts as slop

| Situation | Slop? |
|---|---|
| Agent wrote it; you checked and own it | No (belief 3) |
| You forwarded output you never read | Yes |
| Ten-page doc whose point fits in five lines | Yes (belief 5) |
| Workaround stacked on workaround | Yes, AI or not (belief 6) |
| Throwaway one-shot prototype | Not necessarily (resolution 11) |

The manifesto (written by speakers and attendees of AIE Code Summit
2026, and modeled on the 2001 Agile Manifesto) defines slop by who
pays: "less effort into producing something than we ask the consumer
to spend understanding it." The tool is irrelevant; skipping
responsibility for quality and the reader's experience is the
problem. A quick pre-send check — ours, not the manifesto's:

```text
Before you send, ask:
- Did I read all of it?
- Can I explain every part I'm sending?
- Is it as short as it can be?
- Would I accept it from a teammate?
```

> **Gotcha:** Vibe coding is explicitly fine — resolution 11 calls it
> "high leverage". It turns into slop at the handoff: the prototype
> nobody reviewed quietly becomes the PR a teammate must maintain.

## The five values

| We value | Over |
|---|---|
| Outcomes | Output |
| Understanding | Speed |
| Our own thinking | A model's first draft |
| Better work | Easier work |
| Improving the system | Patching the output |

Use them as tiebreakers: when the two sides conflict, the left one
wins. "Outcomes over output" is spelled out in resolution 10 — what
shipped, who uses it and how it helps matter "FAR MORE than lines of
code, prs merged, tokens spent, or the number of agents running in
parallel." A team that celebrates PR counts is rewarding slop.

```text
Agent: 600-line fix, ready in 2 minutes
You:   20-line root-cause fix, 30 minutes
       of reading first
Ship:  the 20 lines (understanding > speed)
```

## Why slop happens

| Cause | Belief |
|---|---|
| Generating is free; reviewing still costs | 5 |
| Working around problems; additive tools | 6 |
| Pressure to do the humanly impossible | 7 |
| It compounds through what agents read | 8 |
| Teams lose the will to fight it | 9 |

Belief 1 sets the scale: a swarm of agents can produce "more work in a
single day than a person can review in our lifetime." Belief 6 points
out slop predates AI — every repeated workaround is slop — and that
tools lean heavily toward adding rather than subtracting. Belief 9 is
the social cost: the more slop circulates, the less anyone pushes
back, so quality decays over time instead of improving.

> **Gotcha:** Slop compounds (belief 8). Your codebase, docs and chat
> history are the next agent's context, so a sloppy helper becomes a
> pattern it copies. Deleting slop is part of fighting it.

## Do your own thinking first

| Before the work | Why |
|---|---|
| Read the code, docs and prior art | Understand the problem |
| State the intent in your own words | The model can't guess it |
| Decide what "done" looks like | So you can check the output |

Resolution 4: "We do our own thinking when working with a model." You
explore the problem before the work starts, so the model amplifies
your judgment instead of replacing it — belief 4 warns it amplifies a
lack of judgment just as well. Writing a brief forces the thinking:

```text
Goal: retry 503s from the billing API
Why: nightly sync drops ~2% of invoices
Limits: max 3 tries, keep idempotency key
Done when: test fakes two 503s, then 200
Out of scope: other endpoints
```

> **Tip:** If you can't write the "Done when" line, you don't
> understand the problem yet. Go read before you prompt.

## Own it and disclose it

| You | Resolution |
|---|---|
| Own intent, taste and consequences | 5 |
| Say when an agent wrote it | 6 |
| Check the parts that matter first | 6 |

Ownership doesn't shrink with the share AI wrote: "however much AI
helps us make it." Disclosure tells the reader where to look hard. The
manifesto asks for clarity, not a format; Ghostty's policy, for one,
requires naming the tool and the extent of AI help. In a PR:

```md
## AI use
Drafted with Claude Code. I checked:
- retry and backoff logic, line by line
- tests: ran locally, read every assertion
Skimmed only: generated fixtures
```

> **Warning:** Disclosure is not a transfer of blame. "The agent wrote
> it" doesn't excuse a bug you shipped — you own the consequences.

## Review by stakes

| Stakes (example) | Review at least |
|---|---|
| Throwaway prototype | The result: does it work? |
| Internal tool | The plan, plus risky paths |
| Auth, money, user data | Every line, plus the tests |

Resolution 9: agent reviews, linters and verifiers are "useful but not
sufficient" — a human still reviews some subset, and the subset
"depends on the stakes." The table is one way to set it; the manifesto
doesn't prescribe tiers. Resolution 8 explains why review never goes
to zero: even if you stop reading most code, reviewing the plan,
design or result is where your output stops looking like everyone
else's.

> **Note:** Resolution 9 says "for now". The authors expect line-level
> review to shrink as models improve; review of intent and results
> stays.

## Calling out slop, kindly

| Do | Don't |
|---|---|
| Name the cost to you, the reader | Guess whether AI wrote it |
| Ask them to review it first | Silently fix it yourself |
| Offer to look again after | Shame them in public |

Resolution 7: tell them, kindly, and ask them to review it first —
"Most of us have needed that same note at some point." Silently
cleaning up slop teaches the sender it works, and feeds belief 9's
spiral.

```text
Hey — this PR is 1,400 lines and I can't
tell which parts you've checked. Could you
review it first, note what the agent wrote,
and split out the retry change? Happy to
look right after.
```

## Fix the system on the second mistake

| Repeated mistake | Guardrail |
|---|---|
| Stray debug logging | `no-console` lint rule |
| Imports from internal modules | `no-restricted-imports` |
| Same review comment, twice | Agent instructions file or a check |

Resolution 12: "When a mistake shows up twice, we scale ourselves and
our team by improving the system and its guardrails. Anything a
linter, type checker, or automated check can catch, we let it catch."
This is the value "improving the system over patching the output" in
practice:

```js
// eslint.config.js (ESLint 9)
export default [
  {
    rules: {
      "no-console": "error",
      "no-restricted-imports": ["error", {
        patterns: ["**/internal/*"],
      }],
    },
  },
];
```

> **Gotcha:** A rule that lives only in review comments gets broken
> again by every new agent session — it doesn't remember your last
> comment. Encode it where it runs on every change.

## Further reading

- [No AI Slop: A Manifesto](https://www.slopmanifesto.com/) — full
  text, signatures, and how to sign via a GitHub gist comment
- [Manifesto for Agile Software Development](https://agilemanifesto.org/)
  — the 2001 model it follows
- [Ghostty AI Usage Policy](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md)
  — disclose the tool and extent; understand all code
- [Why Software Factories Fail](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/wsff.md)
  — why to keep reading some of the code
- [No More Slop](https://www.youtube.com/watch?v=IoiHI7p12Ao) — swyx
  declares war on slop, AIE Code Summit 2025
- [Please stop the slop](https://tej.as/blog/please-stop-the-slop) —
  Tejas Kumar on keeping slop out of writing
