---
title: Written Communication for Engineers
description: Lead with the point, then the evidence — status updates, PR descriptions, asks, incident and escalation messages, executive summaries, editing passes and writing with an AI assistant.
cheatsheet:
  slug: technical-writing
  section: career
  summary: Lead with the decision or the ask, then the evidence — templates for status updates, PRs, escalations and executive summaries.
  topicVersion: "2026"
  verifiedAgainst:
    - label: Google — Technical Writing One
      url: https://developers.google.com/tech-writing/one
    - label: Google — Technical Writing One, Audience
      url: https://developers.google.com/tech-writing/one/audience
    - label: Google — Technical Writing One, summary
      url: https://developers.google.com/tech-writing/one/summary
    - label: Google Engineering Practices — Writing good CL descriptions
      url: https://google.github.io/eng-practices/review/developer/cl-descriptions.html
    - label: Axios HQ — Smart Brevity 101
      url: https://axioshq.com/hubfs/smart-brevity-101.pdf
    - label: Axios — Smart Brevity book announcement
      url: https://www.axios.com/2022/09/20/axios-book-smart-brevity
    - label: Will Larson, StaffEng — Present to executives
      url: https://staffeng.com/guides/present-to-executives/
  lastVerified: 2026-11-02
  difficulty: beginner
  tags: [writing, communication, status-updates, pull-requests, soft-skills]
  related:
    - practices/adr-design-docs
    - career/influence
    - career/feedback
    - practices/incident-management
---

## Mental model

Readers decide in the first two lines whether to keep reading, so put
the decision, the ask or the news there, and the evidence after it.
Most engineering writing fails not because it is wrong but because it
is ordered like the work was done — background, investigation,
finally the point — when the reader needs the reverse. Write for one
named reader, tell them what you need from them, and stop.

## Lead with the point

| Line | Carries |
|---|---|
| First sentence | The news, decision or ask |
| Second sentence | Why it matters to this reader |
| Bullets | Supporting points, most important first |
| Last | Links and detail for the curious |

This is "bottom line up front", and it is the core of Axios's Smart
Brevity method: pick the one detail you want remembered, sum it up in
one sentence and say it first, then say why it matters. Google's
technical writing course adds the paragraph-level version — one topic
per paragraph, and an opening sentence that states it.

```text
Before:
  Over the last two weeks we looked at the
  queue, tried three configs, and found...
After:
  We're moving billing to the new queue on
  Thursday; no action needed from you.
  Why: it removes the nightly backlog.
```

> **Gotcha:** "Context first" feels polite and buries the ask. If the
> reader only reads your first line in a notification preview, they
> must still know what you want.

## Calibrate to the audience

| Reader | Wants | Cut |
|---|---|---|
| Your team | Detail, trade-offs | Basics they know |
| Partner team | Impact on them, dates | Your internals |
| Manager | Risk, decisions needed | Step-by-step log |
| Non-engineer | Outcome in their terms | Jargon, acronyms |

Google's course calls the core problem the **curse of knowledge**:
experts forget what newcomers do not know, and their explanations
skip the steps a reader needs. Define the target reader before you
write, spell out acronyms on first use, and use one term per concept
throughout — switching between "job", "task" and "worker" makes a
reader think they are three things.

```text
Engineer: p99 latency on /checkout rose
  from 300 ms to 2 s after the pool change.
Sales:    Checkout got slow for some
  customers on Tuesday; it's fixed now.
```

## Writing a clear ask

| Element | Example |
|---|---|
| Who | "@dana, as owner of auth" |
| What exactly | "approve the scope change" |
| By when | "by Wed 17:00 UTC" |
| Default | "otherwise we ship without SSO" |

An ask without a named owner gets no owner, and one without a deadline
gets answered when convenient. Stating the default — what happens if
nobody replies — turns silence into a decision instead of a stall. Put
the ask in the first line, not after the background.

```text
Ask: @dana, can you approve dropping SSO
from v1 by Wed 17:00 UTC? If I hear
nothing, we ship without it and add SSO
in v1.1. Context: the IdP contract slipped
to January (link).
```

## Status updates

| Field | Rule |
|---|---|
| Status | One word: on track, at risk, off track |
| Since last time | Outcomes, not activity |
| Next | What lands before the next update |
| Risks and asks | Named owner and date each |

