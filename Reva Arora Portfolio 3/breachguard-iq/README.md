# BreachGuard IQ — Data Breach Risk & Cost Exposure Simulator

A single-file, browser-only enterprise risk quantification tool styled after Power BI /
Bloomberg Terminal dashboards. It shows any company exactly what a data breach would cost
them today, how fast that cost escalates with detection delay, and which security
investment cuts the risk the most per dollar spent.

**File:** `breachguard_iq.html` — open it directly in Chrome/Edge. No install, no server,
no API keys. All libraries (Tailwind CSS, Chart.js, chartjs-plugin-datalabels, Prism.js)
load from public CDNs.

## What it does

- **5 live "slicers"** (industry, company size, region, data sensitivity, security
  maturity) recalculate every KPI and chart across all tabs instantly, Power BI style.
- **Tab 1 — Risk Overview:** 4 KPI cards, a cost-breakdown donut, an industry benchmark
  bar chart, a security-maturity gauge, and a company-size-vs-cost scatter plot.
- **Tab 2 — Detection Speed Impact:** a slider (10–365 days) drives a live cost
  escalation curve and a waterfall chart showing how faster detection, AI security
  tooling, and staff training stack up to reduce cost.
- **Tab 3 — Risk Reduction Advisor:** a ranked, expandable table of 8 real-world
  security investments with cost, risk reduction, ROI, and payback period, plus a
  bubble chart and a checkbox-driven cumulative risk-reduction bar.
- **Tab 4 — Executive Risk Brief:** an auto-generated, board-ready summary that
  regenerates from whatever filters and investments are currently selected, with a
  one-click copy button.
- **Python Model tab:** the three formulas behind the simulator (cost estimation,
  detection-speed curve, ROI ranking), each with a copy button.
- **Carousel tab:** 6 ready-to-post LinkedIn carousel slides summarizing the story.

## The numbers behind it

Baseline figures are sourced from the IBM Cost of a Data Breach Report: a $4.88M global
average, $10.22M U.S. average, the $3.87M (under 200 days) vs. $5.01M (over 200 days)
containment-speed split, and the observation that AI-powered security automation can cut
breach cost by up to $1.9M. Everything else (industry/size/region multipliers, investment
costs and reduction percentages) is a reasonable illustrative model built on top of those
anchors — swap in your own figures in the `INDUSTRY`, `SIZE`, `REGION`, `SENSITIVITY`, and
`INVESTMENTS` objects near the top of the `<script>` block if you want to calibrate it to
real internal data.

## LinkedIn strategy

**Goal:** position this as a portfolio piece that demonstrates enterprise data
storytelling, risk quantification, and Power BI-caliber front-end dashboard skill —
aimed at recruiters/hiring managers in data analytics, risk/GRC, and cybersecurity roles.

**Format:** post the 6-slide carousel (screenshot each slide from the Carousel tab) as a
native LinkedIn document/carousel post — carousels consistently outperform single images
and links on reach and dwell time.

**Suggested caption** (also embedded as an HTML comment at the top of `breachguard_iq.html`):

> The average data breach now costs $4.88M globally, $10.22M in the U.S.
> I built an interactive simulator that shows any company exactly what a breach would
> cost them today — and which security investment cuts that risk fastest per dollar
> spent.
> Try it: [link]
> What's your company's biggest security blind spot? 👇
> #CyberSecurity #RiskManagement #DataAnalytics #Enterprise #AI #PowerBI

**Posting cadence:**
1. **Day 1:** carousel post with the caption above, linking to a hosted version of the
   HTML file (GitHub Pages is the simplest zero-cost host — just enable Pages on the repo).
2. **Day 3–4:** a follow-up text post pulling one surprising number out of the tool (e.g.,
   "the cheapest lever — employee training — had the highest ROI in every scenario I
   tested") to re-engage the algorithm without reposting the same asset.
3. **Day 7:** comment-bait post asking the audience which industry/company size to
   benchmark next, then reply with a screenshot generated from the tool — turns the asset
   into an ongoing content series instead of a one-off.

**Engagement tips:**
- Reply to every comment within the first hour — LinkedIn weights early engagement
  velocity heavily.
- Tag 2–3 relevant hashtag communities (#CyberSecurity, #RiskManagement,
  #DataAnalytics) but keep it under 5 total; more reads as spam.
- Pin a comment with the direct link, since carousel posts can't include a clickable
  link in the body without hurting reach.
