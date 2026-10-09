/* =========================================================================
   RetainIQ — app.js
   -------------------------------------------------------------------------
   This is the entire "brain" of the app. There is no backend and no build
   step: everything below runs directly in the browser.

   The file is organized into these sections (search for the "======" banners):
     1. CONSTANTS / REFERENCE DATA   - departments, tenure bands, interventions
     2. APP STATE                    - the one object that holds current inputs
     3. FORMATTING HELPERS           - currency/percent/number formatting
     4. CALCULATE MODEL              - the single deterministic math engine
     5. CHART HELPERS                - safe create/destroy for Chart.js
     6. RENDER FUNCTIONS             - turn the model into on-screen HTML/charts
     7. INTERACTIVITY                - tabs, sliders, buttons, copy/export
     8. INIT                         - runs once the page loads
   ========================================================================= */


/* ========================================================================
   1. CONSTANTS / REFERENCE DATA
   These are the built-in datasets the app uses to turn a handful of
   configurator inputs into a full department x tenure cost model.
   All numbers are heuristic industry-style assumptions, documented in the
   README, NOT live/random data.
   ======================================================================== */

// Six departments, each with a share of total headcount and multipliers
// that make the model behave realistically (e.g. Support has lower average
// salary but higher attrition; Engineering has high salary + high criticality).
const DEPARTMENTS = [
  { key: "engineering", name: "Engineering",       share: 0.30, salaryMult: 1.35, criticality: 0.35, attritionMult: 0.85 },
  { key: "sales",       name: "Sales",             share: 0.20, salaryMult: 1.05, criticality: 0.25, attritionMult: 1.30 },
  { key: "support",     name: "Customer Support",  share: 0.15, salaryMult: 0.65, criticality: 0.15, attritionMult: 1.55 },
  { key: "operations",  name: "Operations",        share: 0.15, salaryMult: 0.80, criticality: 0.20, attritionMult: 1.10 },
  { key: "product",     name: "Product",           share: 0.10, salaryMult: 1.25, criticality: 0.30, attritionMult: 0.80 },
  { key: "ga",          name: "G&A",               share: 0.10, salaryMult: 0.90, criticality: 0.18, attritionMult: 1.00 },
];

// Five tenure bands. Early-tenure employees carry more onboarding/ramp risk,
// so they get a higher "riskMult" even though later bands may have larger cost.
const TENURE_BANDS = [
  { key: "0-6",  name: "0–6 mo",  share: 0.35, riskMult: 1.6 },
  { key: "6-12", name: "6–12 mo", share: 0.20, riskMult: 1.3 },
  { key: "1-2",  name: "1–2 yr",  share: 0.20, riskMult: 1.0 },
  { key: "2-4",  name: "2–4 yr",  share: 0.15, riskMult: 0.7 },
  { key: "4+",   name: "4+ yr",   share: 0.10, riskMult: 0.5 },
];

// Industry adjusts the *effective* attrition rate and how costly losing
// institutional knowledge is (criticality), based on common industry patterns.
const INDUSTRY_META = {
  technology:    { label: "Technology",    attritionAdj: 1.05, criticalityAdj: 1.10 },
  healthcare:    { label: "Healthcare",    attritionAdj: 1.15, criticalityAdj: 1.00 },
  retail:        { label: "Retail",        attritionAdj: 1.30, criticalityAdj: 0.80 },
  manufacturing: { label: "Manufacturing", attritionAdj: 0.90, criticalityAdj: 0.90 },
  finance:       { label: "Finance",       attritionAdj: 0.95, criticalityAdj: 1.15 },
  hospitality:   { label: "Hospitality",   attritionAdj: 1.35, criticalityAdj: 0.75 },
};

// Company size adjusts recruiter/replacement cost: smaller companies tend to
// pay a premium per hire (less recruiting infrastructure); larger companies
// benefit from economies of scale.
const COMPANY_SIZE_META = {
  startup:    { label: "Startup (< 100)",        recruiterCostMult: 1.20 },
  smb:        { label: "SMB (100–500)",          recruiterCostMult: 1.10 },
  midmarket:  { label: "Mid-Market (500–2,000)", recruiterCostMult: 1.00 },
  enterprise: { label: "Enterprise (2,000+)",    recruiterCostMult: 0.90 },
};

// Seven retention interventions the user can simulate. costFactor and
// maxReduction are expressed as fractions used directly in the ROI formula
// (see simulateIntervention below and the Python Logic tab for the same math).
const INTERVENTIONS = [
  { id: "comp",     name: "Compensation Adjustment",            desc: "Targeted salary increases for retention-critical roles.",        costFactor: 0.050, maxReduction: 0.25, target: "all" },
  { id: "coaching", name: "Manager Coaching Investment",         desc: "Coaching & leadership training for people managers.",             costFactor: 0.010, maxReduction: 0.12, target: "managers" },
  { id: "mobility", name: "Internal Mobility Program",           desc: "Structured internal transfers and career pathing.",               costFactor: 0.008, maxReduction: 0.15, target: "all" },
  { id: "lnd",      name: "Learning & Development Budget",       desc: "Expanded upskilling and certification budget.",                   costFactor: 0.015, maxReduction: 0.10, target: "all" },
  { id: "flex",     name: "Flexibility / Remote Policy",         desc: "Improved hybrid & remote work flexibility.",                       costFactor: 0.003, maxReduction: 0.08, target: "all" },
  { id: "stay",     name: "Stay Interview Program",               desc: "Proactive stay interviews for flight-risk employees.",            costFactor: 0.002, maxReduction: 0.07, target: "all" },
  { id: "hp",       name: "Targeted High-Performer Retention",   desc: "Retention bonuses & career acceleration for top talent.",          costFactor: 0.020, maxReduction: 0.20, target: "highPerformers" },
];

// Friendly labels + colors for the six turnover cost components. These keys
// (replacement, recruiter, managerTime, onboarding, productivityLoss, vacancy)
// are used everywhere: per-department totals, company totals, driver cards.
const COST_COMPONENTS = [
  { key: "replacement",      label: "Replacement Cost",         color: "#C026D3" },
  { key: "recruiter",        label: "Recruiter Cost",           color: "#0EA5E9" },
  { key: "managerTime",      label: "Manager Interview Time",   color: "#A855F7" },
  { key: "onboarding",       label: "Onboarding & Training",    color: "#EAB308" },
  { key: "productivityLoss", label: "Productivity Loss",        color: "#FB923C" },
  { key: "vacancy",          label: "Vacancy Cost",             color: "#84CC16" },
];

const PALETTE_CYCLE = ["#C026D3", "#84CC16", "#FB923C", "#EAB308", "#0EA5E9", "#A855F7"];