A status update exists so nobody has to ask you for one. Lead with the
state and any change to the date, because that is the one thing every
reader scans for. Report outcomes ("search ships to 10% of users")
rather than effort ("worked on search"), which tells the reader
nothing they can plan around.

```text
Search v2 — AT RISK (was on track)
Date: 14 Nov -> 21 Nov, pending index fix
Done: ranking shipped to 10% of users
Next: reindex prod by Tue
Ask: @ops one extra node by Mon, or we
  slip a further week
```

> **Tip:** Change in status goes first and in words. "At risk (was on
> track)" survives a skim; a colour on a dashboard does not.

## PR descriptions

| Part | Contains |
|---|---|
| First line | What the change does, imperative mood |
| Why | The problem and why this approach |
| Risk | What could break, how it was tested |
| Links | Issue, design doc, benchmarks |

Google's engineering practices treat the description as a permanent
record: a short first line saying **what** the change does, written
as an order ("Delete the FizzBuzz RPC"), then a body saying **why**,
with shortcomings and background. "Fix bug" is their example of an
inadequate description. Reviewers also need to know where to look and
how you verified it.

```text
Retry webhook delivery with backoff

Why: 2% of webhooks fail on transient 503s
and are never retried (#4812).
How: 5 attempts, exponential backoff, then
dead-letter queue.
Risk: duplicate deliveries; receivers
already dedupe on event id.
Tested: unit tests + replay of 1h prod log.
```

## Incident and escalation messages

| Field | Rule |
|---|---|
| Impact | Who is affected, in user terms |
| Status | Investigating, mitigated or resolved |
| Next update | A time, and keep it |
| Ask | The decision or help you need |

During an incident, readers want impact and the time of the next
update more than the cause. An escalation is an ask under time
pressure: say what you need, from whom, by when, and what you have
already tried, so the person you escalate to can act in one read.

```text
[SEV2] Card payments failing in EU
Impact: ~30% of EU checkouts fail since
  09:40 UTC.
Status: mitigating; failover in progress.
Next update: 10:30 UTC.
Ask: need payments on-call to approve
  switching acquirer.
```

> **Warning:** Never let a promised update time pass silently. "No new
> information, next update 11:00" keeps trust; silence makes people
> start their own side channel.

## Summarising for executives

| SCQA | One sentence of |
|---|---|
| Situation | What is true and agreed |
| Complication | What changed or is at risk |
| Question | The decision this raises |
| Answer | Your recommendation |

Will Larson's guide to presenting to executives recommends opening
every document with an SCQA paragraph, and aligning with stakeholders
before the meeting so nothing in it is a surprise. Executives read
for the decision and its cost; give them both in the first paragraph
and put the analysis below for whoever wants it.

```text
We run checkout on one region (S). Two
outages this quarter cost an estimated
$40k each (C). Should we fund
multi-region now (Q)? Yes: 6 engineer-
weeks, done by March (A).
```

## Editing passes and AI assistance

| Pass | Look for |
|---|---|
| Cut | Words that carry no meaning |
| Structure | One idea per paragraph, point first |
| Sentences | Active voice, specific verbs, short |
| Terms | One name per concept |
| Facts | Every number and name checked |

Edit in separate passes; trying to fix structure and wording at once
fixes neither. Google's course centres on exactly these habits:
consistent terminology, active voice, specific verbs and one idea per
sentence. An AI assistant is a good critic — ask it which sentence is
unclear or what a reader would ask next — and a risky author.

```text
Prompt: "Here is my status update for the
VP of Sales. Don't rewrite it. List the
sentences they won't understand and the
questions they'll ask."
```

> **Gotcha:** An assistant-drafted update reads fluent and generic,
> and it confidently fills gaps you did not give it. You own every
> claim: check its numbers and names, and keep your own phrasing for
> anything that carries a commitment.

## Further reading

- [Google Technical Writing One](https://developers.google.com/tech-writing/one)
- [Google Engineering Practices — Writing good CL descriptions](https://google.github.io/eng-practices/review/developer/cl-descriptions.html)
- [Axios HQ — Smart Brevity 101](https://axioshq.com/hubfs/smart-brevity-101.pdf)
- [Will Larson — Present to executives](https://staffeng.com/guides/present-to-executives/)
