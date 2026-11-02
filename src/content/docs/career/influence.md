---
title: Influence Without Authority
description: Getting decisions made and adopted when you do not own the team — reciprocity and currencies, stakeholder maps, framing in the other side's metrics, pre-wiring, decision meetings, disagree-and-commit, pushback, escalation and follow-through.
cheatsheet:
  slug: influence
  section: career
  summary: Get decisions made and adopted across teams you don't run — reciprocity, stakeholder maps, pre-wiring, decision meetings, escalation and follow-through.
  topicVersion: "2026"
  verifiedAgainst:
    - label: Cohen and Bradford — Influence Without Authority, 3rd edition (Wiley)
      url: https://www.wiley.com/en-ie/Influence+Without+Authority,+3rd+Edition-p-9781119347712
    - label: Cohen and Bradford — The influence model, Journal of Organizational Excellence (2005)
      url: https://onlinelibrary.wiley.com/doi/abs/10.1002/joe.20080
    - label: Will Larson — Staff Engineer, the book
      url: https://staffeng.com/book/
    - label: Will Larson, StaffEng — Present to executives
      url: https://staffeng.com/guides/present-to-executives/
    - label: Will Larson, StaffEng — Getting in the room
      url: https://staffeng.com/guides/getting-in-the-room/
    - label: Amazon — Leadership Principles
      url: https://www.amazon.jobs/content/en/our-workplace/leadership-principles
  lastVerified: 2026-11-02
  difficulty: intermediate
  tags: [influence, leadership, stakeholders, decisions, soft-skills, staff-engineer]
  related:
    - career/feedback
    - career/technical-writing
    - career/tech-lead
    - practices/adr-design-docs
---

## Mental model

Influence is built before you need it. People say yes to someone they
trust who is helping them with their own goals, and that trust comes
from credibility and many small favours traded over months. The
proposal is the last step of the process, not the first — if the
meeting is where people hear your idea for the first time, you have
already lost most of your leverage.

## Reciprocity and currencies

| Currency | You can offer |
|---|---|
| Task | Help, resources, a fixed blocker |
| Position | Visibility, credit, a seat at a table |
| Inspiration | A bigger purpose, quality, doing right |
| Relationship | Being listened to, support, inclusion |
| Personal | Learning, ownership, gratitude |

Cohen and Bradford's influence model rests on reciprocity: without
authority you cannot order, but you can trade something the other
person values for what you need. They call those things
**currencies**. The model starts by assuming everyone is a potential
ally, clarifying your own goals, and understanding the other person's
world before working out which currencies matter to them.

```text
You need: platform team to add a cache API
They value: fewer pages at 3 a.m. (task),
  credit with their director (position)
You offer: you write the runbook and the
  alert, and present the win jointly
```

> **Gotcha:** Currencies are what **they** value, not what you think
> should matter. Offering "cleaner architecture" to a team measured on
> uptime is paying in a currency they do not spend.

## Map the stakeholders

| Interest / power | Strategy |
|---|---|
| High power, high interest | Co-design; meet one to one |
| High power, low interest | Short updates, no surprises |
| Low power, high interest | Involve, ask for input |
| Low power, low interest | Inform when it ships |

Before proposing anything, list every person who can block, fund,
build or be affected by the change, and place each in the grid.
Blockers are rarely the loudest people in the meeting; they are the
ones whose systems, roadmaps or metrics your change touches and who
were not asked.

```text
Change: move all services to new CI
  VP Eng       high/low  -> 3-line update
  Infra lead   high/high -> co-own design
  Mobile team  low/high  -> pilot group
  QA           low/low   -> notify at launch
```

## Frame it in their metrics

| Their goal | Your proposal framed as |
|---|---|
| Revenue | Checkout conversion, churn |
| Reliability | Incidents, pages, MTTR |
| Delivery | Lead time, fewer blocked PRs |
| Cost | Monthly spend, headcount saved |

Cohen and Bradford call this understanding the other person's world:
the pressures, metrics and boss they answer to. The same change sells
differently to each stakeholder, and none of them is buying your
reason for wanting it. Say what it does for the number they are
judged on, and what it costs them.

```text
Before: "We should adopt typed contracts
  between services."
After (to Support lead): "Typed contracts
  would have prevented 3 of last quarter's
  5 billing-ticket spikes."
```

## Pre-wire the decision

