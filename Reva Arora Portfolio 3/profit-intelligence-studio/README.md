## Live demo

🔗 **[View live dashboard](https://reevaarora05.github.io/profit-intelligence-studio/profit-intelligence-studio.html)**

# Profit Intelligence Studio

**A dense, Razorpay-style executive profit analytics dashboard for e-commerce — revenue is visible everywhere; this is where the profit drivers and leaks finally live in one screen.**

[Open the live dashboard](./profit-intelligence-studio.html) — a single static HTML file, no install required.

---

## Business problem

Most e-commerce teams can tell you revenue at a glance. Almost none can tell you, in the same glance, where profit is actually being made or lost — how much discounting is costing, which channel looks good on revenue but thin on margin, which segment is quietly the most valuable, or how returns are eating into a category's bottom line. That gap between "revenue dashboard" and "profit dashboard" is where margin quietly erodes for months before finance notices it in a board deck.

Profit Intelligence Studio closes that gap: one dense, card-based workspace — deliberately built in the visual language of a modern fintech ops console (dark theme, left-rail navigation, KPI strip with sparklines, layered chart bands) — that connects revenue, discounting, returns, retention and channel/region economics into a single decision surface.

## What the dashboard shows

- **Left navigation** — Executive Summary, Profit Analytics, Customer Insights, Marketing Performance, Channels, Products, Reports, and a Settings/Data Dictionary page, all deep-linked into one continuously scrollable report (with scroll-spy highlighting).
- **Top filter bar** — date range, channel, region, segment and category filters that scope every card and chart below them, plus a computed date-range badge and a one-click reset.
- **KPI strip** — eight scorecards (Net Profit, Profit Margin %, Revenue, Discount Spend, Return Rate, Average Order Value, Active Customers, Daily Orders), each with a trailing sparkline, a period-over-period delta, and a hover tooltip explaining the metric in plain English.
- **Profit Trend** — a large line chart of Net Profit vs. Revenue over time.
- **Profit by Channel** — a bar chart; click any bar to cross-filter the entire dashboard to that channel.
- **Profit Distribution by Region** — a donut chart with a clickable legend; clicking a slice or legend row cross-filters to that region.
- **Profit by Day of Week / Profit by Hour** — secondary bar charts in the Razorpay volume-pattern style.
- **Top Segments by Profit** — a ranked table of segment × category combinations (including a VIP segment) with revenue, profit, margin %, orders and return rate.
- **Discount Impact by Category** and **Return Rate by Category** — grouped and stacked bar diagnostics.
- **Cohort Retention Heatmap** — repeat-purchase retention by acquisition cohort, month over month.
- **Profit by Region tiles** — a small shaded tile grid, clickable to filter.
- **Scenario Simulator** — a discount-rate slider that recalculates projected net profit live against the current filtered baseline.
- **Data Dictionary** — plain-English definitions for every metric on the page.

## Key metrics tracked

Net Profit, Profit Margin %, Revenue, Discount Spend, Return Rate, Average Order Value, Active Customers, Daily Orders, Discount Burn %, Cohort Retention %.

## Filters and interactions supported

- Sticky top-bar filters: date range, channel, region, segment (New / Returning / VIP), category — all scope every chart, table and KPI simultaneously.
- **Chart-to-filter cross-linking**: clicking a channel bar or a region donut slice/legend row sets that dimension as an active filter and re-renders the whole dashboard, exactly as choosing it from the dropdown would.
- Hover tooltips on every KPI card explaining what the metric means.
- A discount-rate scenario slider that projects net profit under a different discounting assumption, with a live before/after chart.
- Smooth scroll-spy navigation from the left sidebar into every section.

## How to run

No installation, no build step, no server. Download this folder and open `profit-intelligence-studio.html` directly in any modern browser (or use `File → Open`). All data is generated client-side from a seeded synthetic dataset.

## Sample LinkedIn post

> Revenue dashboards are everywhere. Profit dashboards are rare — because profit requires connecting discounting, returns, channel mix and retention, not just adding up orders.
>
> I built **Profit Intelligence Studio**, a dense, Razorpay-style executive analytics dashboard: a KPI strip with sparklines, a profit trend line, channel and region breakdowns you can click straight into as filters, category-level discount/return diagnostics, a cohort retention heatmap, and a live discount-rate scenario simulator.
>
> Fully interactive, fully static — HTML/CSS/JS and Plotly, no backend. Link in comments — feedback welcome from anyone who's had to explain a margin miss to leadership. 👇

## Why it's relevant for business analyst / data analyst / strategy / operations roles

This project is a demonstration of product-analytics thinking, not just chart rendering: translating a vague pain ("we can't see where margin leaks") into a structured data model, a KPI hierarchy, and an interaction design that mirrors how an operator actually works — filter, scan, drill, simulate. It shows fluency with the exact visual and information-density conventions used in real internal analytics tools (fintech-style dashboards, BI-tool card grids), along with the judgment to know which chart form fits which question. That combination — business framing, data modeling, and interface design — is exactly what's evaluated in analyst, strategy and operations interviews.

## Folder structure

```
profit-intelligence-studio/
├── README.md
└── profit-intelligence-studio.html   # entire dashboard: markup, styles, data, and logic
```
