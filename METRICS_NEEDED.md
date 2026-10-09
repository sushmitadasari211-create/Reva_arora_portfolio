# Reva Arora portfolio — items to confirm

Every claim on the site traces to the resume, `Reva_Arora_Links.pdf`, or a project README. Where a project's
**Impact** needed a number that none of those sources contain, the site shows a striped **[METRIC NEEDED]**
card instead of a figure. Send the values (or say "drop it") and each one becomes a one-line edit in
`src/data/projects.ts`.

## [METRIC NEEDED] — 12 items across all 9 projects

All nine projects run on synthetic or simulated data, so "impact" here means either a measured result (e.g.
from a real evaluation run) or a clearly labelled result from a representative scenario in the demo.

| # | Project | Metric needed |
|---|---|---|
| 1 | Supply Chain Control Tower | Time to build the daily ops view before vs. with the control tower |
| 2 | Supply Chain Control Tower | Projected or observed OTIF lift from a simulated carrier reroute |
| 3 | Profit Intelligence Studio | Margin leakage ($ or %) surfaced by segment/category in a representative scenario |
| 4 | Profit Intelligence Studio | Time to explain a margin miss before vs. with the dashboard |
| 5 | RetainIQ | Turnover cost and recommended-plan ROI for a representative scenario |
| 6 | BreachGuard IQ | Modeled breach-cost reduction for a representative company profile |
| 7 | HybridSearch AI | Measured nDCG@10 (and MRR) from running the Python pipeline on Amazon ESCI |
| 8 | SignalChain | Estimated candidates recovered (or conversion gap closed) in a representative scenario |
| 9 | SupportDesk RAG | Measured faithfulness and hallucination rate from a real evaluation run |
| 10 | SupportDesk RAG | Share of tickets answerable without escalation in a pilot or test set |
| 11 | AISpend IQ | Annual savings from recommended consolidation in a representative scenario |
| 12 | CloudCut IQ | Recoverable annual savings for a representative scenario |

## Things to confirm (not metrics)

1. **Profit Intelligence tech stack.** The resume lists *SQL, Power BI, Excel*; the live demo is HTML/JS + Plotly.
   The page shows the demo stack and says the resume lists SQL/Power BI/Excel. Is there a Power BI version to link?
2. **Resume projects not on the links PDF.** *SQL Data Incident Investigator* and *DecisionCraft* are on the
   resume but have no repo/demo link, so they are not on the site (the brief says links come only from the PDF).
   Add links if they should appear.
3. **Market statistics left out on purpose.** Some READMEs quote figures with no source — e.g. AISpend IQ
   ("$2.59T on AI in 2026", "95% achieve no measurable ROI", "700+ AI tools") and CloudCut IQ ("$723B cloud
   spend", "$200B+ wasted", "51% of licenses unused"). They are not used on the site. The IBM breach-cost figures
   on BreachGuard IQ are used because the README names the IBM report; they are labelled as cited.
4. **HybridSearch AI wording.** README says hybrid search "typically improves nDCG@10 by ~15–20%" as an industry
   claim. It is not presented as Reva's result; item 7 above asks for her measured number.
5. **Hero character.** The animated hero is a generic illustrated character, not Reva. Her real photo is on the
   About badge. Kept per your instruction.
6. **Phone number** from the resume is intentionally not on the site (brief: contact = LinkedIn, GitHub, email).
7. **Colour palette.** The brief's palette link was never provided; the site uses the existing blush/rose theme.
   All colours are tokens in `src/index.css`, so a re-skin is a single-file change.