/* ========================================================================
   2. APP STATE
   One object holds everything the app currently knows: the raw configurator
   inputs, the intervention slider levels, which segment is selected, the
   most recent computed model, and the live Chart.js instances (so we can
   safely destroy + recreate them instead of leaking memory or crashing).
   ======================================================================== */

const appState = {
  inputs: {
    industry: "technology",
    companySize: "midmarket",
    headcount: 1200,
    attritionRate: 18,     // percent
    avgSalary: 78000,
    timeToFillDays: 45,
    rampMonths: 4,
    pctHighPerformers: 15, // percent
    pctManagerRoles: 12,   // percent
  },
  interventionLevels: { comp: 50, coaching: 50, mobility: 50, lnd: 50, flex: 50, stay: 50, hp: 50 },
  selectedSegment: { deptIndex: 0, tenureIndex: null }, // null tenureIndex = whole department
  model: null,
  charts: {}, // canvasId -> Chart.js instance
};


/* ========================================================================
   3. FORMATTING HELPERS
   ======================================================================== */

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatCurrency(value) {
  const rounded = Math.round(value || 0);
  return "$" + rounded.toLocaleString("en-US");
}

function formatCurrencyCompact(value) {
  const abs = Math.abs(value || 0);
  if (abs >= 1e6) return (value < 0 ? "-" : "") + "$" + (abs / 1e6).toFixed(2) + "M";
  if (abs >= 1e3) return (value < 0 ? "-" : "") + "$" + (abs / 1e3).toFixed(1) + "K";
  return formatCurrency(value);
}

function formatPercent(value, decimals = 0) {
  return (value || 0).toFixed(decimals) + "%";
}

function formatNumber(value) {
  return Math.round(value || 0).toLocaleString("en-US");
}


/* ========================================================================
   4. CALCULATE MODEL
   The single deterministic function that turns configurator inputs +
   intervention slider levels into every number the app displays.
   Nothing here uses Math.random() — same inputs always produce same outputs.
   ======================================================================== */

