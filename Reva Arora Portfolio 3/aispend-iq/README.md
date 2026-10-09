# AISpend IQ — Enterprise AI ROI & Tool Sprawl Command Center

**Tagline:** Enterprises spent $2.59T on AI in 2026. 95% have no idea if it's working.

A single-file, browser-only command center that helps a company measure AI ROI,
detect tool sprawl, find wasted spend, surface AI fatigue risk, and generate a
board-ready executive report — all without a backend or an API key.

Open `aispend_iq.html` in Chrome. Configure a company profile on the left,
click **🚀 Analyze My AI Stack**, and explore the four tabs.

---

## The business problem

Three compounding crises hide inside enterprise AI budgets:

1. **ROI Blindness** — enterprises spent $2.59T on AI in 2026, but 95% achieve no
   measurable P&L ROI. Most teams track *adoption* (logins, usage hours) instead
   of *outcomes*.
2. **Tool Sprawl** — the average large enterprise runs 700+ distinct AI tools,
   often adopted team-by-team with no IT or finance visibility. Fragmented stacks
   cost $1,800–$2,800/user/year vs. $800–$1,400 for a consolidated platform.
3. **AI Fatigue** — frequent AI users are 45% more likely to report high burnout
   (Google Cloud, 2026), and employees lose real time every day switching
   between disconnected tools.

AISpend IQ puts all three in one place: a Tool Map (what you have and whether
it's earning its keep), a ROI Calculator (turn "vibes" into a P&L number), a
Consolidation Advisor (find the overlap and the shadow AI risk), and an
auto-generated Board Report that ties it all together.

## What's inside

- **Hero configurator** — industry, company size, region, department, budget,
  and tool-count sliders drive every number on the page.
- **🗺️ Tool Map** — a 20-tool bubble chart (Adoption × ROI × Spend), click any
  bubble for a full profile with a Keep/Optimize/Eliminate recommendation and a
  sortable summary table.
- **📊 ROI Calculator** — a 5-step framework (baseline → AI impact → investment
  → live calculation → 24-month projection chart with a shaded break-even zone).
- **✂️ Consolidation Advisor** — expandable overlap-category cards (LLM/Chat,
  Image Gen, Code, Analytics, Automation), a shadow AI risk table, and a
  sprawl score.
- **📋 Board Report** — an auto-generated executive summary with a 90-day
  action plan, copy-to-clipboard and export-to-file buttons.
- **🐍 Python Model** — the real calculation logic behind the ROI engine, sprawl
  detector, and shadow AI risk scorer, as copy-pasteable Python.
- **📱 Carousel Slides** — 6 ready-to-screenshot slides for social media.

## Tech notes

- Single self-contained HTML file — Tailwind CSS, Chart.js, and Prism.js are
  pulled from public CDNs purely for layout, charting, and code highlighting;
  everything else is vanilla JavaScript.
- All figures are **simulated** — the 20-tool catalog, shadow AI table, and
  formula constants (waste %, fatigue score, ROI coverage, etc.) are
  hand-built to illustrate how a real enterprise AI ROI dashboard would behave,
  not pulled from any live system. The ROI Calculator's dollar conversions for
  error-reduction and throughput/CSAT uplift are a simplified estimation model,
  labeled as such directly in the app.
- Nothing is sent to a server. Refreshing the page resets all state.

---

## LinkedIn / Instagram strategy

**Goal:** position this as proof of enterprise-grade product thinking — able to
translate a boardroom problem (AI spend accountability) into a working,
interactive tool, not just a chatbot wrapper.

### Posting plan

1. **Lead with the carousel** (screenshot the 6 slides from the "Carousel
   Slides" tab). Carousels outperform single images/text on both LinkedIn and
   Instagram for dwell time and saves.
2. **Use the embedded caption** at the top of `aispend_iq.html` (HTML comment)
   as your LinkedIn post copy — it's ready to paste.
3. **Put the live link in the first comment**, not the post body — this avoids
   the algorithm's outbound-link reach penalty on LinkedIn. On Instagram, use
   "link in bio."
4. **Ask a specific, low-friction question** to drive comments: "What's your
   company's AI tool count? Drop it below." Specific numeric questions get
   more replies than open-ended ones.
5. **Reply to every comment in the first hour** — early engagement velocity is
   the strongest signal both platforms reward.
6. **Repurpose for Instagram** as a static carousel post (same 6 slides,
   square-cropped) plus a Reel walking through the "Analyze My AI Stack" button
   and the bubble chart — screen-recorded interactions perform well as
   demo content.
7. **Hashtags** (already in slide 6): `#AI #EnterpriseAI #DataAnalytics #AIStrategy #ROI #TechLeadership`
   — on Instagram, add 3–5 more niche tags (`#AIROI #EnterpriseSoftware #SaaS`)
   since Instagram rewards a longer tail than LinkedIn.
8. **Follow-up post** a few days later: "Here's what people got wrong about
   their AI tool count" — using real (anonymized) numbers from comment
   replies is a proven way to get a second wave of reach from one project.

### Optional hosting

`aispend_iq.html` is a single static file — it can be hosted for free on GitHub
Pages, Netlify, or Vercel with zero backend for the live-demo link. Not
required to post the carousel itself.
