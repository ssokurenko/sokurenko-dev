---
title: Giving and Receiving Feedback
description: Observation, impact, request — how to give feedback to peers, reports and managers, receive it without defending, and ask for feedback you can use.
cheatsheet:
  slug: feedback
  section: career
  summary: Give feedback as observation, impact and request; receive it without defending; ask for it so people actually answer.
  topicVersion: "2026"
  verifiedAgainst:
    - label: Radical Candor — Kim Scott's feedback framework
      url: https://www.radicalcandor.com/our-approach
    - label: Nonviolent Communication, Chapter 1 — Marshall Rosenberg (CNVC)
      url: https://cnvc.org/Training/nvc-chapter-1
    - label: Center for Creative Leadership — Situation-Behavior-Impact-Intent
      url: https://www.ccl.org/articles/leading-effectively-articles/closing-the-gap-between-intent-vs-impact-sbii/
    - label: Google re:Work — Hold effective 1:1 meetings
      url: https://rework.withgoogle.com/intl/en/guides/hold-effective-one-on-one-meetings
    - label: Google re:Work — Coach using the GROW model
      url: https://rework.withgoogle.com/intl/en/guides/coach-using-the-grow-model
    - label: Conventional Comments
      url: https://conventionalcomments.org/
    - label: Erin Meyer — Giving negative feedback across cultures
      url: https://erinmeyer.com/giving-negative-feedback-across-cultures/
  lastVerified: 2026-11-02
  difficulty: beginner
  tags: [feedback, communication, conflict, code-review, soft-skills]
  related:
    - career/tech-lead
    - career/influence
    - career/behavioral-interview
    - practices/code-review
---

## Mental model

Feedback is an observation, its impact, and a request — delivered soon
and in private. Anything else you add is a judgement ("you're careless",
"great job"), and a judgement gets defended or dismissed instead of
acted on. The other person can argue with your opinion of them; they
cannot argue with what happened and what it caused.

## Observation, impact, request

| Part | Sounds like | Not like |
|---|---|---|
| Observation | "The deploy went out without the migration" | "You're careless" |
| Impact | "Checkout failed for 20 minutes" | "It was bad" |
| Request | "Can we add the migration to the checklist?" | "Be more careful" |

The structure is the overlap of three established models: the Center
for Creative Leadership's Situation-Behavior-Impact, and the
observation and request steps of Rosenberg's Nonviolent Communication.
An observation is something two reasonable people would agree they
saw. The impact is concrete and yours or the team's. The request is a
specific, doable action — an invitation the person can say yes to, not
a verdict.

```text
"In Tuesday's planning (situation) you
committed us to Friday without asking the
team (observation). Two people are now
cancelling leave (impact). Next time, can
we check capacity before we commit?
(request)"
```

> **Gotcha:** Adjectives sneak judgements in. "You were rude in the
> review" is an evaluation; "you wrote 'this is wrong' with no
> explanation on six comments" is an observation.

## Timing and medium

| Situation | Choose |
|---|---|
| Praise | Soon; public is fine if they like it |
| Corrective, small | Soon, private, short |
| Corrective, serious | Private, live (call or in person) |
| Pattern over weeks | Scheduled 1:1, with examples |
| Angry right now | Wait until you can state the impact calmly |

Feedback decays fast: a week later the details are disputed and the
person wonders why you waited. Corrective feedback goes in private
because an audience turns it into a status fight. Text strips tone, so
anything serious happens live and gets a short written follow-up.

```text
"Have you got 10 minutes after standup?
Nothing urgent — I want to talk about
yesterday's incident call."
```

## Praise that teaches

| Vague | Specific |
|---|---|
| "Great job" | "The rollback plan in your PR saved us" |
| "Nice talk" | "The latency chart made the trade-off clear" |
| "Thanks for helping" | "Pairing on the flaky test unblocked my week" |

Praise is feedback too, and it uses the same structure. Specific praise
tells the person which behaviour to repeat; generic praise only signals
that you are pleased. Radical Candor's framework calls caring
personally without challenging directly _Ruinous Empathy_ — and
withholding criticism while handing out vague praise is exactly that.

```text
"Your design doc listed the three options
we rejected and why. That saved the
review 30 minutes of re-arguing — please
keep doing that."
```

## Feedback in code review

