# CloudCut IQ — Cloud & SaaS Spend Waste Detector

**A browser-based FinOps dashboard that estimates cloud waste, unused SaaS licenses, duplicate tools, and contract renewal risk — no backend, no build step, no data ever leaves your browser.**

---

## The Problem

Enterprises spent an estimated **$723B on cloud in 2026**, and analysts believe **$200B+ of that is wasted** on idle compute, orphaned storage, and over-provisioned instances. On the SaaS side, the average enterprise runs **291 apps**, and roughly **51% of purchased licenses go unused** — adding up to an average of **$18M in annual software waste** per large organization.

Most finance and engineering teams have no single place to see this waste. Cloud bills, SaaS invoices, and vendor contracts live in separate systems, so the leaks stay invisible until a budget review forces the question. **CloudCut IQ** exists to make that waste visible in under a minute, using nothing but a browser.

## Key Features

- **Configurator** — set industry, company size, cloud provider, annual cloud spend, SaaS tool count, and employee count, then click **Scan My Stack** to recalculate every chart and card instantly.
- **Waste Map** — a custom CSS tile layout (no treemap plugin required) where tile size reflects annual waste dollars; click any tile for a full breakdown of why the waste happens and how to fix it.
- **Cloud Breakdown** — stacked spend-by-resource-type bar chart, a half-doughnut Cloud Efficiency Score gauge, a simulated savings waterfall, and a 12-month spend-vs-waste trend line with a budget annotation.
- **SaaS Utilization** — a pure HTML/CSS department-vs-utilization heatmap, a top-10 wasted-spend bar chart, duplicate-tool consolidation cards, and an active/underused/unused/duplicate license doughnut.
- **Renewal Risk Radar** — 15 contract cards, a bubble/scatter plot of renewal timing vs. contract value, and a fully sortable vanilla-JS table (click any column header).
- **Savings Report** — an auto-generated, board-ready summary with a copy-to-clipboard button and a downloadable `.txt` export.
- **Python Model** — the exact waste, utilization, and renewal-risk formulas used by the dashboard, shown as syntax-highlighted, copyable Python snippets.
- **Social Carousel** — six ready-to-post LinkedIn-style slide cards plus a pre-written caption, both driven by your live scan results.

All calculations run through a single deterministic `calculateModel()` function — the same inputs always produce the same outputs, with no randomness after page load.

## Screenshots

_Add screenshots here after your first local run, e.g._

```
assets/screenshot-wastemap.png
assets/screenshot-cloudbreakdown.png
assets/screenshot-renewalradar.png
```

## Tech Stack

| Layer      | Library                                                        |
|------------|-----------------------------------------------------------------|
| Styling    | [Tailwind CSS](https://tailwindcss.com/) (CDN, no build step)   |
| Charts     | [Chart.js 4](https://www.chartjs.org/) (doughnut, bubble, bar, line, scatter, half-doughnut gauge) |
| Chart labels | [chartjs-plugin-datalabels](https://chartjs-plugin-datalabels.netlify.app/) |
| Chart annotations | [chartjs-plugin-annotation](https://www.chartjs.org/chartjs-plugin-annotation/) |
| Code highlighting | [Prism.js](https://prismjs.com/) (Python) |
| App logic  | Vanilla JavaScript (no framework, no bundler, no TypeScript) |

Everything is loaded from stable CDN URLs inside a single HTML file — there is nothing to `npm install`.

## How to Run Locally

1. Download or clone this repository.
2. Open `cloudcut-iq.html` directly in Chrome (double-click it, or drag it into a browser window).

That's it — no server, no build step, no dependencies to install.

## Deploying to GitHub Pages

1. Create a new GitHub repository and push `cloudcut-iq.html` and `README.md` to it.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, pick your default branch (e.g. `main`) and the `/ (root)` folder, then save.
4. Wait a minute for GitHub to build the page, then visit the URL GitHub Pages gives you (e.g. `https://<your-username>.github.io/<repo-name>/cloudcut-iq.html`).
5. Optional: rename `cloudcut-iq.html` to `index.html` (or add an `index.html` that redirects to it) if you want it to load at the bare repo URL.

## Repo Structure

```
cloudcut-iq/
├── cloudcut-iq.html   # the entire app: markup, styles, and JavaScript
└── README.md          # this file
```

The app is intentionally kept as a single file so it can be shared, forked, or deployed by copying one file — there is no `src/`, `dist/`, or `node_modules/` to manage.

## What This Project Demonstrates

- Building a **data product**, not just a chart — a configurable model that drives every visualization, card, and generated report from one source of truth.
- Designing a **custom visualization** (the CSS waste-map tiles) as a deliberate, stable substitute for a fragile charting plugin.
- Using **Chart.js beyond default chart types** — a half-doughnut gauge, a simulated waterfall, and bubble encodings for cost vs. utilization and renewal risk.
- Writing **interactive vanilla JavaScript** at a non-trivial scale (tabs, sortable tables, event delegation, clipboard/export APIs) with no framework and no duplicate event listeners.
- Translating a business problem (FinOps / cloud cost governance) into a self-contained, presentable analytics tool.

## Suggested LinkedIn Post

> Enterprises waste billions on cloud and SaaS every year.
> I built CloudCut IQ, a browser-based FinOps dashboard that estimates cloud waste, unused licenses, duplicate tools, and renewal risk in one place.
> It includes a waste map, cloud efficiency score, SaaS utilization analysis, renewal risk radar, and an auto-generated savings report.
> #FinOps #CloudCost #SaaS #DataAnalytics #PowerBI #AnalyticsEngineering

## License

MIT — free to use, modify, and share. See the caption above for attribution if you post about it.
