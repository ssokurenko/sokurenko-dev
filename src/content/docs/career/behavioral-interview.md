---
title: Behavioral Interview for Senior Roles
description: Preparing and delivering behavioral answers at senior and staff level — STAR with reflection, a story bank, the signals interviewers score, question families, Amazon's Leadership Principles and questions to ask back.
cheatsheet:
  slug: behavioral-interview
  section: career
  summary: STAR with reflection, a story bank mapped to signals, and what each question family really tests at senior and staff level.
  topicVersion: "2026"
  verifiedAgainst:
    - label: Tech Interview Handbook — Behavioral interviews, how to prepare
      url: https://www.techinterviewhandbook.org/behavioral-interview/
    - label: Tech Interview Handbook — Common behavioral questions
      url: https://www.techinterviewhandbook.org/behavioral-interview-questions/
    - label: Tech Interview Handbook — Questions to ask at the end
      url: https://www.techinterviewhandbook.org/final-questions/
    - label: Amazon — Leadership Principles
      url: https://www.amazon.jobs/content/en/our-workplace/leadership-principles
    - label: About Amazon — Leadership Principles interview strategies
      url: https://www.aboutamazon.com/news/workplace/amazon-leadership-principles-interview
  lastVerified: 2026-11-02
  difficulty: intermediate
  tags: [interview, career, star, storytelling, soft-skills]
  related:
    - career/influence
    - career/technical-writing
    - career/salary-negotiation
    - foundations/system-design
---

## Mental model

A behavioral question is not asking what happened; it is asking how
you think. The interviewer is grading how you defined the problem,
which trade-offs you made under real constraints, and whether you
would do it the same way again — the story is only the vehicle for
that judgement. The same round also sets your level, so a story that
shows a correct decision at too small a scope still scores low.

## STAR with reflection

| Part | Answers |
|---|---|
| Situation | Where, when, what was at stake |
| Task | What you had to achieve |
| Action | What **you** did, why, and the alternatives |
| Result | Outcome, measured where possible |
| Learning | What you would do differently now |

STAR is the standard structure. The Tech Interview Handbook adds a
final reflection step — "STAR(R)", often called STAR-L — as the
strongest seniority signal: finish by looking back at what you learned
and what changed afterwards. The Action is where the score is earned,
because actions are the repeatable behaviours the interview is named
after.

```text
S  Payments migration, 3 teams, Q4 freeze
T  Cut over without a checkout outage
A  I proposed dual-writes over a big-bang
   switch; traded 3 weeks for rollback
R  Zero-downtime cutover, 2 weeks late
L  I'd involve finance in week 1, not 6
```

> **Gotcha:** "We decided, we built" hides you. The interviewer cannot
> credit a team; say "I proposed", "I convinced", "I chose not to",
> and keep the team's work as context.

## The big three questions

| Question | Prepare |
|---|---|
| Tell me about yourself | Two-minute arc ending at this role |
| Your most impactful project | Impact, scope, your part |
| A conflict you resolved | Most common soft-skill question |

The Handbook argues that drilling long question lists pays off less
than preparing stories, with three exceptions that appear in almost
every loop. Prepare bullet points for them rather than a script, and
rehearse them aloud so they come out naturally.

```text
Tell me about yourself:
  now   -> staff eng, payments platform
  how   -> 3 roles, each larger scope
  why   -> want grid-scale energy systems
  ask   -> which is why this role
```

## Build a story bank

| Signal | Story you need |
|---|---|
| Conflict | Disagreement you resolved |
| Failure | A mistake you owned and fixed |
| Influence | Changed a decision you did not own |
| Ambiguity | Defined an unclear problem |
| Scale | Work that crossed teams or systems |
| Growth | Feedback that changed how you work |

Start from projects, not questions: the Handbook suggests collecting
3–5 projects with high impact, high complexity and high personal
involvement, then mining each for several stories, because one large
project usually contains conflict, ambiguity and a mistake. Map every
story to the signals above and look for empty rows — those are the
questions you will fumble.

```text
Project: payments migration
  conflict  -> finance vs platform on dates
  ambiguity -> no owner for refunds path
  failure   -> missed FX rounding in test
Project: on-call redesign
  influence -> got 4 teams to adopt SLOs
```

