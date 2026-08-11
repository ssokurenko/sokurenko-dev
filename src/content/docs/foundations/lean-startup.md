---
title: The Lean Startup
description: Hypotheses, MVPs, validated learning, innovation accounting, engines of growth and pivots — the method for building under extreme uncertainty.
cheatsheet:
  slug: lean-startup
  section: foundations
  summary: Hypotheses, MVPs, validated learning, actionable metrics, engines of growth and pivots — how to build when the plan cannot be trusted.
  topicVersion: "N/A"
  verifiedAgainst:
    - label: The Lean Startup — Principles, Eric Ries
      url: http://theleanstartup.com/principles
    - label: Minimum Viable Product — a guide, Eric Ries
      url: http://www.startuplessonslearned.com/2009/08/minimum-viable-product-guide.html
    - label: Validated learning about customers, Eric Ries
      url: http://www.startuplessonslearned.com/2009/04/validated-learning-about-customers.html
    - label: The three drivers of growth for your business model, Eric Ries
      url: http://www.startuplessonslearned.com/2008/09/three-drivers-of-growth-for-your.html
    - label: Pivot, don't jump to a new vision, Eric Ries
      url: http://www.startuplessonslearned.com/2009/06/pivot-dont-jump-to-new-vision.html
    - label: Beware of Vanity Metrics, Eric Ries
      url: http://www.startuplessonslearned.com/2010/02/beware-of-vanity-metrics-for-harvard.html
    - label: How to conduct a Five Whys root cause analysis, Eric Ries
      url: http://www.startuplessonslearned.com/2009/07/how-to-conduct-five-whys-root-cause.html
    - label: Build, Measure, Learn — Steve Blank
      url: https://steveblank.com/2015/05/06/build-measure-learn-throw-things-against-the-wall-and-see-if-they-work/
  lastVerified: 2026-08-11
  difficulty: intermediate
  tags: [product, methodology, experimentation, metrics, startup]
  related:
    - practices/scrum
---

## Mental model

A startup is "a human institution designed to create a new product or
service under conditions of extreme uncertainty" — the uncertainty is
what defines it, not the size, the age, or the garage. Under that
uncertainty a detailed plan is theatre, because you cannot forecast a
market that does not exist yet. So the unit of progress stops being
features shipped and becomes **validated learning about customers**,
and every practice below is machinery for buying that learning cheaply.

## Hypotheses, not ideas

| Leap-of-faith assumption | The question it settles |
|---|---|
| Value hypothesis | Does this deliver value once used? |
| Growth hypothesis | How do new customers find it? |
| Customer segment | Who has this problem badly? |
| Willingness to pay | Will they give up money or time? |

Steve Blank puts the correction bluntly: "new ventures don't start with
'ideas', they start with hypotheses (a fancy word for guesses)". His
frame for a startup is a temporary organization searching for a
repeatable and scalable business model, and customer development is
"the process of how you get out of the building and search for the
model". Write down the two assumptions that kill the company if they
are wrong, and test those first — not the ones that are easiest to
test.

> **Gotcha:** Interest is not evidence. "Would you use this?" is
> answered by politeness, and everyone says yes. Ask what they did
> last time they had the problem, or ask for a commitment — an email,
> a deposit, an hour of their time.

## Build-Measure-Learn

| Stage | Produces |
|---|---|
| Build | The smallest test of one hypothesis |
| Measure | Data on what people actually did |
| Learn | A pivot-or-persevere decision |

The loop runs build, then measure, then learn — but it is *planned in
reverse*: decide what you need to learn, derive the metric that would
show it, then build the least thing that produces that metric. The
number to optimize is total time around the loop, not the speed of any
one arc. Blank's summary of the intent is "to maximize learning through
incremental and iterative engineering", which he restates as
hypotheses, experiments, tests, insights.

```text
Plan backwards        Run forwards
  Learn what?           Build
  Measure what?   ->    Measure
  Build what?           Learn

Optimize the whole lap, not one arc.
```

