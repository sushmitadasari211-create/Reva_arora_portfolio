/**
 * The nine portfolio projects. Sources, per the brief:
 * - Links come only from Reva_Arora_Links.pdf.
 * - Narrative comes from each repo README (and the resume for Profit Intelligence).
 * - No invented metrics. Where an impact number isn't in the sources, the item
 *   carries `metricNeeded` and renders as a [METRIC NEEDED] tag; the same list
 *   lives in METRICS_NEEDED.md for Reva to confirm.
 * - Market statistics a README states without a source are left out on purpose.
 */
import cloudcutWasteMap from '../assets/projects/cloudcut-2.jpg'
import cloudcutBreakdown from '../assets/projects/cloudcut-3.jpg'

export type ProjectIcon = 'route' | 'profit' | 'people' | 'shield' | 'search' | 'funnel' | 'chat' | 'spark' | 'cloud'

export type ImpactMetric = {
  label: string
  /** A confirmed value, quoted from a source. */
  value?: string
  source?: string
  /** What Reva needs to supply when no sourced value exists. */
  metricNeeded?: string
}

export type Project = {
  slug: string
  number: string
  name: string
  domain: string
  icon: ProjectIcon
  tagline: string
  problem: {
    audience: string
    summary: string
    costs: string[]
    /** Third-party context, only when the README names its source. */
    context?: { text: string; source: string }
  }
  solution: {
    approach: string[]
    architecture: string[]
    stack: string[]
  }
  impact: {
    quantified: ImpactMetric[]
    qualitative: string[]
  }
  /** How the demo is built and what its data is — stated plainly. */
  buildNote: string
  repo: string
  demo: string
  screenshots?: { src: string; alt: string }[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'supply-chain-control-tower',
    number: '01',
    name: 'Supply Chain Control Tower',
    domain: 'Supply chain & operations',
    icon: 'route',
    tagline: 'OTIF, delays, inventory risk, and warehouse health in one operations console instead of five disconnected reports.',
    problem: {
      audience: 'Fulfillment and operations leaders running a multi-carrier, multi-warehouse network.',
      summary:
        'OTIF lives in one report, delay reasons in a carrier portal, inventory exposure in an ERP export, and warehouse load in a spreadsheet someone updates by hand. By the time the four are stitched together, a delay has already become a stockout or a broken SLA.',
      costs: [
        'Delays surface after they have turned into stockouts or SLA breaches, not before.',
        'Four sources have to be stitched together by hand before anyone can act.',
        'No single view of where the network is degrading, so carrier issues are caught late.',
      ],
    },
    solution: {
      approach: [
        'One filterable control tower: an 8-metric KPI strip (OTIF %, On-Time Delivery %, Delayed Shipments, At-Risk Orders, Average Transit Time, Inventory Exposure, Backorder Rate, Warehouse Congestion Score), each with a sparkline and period-over-period delta.',
        'Six global filters (week range, origin, destination, carrier, priority, shipment type) scope every KPI, chart, and table at once.',
        'A geographic lane map colored by delivery health; clicking a lane or a Top Routes row opens a route drawer with KPIs, delay breakdown, and weekly OTIF trend.',
        'A delay-reasons donut that cross-filters the routes table, an inventory likelihood × impact risk matrix, and a severity-ranked critical-alerts list.',
        'A carrier scenario simulator that reroutes volume away from an underperforming carrier and recomputes projected OTIF live, plus a one-click Huddle mode for stand-ups.',
      ],
      architecture: [
        'Seeded synthetic shipment, inventory & carrier dataset',
        'Shared filter state',
        'KPI, chart & table renderers (Plotly)',
        'Cross-filter, drawer & scenario interactions',
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Plotly.js (incl. built-in geo map)'],
    },
    impact: {
      quantified: [
        { label: 'Operational sources consolidated', value: '4 → 1', source: 'README: OTIF report, carrier portal, ERP export, warehouse spreadsheet' },
        { label: 'Time to assemble a network status view', metricNeeded: 'Time to build the daily ops view before vs. with the control tower' },
        { label: 'OTIF change from carrier rerouting', metricNeeded: 'Projected or observed OTIF lift from a simulated reroute' },
      ],
      qualitative: [
        'Drill from network-level KPIs to a single lane’s detail drawer, from either the map or the routes table.',
        'Tests a carrier reroute before committing volume, instead of after the SLA is missed.',
        'Huddle mode matches how operations teams actually run daily stand-ups.',
        'Includes a plain-English data dictionary for every metric on the page.',
      ],
    },
    buildNote: 'Single static HTML file running on a seeded synthetic dataset generated in the browser. No backend, no API keys.',
    repo: 'https://github.com/reevaarora05/supply-chain-control-tower',
    demo: 'https://reevaarora05.github.io/supply-chain-control-tower/supply-chain-control-tower.html',
  },
  {
    slug: 'profit-intelligence-studio',
    number: '02',
    name: 'Profit Intelligence Studio',
    domain: 'E-commerce profitability',
    icon: 'profit',
    tagline: 'Revenue is visible everywhere; this puts the profit drivers and margin leaks on one screen.',
    problem: {
      audience: 'E-commerce leadership and finance teams accountable for margin.',
      summary:
        'Most teams can read revenue at a glance but not where profit is made or lost: what discounting costs, which channel is strong on revenue but thin on margin, or how returns erode a category.',
      costs: [
        'Margin erodes for months before finance notices it in a board deck.',
        'Pricing and discount changes are made without seeing their profit effect first.',
        'High-revenue segments and channels can hide low or negative margin.',
      ],
    },
    solution: {
      approach: [
        'An executive dashboard connecting discounting, returns, channel mix, and retention in one filterable surface with 8 KPI scorecards (Net Profit, Profit Margin %, Revenue, Discount Spend, Return Rate, AOV, Active Customers, Daily Orders).',
        'Click-to-cross-filter: selecting a channel bar or a region slice filters the whole dashboard, exactly as the dropdown would.',
        'Discount-impact and return-rate diagnostics by category, plus a ranked table of segment × category profit, margin, and return rate.',
        'Cohort retention heatmap of repeat purchase by acquisition month.',
        'A discount-rate simulator that recalculates projected net profit live against the current filtered baseline.',
      ],
      architecture: [
        'Seeded synthetic order, return & customer data',
        'KPI hierarchy & filter model',
        'Chart bands with cross-filter wiring',
        'Discount-rate scenario engine',
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Plotly.js'],
    },
    impact: {
      quantified: [
        { label: 'KPI scorecards on one surface', value: '8', source: 'Resume & README' },
        { label: 'Margin leakage identified', metricNeeded: 'Margin leakage ($ or %) surfaced by segment/category in a representative scenario' },
        { label: 'Time to answer a margin question', metricNeeded: 'Time to explain a margin miss before vs. with the dashboard' },
      ],
      qualitative: [
        'Isolates margin leakage by segment and category through cohort heatmaps and cross-filtered channel and region analysis.',
        'Pricing changes are tested in the simulator before they are made.',
        'Every KPI carries a hover tooltip explaining the metric in plain English.',
      ],
    },
    buildNote:
      'Live demo is a single static HTML file using Plotly and a seeded synthetic dataset. The resume lists this project under SQL, Power BI, and Excel.',
    repo: 'https://github.com/reevaarora05/profit-intelligence-studio',
    demo: 'https://reevaarora05.github.io/profit-intelligence-studio/profit-intelligence-studio.html',
  },
  {
    slug: 'retainiq',
    number: '03',
    name: 'RetainIQ',
    domain: 'People analytics & HR finance',
    icon: 'people',
    tagline: 'Prices employee turnover in dollars and simulates the ROI of retention spend before budget is committed.',
    problem: {
      audience: 'CFOs, HR leaders, and department heads setting retention budgets.',
      summary:
        'Every company tracks its attrition rate. Almost none can answer the CFO’s next question: what is turnover costing us, and what should we spend to fix it?',
      costs: [
        'Recruiter time, manager interview hours, and weeks of an empty seat.',
        'Months of ramp-up before a replacement is fully productive.',
        'The productivity drag on the team around each departure — none of which appears on a single invoice.',
      ],
    },
    solution: {
      approach: [
        'A deterministic cost model that converts attrition into a fully loaded annual dollar cost across six named components: replacement, recruiter, manager interview time, onboarding, productivity loss, and vacancy.',
        'A department × tenure-band heatmap (6 departments, 5 tenure bands) ranking where turnover burns the most money, not just where the rate is highest.',
        'An intervention simulator with seven levers (comp adjustment, manager coaching, internal mobility, L&D, flexibility, stay interviews, high-performer retention), each showing cost, savings, and ROI live.',
        'An ROI board with payback period and a 12-month cumulative savings projection, plus an executive summary and 90-day plan exportable as text.',
        'The exact cost, risk-scoring, and ROI formulas published as Python snippets.',
      ],
      architecture: [
        'Workforce configurator inputs',
        'calculateModel() — one deterministic function',
        'Cost breakdown, risk segments & ROI views',
        'Executive summary & 90-day plan',
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js', 'Python (model formulas)'],
    },
    impact: {
      quantified: [
        { label: 'Cost components priced per departure', value: '6', source: 'README' },
        { label: 'Retention interventions with ROI', value: '7', source: 'README' },
        { label: 'Annual turnover cost surfaced', metricNeeded: 'Turnover cost and recommended-plan ROI for a representative scenario' },
      ],
      qualitative: [
        'Turns a fuzzy HR metric into an auditable financial model with named, documented assumptions.',
        'Produces a ranked retention plan with a payback period — the format a budget meeting needs.',
        'Combined interventions are capped at 60% of baseline exits so stacked scenarios stay realistic.',
      ],
    },
    buildNote:
      'Vanilla HTML, CSS, and JavaScript with Chart.js; no backend. Cost and ROI figures are illustrative heuristics documented in app.js, not certified financial advice.',
    repo: 'https://github.com/reevaarora05/RetainIQ',
    demo: 'https://reevaarora05.github.io/RetainIQ/index.html',
  },
  {
    slug: 'breachguard-iq',
    number: '04',
    name: 'BreachGuard IQ',
    domain: 'Cyber risk quantification',
    icon: 'shield',
    tagline: 'What a data breach would cost a company today, how fast that cost climbs with detection delay, and which investment cuts it most per dollar.',
    problem: {
      audience: 'Executives, risk/GRC leads, and security leaders deciding where to invest.',
      summary:
        'Leaders rarely see, in one place, what a breach would cost their company today, how quickly that cost escalates with detection delay, or which security investment reduces risk most per dollar.',
      costs: [
        'Breach cost rises sharply the longer detection and containment take.',
        'Security investments are prioritized without a cost-per-risk-reduced comparison.',
      ],
      context: {
        text: '$4.88M global average breach cost ($10.22M in the U.S.); $3.87M when contained in under 200 days vs. $5.01M over 200 days.',
        source: 'IBM Cost of a Data Breach Report, as cited in the project README',
      },
    },
    solution: {
      approach: [
        'Five Power BI-style slicers (industry, company size, region, data sensitivity, security maturity) recalculate every KPI and chart across all tabs.',
        'A detection-speed slider (10–365 days) drives a live cost-escalation curve and a waterfall showing how faster detection, AI security tooling, and training stack up.',
        'A ranked, expandable table of 8 security investments with cost, risk reduction, ROI, and payback, plus a bubble chart and cumulative risk-reduction bar.',
        'An auto-generated executive risk brief that regenerates from the current filters and selected investments.',
        'The three formulas behind the simulator (cost estimation, detection curve, ROI ranking) published in a Python tab.',
      ],
      architecture: [
        'IBM benchmark anchors',
        'Industry / size / region / sensitivity multipliers',
        'Cost, detection-curve & ROI models',
        'Executive risk brief',
      ],
      stack: ['HTML', 'Tailwind CSS', 'JavaScript', 'Chart.js', 'chartjs-plugin-datalabels', 'Prism.js', 'Python (model)'],
    },
    impact: {
      quantified: [
        { label: 'Security investments ranked by ROI', value: '8', source: 'README' },
        { label: 'Detection window modeled', value: '10–365 days', source: 'README' },
        { label: 'Exposure reduction from recommended mix', metricNeeded: 'Modeled breach-cost reduction for a representative company profile' },
      ],
      qualitative: [
        'Puts a company-specific dollar exposure next to the cost and ROI of each control.',
        'Makes the cost of slow detection visible and directly adjustable.',
        'Produces a board-ready brief from whatever scenario is on screen.',
      ],
    },
    buildNote:
      'Single browser-only HTML file. Baselines are anchored to IBM report figures; industry, size, region, and investment multipliers are an illustrative model on top of those anchors.',
    repo: 'https://github.com/reevaarora05/breachguard-iq',
    demo: 'https://reevaarora05.github.io/breachguard-iq/breachguard_iq.html',
  },
  {
    slug: 'hybridsearch-ai',
    number: '05',
    name: 'HybridSearch AI',
    domain: 'AI search & retrieval',
    icon: 'search',
    tagline: 'Shows why dense + sparse retrieval with Reciprocal Rank Fusion beats either method alone for product search.',
    problem: {
      audience: 'E-commerce search and product teams, and the shoppers who rely on search to find products.',
      summary:
        'Product search breaks in two opposite directions. Keyword (sparse) search finds exact SKUs and brand codes but misses intent and synonyms; semantic (dense) search understands intent but misses exact product codes.',
      costs: [
        'Shoppers searching by intent (“shoes for runners with flat feet”) get irrelevant results from keyword search.',
        'Shoppers searching by exact model (“WH-1000XM5”) get loosely related products from semantic search.',
        'The trade-off is hard to see without comparing the methods side by side on the same query.',
      ],
    },
    solution: {
      approach: [
        'Three side-by-side result columns — Dense (BGE-Large), Sparse (SPLADE), and Hybrid (RRF) — with live evaluation metrics.',
        'A step-by-step RRF visualizer and an alpha slider that re-fuses the hybrid ranking in real time.',
        'Five built-in scenarios that each isolate one failure mode, e.g. “WH-1000XM5 Sony headphones” ranks Sony #1 sparse, #3 dense, #1 hybrid.',
        'A benchmarks tab comparing nDCG@10 across five query archetypes.',
        'Copy-ready Python for the production path: Qdrant hybrid collection, SPLADE and BGE-Large encoding, the RRF query, and nDCG/MRR evaluation.',
      ],
      architecture: [
        'Query',
        'SPLADE sparse + BGE-Large dense encoders',
        'Qdrant hybrid collection (Amazon ESCI)',
        'Reciprocal Rank Fusion',
        'nDCG@10 / MRR evaluation',
      ],
      stack: ['Python', 'Qdrant', 'SPLADE', 'BGE-Large', 'Amazon ESCI', 'HTML / CSS / JavaScript', 'Chart.js', 'Prism.js'],
    },
    impact: {
      quantified: [
        { label: 'Failure-mode scenarios demonstrated', value: '5', source: 'README' },
        { label: 'nDCG@10 lift of hybrid over best single method', metricNeeded: 'Measured nDCG@10 (and MRR) from running the Python pipeline on Amazon ESCI' },
      ],
      qualitative: [
        'Makes the dense vs. sparse trade-off visible to non-specialists in one screen.',
        'Pairs the visual explainer with the production implementation, so the demo maps to code a team could ship.',
      ],
    },
    buildNote:
      'The browser demo is a simulation: results for the five scenarios are pre-scripted and free-text queries use a deterministic scorer. The Python tab shows the real Qdrant + SPLADE + BGE-Large implementation.',
    repo: 'https://github.com/reevaarora05/hybridsearch-ai',
    demo: 'https://reevaarora05.github.io/hybridsearch-ai/hybridsearch.html',
  },
  {
    slug: 'signalchain',
    number: '06',
    name: 'SignalChain',
    domain: 'Recruiting operations',
    icon: 'funnel',
    tagline: 'Turns raw recruiting-funnel counts into a decision: where candidates are lost, why, and what to fix first.',
    problem: {
      audience: 'Talent acquisition leaders and recruiting operations teams.',
      summary:
        'Most recruiting teams know how many candidates entered the funnel. Few know exactly where qualified candidates are lost, why, and which fix to prioritize.',
      costs: [
        'Qualified candidates drop out at a stage nobody has flagged.',
        'Interventions are chosen by instinct instead of by expected candidates recovered.',
        'Recruiting dashboards stop at the numbers, without an owner or a next step.',
      ],
    },
    solution: {
      approach: [
        'Four hiring scenarios (high-volume, senior engineering, enterprise sales, remote tech) across a 7-stage funnel from Sourced to Accepted.',
        'Every stage-to-stage transition benchmarked against an industry conversion table; the largest negative gap is flagged as the leak on a risk heatmap.',
        'A root-cause panel scoring the likely cause (e.g. slow recruiter response, compensation mismatch, hiring-manager misalignment) with severity and confidence.',
        'Three ranked interventions per scenario with effort, cost, time, owner, reversibility, and estimated candidates recovered.',
        'An auto-generated one-page executive decision document, plus the detection and ranking logic in Python.',
      ],
      architecture: [
        'Funnel snapshot (7 stages)',
        'Benchmark-driven leak detection',
        'Root-cause scoring',
        'Ranked, costed interventions',
        'Executive decision summary',
      ],
      stack: ['HTML', 'Tailwind CSS', 'JavaScript', 'Chart.js', 'Prism.js', 'Python (model)'],
    },
    impact: {
      quantified: [
        { label: 'Funnel stages benchmarked', value: '7', source: 'README' },
        { label: 'Hiring scenarios modeled', value: '4', source: 'README' },
        { label: 'Candidates recovered by top intervention', metricNeeded: 'Estimated candidates recovered (or conversion gap closed) in a representative scenario' },
      ],
      qualitative: [
        'Moves a funnel chart toward a consulting-style deliverable: leak, cause, action, owner, next step.',
        'Ranks fixes by expected recovery and effort, so the first action is defensible.',
      ],
    },
    buildNote: 'Single self-contained HTML file; scenario data and benchmark tables are built in. No backend or build step.',
    repo: 'https://github.com/reevaarora05/signalchain',
    demo: 'https://reevaarora05.github.io/signalchain/signalchain.html',
  },
  {
    slug: 'supportdesk-rag',
    number: '07',
    name: 'SupportDesk RAG',
    domain: 'Enterprise AI · RAG',
    icon: 'chat',
    tagline: 'A production-pattern retrieval-augmented support assistant that cites its sources and hands off to a human when unsure.',
    problem: {
      audience: 'Enterprise IT support teams, their new hires, and the senior engineers who answer the same questions repeatedly.',
      summary:
        'IT knowledge is scattered across Confluence, Slack, and old tickets. Keyword search fails on natural-language questions, and generic chatbots answer confidently without grounding.',
      costs: [
        'Repetitive questions (“How do I reset VPN?”) consume senior engineers’ time.',
        'New hires can’t find answers that already exist somewhere.',
        'Ungrounded AI answers create risk when they are wrong.',
      ],
    },
    solution: {
      approach: [
        'Five LlamaIndex retrieval strategies in parallel — Vector, Keyword, Hybrid (RRF), Tree, and Summary — because different question types need different retrieval shapes.',
        'A LangChain LCEL pipeline: retrieve → rerank → generate → verify, with multi-turn memory.',
        'A hard anti-hallucination guard: answers may only use retrieved context, every claim needs a citation, and unsupported answers are regenerated or escalated.',
        'Two-layer evaluation: retrieval (Precision@K, MRR) and generation (RAGAS-style faithfulness, answer relevance, hallucination rate), plus a human-eval rubric.',
        'Confidence-gated handoff: below 0.5 retrieval precision, the assistant says so and routes to a human.',
      ],
      architecture: [
        'Tickets & documentation',
        'Five LlamaIndex indices',
        'Rerank',
        'Grounded generation with citations',
        'Verification guard → answer or human handoff',
      ],
      stack: ['Python', 'LlamaIndex', 'LangChain (LCEL)', 'LangGraph', 'RAGAS-style evaluation', 'HTML', 'Tailwind CSS', 'Chart.js', 'Prism.js'],
    },
    impact: {
      quantified: [
        { label: 'Retrieval strategies compared', value: '5', source: 'README' },
        { label: 'Human-handoff threshold', value: '< 0.5 precision', source: 'README' },
        { label: 'Hallucination rate / faithfulness', metricNeeded: 'Measured faithfulness and hallucination rate from a real evaluation run' },
        { label: 'Support deflection', metricNeeded: 'Share of tickets answerable without escalation in a pilot or test set' },
      ],
      qualitative: [
        'Shows the pattern that would actually ship — grounding, citations, evaluation, and escalation — not a toy chatbot.',
        'An A/B toggle contrasts a plain base model with the RAG system on the same question.',
      ],
    },
    buildNote:
      'Browser-only demo with mock ticket and documentation data; all metrics shown in the app are simulated. The code tabs contain the Python LlamaIndex, LangChain, and LangGraph implementation.',
    repo: 'https://github.com/reevaarora05/SupportDesk-RAG',
    demo: 'https://reevaarora05.github.io/SupportDesk-RAG/supportdesk_rag.html',
  },
  {
    slug: 'aispend-iq',
    number: '08',
    name: 'AISpend IQ',
    domain: 'AI governance & spend',
    icon: 'spark',
    tagline: 'A command center for enterprise AI spend: ROI, tool sprawl, shadow AI, and a board-ready report.',
    problem: {
      audience: 'CIOs, finance leaders, and IT teams accountable for enterprise AI budgets.',
      summary:
        'Teams track AI adoption — logins and usage hours — rather than outcomes, while tools are adopted team by team without IT or finance visibility.',
      costs: [
        'AI spend can’t be tied to a P&L number, so budgets are defended on anecdote.',
        'Overlapping tools are paid for several times across departments.',
        'Shadow AI tools create data and compliance risk nobody has assessed.',
      ],
    },
    solution: {
      approach: [
        'A configurator (industry, company size, region, department, budget, tool count) that drives every number on the page.',
        'A Tool Map: a 20-tool bubble chart of adoption × ROI × spend, with a Keep / Optimize / Eliminate recommendation per tool.',
        'A 5-step ROI calculator from baseline to a 24-month projection with a shaded break-even zone.',
        'A consolidation advisor across overlap categories (LLM/chat, image, code, analytics, automation), a shadow-AI risk table, and a sprawl score.',
        'An auto-generated board report with a 90-day action plan, plus the ROI, sprawl, and risk logic in Python.',
      ],
      architecture: [
        'Company profile configurator',
        'ROI engine, sprawl detector & shadow-AI risk scorer',
        'Tool Map, ROI, and consolidation views',
        'Board report & 90-day plan',
      ],
      stack: ['HTML', 'Tailwind CSS', 'JavaScript', 'Chart.js', 'Prism.js', 'Python (model)'],
    },
    impact: {
      quantified: [
        { label: 'Tools profiled on the Tool Map', value: '20', source: 'README' },
        { label: 'Projection horizon', value: '24 months', source: 'README' },
        { label: 'Consolidation savings identified', metricNeeded: 'Annual savings from recommended consolidation in a representative scenario' },
      ],
      qualitative: [
        'Shifts the AI conversation from adoption metrics to outcome and P&L metrics.',
        'Gives every tool an explicit Keep / Optimize / Eliminate call with the reasoning visible.',
      ],
    },
    buildNote:
      'Single self-contained HTML file. The tool catalog, shadow-AI table, and formula constants are simulated to illustrate the model; nothing is sent to a server.',
    repo: 'https://github.com/reevaarora05/AISpend-IQ',
    demo: 'https://reevaarora05.github.io/AISpend-IQ/aispend_iq.html',
  },
  {
    slug: 'cloudcut-iq',
    number: '09',
    name: 'CloudCut IQ',
    domain: 'FinOps · cloud & SaaS spend',
    icon: 'cloud',
    tagline: 'Finds cloud waste, unused SaaS licenses, duplicate tools, and renewal risk in one browser-based FinOps dashboard.',
    problem: {
      audience: 'Finance, FinOps, and engineering teams who own cloud and SaaS budgets.',
      summary:
        'Cloud bills, SaaS invoices, and vendor contracts live in separate systems, so idle compute, orphaned storage, over-provisioned instances, and unused licenses stay invisible until a budget review forces the question.',
      costs: [
        'Paying for idle and over-provisioned infrastructure month after month.',
        'Unused and duplicate SaaS licenses renewing without review.',
        'Contracts auto-renewing before anyone checks utilization.',
      ],
    },
    solution: {
      approach: [
        'A configurator (industry, company size, provider, cloud spend, SaaS count, employees) that recalculates every card and chart on “Scan My Stack”.',
        'A waste map of CSS tiles sized by annual waste dollars; each tile explains why the waste happens and how to fix it.',
        'Cloud breakdown: spend by resource type, an efficiency-score gauge, a savings waterfall, and a 12-month spend-vs-waste trend.',
        'SaaS utilization: a department × utilization heatmap, top-10 wasted spend, duplicate-tool consolidation, and license status split.',
        'A renewal-risk radar across 15 contracts with a sortable table, and an exportable board-ready savings report.',
      ],
      architecture: [
        'Stack configurator',
        'calculateModel() — deterministic waste, utilization & renewal-risk formulas',
        'Waste map, cloud, SaaS & renewal views',
        'Savings report export',
      ],
      stack: ['HTML', 'Tailwind CSS', 'JavaScript', 'Chart.js 4', 'chartjs-plugin-datalabels', 'chartjs-plugin-annotation', 'Prism.js', 'Python (model)'],
    },
    impact: {
      quantified: [
        { label: 'Contracts on the renewal-risk radar', value: '15', source: 'README' },
        { label: 'Recoverable savings identified', metricNeeded: 'Recoverable annual savings for a representative scenario (the demo shows its own scenario output)' },
      ],
      qualitative: [
        'Makes cloud and SaaS waste visible in under a minute, with nothing leaving the browser.',
        'Every waste tile pairs the dollar figure with a cause and a concrete fix.',
        'One deterministic model drives every chart, card, and report — same inputs, same outputs.',
      ],
    },
    buildNote: 'Single HTML file; all calculations run client-side through one deterministic function. No data leaves the browser.',
    repo: 'https://github.com/reevaarora05/cloudcut-iq-finops-dashboard',
    demo: 'https://reevaarora05.github.io/cloudcut-iq-finops-dashboard/cloudcut-iq.html',
    screenshots: [
      { src: cloudcutWasteMap, alt: 'CloudCut IQ waste map: KPI cards and tiles sized by annual waste' },
      { src: cloudcutBreakdown, alt: 'CloudCut IQ waste-by-category donut and cost vs. utilization bubble chart' },
    ],
  },
]

export const projectBySlug = (slug: string) => PROJECTS.find((project) => project.slug === slug)