| Step | Purpose |
|---|---|
| One-to-one drafts | Find objections privately |
| Fold feedback in | Make it partly theirs |
| Ask the decider early | Learn what they need to say yes |
| Confirm before the meeting | No first-time surprises |

Will Larson's guide to presenting to executives recommends aligning
with stakeholders before the presentation — the Japanese practice of
**nemawashi** — and sending an early draft to an executive who will
attend, asking what to change. People object more freely in private,
and an objection you fix beforehand is one nobody needs to defend in
public.

```text
"Before Thursday's review I'd like your
eyes on this. What would stop you from
supporting it? I'd rather change it now
than argue about it in the room."
```

> **Tip:** Name who raised a concern when you show the fix: "Priya
> spotted the migration risk, so phase 1 is read-only." Credit is a
> currency, and it turns a critic into a co-author.

## Run the decision meeting

| Element | Rule |
|---|---|
| Decider | One named person, stated up front |
| Options | Two or three, including "do nothing" |
| Criteria | Agreed before options are debated |
| Output | Decision, owner, date, written down |

A meeting without a named decider produces discussion, not a decision.
Open with the question and who decides it, compare options against
criteria agreed first, and end by reading the decision back. Send the
written record the same day; a decision nobody wrote down gets
re-litigated in a month.

```text
Decision: adopt new CI for all services
Decider: @maria (VP Eng)
Rejected: keep Jenkins (cost), per-team
  choice (support burden)
Owner: @lee; pilot done by 15 Dec
```

## Disagree and commit

| Before the decision | After the decision |
|---|---|
| Argue your case fully | Support it in public |
| Put objections in writing | Execute it as your own |
| Propose a test or a revisit date | Raise new data, not old arguments |

Amazon's "Have Backbone; Disagree and Commit" principle states the
norm well: challenge decisions you disagree with, respectfully, even
when it is uncomfortable — and once a decision is made, commit wholly.
Your credibility for the next disagreement depends on how you behave
after losing this one.

```text
"I still think per-team CI is cheaper, and
I've said why. We've decided otherwise, so
I'll migrate my team first and report what
we hit."
```

> **Warning:** Committing in the meeting and slow-walking afterwards
> is the fastest way to spend all the trust you built. If new facts
> appear, raise them openly with the decider.

## Handle pushback

| Pushback | Usually means | Response |
|---|---|---|
| "Not now" | Priority conflict | Ask what would make it now |
| "Too risky" | Unclear blast radius | Offer a reversible pilot |
| "Not my problem" | Wrong currency | Show the cost to them |
| Silence | No owner, or a hidden no | Ask one person directly |

Treat an objection as information about the other person's world, not
as an attack to defeat. Ask what would have to be true for them to
say yes, and shrink the commitment until it is easy: a pilot, a time
box, a reversible first step.

```text
Them: "We can't take this on this quarter."
You:  "Understood. Would a two-week pilot on
       one service fit if my team does the
       setup?"
```

## Escalate without burning bridges

| Do | Don't |
|---|---|
| Tell them first that you'll escalate | Go over their head silently |
| Escalate jointly, with both views | Present only your side |
| Ask the manager for a decision | Ask the manager to overrule them |
| Thank them afterwards | Treat it as a win |

Escalation is a normal tool for resolving a priority conflict two
people cannot settle, not a punishment. Write the shared summary
together — the options, each side's reasoning, the decision needed —
so the manager decides the question rather than judging the people.

```text
"We disagree on whether auth or search
goes first. Shall we write up both views
for Sam together and ask for a call by
Friday?"
```

## Follow through

| After yes | Why |
|---|---|
| Deliver your side first | Proves the trade was real |
| Report results in their metric | Pays the promised currency |
| Credit them publicly | Builds the next yes |

A "yes" is the start of adoption, not the end. Deliver what you
offered, report the result in the terms you used to sell it, and
credit the people who backed you — that is the credibility you will
spend on the next proposal.

```text
"Two weeks in: new CI cut median build
time on payments from 14 to 6 minutes.
Thanks to @lee's team for piloting it."
```

## Further reading

- [Cohen and Bradford — Influence Without Authority](https://www.wiley.com/en-ie/Influence+Without+Authority,+3rd+Edition-p-9781119347712)
- [Will Larson — Staff Engineer](https://staffeng.com/book/)
- [Will Larson — Present to executives](https://staffeng.com/guides/present-to-executives/)
- [Amazon Leadership Principles](https://www.amazon.jobs/content/en/our-workplace/leadership-principles)
