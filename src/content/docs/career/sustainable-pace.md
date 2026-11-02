---
title: Sustainable Pace and Burnout
description: Recognising and preventing burnout as an engineer or a lead — the WHO definition, Maslach's six areas of worklife, on-call limits, saying no, boundaries and AI-tool fatigue.
cheatsheet:
  slug: sustainable-pace
  section: career
  summary: Burnout is a mismatch between demands and resources over time — spot the signs, fix the structure first, then protect focus, recovery and boundaries.
  topicVersion: "ICD-11"
  verifiedAgainst:
    - label: WHO — Burn-out an "occupational phenomenon" (ICD-11)
      url: https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases
    - label: WHO — FAQ, Burn-out an occupational phenomenon
      url: https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon
    - label: Maslach & Leiter (2016) — Understanding the burnout experience, World Psychiatry
      url: https://pubmed.ncbi.nlm.nih.gov/27265691/
    - label: Leiter & Maslach (2003) — Areas of worklife, a structured approach to organizational predictors of job burnout
      url: https://www.doi.org/10.1016/S1479-3555(03)03003-8
    - label: Google SRE book — Being On-Call
      url: https://sre.google/sre-book/being-on-call/
    - label: Principles behind the Agile Manifesto
      url: https://agilemanifesto.org/principles.html
    - label: State of Devs 2026 (Devographics)
      url: https://2026.stateofdevs.com/en-US/
    - label: Stack Overflow Developer Survey 2026 — Work
      url: https://survey.stackoverflow.co/2026/work
  lastVerified: 2026-11-02
  difficulty: beginner
  tags: [burnout, wellbeing, on-call, workload, boundaries]
  related:
    - career/tech-lead
    - career/feedback
    - practices/incident-management
    - career/second-brain
---

## Mental model

Burnout is a mismatch between what the job demands and the resources
you have to meet it, sustained over time — not a personal weakness.
Maslach and Leiter's research ties it to six areas of worklife:
workload, control, reward, community, fairness and values. Fix those
structurally first; a weekend off cannot repay a workload that is
permanently above capacity.

## What burnout is

| WHO dimension | Feels like |
|---|---|
| Exhaustion | Drained before the day starts |
| Mental distance, cynicism | "Why bother?"; detached from the work |
| Reduced professional efficacy | Nothing you do seems to land |

ICD-11 defines burn-out as a syndrome "resulting from chronic workplace
stress that has not been successfully managed", with these three
dimensions. WHO classifies it as an _occupational phenomenon_, not a
medical condition, and says it refers specifically to work — not other
areas of life. It is common: State of Devs 2026 found 62% of
respondents had experienced burnout at some point in their career.

```text
Burnout  = exhaustion
         + cynicism / mental distance
         + reduced efficacy
Tiredness after a launch = exhaustion only
```

> **Gotcha:** Exhaustion alone is not burnout, and a holiday that
> fixes it was what you needed. Cynicism and lost efficacy that return
> a week after you come back point at the job, not at your rest.

## Warning signs

| Sign | Ask yourself |
|---|---|
| Sunday dread every week | Which part of Monday? |
| Cynical about work you used to like | What changed — scope, team, values? |
| Procrastinating, unable to focus | Too much, or too little control? |
| Working longer, delivering less | Since when? |
| Sleep, illness, irritability | Is this lasting weeks, not days? |

The signs match the three dimensions and show up before you name them.
Around half of State of Devs 2026 respondents reported recent trouble
focusing, extra procrastination, unusual drain, or feeling less
effective. Track signs weekly in one line; a trend is easier to act on
than a feeling.

```text
Weekly check (1–5, 5 = good)
2026-10-19  energy 3  focus 3  meaning 4
2026-10-26  energy 2  focus 2  meaning 3
2026-11-02  energy 2  focus 2  meaning 2
-> three weeks down: raise it in 1:1
```

## The six areas of worklife

| Area | Mismatch looks like |
|---|---|
| Workload | More work than hours, with no end date |
| Control | Responsible for outcomes you can't influence |
| Reward | Effort unrecognised, in pay or acknowledgement |
| Community | Isolated, or constant conflict |
| Fairness | Promotions or on-call shared unevenly |
| Values | Asked to ship what you think is wrong |

Maslach and Leiter frame burnout as a chronic mismatch in one or more of
these areas, which makes them a diagnostic checklist. Name the area
before picking a fix: a values mismatch is not cured by a lighter
sprint, and a workload problem is not cured by a team offsite. Bring
the named area to your manager — it is a concrete, fixable request.