function calculateModel(inputs) {
  const industry = INDUSTRY_META[inputs.industry];
  const companySize = COMPANY_SIZE_META[inputs.companySize];
  const attritionRateDecimal = inputs.attritionRate / 100;

  // Global adjustment factors applied across every department:
  // losing more high performers/managers makes productivity loss & manager
  // time more expensive company-wide.
  const highPerformerFactor = 1 + (inputs.pctHighPerformers / 100) * 0.5;
  const managerFactor = 1 + (inputs.pctManagerRoles / 100) * 0.6;

  // Normalize department attrition multipliers so the headcount-weighted
  // average multiplier is exactly 1.0. This guarantees the company-wide
  // attrition rate you set on the slider is preserved after distributing
  // risk across departments (only the *distribution* changes, not the total).
  const normFactor = DEPARTMENTS.reduce((sum, d) => sum + d.share * d.attritionMult, 0);

  // ---- Per-employee-exit cost formula (mirrors the Python Logic tab) ----
  function costPerExit(salary, criticality) {
    const replacement = salary * 0.20 * companySize.recruiterCostMult;                 // agency/advertising/admin
    const recruiter = salary * 0.10 * companySize.recruiterCostMult;                   // internal recruiter time
    const managerTime = (salary / 2080) * 15 * 2 * managerFactor;                      // hourly rate * interview hrs * interviewers
    const onboarding = salary * (inputs.rampMonths / 12) * 0.50;                       // training + ramp materials
    const productivityLoss = salary * (inputs.rampMonths / 12) * criticality * highPerformerFactor; // ramp inefficiency + team drag
    const vacancy = (salary / 260) * inputs.timeToFillDays * 0.60;                    // lost output while seat is empty
    const total = replacement + recruiter + managerTime + onboarding + productivityLoss + vacancy;
    return { replacement, recruiter, managerTime, onboarding, productivityLoss, vacancy, total };
  }

  // ---- Build per-department rows ----
  const departments = DEPARTMENTS.map((d) => {
    const headcount = inputs.headcount * d.share;
    const salary = inputs.avgSalary * d.salaryMult;
    const criticality = d.criticality * industry.criticalityAdj;
    let attritionRate = attritionRateDecimal * industry.attritionAdj * (d.attritionMult / normFactor);
    attritionRate = clamp(attritionRate, 0.02, 0.75);
    const exits = headcount * attritionRate;
    const cost = costPerExit(salary, criticality);
    const componentTotals = {};
    COST_COMPONENTS.forEach((c) => { componentTotals[c.key] = cost[c.key] * exits; });
    const totalCost = cost.total * exits;

    return {
      key: d.key,
      name: d.name,
      headcount,
      salary,
      criticality,
      attritionRate,
      exits,
      costPerExit: cost,
      componentTotals,
      totalCost,
      attritionMultNorm: d.attritionMult / normFactor,
    };
  });

  // ---- Company-wide totals ----
  const totalExits = departments.reduce((s, d) => s + d.exits, 0);
  const totalCost = departments.reduce((s, d) => s + d.totalCost, 0);
  const avgCostPerExit = totalExits > 0 ? totalCost / totalExits : 0;

  const componentTotals = {};
  COST_COMPONENTS.forEach((c) => {
    componentTotals[c.key] = departments.reduce((s, d) => s + d.componentTotals[c.key], 0);
  });

  const directCost = componentTotals.replacement + componentTotals.recruiter + componentTotals.managerTime;
  const indirectCost = componentTotals.onboarding + componentTotals.productivityLoss + componentTotals.vacancy;

  // ---- Department x Tenure segment matrix (drives the heatmap + risk count) ----
  // Cell value approximates the turnover-cost concentration of that segment.
  const segmentMatrix = departments.map((d) =>
    TENURE_BANDS.map((t) => d.exits * t.share * t.riskMult * d.costPerExit.total)
  );
  const flatMatrix = segmentMatrix.flat();
  const sortedMatrix = [...flatMatrix].sort((a, b) => a - b);
  const p75 = sortedMatrix[Math.floor(0.75 * (sortedMatrix.length - 1))];
  const matrixMin = sortedMatrix[0];
  const matrixMax = sortedMatrix[sortedMatrix.length - 1];
  const highRiskSegmentCount = flatMatrix.filter((v) => v >= p75).length;

  // Risk score per department (0-100) for the bubble chart, combining
  // relative attrition risk with the tenure-weighted risk profile.
  const tenureRiskWeighted = TENURE_BANDS.reduce((s, t) => s + t.share * t.riskMult, 0);
  departments.forEach((d) => {
    const raw = d.attritionMultNorm * industry.attritionAdj * tenureRiskWeighted;
    d.riskScore = clamp(Math.round(raw * 40), 0, 100);
  });

  const totals = { totalExits, totalCost, avgCostPerExit, directCost, indirectCost, componentTotals };

  // ---- Intervention math ----
  function targetCount(target) {
    if (target === "managers") return inputs.headcount * (inputs.pctManagerRoles / 100);
    if (target === "highPerformers") return inputs.headcount * (inputs.pctHighPerformers / 100);
    return inputs.headcount;
  }

  function simulateIntervention(iv, levelPct) {
    const level = levelPct / 100;
    const targeted = targetCount(iv.target);
    const cost = iv.costFactor * targeted * inputs.avgSalary * level;
    const reductionFrac = iv.maxReduction * level;
    const targetShare = inputs.headcount > 0 ? Math.min(1, targeted / inputs.headcount) : 0;
    const exitsInTarget = totalExits * targetShare;
    const exitsAvoided = exitsInTarget * reductionFrac;
    const savings = exitsAvoided * avgCostPerExit;
    const netImpact = savings - cost;
    const roiPct = cost > 0 ? (netImpact / cost) * 100 : 0;
    return { cost, exitsAvoided, savings, netImpact, roiPct };
  }

  // Combines a set of {cost, exitsAvoided} selections into one scenario,
  // capping total avoided exits at 60% of baseline exits so stacking every
  // intervention at once never implies eliminating attrition entirely.
  function combineSelections(selections) {
    let cost = 0;
    let exitsAvoidedRaw = 0;
    selections.forEach((s) => { cost += s.cost; exitsAvoidedRaw += s.exitsAvoided; });
    const cap = totalExits * 0.6;
    const scaleFactor = exitsAvoidedRaw > cap && exitsAvoidedRaw > 0 ? cap / exitsAvoidedRaw : 1;
    const exitsAvoidedCapped = exitsAvoidedRaw * scaleFactor;
    const savings = exitsAvoidedCapped * avgCostPerExit;
    const netImpact = savings - cost;
    const roiPct = cost > 0 ? (netImpact / cost) * 100 : 0;
    const paybackMonths = cost > 0 && savings > 0 ? cost / (savings / 12) : null;
    return { cost, exitsAvoidedRaw, exitsAvoidedCapped, scaleFactor, savings, netImpact, roiPct, paybackMonths };
  }

  // Live per-intervention numbers (driven by the sliders) + a level-independent
  // "efficiency" ROI (computed at 100% funding) used purely for ranking, since
  // cost and savings both scale linearly with level -- their ratio doesn't
  // actually depend on the slider position, only on the intervention itself.
  const interventions = INTERVENTIONS.map((iv) => {
    const levelPct = appState.interventionLevels[iv.id];
    const live = simulateIntervention(iv, levelPct);
    const efficiency = simulateIntervention(iv, 100);
    return {
      ...iv,
      levelPct,
      cost: live.cost,
      exitsAvoided: live.exitsAvoided,
      savings: live.savings,
      netImpact: live.netImpact,
      liveRoiPct: live.roiPct,
      efficiencyRoiPct: efficiency.roiPct,
      full: efficiency, // {cost, exitsAvoided, savings, netImpact, roiPct} at 100% funding
    };
  });

  const rankedByEfficiency = [...interventions].sort((a, b) => b.efficiencyRoiPct - a.efficiencyRoiPct);
  const top3 = rankedByEfficiency.slice(0, 3);

  // Live combined scenario (what the ROI Board / KPIs / projection show)
  const scenario = combineSelections(interventions.map((iv) => ({ cost: iv.cost, exitsAvoided: iv.exitsAvoided })));
  scenario.newAttritionRate =
    totalExits > 0 ? inputs.attritionRate * (1 - scenario.exitsAvoidedCapped / totalExits) : inputs.attritionRate;
  scenario.newTotalCost = totalCost - scenario.savings;

  // Recommended combo: top 3 most efficient interventions, fully funded (100%)
  const recommendedCombo = combineSelections(top3.map((iv) => ({ cost: iv.full.cost, exitsAvoided: iv.full.exitsAvoided })));

  // 12-month cumulative net-savings projection: investment spent up front in
  // month 1, monthly savings ramp linearly to full run-rate by month 6.
  const monthlyRunRate = scenario.savings / 12;
  let cumulativeSavings = 0;
  const projection = [];
  for (let month = 1; month <= 12; month++) {
    const rampFactor = Math.min(1, month / 6);
    cumulativeSavings += monthlyRunRate * rampFactor;
    projection.push(cumulativeSavings - scenario.cost);
  }

  // ---- Savings Opportunity Waterfall (Cost Breakdown tab) ----
  // Shows, independent of the simulator sliders, how much of the current
  // total cost could be recovered if every intervention were fully funded.
  const waterfallScale = combineSelections(interventions.map((iv) => ({ cost: iv.full.cost, exitsAvoided: iv.full.exitsAvoided }))).scaleFactor;
  let waterfallRunning = totalCost;
  const waterfallSteps = interventions.map((iv) => {
    const stepSavings = iv.full.exitsAvoided * waterfallScale * avgCostPerExit;
    const base = waterfallRunning - stepSavings;
    const step = { name: iv.name, base, value: stepSavings };
    waterfallRunning = base;
    return step;
  });

  // ---- Top loss drivers (Cost Breakdown tab) ----
  const driverList = COST_COMPONENTS.map((c) => ({
    label: c.label,
    value: componentTotals[c.key],
    pct: totalCost > 0 ? (componentTotals[c.key] / totalCost) * 100 : 0,
  })).sort((a, b) => b.value - a.value);
  const topDrivers = driverList.slice(0, 3);
  const topDepartment = [...departments].sort((a, b) => b.totalCost - a.totalCost)[0];
  const topTenureRisk = (() => {
    let best = { deptIndex: 0, tenureIndex: 0, value: -Infinity };
    segmentMatrix.forEach((row, di) => row.forEach((v, ti) => { if (v > best.value) best = { deptIndex: di, tenureIndex: ti, value: v }; }));
    return best;
  })();

  const costExplanation =
    `${topDrivers[0].label} is the single largest contributor to your $${formatNumber(totalCost)} annual turnover bill, ` +
    `making up ${formatPercent(topDrivers[0].pct, 1)} of the total. ${topDepartment.name} carries the highest departmental cost ` +
    `at ${formatCurrencyCompact(topDepartment.totalCost)}/year from an estimated ${formatNumber(topDepartment.exits)} exits. ` +
    `Direct costs (replacement, recruiter, manager time) account for ${formatCurrencyCompact(directCost)}, while indirect costs ` +
    `(onboarding, productivity loss, vacancy) account for ${formatCurrencyCompact(indirectCost)} -- the part most leaders never see on an invoice.`;

  // ---- Executive Summary text ----
  const topIv = rankedByEfficiency[0];
  const secondIv = rankedByEfficiency[1];
  const ninetyDayPlan = [
    `Weeks 1-2: Launch a ${topIv.name.toLowerCase()} pilot in ${topDepartment.name}, the department driving the largest share of turnover cost.`,
    `Weeks 3-6: Stand up ${secondIv.name.toLowerCase()} for the ${TENURE_BANDS[topTenureRisk.tenureIndex].name} tenure band in ${departments[topTenureRisk.deptIndex].name}, the highest-risk segment identified in the heatmap.`,
    `Weeks 6-10: Fund the top 3 interventions (${top3.map((i) => i.name).join(", ")}) at the levels modeled in the ROI Board, targeting a payback under ${recommendedCombo.paybackMonths ? Math.ceil(recommendedCombo.paybackMonths) : "12"} months.`,
    `Weeks 10-13: Re-run RetainIQ with updated attrition figures to confirm the projected ${formatPercent(recommendedCombo.roiPct, 0)} ROI is materializing, and reallocate budget toward whichever intervention is outperforming.`,
  ];

  const executiveSummary = {
    drivingCost:
      `Your organization is projected to lose ${formatCurrencyCompact(totalCost)} this year to employee turnover, driven primarily by ` +
      `${topDrivers[0].label.toLowerCase()} (${formatPercent(topDrivers[0].pct, 0)} of total cost) and concentrated most heavily in ${topDepartment.name}.`,
    keyGroups:
      `The ${TENURE_BANDS[topTenureRisk.tenureIndex].name} tenure band inside ${departments[topTenureRisk.deptIndex].name} represents the single highest-cost ` +
      `segment on the risk heatmap. Across the company, ${highRiskSegmentCount} of ${flatMatrix.length} department x tenure segments are flagged as high-risk.`,
    efficientInterventions:
      `${topIv.name} and ${secondIv.name} deliver the strongest efficiency, each returning an estimated ${formatPercent(topIv.efficiencyRoiPct, 0)} and ` +
      `${formatPercent(secondIv.efficiencyRoiPct, 0)} ROI respectively when fully funded, ahead of the remaining five interventions modeled.`,
    ninetyDayPlan,
  };
  executiveSummary.fullText =
    `RETAINIQ EXECUTIVE SUMMARY\n\n` +
    `WHAT IS DRIVING THE HIGHEST TURNOVER COST\n${executiveSummary.drivingCost}\n\n` +
    `WHICH EMPLOYEE GROUPS MATTER MOST\n${executiveSummary.keyGroups}\n\n` +
    `WHICH INTERVENTIONS ARE MOST EFFICIENT\n${executiveSummary.efficientInterventions}\n\n` +
    `90-DAY PLAN\n${ninetyDayPlan.map((l, i) => `${i + 1}. ${l}`).join("\n")}\n`;

  // ---- LinkedIn carousel content ----
  const linkedIn = {
    slides: [
      { title: "Employee turnover is a hidden financial leak", body: `Most leadership teams never see the real number. For an org this size, it's ${formatCurrencyCompact(totalCost)} a year.` },
      { title: "The true cost of one exit", body: `Every departure costs an estimated ${formatCurrencyCompact(avgCostPerExit)} once you count recruiting, manager time, onboarding, and lost productivity -- not just the recruiter fee.` },
      { title: "Some teams are bleeding faster than others", body: `${departments[topTenureRisk.deptIndex].name} employees in their ${TENURE_BANDS[topTenureRisk.tenureIndex].name} window are the single highest-risk segment we found.` },
      { title: "Not all retention spend is equal", body: `${topIv.name} returns an estimated ${formatPercent(topIv.efficiencyRoiPct, 0)} ROI when fully funded -- some interventions simply outperform others.` },
      { title: "The math behind the plan", body: `Funding the top 3 interventions could save ${formatCurrencyCompact(recommendedCombo.savings)}/year at a payback of ${recommendedCombo.paybackMonths ? Math.ceil(recommendedCombo.paybackMonths) + " months" : "under 12 months"}.` },
      { title: "Stop guessing. Start quantifying.", body: "RetainIQ turns turnover into a financial model you can defend in front of a CFO -- not just a chart for HR." },
    ],
  };
  linkedIn.caption =
    `Employee turnover isn't just an HR metric -- it's a financial leak most leadership teams never quantify.\n\n` +
    `Running this org's numbers through RetainIQ:\n` +
    `-> ${formatCurrencyCompact(totalCost)} estimated annual turnover cost\n` +
    `-> ${formatCurrencyCompact(avgCostPerExit)} average cost per exit\n` +
    `-> ${departments[topTenureRisk.deptIndex].name} (${TENURE_BANDS[topTenureRisk.tenureIndex].name}) is the highest-risk segment\n` +
    `-> ${topIv.name} is the most efficient retention lever at ${formatPercent(topIv.efficiencyRoiPct, 0)} ROI\n\n` +
    `This isn't an attrition prediction demo -- it's a decision-support model that prices retention spend against the cost of doing nothing.\n\n` +
    `#HRAnalytics #PeopleAnalytics #RetentionStrategy #FutureOfWork #HRTech`;

  return {
    inputs,
    industry,
    companySize,
    departments,
    tenureBands: TENURE_BANDS,
    segmentMatrix,
    matrixMin,
    matrixMax,
    highRiskSegmentCount,
    totals,
    interventions,
    rankedByEfficiency,
    top3,
    scenario,
    recommendedCombo,
    projection,
    waterfallSteps,
    topDrivers,
    topDepartment,
    topTenureRisk,
    costExplanation,
    executiveSummary,
    linkedIn,
  };
}


