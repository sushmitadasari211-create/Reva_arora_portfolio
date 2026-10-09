# RetainIQ

**Employee Turnover Cost & Retention ROI Calculator**

> Turn employee turnover into a number a CFO will actually act on.

---

## The business problem

Every company tracks its attrition *rate*. Almost none of them can answer the
next question a CFO actually asks: **"What is that costing us, and what
should we spend to fix it?"**

Turnover has real, compounding costs that rarely show up on a single invoice:
recruiter time, manager interview hours, weeks of an empty seat, months of
ramp-up before a new hire is fully productive, and the quiet drag on the
team around them. RetainIQ prices all of it, breaks it down by department and
tenure, and then simulates what happens if you actually spend money to fix it.

## Why this is different from a generic attrition dashboard

**This is not an attrition prediction demo.** It does not try to predict
*who* will quit using a black-box model. Instead, RetainIQ is a **retention
decision-support product** that:

- Converts your attrition rate into a fully-loaded **annual dollar cost**,
  broken into six named cost components.
- Identifies **which department + tenure combinations** are burning the most
  money, not just which have the highest turnover percentage.
- Lets you simulate **seven concrete interventions** (comp adjustments,
  manager coaching, internal mobility, L&D, flexibility, stay interviews,
  high-performer retention) and see the **cost, savings, and ROI of each**
  before you spend a dollar.
- Recommends a **specific, ranked retention plan** with a payback period --
  the kind of output you'd actually bring into a budget meeting.

A dashboard tells you attrition went up. RetainIQ tells you what it's costing
you and what to do about it.

## Key features

- **Hero KPI band** — annual turnover cost, attrition rate, high-risk segment
  count, and estimated ROI from your current retention plan, all live.
- **Workforce Configurator** — industry, company size, headcount, attrition
  rate, salary, time-to-fill, onboarding ramp, % high performers, and %
  manager roles all feed one deterministic model.
- **Cost Breakdown** — stacked cost-component chart by department, a direct
  vs. indirect doughnut, a savings-opportunity waterfall, and the top three
  loss drivers.
- **Risk Segments** — a department x tenure-band heatmap, a risk-score vs.
  replacement-cost bubble chart, and clickable segment detail panels.
- **Intervention Simulator** — seven live sliders, each recalculating cost,
  attrition reduction, savings, and net impact instantly, plus a before/after
  comparison and an ROI-ranked list.
- **ROI Board** — an ROI gauge, a 12-month cumulative savings projection, a
  payback-period card, budget-vs-benefit bars, and a recommended plan banner.
- **Executive Summary** — plain-language narrative + a 90-day action plan,
  copyable and exportable as a `.txt` file.
- **Python Logic** — the exact cost, risk-scoring, and ROI formulas used by
  the app, written out as copyable Python snippets.
- **LinkedIn Carousel** — six ready-to-share slide panels and a caption, all
  populated with your own numbers.

## Screenshots

_Add screenshots of the Hero KPI band, Cost Breakdown tab, Risk Segments
heatmap, and ROI Board here once you've generated your own scenario._

```
docs/screenshot-hero.png
docs/screenshot-cost-breakdown.png
docs/screenshot-risk-segments.png
docs/screenshot-roi-board.png
```

## Tech stack

- Vanilla **HTML, CSS, and JavaScript** — no framework, no build tools
- **[Chart.js](https://www.chartjs.org/)** (loaded via CDN) for all charts
- Zero backend, zero external APIs, zero tracking — runs entirely client-side

## Data model & assumptions

All numbers come from one deterministic function, `calculateModel(inputs)`,
in `app.js`. There is no randomness — the same inputs always produce the
same outputs. The heuristics used:

| Cost component | Formula (per departing employee) |
|---|---|
| Replacement | `salary × 0.20 × company-size multiplier` |
| Recruiter | `salary × 0.10 × company-size multiplier` |
| Manager interview time | `hourly rate × 15 interview hours × 2 interviewers` |
| Onboarding & training | `salary × (ramp months ÷ 12) × 0.50` |
| Productivity loss | `salary × (ramp months ÷ 12) × role criticality` |
| Vacancy cost | `(salary ÷ 260 workdays) × time-to-fill days × 0.60` |

Six departments (Engineering, Sales, Customer Support, Operations, Product,
G&A) and five tenure bands (0–6mo, 6–12mo, 1–2yr, 2–4yr, 4yr+) each carry
their own salary, criticality, and relative-attrition multipliers, calibrated
so the headcount-weighted average always reconciles back to the attrition
rate you set on the slider. Industry and company size apply additional
adjustment factors (documented in the `INDUSTRY_META` / `COMPANY_SIZE_META`
constants in `app.js`).

Each of the seven interventions has a `costFactor` and a `maxReduction`
(maximum attrition-rate reduction at 100% funding). Because both cost and
savings scale linearly with investment level, an intervention's ROI
*efficiency* is independent of the slider position — only the absolute
dollar totals change. Combined scenarios cap total avoided exits at 60% of
baseline exits so stacking every intervention at once never implies
eliminating attrition entirely.

## Local run steps

No installation, no build step, no server required.

1. Download or clone this folder.
2. Double-click `index.html` (or right-click → Open With → your browser).
3. Adjust the Workforce Configurator and click **Analyze Retention Risk**.

## GitHub Pages deployment steps

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`.
4. Choose your default branch (e.g. `main`) and the `/ (root)` folder.
5. Save — GitHub will publish the site at
   `https://<your-username>.github.io/<repo-name>/`.

## Repo structure

```
RetainIQ/
├── index.html    # Page structure: header, KPIs, configurator, 7 tabs
├── styles.css    # Design system: colors, layout, responsive rules
├── app.js        # calculateModel() + all rendering + all interactivity
└── README.md     # This file
```

## What this project demonstrates

- Translating a fuzzy HR metric (attrition %) into a rigorous, auditable
  financial model with named, documented assumptions.
- Building a fully interactive, multi-tab analytics product with **zero**
  backend and **zero** build tooling — just HTML/CSS/JS and a CDN chart
  library.
- Designing an intervention/ROI simulator where the underlying math (linear
  cost/savings scaling, capped combined effects) is intentionally simple
  enough to explain to a non-technical stakeholder, on purpose.
- Product thinking beyond "a chart": the same model powers KPIs, charts, a
  heatmap, an executive narrative, and shareable social content, all from one
  source of truth (`calculateModel`).

## Suggested LinkedIn post

> I built RetainIQ: a browser-based tool that prices employee turnover in
> real dollars and simulates the ROI of retention spend before you commit
> budget to it.
>
> No backend. No build tools. No attrition "prediction" black box — just a
> transparent, documented cost + ROI model you can hand to a CFO.
>
> Try it, fork it, or use the LinkedIn Carousel tab inside the app to
> generate a shareable summary of your own numbers.
>
> #HRAnalytics #PeopleAnalytics #RetentionStrategy #HRTech

## License

Released for personal, educational, and portfolio use. No warranty is
provided; the cost and ROI figures are illustrative heuristics, not
certified financial or actuarial advice.
