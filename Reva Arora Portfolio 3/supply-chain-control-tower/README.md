## Live demo

🔗 **[View live dashboard](https://reevaarora05.github.io/supply-chain-control-tower/supply-chain-control-tower.html)**

# Supply Chain Control Tower

**A dense, Razorpay-style operations control tower — OTIF, delays, inventory risk and warehouse health, surfaced in one light-themed command console instead of five disconnected reports.**

[Open the live dashboard](./supply-chain-control-tower.html) — a single static HTML file, no install required.

---

## Business problem and operational context

Fulfillment teams typically watch OTIF in one report, delay reasons in a carrier portal, inventory exposure in an ERP export, and warehouse load in a spreadsheet someone updates manually. By the time all four get stitched together, a delay has already become a stockout or a broken SLA. Operations leaders don't need another report — they need a **control tower**: one live-feeling surface that shows where the network is healthy, where it's degrading, and what to do about it now.

Supply Chain Control Tower answers that with the same dense, card-based, KPI-strip-plus-chart-bands layout used by modern operational dashboards — but in a light theme, deliberately distinct from its dark-themed sibling project, and mapped to a logistics/fulfillment data model instead of a financial one.

## Sections and key charts

- **Left navigation** — Executive Summary, Fulfillment Analytics, Inventory, Delays & Risk, Carriers, Warehouses, Alerts, and a Data Dictionary, all deep-linked with scroll-spy highlighting.
- **Top filter bar** — week range, origin region, destination region, carrier, priority (Standard/Express) and shipment type (Parcel/Pallet/Container), plus a computed "Week of&hellip;" badge, a Reset button, and a "View alerts" jump link.
- **KPI strip** — eight scorecards (OTIF %, On-Time Delivery %, Delayed Shipments, At-Risk Orders, Average Transit Time, Inventory Exposure, Backorder Rate, Warehouse Congestion Score), each with a sparkline and a period-over-period delta.
- **Shipment Volume & OTIF Trend** — a combo chart: shipment volume as bars on the left axis, OTIF % as a line on the right axis.
- **Shipment Lanes** — a real world map (via Plotly's built-in geo projection, no API key or tile server needed) showing warehouse hubs and lanes colored by delivery health; click a lane to open the route detail drawer.
- **Delay Reasons Distribution** — a donut chart with a clickable legend that cross-filters the routes table below.
- **Shipments by Day of Week / Shipments by Hour** — secondary volume-pattern bar charts.
- **Inventory Risk Matrix** — a likelihood-×-impact grid, shaded by SKU cluster concentration.
- **Warehouse Health Trend** — a congestion-score line chart over the selected week range.
- **Top Routes by Risk** — a sortable table (route, shipments, OTIF %, average delay, main delay reason); click a row to open the route detail drawer and highlight that lane on the map.
- **Recent Critical Alerts** — an auto-generated, severity-ranked list built from the current filter slice.
- **Carrier Scenario Simulator** — reroute a share of volume away from an underperforming carrier and watch projected OTIF update live.
- **Huddle mode** — a one-click toggle that strips the view down to KPIs, alerts and the map for a stand-up meeting.
- **Data Dictionary** — plain-English definitions for every metric on the page.

## Metrics and filters available

**Metrics:** OTIF %, On-Time Delivery %, Delayed Shipments, At-Risk Orders, Average Transit Time, Inventory Exposure, Backorder Rate, Warehouse Congestion Score.

**Filters:** Week range, Origin Region, Destination Region, Carrier, Priority, Shipment Type — every one scopes the KPIs, charts and tables simultaneously, with a single Reset control.

**Interactions:** clicking a delay-reason donut slice cross-filters the Top Routes table; clicking a map lane or a routes-table row opens an in-page detail drawer (route KPIs, delay-reason breakdown, weekly OTIF trend) and highlights that lane on the map; Huddle mode condenses the whole dashboard to its essentials.

## How to run

No installation, no build step, no server, no API keys. Download this folder and open `supply-chain-control-tower.html` directly in any modern browser. All shipment, inventory and carrier data is generated client-side from a seeded synthetic dataset.

## Sample LinkedIn post

> Ops teams don't usually lose to bad data — they lose to *scattered* data: OTIF in one tool, delay reasons in a carrier portal, inventory risk nobody flagged until it was already a stockout.
>
> I built a **Supply Chain Control Tower** — a dense, light-themed operations dashboard with a live-feeling KPI strip, a real geographic lane map, a click-to-cross-filter delay-reasons donut, an inventory risk matrix, a routes-at-risk table with an in-page detail drawer, a carrier-reroute scenario simulator, and a one-click "huddle mode" for stand-ups.
>
> Fully interactive, fully static — HTML/CSS/JS and Plotly (including its built-in world map, zero API keys). Link in comments — would love input from anyone who's run an ops floor. 👇

## Why it's relevant for analytics / operations / supply chain / consulting roles

This project demonstrates designing for operational urgency rather than just presenting historical data: modeling a real cross-functional ops problem (fulfillment, inventory, carrier risk) as one coherent, filterable data structure; using status color correctly and consistently for state rather than identity; shipping a working geographic visualization and a genuine click-to-drill interaction pattern; and including the kind of detail — a dedicated huddle mode for how ops teams actually run daily stand-ups — that signals real operational fluency rather than a generic dashboard exercise. That's the combination assessed in analytics, operations, supply chain and consulting case interviews alike.

## Folder structure

```
supply-chain-control-tower/
├── README.md
└── supply-chain-control-tower.html   # entire dashboard: markup, styles, data, and logic
```