/* ========================================================================
   5. CHART HELPERS
   ======================================================================== */

function renderChart(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (appState.charts[canvasId]) {
    appState.charts[canvasId].destroy();
  }
  appState.charts[canvasId] = new Chart(canvas.getContext("2d"), config);
}

const CHART_FONT = { family: "-apple-system, Segoe UI, Roboto, sans-serif", size: 12 };

function baseChartOptions(extra) {
  return Object.assign(
    {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { font: CHART_FONT, color: "#383B58" } },
      },
      scales: {},
    },
    extra
  );
}


/* ========================================================================
   6. RENDER FUNCTIONS
   ======================================================================== */

function renderKpis(model) {
  document.getElementById("kpi-turnover-cost").textContent = formatCurrencyCompact(model.totals.totalCost);
  document.getElementById("kpi-turnover-cost-sub").textContent = `across ${DEPARTMENTS.length} departments`;

  document.getElementById("kpi-attrition-rate").textContent = formatPercent(model.inputs.attritionRate);
  document.getElementById("kpi-attrition-rate-sub").textContent = `${formatNumber(model.totals.totalExits)} employees / year`;

  document.getElementById("kpi-risk-segments").textContent = model.highRiskSegmentCount;
  document.getElementById("kpi-risk-segments-sub").textContent = `of ${model.segmentMatrix.flat().length} department x tenure cells flagged`;

  document.getElementById("kpi-roi").textContent = formatPercent(model.scenario.roiPct);
  document.getElementById("kpi-roi-sub").textContent = model.scenario.paybackMonths
    ? `payback in ${Math.ceil(model.scenario.paybackMonths)} months`
    : `fund an intervention to see payback`;
}

