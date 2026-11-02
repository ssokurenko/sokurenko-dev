---
title: Code Review in the AI Era
description: How to review and how to be reviewed when much of the code is agent-written — PR size, a dependency-ordered checklist, reading agent diffs, comment labels, turnaround and AI reviewers.
cheatsheet:
  slug: code-review
  section: practices
  summary: Reviewing and being reviewed when agents write much of the code — PR size, checklist, agent-diff traps, comment labels, turnaround, AI reviewers.
  topicVersion: "N/A"
  verifiedAgainst:
    - label: Google Engineering Practices — The Standard of Code Review
      url: https://google.github.io/eng-practices/review/reviewer/standard.html
    - label: Google Engineering Practices — What to look for in a code review
      url: https://google.github.io/eng-practices/review/reviewer/looking-for.html
    - label: Google Engineering Practices — Navigating a CL in review
      url: https://google.github.io/eng-practices/review/reviewer/navigate.html
    - label: Google Engineering Practices — Speed of code reviews
      url: https://google.github.io/eng-practices/review/reviewer/speed.html
    - label: Google Engineering Practices — How to write code review comments
      url: https://google.github.io/eng-practices/review/reviewer/comments.html
    - label: Google Engineering Practices — Small CLs
      url: https://google.github.io/eng-practices/review/developer/small-cls.html
    - label: Google Engineering Practices — Writing good CL descriptions
      url: https://google.github.io/eng-practices/review/developer/cl-descriptions.html
    - label: DORA — Trunk-based development (code review pitfalls)
      url: https://dora.dev/capabilities/trunk-based-development/
    - label: DORA — Announcing the 2025 DORA Report
      url: https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report
    - label: LinearB — 2026 Software Engineering Benchmarks Report (survey)
      url: https://linearb.io/resources/software-engineering-benchmarks-report
  lastVerified: 2026-11-02
  difficulty: intermediate
  tags: [code-review, pull-requests, ai, quality, collaboration]
  related:
    - practices/testing-strategy
    - practices/trunk-based-development
    - practices/ai-coding-agents
    - tooling/git
---

## Mental model

Review exists to verify **intent and risk**: does this change do what
it claims, and what breaks if it is wrong? Everything a linter,
formatter or type checker can say, automate, so humans spend attention
only where tools cannot. With agents writing much of the code, the
bottleneck has moved from typing to review — which makes small,
well-described changes and fast turnaround the highest-leverage habits
a team has.

## The approval standard

| Question | Decides |
|---|---|
| Does it improve overall code health? | Approve, even if imperfect |
| Is it a feature we do not want? | Reject early, kindly |
| Is it style the guide does not cover? | Author's call |
| Is it only polish? | Prefix `Nit:` and approve |

Google's senior rule: approve once a change **definitely improves the
code health of the system**, even if it is not perfect. There is no
perfect code, only better code; demanding polish on every line slows
improvement down. Technical facts and data overrule opinions, and on
style the style guide is the authority — anything it does not cover is
personal preference.

```text
Blocks:     correctness, security, data loss,
            no tests for new behaviour
Does not:   "I'd have named it differently",
            formatting a tool can fix
```

## Size and stacking

| Size | Reading |
|---|---|
| ~100 changed lines | Usually reasonable |
| ~1000 lines | Usually too large |
| Refactor + feature mixed | Split into two |
| Generated or mechanical | Separate, say so in the description |

Small changes are reviewed faster and more thoroughly, are less likely
to hide bugs, and are easier to roll back. Google gives no hard limit,
but treats 100 lines as usually reasonable and 1000 as usually too
large. When work depends on unmerged work, **stack** it: a chain of
small dependent PRs, each reviewable alone, instead of one big one.

```text
#1  Add RefundPolicy type + tests     (80)
#2  Use policy in RefundService       (120)
     based on #1
#3  Expose refund limit in admin UI   (90)
     based on #2
```

> **Gotcha:** Agents make big diffs cheap to produce but not cheap to
> review. A 900-line agent PR still costs 900 lines of reviewer
> attention — ask for it to be split before reading it.

## Reviewer checklist, in order

| Order | Check |
|---|---|
| 1 | Should this change exist? Read the description |
| 2 | Correctness of the main file(s) and design |
| 3 | Tests: new behaviour covered, nothing weakened |
| 4 | Security and data: input, auth, migrations, PII |
| 5 | Operability: logs, metrics, flags, rollback |
| 6 | Readability: names, comments, complexity |

Order matters because an early finding can make later work moot. Take
a broad view first and reject a change that should not happen before
reading every line. Then find the main part and send design comments
immediately, even if you have not finished the rest. Readability comes
last because it is the cheapest to fix and the easiest to automate.