| Label | Means |
|---|---|
| `praise:` | Something worth repeating |
| `issue (blocking):` | Must change before merge |
| `suggestion (non-blocking):` | Consider it; author decides |
| `nitpick:` | Trivial preference |
| `question:` | You are unsure; asking, not demanding |

A review comment is feedback on code, not on the author, and written
text reads harsher than you meant. Conventional Comments makes intent
explicit with a label and a decoration, so the author knows what blocks
the merge. Pair every `issue` with a suggestion or the reason.

```text
issue (blocking): this query runs inside
the loop — N+1 against orders.

suggestion: fetch once with `WHERE id IN`
before the loop?
```

> **Tip:** Move to a call after two rounds of back-and-forth on one
> comment. Threads escalate; voices de-escalate.

## Receiving feedback

| Instead of | Say |
|---|---|
| "That's not what happened" | "Can you give me an example?" |
| "I did that because…" | "Thanks. Let me think about it." |
| Silence, then nothing changes | Tell them later what you changed |

Your first reaction to criticism is to defend — explain intent, correct
details. Intent is real but it does not cancel impact, and arguing
teaches the giver never to bother again. Ask questions until you can
restate the point, thank them, and decide later whether to act. Closing
the loop is what makes people give you feedback a second time.

```text
"So the concern is that my updates in
standup are too detailed to follow — is
that right? Thanks. I'll try a two-line
summary this week and check back."
```

## Asking for useful feedback

| Weak ask | Strong ask |
|---|---|
| "Any feedback?" | "What's one thing I could do better?" |
| "How did the talk go?" | "Where did you lose the thread?" |
| "Was the doc OK?" | "What would you cut from section 2?" |

"Any feedback?" gets "looks good" because it is cheap to answer and
risky to answer honestly. Ask for one specific thing, about a specific
piece of work, soon after it. Google's re:Work 1:1 guide suggests a
manager ask "Is there anything I should be doing for you that I am not
doing?" — the same move works upward and between peers.

```text
"I'm working on running shorter meetings.
In today's retro, where did I let it
drag? One example is plenty."
```

## The difficult conversation

| Step | Purpose |
|---|---|
| Ask for permission and time | No ambush |
| State observation and impact | Shared facts |
| Ask for their view | Intent you do not know |
| Agree a request and a check-in | Change, not catharsis |

Some feedback cannot be short: a repeated pattern, a conflict between
two people, a missed commitment with consequences. CCL's SBII model
adds _intent_ — ask why before concluding. Prepare your observation in
writing, keep to one issue, and end with an agreed next step and a date
to look at it again.

```text
"I'd like to talk about code review
turnaround. Three of my PRs waited more
than four days this sprint, and the
release slipped. What's going on from
your side? ... Could we agree on a
one-day first response, and check in
on it in two weeks?"
```

## Across cultures and remote

| Signal | Direct cultures | Indirect cultures |
|---|---|---|
| Criticism wording | Upgraders: "totally wrong" | Downgraders: "a bit off" |
| Setting | Can be in the group | Strictly one-to-one |

Erin Meyer's research on cultural feedback places cultures from direct
to indirect negative feedback; "slightly concerned" from one colleague
can carry the weight of "unacceptable" from another. Do not imitate a
more direct style — Meyer warns it usually backfires. Remotely, default
to camera-on calls for anything corrective and confirm understanding in
writing.

```text
"I may be phrasing this too softly, so
to be clear: this needs to change before
the release. Does that match how you
read it?"
```

> **Gotcha:** Individuals vary more than countries. Use the culture as
> a first guess, then ask the person how they like to get feedback.

## Further reading

- [Radical Candor — the framework](https://www.radicalcandor.com/our-approach)
- [Nonviolent Communication, Chapter 1](https://cnvc.org/Training/nvc-chapter-1)
- [CCL — Situation-Behavior-Impact-Intent](https://www.ccl.org/articles/leading-effectively-articles/closing-the-gap-between-intent-vs-impact-sbii/)
- [Google re:Work — Hold effective 1:1 meetings](https://rework.withgoogle.com/intl/en/guides/hold-effective-one-on-one-meetings)
- [Conventional Comments](https://conventionalcomments.org/)
- [Erin Meyer — Negative feedback across cultures](https://erinmeyer.com/giving-negative-feedback-across-cultures/)
