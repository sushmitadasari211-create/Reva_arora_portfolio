# SignalChain — Recruiting Funnel Loss Analyzer

A standalone browser app that turns raw recruiting-funnel counts into a decision artifact: where candidates are being lost, why, and what to fix first. Single self-contained HTML file — no backend, no build step, no Node.js.

---

## What It Does

Pick one of 4 hiring scenarios (High-Volume Hiring, Senior Engineering Hiring, Enterprise Sales Hiring, Remote Tech Hiring) and SignalChain runs a 4-part workflow:

1. **Funnel Snapshot** — candidate counts across all 7 stages (Sourced → Applied → Screened → HM Interview → Final Interview → Offered → Accepted), a Chart.js funnel bar chart, stage-to-stage conversion bars, the top leakage stage, and a candidate velocity metric.
2. **Drop-off Diagnosis** — every stage-to-stage transition is benchmarked against a fixed industry-conversion-rate table. The transition with the largest negative gap is flagged as the leak, shown on a red/amber/green risk heatmap and a donut chart of candidates lost per stage. A root-cause panel scores a likely cause (e.g. slow recruiter response, compensation mismatch, hiring manager misalignment, employer brand/process opacity) with a severity and confidence rating.
3. **Intervention Options** — 3 ranked interventions per scenario, each with effort, cost, time to implement, owner, reversibility, and estimated candidates recovered, plus a live bar chart and ROI table.
4. **Executive Summary** — an auto-generated one-page decision document (scenario, top leak, root cause, recommended action, expected impact, owner, next step) with Copy / Export / Reset Scenario buttons.

A **Python Model** tab shows the same bottleneck-detection and intervention-ranking logic in Python, and a **Carousel Slides** tab has 6 LinkedIn-ready slides with individual copy buttons.

---

## Why It's Unique

Most recruiting dashboards stop at "here are the numbers." SignalChain is built backward from the question a Talent Acquisition leader actually asks in a staffing review: *where exactly are we losing people, why, and what do we do about it first?* The benchmark-driven bottleneck detector and the ranked, costed intervention list turn a funnel chart into something closer to a consulting deliverable than a BI widget — and it's clearly a different problem space from the other two apps in this portfolio series (decision intelligence and contract risk), which shows range across an analytics/solutions-engineering skill set.

---

## Deploy to GitHub Pages (drag-and-drop, 60 seconds)

1. Go to [github.com](https://github.com) → New repository → name it `signalchain` → Public → Create.
2. On your local machine, zip the `signalchain` folder.
3. In your new repo, click **Add file → Upload files**, drag the three items (`signalchain.html`, `index.html`, `README.md`), commit.
4. Go to **Settings → Pages → Source: Deploy from a branch → main / (root) → Save**.
5. Wait ~60 seconds. Your app is live at `https://<your-username>.github.io/signalchain/`.

## Deploy to Netlify (drag-and-drop, 30 seconds)

1. Go to [netlify.com](https://netlify.com) → Log in → **Sites → Add new site → Deploy manually**.
2. Drag the entire `signalchain` folder onto the deploy drop zone.
3. Netlify assigns a URL instantly. Optional: **Site settings → Change site name** for a custom subdomain.

No Git required. Works from a USB drive.

---

## LinkedIn Posting Plan

**Hook formula:** "Most recruiting teams know how many candidates entered the funnel. Almost none know exactly where qualified candidates are lost, why, and what to fix first. So I built a tool that does."

**Post structure:**
- Line 1: The hook above.
- Lines 2–3: What the tool does — one concrete mechanic (the benchmark-driven leak detector, the ranked interventions).
- Lines 4–5: A result or observation that adds credibility (e.g. "one scenario shows a 30-point conversion gap against benchmark at a single stage").
- Closing question to drive comments: "Which stage do you think loses the most candidates on your team?"
- 3–5 hashtags max (`#TalentAcquisition #RecruitingOps #HRAnalytics #PeopleAnalytics #SolutionsEngineering`).

**Best days/times:** Tuesday–Thursday, 10am–12pm PST.

**Recommended screen-recording moment (30–45 seconds):** switch between two scenario cards (e.g. High-Volume Hiring → Senior Engineering Hiring) and let the viewer watch the hero KPIs, top-leak banner, risk heatmap, and root-cause panel all recompute live. That's the "wow moment" — not a full feature tour.

---

## Tech Stack Rationale

| Library | Why |
|---------|-----|
| **Tailwind CDN** | Utility-first CSS, zero build step, responsive with no custom media queries. |
| **Chart.js** | Funnel bar chart, drop-off donut chart, intervention comparison chart — all covered. |
| **Prism.js (Tomorrow theme)** | Lightweight syntax highlighting for the Python model tab. |
| **No jQuery, no React, no bundler** | Opens from a `file://` URL or GitHub Pages with zero setup. |