```text
1  description: why, what, how tested?
2  main file first — design comments now
3  tests: would they fail without the fix?
4  migration reversible? secrets? authz?
5  how do we know it broke in prod?
6  then names, comments, nits
```

## Reading an agent's diff

| Look for | Because agents |
|---|---|
| Calls to APIs that do not exist | Invent plausible signatures |
| Changes outside the task | Drift into "while I was here" edits |
| Deleted, skipped or loosened tests | Turn red to green by removal |
| Duplicated helpers | Miss the existing one |
| Confident description vs real diff | Summarise intent, not result |

Read agent output as you would a capable stranger's: the code is
fluent, so fluency proves nothing. Verify every external call against
the library's real API and check that the test diff only adds or
tightens assertions. LinearB's 2026 benchmark of about 8.1 million pull
requests found AI-generated PRs merged within 30 days 32.7% of the time
versus 84.4% for unassisted ones, and waited about 4.6 times longer for
review (vendor survey data).

```text
- expect(total).toBe(108.5)
+ expect(total).toBeGreaterThan(0)
  ^ assertion weakened: block, ask why
- it('rejects over-refund', ...)
+ it.skip('rejects over-refund', ...)
  ^ test disabled: block
```

> **Warning:** "All tests pass" from an agent is a claim, not
> evidence. Check CI on the actual head commit, and check that the
> tests it cites exist and assert something.

## Comments and severity labels

| Prefix | Means |
|---|---|
| (none) | Must address before merge |
| `Nit:` | Polish; author may ignore |
| `Optional:` / `Consider:` | Good idea, not required |
| `FYI:` | Informational, for the future |

Comment on the code, never the person, and explain why — a reason
lets the author fix the next case without you. Labels stop authors from
treating every remark as mandatory and burning a round trip on a nit.
Say when something is good, too, with the reason.

```text
Bad:  Why did you use threads here?
Good: The concurrency model adds complexity
      but I see no throughput gain here —
      can we keep this single-threaded?
Nit:  `cnt` -> `retryCount` reads better.
```

> **Tip:** When only nits remain, approve with comments ("LGTM with
> comments") instead of requesting another round.

## Turnaround

| Rule | Source of the rule |
|---|---|
| Respond within one business day, max | Google |
| Don't break focus to review | Google |
| Multi-approval, hours-long review | DORA pitfall |
| Prefer synchronous review when ready | DORA |

Slow review makes authors batch changes into bigger PRs, which are
slower to review: a spiral DORA names as a top obstacle to trunk-based
development. Review when you finish a focused task rather than mid-flow,
but treat the first response as due the same day. If you cannot do a
full pass, send the high-level comments now.

```text
Team review SLA (example)
first response   < 4 working hours
P0 / revert      immediately
> 400 lines      author asked to split
```

## Preparing your own change

| Include | Why |
|---|---|
| First line: imperative summary | Stands alone in history |
| Why, and decisions not in code | Reviewers and future readers |
| How you tested it | Evidence, not assertion |
| Risk and rollback | Reviewer can focus there |
| A self-review pass first | Catch your own noise |

The description becomes permanent history; future engineers will find
the change by searching for it. Write what changed and why, not "fix
bug". For agent-written changes, say so and say what you verified
yourself.

```text
Limit refunds to the original charge amount

Refunds above the charge were accepted and
paid out (INC-2291). Adds RefundPolicy and a
422 for over-limit requests.

Tested: unit tests for equal/over/under;
replayed INC-2291 request on staging.
Rollback: revert; no migration.
```

## AI reviewers

| Use them for | Do not use them for |
|---|---|
| A first pass before a human | The approval decision |
| Spotting missing tests, typos | Judging intent or product fit |
| Summarising a large diff | Trusting "no issues found" |

An AI reviewer is one more linter with a wider range and more false
positives. Run it before requesting human review so the author fixes
the obvious, then let a human who understands the intent own approval.
DORA 2025 found AI raises throughput but still correlates with lower
stability; review is part of the control system that keeps the extra
change volume from becoming incidents.

```text
pipeline: lint -> tests -> AI review
           (author fixes) -> human review
human approves; AI comments are input,
never a required or sufficient check
```

## Further reading

- [Google Engineering Practices — Code Review](https://google.github.io/eng-practices/review/)
- [Google — Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html)
- [Google — How to write code review comments](https://google.github.io/eng-practices/review/reviewer/comments.html)
- [DORA — Trunk-based development](https://dora.dev/capabilities/trunk-based-development/)
- [2025 DORA Report announcement](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