```text
"The issue isn't hours this month. I'm on
the hook for the release date, but I
can't change scope or staffing (control).
Can I get a say in what gets cut?"
```

## Workload and on-call limits

| Limit | Source |
|---|---|
| Sustain a constant pace indefinitely | Agile Manifesto principles |
| On-call ≤ 25% of an SRE's time | Google SRE book |
| ≤ 2 incidents per 12-hour shift | Google SRE book |
| Follow-up time after every incident | Google SRE book |

The Agile Manifesto asks that sponsors, developers and users "maintain
a constant pace indefinitely" — a sprint that needs overtime to finish
is a planning bug. Google's SRE book caps on-call at 25% of an SRE's
time and estimates an incident takes about six hours to handle and
follow up, which is why it targets at most two per 12-hour shift.
Treat those as upper bounds, not quotas.

```text
On-call health (last quarter)
pages per shift (avg)    __  target <= 2
out-of-hours pages       __
shifts per person        __  (even?)
incidents w/o follow-up  __  target 0
```

## Saying no with a trade-off

| Instead of | Say |
|---|---|
| "Yes" (and work the weekend) | "Yes, if X moves to next sprint" |
| "No" | "Not this week — Thursday works" |
| Silent overload | "Which of these three matters most?" |

You protect a sustainable pace by making the cost of new work visible,
not by refusing it. A trade-off answer hands the priority decision back
to the person who owns priorities. Write it down so the trade survives
the meeting.

```text
"Happy to take the export bug. That
pushes the search refactor past Friday.
OK to move it, or should someone else
pick up the bug?"
```

## Focus, recovery and remote boundaries

| Practice | Why |
|---|---|
| Fixed start and stop time | Remote work has no commute to end the day |
| Notifications off after hours | On-call is the only exception |
| Focus blocks in the calendar | Deep work needs unbroken time |
| Real breaks, away from the screen | Recovery is not a reward for finishing |

Recovery is part of the work cycle, not a reward at the end of it.
Remote work removes the physical edges of the day, so draw them
yourself and make them visible to the team.

```text
Status: Focus until 11:00 — reply after
Hours: 09:00–17:30 CET
Slack: notifications paused 18:00–08:00
Urgent: page on-call, not DM
```

## AI-tool fatigue and keeping skills

| Pressure | Counter |
|---|---|
| Usage quotas or leaderboards | Argue for outcome metrics instead |
| Reviewing more generated code | Review time is work — plan for it |
| Fear of skill loss | Do some tasks by hand on purpose |

State of Devs 2026 reports that AI tools may make developers more
productive without making them happier, and that heavy-handed mandates
such as quotas or leaderboards can hurt job happiness. In the Stack
Overflow 2026 survey, a third of developers said they are not happy at
work. Choose which work you keep doing yourself, so your judgement
stays sharp enough to review what the tools produce.

```text
Weekly by hand (no assistant):
- one bug from reproduction to fix
- one design sketch before prompting
- one review read line by line
```

## Asking for help and helping others

| Situation | Go to |
|---|---|
| Structural cause (load, control) | Your manager, with the named area |
| Symptoms lasting weeks | A doctor or mental-health professional |
| Employer support available | Employee assistance programme, HR |
| A teammate seems off | Ask privately; listen; don't diagnose |

Talk to your manager early, with specifics — it is easier to change a
sprint than to replace a burned-out engineer. Persistent low mood,
sleep problems or physical symptoms deserve a professional, because
burnout is not a diagnosis and other conditions look similar. For a
teammate, a private question and real follow-through do more than
advice.

```text
"You've seemed stretched the last few
weeks — how are you doing, honestly?
... Is there anything on your plate I
can take, or raise with our manager?"
```

> **Warning:** If you or a colleague has thoughts of self-harm, contact
> local emergency services or a crisis line now, not a manager.

## Further reading

- [WHO — Burn-out an "occupational phenomenon"](https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases)
- [Maslach & Leiter — Understanding the burnout experience](https://pubmed.ncbi.nlm.nih.gov/27265691/)
- [Google SRE book — Being On-Call](https://sre.google/sre-book/being-on-call/)
- [State of Devs 2026](https://2026.stateofdevs.com/en-US/)
- [Stack Overflow Developer Survey 2026 — Work](https://survey.stackoverflow.co/2026/work)