/* ---- Tab 1: Cost Breakdown ---- */
function renderCostBreakdown(model) {
  // Stacked bar: cost components per department
  renderChart("chart-stacked-cost", {
    type: "bar",
    data: {
      labels: model.departments.map((d) => d.name),
      datasets: COST_COMPONENTS.map((c) => ({
        label: c.label,
        data: model.departments.map((d) => Math.round(d.componentTotals[c.key])),
        backgroundColor: c.color,
        borderRadius: 4,
      })),
    },
    options: baseChartOptions({
      scales: {
        x: { stacked: true, ticks: { font: CHART_FONT } },
        y: { stacked: true, ticks: { font: CHART_FONT, callback: (v) => formatCurrencyCompact(v) } },
      },
      plugins: {
        legend: { position: "bottom", labels: { font: CHART_FONT, boxWidth: 12 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` } },
      },
    }),
  });

  // Doughnut: direct vs indirect
  renderChart("chart-direct-indirect", {
    type: "doughnut",
    data: {
      labels: ["Direct Cost", "Indirect Cost"],
      datasets: [{ data: [Math.round(model.totals.directCost), Math.round(model.totals.indirectCost)], backgroundColor: ["#C026D3", "#FB923C"], borderWidth: 0 }],
    },
    options: baseChartOptions({
      plugins: {
        legend: { position: "bottom", labels: { font: CHART_FONT } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${formatCurrency(ctx.raw)}` } },
      },
    }),
  });

  // Waterfall-style savings opportunity chart (stable Chart.js bar method)
  const steps = model.waterfallSteps;
  const labels = ["Current Cost", ...steps.map((s) => s.name), "Achievable Cost"];
  const finalRemaining = steps.length ? steps[steps.length - 1].base : model.totals.totalCost;
  const baseData = [0, ...steps.map((s) => s.base), 0];
  const valueData = [model.totals.totalCost, ...steps.map((s) => s.value), finalRemaining];
  const barColors = ["#C026D3", ...steps.map(() => "#84CC16"), "#EAB308"];

  renderChart("chart-waterfall", {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "base", data: baseData, backgroundColor: "rgba(0,0,0,0)", stack: "wf" },
        { label: "Cost", data: valueData, backgroundColor: barColors, stack: "wf", borderRadius: 4 },
      ],
    },
    options: baseChartOptions({
      plugins: {
        legend: { display: false },
        tooltip: {
          filter: (ctx) => ctx.dataset.label !== "base",
          callbacks: { label: (ctx) => formatCurrency(ctx.raw) },
        },
      },
      scales: {
        x: { stacked: true, ticks: { font: { ...CHART_FONT, size: 10 } } },
        y: { stacked: true, ticks: { font: CHART_FONT, callback: (v) => formatCurrencyCompact(v) } },
      },
    }),
  });

  // Top loss driver cards
  const driverCards = document.getElementById("driver-cards");
  driverCards.innerHTML = model.topDrivers
    .map(
      (d) => `
      <div class="driver-card">
        <div class="driver-name">${d.label}</div>
        <div class="driver-value">${formatCurrencyCompact(d.value)}</div>
        <div class="driver-pct">${formatPercent(d.pct, 1)} of total turnover cost</div>
      </div>`
    )
    .join("");

  document.getElementById("cost-explanation").textContent = model.costExplanation;
}