## Pacing an answer

| Part | Share of the answer |
|---|---|
| Situation and Task | Brief — just enough stakes |
| Action | Most of it |
| Result and Learning | Short, concrete, measured |

Candidates overspend on setup because it is the part they remember
best. Give enough context to make the stakes clear, then move to your
decisions. Keep the first pass compact and let follow-up questions
pull out detail; an interviewer who wants more will ask, one who is
lost in background will stop listening.

```text
Too long:  4 minutes of org history
Better:    "Two teams owned checkout and
           neither owned refunds. I had to
           ship refunds in 6 weeks." -> Action
```

## Senior signals

| Signal | Shows as |
|---|---|
| Scope | Multiple teams, systems or quarters |
| Stakeholders | Who you aligned, and how |
| Trade-offs | Options you rejected, and why |
| Measured outcome | A number or observable change |
| Reflection | What you would change now |

The Handbook names two purposes of the round: whether you have shown
the right behaviours, and your level. At senior and staff level the
same story is scored on how wide its consequences were and how you
handled the people around the technical problem. Name the option you
did not take; a decision with no alternative is not a decision.

```text
Mid:    "I fixed the flaky deploy."
Senior: "Deploys failed 1 in 5. I could
  patch our pipeline or fix the shared
  runner; I chose the runner, which took
  2 weeks longer but fixed it for 6 teams."
```

## Question families

| Question | Really testing |
|---|---|
| Conflict with a co-worker | Empathy, resolution, no blame |
| Disagreed with your manager | Backbone and commitment |
| A failure or mistake | Ownership, learning |
| Something you pushed for | Influence without authority |
| Tight deadline | Prioritisation, trade-offs |
| Criticism of your work | Coachability |

These families come from the Handbook's list of commonly asked
questions across large tech companies. Each one has a trap answer: a
conflict where the other person was simply wrong, a failure that was
really a success, a deadline met only by heroics. Pick stories where
you changed your own behaviour.

```text
Weak:  "My weakness is I work too hard."
Strong: "I used to review PRs late at
  night; reviews became a bottleneck. I
  now block two review slots a day."
```

> **Warning:** Never blame a former colleague or employer, even
> accurately. The interviewer hears how you will describe them next.

## Amazon Leadership Principles as vocabulary

| Principle | Typical question |
|---|---|
| Customer Obsession | Went beyond the spec for a user |
| Ownership | Fixed something outside your remit |
| Have Backbone; Disagree and Commit | Challenged a decision, then delivered |
| Dive Deep | Found a root cause others missed |
| Deliver Results | Shipped despite a setback |

Amazon publishes 16 Leadership Principles and its interviewers map
questions to them, which makes them a useful shared vocabulary even
for other companies. "Have Backbone; Disagree and Commit" captures a
senior expectation: respectfully challenge a decision you disagree
with, and once it is made, commit wholly. Read the target company's
published values and tag each story with the ones it demonstrates.

```text
Story: dual-write migration
  Ownership, Dive Deep, Disagree and Commit
Story: on-call SLOs
  Earn Trust, Insist on the Highest Standards
```

## Questions to ask back

| Goal | Ask |
|---|---|
| Real work | "What problem would you want me to solve first?" |
| Bar | "What does success look like for this team?" |
| Culture | "What is the most frustrating part of working here?" |
| Decisions | "How are technical decisions made, and by whom?" |

The final minutes are part of the interview. These questions, adapted
from the Handbook's list, show you think about impact and team health,
and the answers tell you whether you want the job. Prepare four and
ask the two the conversation has not already answered.

```text
"What's the most costly technical decision
the team is still living with?"
```

## Further reading

- [Tech Interview Handbook — Behavioral interviews](https://www.techinterviewhandbook.org/behavioral-interview/)
- [Tech Interview Handbook — Common behavioral questions](https://www.techinterviewhandbook.org/behavioral-interview-questions/)
- [Tech Interview Handbook — Questions to ask](https://www.techinterviewhandbook.org/final-questions/)
- [Amazon Leadership Principles](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)