> **Gotcha:** Teams instrument the Build arc alone — velocity, cycle
> time, deploys per day — and leave a two-week reporting lag in
> Measure and a quarterly review in Learn. Halving build time then
> barely moves the loop it was supposed to shorten.

## Minimum viable product

| MVP type | What it tests |
|---|---|
| Landing page, ad smoke test | Demand, before anything exists |
| Concierge | The service, delivered by hand |
| Wizard of Oz | Real interface, manual behind it |
| Video | Whether people grasp and want it |
| Single-feature build | Value of the one core action |

The MVP is "that version of a new product which allows a team to
collect the maximum amount of validated learning about customers with
the least effort", and Ries is emphatic that "MVP, despite the name, is
not about creating minimal products". Minimum is measured against the
hypothesis, not against a feature count — IMVU's first MVP took six
months. Blank's version is the useful test in the room: the simplest
thing you can show customers to get the most learning at that point in
time.

> **Gotcha:** An MVP that produces no measurement is not an MVP, it is
> just a small product. Ries's own example is a feature that took two
> weeks to build when "a simple AdWords smoke test would have revealed
> how utterly bad the concept was".

## Validated learning

| Activity | Progress? |
|---|---|
| Feature shipped on schedule | Only if it settled a hypothesis |
| Hypothesis disproved by data | Yes — a costly path closed early |
| Revenue up, cause unknown | No, nothing was learned |
| Roadmap delivered in full | This is how you achieve failure |

Validated learning is "a rigorous method for demonstrating progress
when one is embedded in the soil of extreme uncertainty", and the
validation "comes in the form of data that demonstrates that the key
risks in the business have been addressed". Ries states the priority
plainly: "Given a choice between what a successful team has learned and
the source code they have produced, I would take the learning every
time." The failure mode all of this exists to prevent is *achieving
failure* — executing a plan faithfully, on time, on budget, for a
product nobody wants.

> **Gotcha:** A disproved hypothesis is a successful experiment, but
> it reads to the organization as a missed commitment. If the review
> only rewards shipped scope, teams will stop running experiments that
> can come back negative — which is all the useful ones.

## Actionable metrics

| Vanity metric | Actionable replacement |
|---|---|
| Total registered users | Activation rate, by cohort |
| Page views | Retention by signup week |
| Gross revenue | Revenue per customer, per cohort |
| Press mentions | Conversion from that channel |

Vanity metrics are "numbers which look good on paper but aren't action
oriented: website hits, message volume, or 'billions and billions
served'". They only go up and to the right, so they cannot tell you
whether the last change helped. Ries asks that every metric be
**actionable, accessible, and auditable**, and that cause and effect be
established by cohort analysis and split testing rather than by reading
a cumulative chart.

> **Gotcha:** Gross numbers invite a bias Ries names directly — "when
> the numbers go up, we tend to take credit. But when the numbers go
> down, we tend to blame someone or something else." A per-cohort rate
> removes the argument, because each cohort's curve stands alone.

## Innovation accounting

| Milestone | The work |
|---|---|
| Establish the baseline | Ship an MVP, measure where you are |
| Tune the engine | Move that baseline toward the ideal |
| Pivot or persevere | Judge whether tuning still pays |

Conventional milestones assume you know the destination, and a
startup's metrics are all effectively zero at the start — so
innovation accounting substitutes **learning milestones**: how to
measure progress and prioritize work while the business model is still
a guess. The baseline is deliberately unflattering, being the honest
current conversion, retention, or price. Tuning means every experiment
must move that number, and the size of the moves tells you whether the
hypothesis has life in it.

> **Gotcha:** A team that keeps hitting small improvements can still be
> failing. If a dozen experiments each add a fraction of a percent and
> the gap to a viable business is a factor of ten, the engine is tuned
> and the hypothesis is still wrong.

## Engines of growth