/* ---- Tab 2: Risk Segments ---- */
function colorForValue(value, min, max) {
  const t = max > min ? (value - min) / (max - min) : 0;
  const from = [132, 204, 22];  // lime (low risk)
  const to = [251, 146, 60];    // tangerine (high risk)
  const rgb = from.map((c, i) => Math.round(c + (to[i] - c) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function renderHeatmap(model) {
  const grid = document.getElementById("heatmap-grid");
  grid.style.gridTemplateColumns = `160px repeat(${model.tenureBands.length}, 1fr)`;
  let html = `<div class="heatmap-header-cell row-label">Department</div>`;
  model.tenureBands.forEach((t) => { html += `<div class="heatmap-header-cell">${t.name}</div>`; });

  model.departments.forEach((d, di) => {
    html += `<div class="heatmap-header-cell row-label">${d.name}</div>`;
    model.tenureBands.forEach((t, ti) => {
      const value = model.segmentMatrix[di][ti];
      const color = colorForValue(value, model.matrixMin, model.matrixMax);
      const selected = appState.selectedSegment.deptIndex === di && appState.selectedSegment.tenureIndex === ti ? "selected" : "";
      html += `<div class="heatmap-cell ${selected}" style="background:${color}" data-dept="${di}" data-tenure="${ti}" title="${d.name} / ${t.name}">${formatCurrencyCompact(value)}</div>`;
    });
  });
  grid.innerHTML = html;

  grid.querySelectorAll(".heatmap-cell").forEach((cell) => {
    cell.addEventListener("click", () => {
      const di = Number(cell.dataset.dept);
      const ti = Number(cell.dataset.tenure);
      appState.selectedSegment = { deptIndex: di, tenureIndex: ti };
      renderHeatmap(appState.model);
      renderSegmentCards(appState.model);
      renderSegmentDetail(appState.model);
    });
  });
}

function renderBubbleChart(model) {
  const maxHeadcount = Math.max(...model.departments.map((d) => d.headcount));
  renderChart("chart-bubble", {
    type: "bubble",
    data: {
      datasets: model.departments.map((d, i) => ({
        label: d.name,
        data: [{ x: d.riskScore, y: Math.round(d.costPerExit.total), r: 8 + (d.headcount / maxHeadcount) * 22 }],
        backgroundColor: PALETTE_CYCLE[i % PALETTE_CYCLE.length] + "CC",
        borderColor: PALETTE_CYCLE[i % PALETTE_CYCLE.length],
        borderWidth: 1.5,
      })),
    },
    options: baseChartOptions({
      plugins: {
        legend: { position: "bottom", labels: { font: CHART_FONT, boxWidth: 10 } },
        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: risk ${ctx.raw.x}, ${formatCurrency(ctx.raw.y)}/exit` } },
      },
      scales: {
        x: { title: { display: true, text: "Attrition Risk Score", font: CHART_FONT }, min: 0, max: 100, ticks: { font: CHART_FONT } },
        y: { title: { display: true, text: "Avg. Replacement Cost", font: CHART_FONT }, ticks: { font: CHART_FONT, callback: (v) => formatCurrencyCompact(v) } },
      },
    }),
  });
}

function renderSegmentCards(model) {
  const container = document.getElementById("segment-cards");
  container.innerHTML = model.departments
    .map((d, i) => {
      const selected = appState.selectedSegment.deptIndex === i && appState.selectedSegment.tenureIndex === null ? "selected" : "";
      return `
      <div class="segment-card ${selected}" data-dept="${i}">
        <div class="seg-name">${d.name}</div>
        <div class="seg-meta">${formatNumber(d.headcount)} employees &middot; ${formatPercent(d.attritionRate * 100, 1)} attrition &middot; risk ${d.riskScore}/100</div>
        <div class="seg-cost">${formatCurrencyCompact(d.totalCost)}/yr</div>
      </div>`;
    })
    .join("");

  container.querySelectorAll(".segment-card").forEach((card) => {
    card.addEventListener("click", () => {
      const di = Number(card.dataset.dept);
      appState.selectedSegment = { deptIndex: di, tenureIndex: null };
      renderHeatmap(appState.model);
      renderSegmentCards(appState.model);
      renderSegmentDetail(appState.model);
    });
  });
}

function renderSegmentDetail(model) {
  const { deptIndex, tenureIndex } = appState.selectedSegment;
  const dept = model.departments[deptIndex];
  const body = document.getElementById("segment-detail-body");

  if (tenureIndex === null) {
    // Whole-department view
    const rows = COST_COMPONENTS.map(
      (c) => `<div class="detail-row"><span>${c.label}</span><span>${formatCurrency(dept.componentTotals[c.key])}</span></div>`
    ).join("");
    body.innerHTML = `
      <p class="muted" style="margin-bottom:10px;">${dept.name} — whole department</p>
      <div class="detail-row"><span>Headcount</span><span>${formatNumber(dept.headcount)}</span></div>
      <div class="detail-row"><span>Annual Exits</span><span>${formatNumber(dept.exits)}</span></div>
      <div class="detail-row"><span>Attrition Rate</span><span>${formatPercent(dept.attritionRate * 100, 1)}</span></div>
      <div class="detail-row"><span>Risk Score</span><span>${dept.riskScore}/100</span></div>
      ${rows}
      <div class="detail-row"><strong>Total Annual Cost</strong><strong>${formatCurrency(dept.totalCost)}</strong></div>
    `;
  } else {
    const tenure = model.tenureBands[tenureIndex];
    const cellValue = model.segmentMatrix[deptIndex][tenureIndex];
    const isHighRisk = cellValue >= model.matrixMax * 0.6;
    body.innerHTML = `
      <p class="muted" style="margin-bottom:10px;">${dept.name} &middot; ${tenure.name} tenure</p>
      <div class="detail-row"><span>Segment Cost Concentration</span><span>${formatCurrency(cellValue)}</span></div>
      <div class="detail-row"><span>Department Risk Score</span><span>${dept.riskScore}/100</span></div>
      <div class="detail-row"><span>Tenure Risk Multiplier</span><span>${tenure.riskMult.toFixed(2)}x</span></div>
      <div class="detail-row"><span>Est. Share of Department Exits</span><span>${formatPercent(tenure.share * 100, 0)}</span></div>
      <div class="detail-row"><strong>Recommendation</strong><strong>${isHighRisk ? "Prioritize" : "Monitor"}</strong></div>
      <p style="margin-top:12px; font-size:13px; color:var(--ink-700); line-height:1.6;">
        ${isHighRisk
          ? `This is one of the highest-cost segments in your organization. Consider a targeted stay-interview push or onboarding investment for ${dept.name} employees in their ${tenure.name} window.`
          : `This segment carries moderate risk relative to others -- keep monitoring but prioritize higher-cost segments first.`}
      </p>
    `;
  }
}

function renderRiskSegments(model) {
  renderHeatmap(model);
  renderBubbleChart(model);
  renderSegmentCards(model);
  renderSegmentDetail(model);
}

/* ---- Tab 3: Intervention Simulator ---- */
function renderInterventionRow(iv) {
  const netClass = iv.netImpact >= 0 ? "iv-positive" : "iv-negative";
  return `
    <div class="intervention-row" data-iv="${iv.id}">
      <div>
        <div class="intervention-name">${iv.name}</div>
        <div class="intervention-desc">${iv.desc}</div>
      </div>
      <div>
        <label style="font-size:12px; color:var(--ink-500); display:flex; justify-content:space-between;">
          Investment level <span class="field-value" id="iv-value-${iv.id}">${iv.levelPct}%</span>
        </label>
        <input type="range" min="0" max="100" step="5" value="${iv.levelPct}" id="iv-slider-${iv.id}" data-iv="${iv.id}" />
      </div>
      <div class="iv-metric"><span class="iv-metric-label">Cost</span><span class="iv-metric-value">${formatCurrencyCompact(iv.cost)}</span></div>
      <div class="iv-metric"><span class="iv-metric-label">Attrition ↓</span><span class="iv-metric-value">${formatPercent(iv.exitsAvoided / Math.max(1, appState.model.totals.totalExits) * 100, 1)}</span></div>
      <div class="iv-metric"><span class="iv-metric-label">Savings</span><span class="iv-metric-value">${formatCurrencyCompact(iv.savings)}</span></div>
      <div class="iv-metric"><span class="iv-metric-label">Net Impact</span><span class="iv-metric-value ${netClass}">${formatCurrencyCompact(iv.netImpact)}</span></div>
    </div>`;
}

function renderInterventions(model) {
  const container = document.getElementById("intervention-controls");
  container.innerHTML = model.interventions.map(renderInterventionRow).join("");

  container.querySelectorAll("input[type=range]").forEach((slider) => {
    slider.addEventListener("input", (e) => {
      const id = e.target.dataset.iv;
      appState.interventionLevels[id] = Number(e.target.value);
      document.getElementById(`iv-value-${id}`).textContent = `${e.target.value}%`;
      recomputeScenario();
    });
  });

  // Before vs after
  const before = document.getElementById("before-after");
  const scenario = model.scenario;
  before.innerHTML = `
    <div class="ba-row"><span class="ba-label">Attrition Rate</span><span><span class="ba-before">${formatPercent(model.inputs.attritionRate)}</span> → <span class="ba-after">${formatPercent(scenario.newAttritionRate, 1)}</span></span></div>
    <div class="ba-row"><span class="ba-label">Annual Turnover Cost</span><span><span class="ba-before">${formatCurrencyCompact(model.totals.totalCost)}</span> → <span class="ba-after">${formatCurrencyCompact(scenario.newTotalCost)}</span></span></div>
    <div class="ba-row"><span class="ba-label">Annual Exits</span><span><span class="ba-before">${formatNumber(model.totals.totalExits)}</span> → <span class="ba-after">${formatNumber(model.totals.totalExits - scenario.exitsAvoidedCapped)}</span></span></div>
    <div class="ba-row"><span class="ba-label">Total Investment</span><span class="ba-after">${formatCurrencyCompact(scenario.cost)}</span></div>
  `;

  // Ranking
  const ranking = document.getElementById("intervention-ranking");
  ranking.innerHTML = model.rankedByEfficiency
    .map((iv, i) => `
      <div class="rank-row">
        <span class="rank-num">${i + 1}</span>
        <span class="rank-name">${iv.name}</span>
        <span class="rank-roi">${formatPercent(iv.efficiencyRoiPct, 0)} ROI</span>
      </div>`)
    .join("");

  // What-if summary
  document.getElementById("scenario-summary").textContent =
    `At current investment levels, this scenario costs ${formatCurrencyCompact(scenario.cost)} and is projected to avoid ${formatNumber(scenario.exitsAvoidedCapped)} exits, ` +
    `saving ${formatCurrencyCompact(scenario.savings)}/year -- a net impact of ${formatCurrencyCompact(scenario.netImpact)} and an ROI of ${formatPercent(scenario.roiPct)}` +
    (scenario.paybackMonths ? `, paying back in ${Math.ceil(scenario.paybackMonths)} months.` : ".");
}

/* ---- Tab 4: ROI Board ---- */
function renderRoiGauge(model) {
  const roi = model.scenario.roiPct;
  const gaugeMax = 200; // gauge display scale: 0-200% ROI
  const achievedFraction = clamp(roi, 0, gaugeMax) / gaugeMax;
  renderChart("chart-roi-gauge", {
    type: "doughnut",
    data: {
      labels: ["Achieved", "Remaining"],
      datasets: [{ data: [achievedFraction * 100, 100 - achievedFraction * 100], backgroundColor: ["#C026D3", "#E4E5F3"], borderWidth: 0 }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      circumference: 180,
      rotation: -90,
      cutout: "72%",
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    },
  });
  document.getElementById("gauge-readout").textContent = formatPercent(roi);
}

function renderProjectionChart(model) {
  renderChart("chart-projection", {
    type: "line",
    data: {
      labels: model.projection.map((_, i) => `Month ${i + 1}`),
      datasets: [{
        label: "Cumulative Net Savings",
        data: model.projection.map((v) => Math.round(v)),
        borderColor: "#84CC16",
        backgroundColor: "rgba(132,204,22,0.15)",
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      }],
    },
    options: baseChartOptions({
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => formatCurrency(ctx.raw) } } },
      scales: { y: { ticks: { font: CHART_FONT, callback: (v) => formatCurrencyCompact(v) } }, x: { ticks: { font: { ...CHART_FONT, size: 10 } } } },
    }),
  });
}

function renderBudgetBenefitChart(model) {
  renderChart("chart-budget-benefit", {
    type: "bar",
    data: {
      labels: model.interventions.map((iv) => iv.name.split(" ").slice(0, 2).join(" ")),
      datasets: [
        { label: "Cost", data: model.interventions.map((iv) => Math.round(iv.cost)), backgroundColor: "#FB923C", borderRadius: 4 },
        { label: "Savings", data: model.interventions.map((iv) => Math.round(iv.savings)), backgroundColor: "#84CC16", borderRadius: 4 },
      ],
    },
    options: baseChartOptions({
      plugins: { legend: { position: "bottom", labels: { font: CHART_FONT } }, tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(ctx.raw)}` } } },
      scales: { y: { ticks: { font: CHART_FONT, callback: (v) => formatCurrencyCompact(v) } }, x: { ticks: { font: { ...CHART_FONT, size: 10 } } } },
    }),
  });
}

function renderRoiBoard(model) {
  renderRoiGauge(model);
  renderProjectionChart(model);
  renderBudgetBenefitChart(model);

  document.getElementById("roi-investment").textContent = formatCurrencyCompact(model.scenario.cost);
  document.getElementById("roi-savings").textContent = formatCurrencyCompact(model.scenario.savings);
  document.getElementById("roi-payback").textContent = model.scenario.paybackMonths ? `${Math.ceil(model.scenario.paybackMonths)} months` : "N/A";

  document.getElementById("recommended-plan-text").textContent =
    `Fund ${model.top3.map((iv) => iv.name).join(", ")} to unlock an estimated ${formatCurrencyCompact(model.recommendedCombo.savings)} in annual savings ` +
    `at an estimated ${formatPercent(model.recommendedCombo.roiPct)} ROI` +
    (model.recommendedCombo.paybackMonths ? ` -- payback in ${Math.ceil(model.recommendedCombo.paybackMonths)} months.` : ".");

  const boardBody = document.getElementById("board-summary-body");
  boardBody.innerHTML = `
    <div class="board-line"><span>Annual Turnover Cost (baseline)</span><span>${formatCurrency(model.totals.totalCost)}</span></div>
    <div class="board-line"><span>Recommended Investment</span><span>${formatCurrency(model.scenario.cost)}</span></div>
    <div class="board-line"><span>Projected Annual Savings</span><span>${formatCurrency(model.scenario.savings)}</span></div>
    <div class="board-line"><span>Net Impact</span><span>${formatCurrency(model.scenario.netImpact)}</span></div>
    <div class="board-line"><span>ROI</span><span>${formatPercent(model.scenario.roiPct)}</span></div>
    <div class="board-line"><span>Payback Period</span><span>${model.scenario.paybackMonths ? Math.ceil(model.scenario.paybackMonths) + " months" : "N/A"}</span></div>
  `;
}

/* ---- Tab 5: Executive Summary ---- */
function renderExecutiveSummary(model) {
  const body = document.getElementById("executive-summary-body");
  const s = model.executiveSummary;
  body.innerHTML = `
    <h4>What is driving the highest turnover cost</h4>
    <p>${s.drivingCost}</p>
    <h4>Which employee groups matter most</h4>
    <p>${s.keyGroups}</p>
    <h4>Which interventions are most efficient</h4>
    <p>${s.efficientInterventions}</p>
    <h4>What 90-day plan should leadership prioritize</h4>
    <ul>${s.ninetyDayPlan.map((line) => `<li>${line}</li>`).join("")}</ul>
  `;
}

/* ---- Tab 7: LinkedIn Carousel ---- */
function renderLinkedInCarousel(model) {
  const grid = document.getElementById("carousel-grid");
  grid.innerHTML = model.linkedIn.slides
    .map(
      (slide, i) => `
      <div class="carousel-slide slide-${i + 1}">
        <span class="slide-num">Slide ${i + 1} / 6</span>
        <h4>${slide.title}</h4>
        <p>${slide.body}</p>
      </div>`
    )
    .join("");
  document.getElementById("linkedin-caption").textContent = model.linkedIn.caption;
}

/* ---- Umbrella render functions ---- */
function renderCharts(model) {
  renderCostBreakdown(model);
  renderRiskSegments(model);
  renderRoiBoard(model);
}

function renderAll(model) {
  renderKpis(model);
  renderCharts(model); // cost breakdown + risk segments + ROI board charts
  renderInterventions(model);
  renderExecutiveSummary(model);
  renderLinkedInCarousel(model);
}


/* ========================================================================
   7. INTERACTIVITY
   ======================================================================== */

function readConfiguratorInputs() {
  appState.inputs.industry = document.getElementById("input-industry").value;
  appState.inputs.companySize = document.getElementById("input-company-size").value;
  appState.inputs.headcount = Number(document.getElementById("input-headcount").value);
  appState.inputs.attritionRate = Number(document.getElementById("input-attrition").value);
  appState.inputs.avgSalary = Number(document.getElementById("input-salary").value);
  appState.inputs.timeToFillDays = Number(document.getElementById("input-time-to-fill").value);
  appState.inputs.rampMonths = Number(document.getElementById("input-ramp").value);
  appState.inputs.pctHighPerformers = Number(document.getElementById("input-high-performers").value);
  appState.inputs.pctManagerRoles = Number(document.getElementById("input-manager-roles").value);
}

function updateSliderLabels() {
  document.getElementById("val-headcount").textContent = formatNumber(appState.inputs.headcount);
  document.getElementById("val-attrition").textContent = `${appState.inputs.attritionRate}%`;
  document.getElementById("val-salary").textContent = formatCurrency(appState.inputs.avgSalary);
  document.getElementById("val-time-to-fill").textContent = `${appState.inputs.timeToFillDays}`;
  document.getElementById("val-ramp").textContent = `${appState.inputs.rampMonths}`;
  document.getElementById("val-high-performers").textContent = `${appState.inputs.pctHighPerformers}%`;
  document.getElementById("val-manager-roles").textContent = `${appState.inputs.pctManagerRoles}%`;
}

function analyzeRetentionRisk() {
  readConfiguratorInputs();
  appState.selectedSegment = { deptIndex: 0, tenureIndex: null };
  appState.model = calculateModel(appState.inputs);
  renderAll(appState.model);
  showToast("Analysis complete -- all tabs updated.");
}

// Lighter-weight recompute used when only the intervention sliders move:
// re-runs the full deterministic model (cheap for this dataset size) but
// only re-renders the tabs that depend on intervention levels.
function recomputeScenario() {
  appState.model = calculateModel(appState.inputs);
  renderKpis(appState.model);
  renderInterventions(appState.model);
  renderRoiBoard(appState.model);
  renderExecutiveSummary(appState.model);
  renderLinkedInCarousel(appState.model);
}

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-btn");
  const panels = document.querySelectorAll(".tab-panel");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); });
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
}

function copyText(text, successMessage) {
  const done = () => showToast(successMessage || "Copied to clipboard.");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try { document.execCommand("copy"); } catch (e) { /* no-op: clipboard unavailable */ }
  document.body.removeChild(textarea);
  done();
}

function exportTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}`);
}

function buildFindingsText(model) {
  return (
    `RetainIQ Key Findings\n` +
    `---------------------\n` +
    `Annual Turnover Cost: ${formatCurrency(model.totals.totalCost)}\n` +
    `Top Cost Driver: ${model.topDrivers[0].label} (${formatPercent(model.topDrivers[0].pct, 1)} of total)\n` +
    `Highest-Risk Segment: ${model.topDepartment.name} / ${model.tenureBands[model.topTenureRisk.tenureIndex].name}\n` +
    `Most Efficient Intervention: ${model.rankedByEfficiency[0].name} (${formatPercent(model.rankedByEfficiency[0].efficiencyRoiPct, 0)} ROI)\n` +
    `Recommended Plan ROI: ${formatPercent(model.recommendedCombo.roiPct, 0)}, payback ${model.recommendedCombo.paybackMonths ? Math.ceil(model.recommendedCombo.paybackMonths) + " months" : "N/A"}\n`
  );
}

function setupEventListeners() {
  // Configurator sliders: update the visible number immediately, but only
  // recompute the full model when the user clicks "Analyze".
  ["input-headcount", "input-attrition", "input-salary", "input-time-to-fill", "input-ramp", "input-high-performers", "input-manager-roles"].forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      readConfiguratorInputs();
      updateSliderLabels();
    });
  });

  document.getElementById("btn-analyze").addEventListener("click", analyzeRetentionRisk);

  // Header actions
  document.getElementById("btn-export-summary").addEventListener("click", () => {
    exportTextFile("retainiq-executive-summary.txt", appState.model.executiveSummary.fullText);
  });
  document.getElementById("btn-copy-findings").addEventListener("click", () => {
    copyText(buildFindingsText(appState.model), "Findings copied to clipboard.");
  });

  // Executive summary tab actions
  document.getElementById("btn-copy-summary").addEventListener("click", () => {
    copyText(appState.model.executiveSummary.fullText, "Executive summary copied.");
  });
  document.getElementById("btn-export-txt").addEventListener("click", () => {
    exportTextFile("retainiq-executive-summary.txt", appState.model.executiveSummary.fullText);
  });

  // ROI board download
  document.getElementById("btn-download-board").addEventListener("click", () => {
    const m = appState.model;
    const text =
      `RetainIQ Board Summary\n----------------------\n` +
      `Annual Turnover Cost (baseline): ${formatCurrency(m.totals.totalCost)}\n` +
      `Recommended Investment: ${formatCurrency(m.scenario.cost)}\n` +
      `Projected Annual Savings: ${formatCurrency(m.scenario.savings)}\n` +
      `Net Impact: ${formatCurrency(m.scenario.netImpact)}\n` +
      `ROI: ${formatPercent(m.scenario.roiPct)}\n` +
      `Payback Period: ${m.scenario.paybackMonths ? Math.ceil(m.scenario.paybackMonths) + " months" : "N/A"}\n` +
      `Recommended Plan: ${m.top3.map((iv) => iv.name).join(", ")}\n`;
    exportTextFile("retainiq-board-summary.txt", text);
  });

  // Python Logic copy buttons
  document.querySelectorAll(".btn-copy-code").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      copyText(target.textContent, "Code snippet copied.");
    });
  });

  // LinkedIn caption copy
  document.getElementById("btn-copy-caption").addEventListener("click", () => {
    copyText(appState.model.linkedIn.caption, "Caption copied.");
  });
}


/* ========================================================================
   8. INIT
   ======================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  setupTabs();
  setupEventListeners();
  updateSliderLabels();
  analyzeRetentionRisk(); // populate the whole app with the default scenario
});