| Engine | The number that governs it |
|---|---|
| Sticky | Retention above churn rate |
| Viral | Viral coefficient above 1.0 |
| Paid | Lifetime value above blended CPA |

Growth is not a mood; it is one of three mechanisms, each with a single
governing number. Sticky growth compounds when new customer
acquisition outruns churn. Viral growth needs a coefficient above 1.0,
because "if the coefficient is > 1.0, you generally have a viral hit on
your hands". Paid growth lives on the spread, which "determines either
your profitability or your rate of growth". Ries's instruction is to
specialize: "Every startup needs to 'pick a major' among these three
drivers of growth. It's simply too hard to focus on more than one."

> **Gotcha:** Word of mouth is not the viral engine. Viral means
> transmission is a necessary byproduct of ordinary use, the way
> sending mail once carried Hotmail's signature — happy customers
> recommending you is sticky growth wearing a flattering name.

## Pivot or persevere

| Pivot | What changes |
|---|---|
| Zoom-in | One feature becomes the whole product |
| Zoom-out | The product becomes one feature |
| Customer segment | Same product, a different buyer |
| Customer need | Same buyer, a different problem |
| Platform | Application becomes platform, or back |
| Engine of growth | Sticky, viral or paid is swapped |

A pivot is "a structural course correction to test a new fundamental
hypothesis about the product, strategy and engine of growth" — the
vision usually survives it, the strategy does not. What separates a
pivot from a restart is continuity: "successful startups change
directions but stay grounded in what they've learned. They keep one
foot in the past and place one foot in a new possible future", where
unsuccessful ones "jump outright from one vision to something
completely different" and discard the learning they paid for. Value
capture, channel, technology and business architecture pivots complete
the book's catalogue. Schedule the decision as a standing meeting, so
it is taken on evidence rather than on exhaustion.

> **Gotcha:** Runway measured in months is the wrong unit — the real
> question is how many pivots you can still afford. Cutting burn buys
> more of both, but shortening the loop increases the runway without
> additional cash, which is the cheaper lever.

## Small batches and Five Whys

| Practice | Effect |
|---|---|
| Small batches | Defect found next to its cause |
| Continuous deployment | The loop closes in hours |
| Five Whys | The fix lands on the cause |
| Proportional investment | Response sized to the damage |

The method inherits its factory floor from lean manufacturing: work in
small batches, stop the line when something is wrong, and treat unused
inventory — features nobody asked for — as waste. Five Whys is the
tool for the stop: ask why five times, on the premise that behind every
supposedly technical problem is a human problem, and always include
"why didn't our tests catch and prevent the problem?". Then invest at
every level in proportion to the damage — "don't do too much, and
don't do nothing" — with everyone affected in the room.

> **Gotcha:** Five Whys turns into five blames the moment a name
> arrives before a system does. Ries offers no shortcut — "there's no
> easy fix to this problem. Trust takes time to build up" — so start
> with small problems and let the practice earn its credibility.

## Further reading

- [The Lean Startup principles](http://theleanstartup.com/principles)
- [Minimum Viable Product: a guide](http://www.startuplessonslearned.com/2009/08/minimum-viable-product-guide.html)
- [Validated learning about customers](http://www.startuplessonslearned.com/2009/04/validated-learning-about-customers.html)
- [The three drivers of growth](http://www.startuplessonslearned.com/2008/09/three-drivers-of-growth-for-your.html)
- [Pivot, don't jump to a new vision](http://www.startuplessonslearned.com/2009/06/pivot-dont-jump-to-new-vision.html)
- [Beware of vanity metrics](http://www.startuplessonslearned.com/2010/02/beware-of-vanity-metrics-for-harvard.html)
- [How to conduct a Five Whys analysis](http://www.startuplessonslearned.com/2009/07/how-to-conduct-five-whys-root-cause.html)
- [Steve Blank on Build, Measure, Learn](https://steveblank.com/2015/05/06/build-measure-learn-throw-things-against-the-wall-and-see-if-they-work/)
