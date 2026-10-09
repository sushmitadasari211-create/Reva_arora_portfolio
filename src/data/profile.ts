/**
 * Everything personal on the site, in one place. Sources:
 * - Reva_Arora_Business_Analyst_Master_Resume.pdf (role, experience, education, skills)
 * - Reva_Arora_Links.pdf (LinkedIn, GitHub — the only source for links)
 * - Resume link supplied by the client in chat
 */

export const PROFILE = {
  name: 'Reva Arora',
  firstName: 'Reva',
  lastName: 'Arora',
  title: 'Business Analyst',
  tagline: 'Business Analyst · Data & AI',
  location: 'Fremont, CA',
  relocation: 'Open to relocation',
  email: 'reevaarora05@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/reva-arora/',
    github: 'https://github.com/reevaarora05/',
    resume: 'https://drive.google.com/file/d/1C3NpuDINOytZwwNG5UP0Ct7MthBHWJL4/view?usp=drive_link',
  },
} as const

/** Home positioning: resume summary + project themes, no metrics beyond the resume. */
export const POSITIONING = {
  statement:
    'Business Analyst with 3+ years across insurance and enterprise real estate operations, translating ambiguous problems into structured requirements, automated reporting, and decision tools. Outside of client work, I build analytics and AI products spanning supply chain, profitability, FinOps, security risk, and retrieval-augmented search.',
} as const

/** Evidence strip on Home. Every figure is quoted from the resume. */
export const HIGHLIGHTS = [
  { value: '~7 hrs/wk', label: 'manual reporting effort cut through 4+ automated dashboards', source: 'Intelty, Inc.' },
  { value: '20%', label: 'less manual processing from Excel analysis of customer and policy data', source: 'A&M Insurance Broker' },
  { value: '~18/mo', label: 'data-quality escalations closed before they reached clients', source: 'A&M Insurance Broker' },
  { value: '10+', label: 'recurring data-quality issues resolved through validation and RCA', source: 'Intelty, Inc.' },
] as const

export const CORE_SKILLS = [
  'Requirements elicitation',
  'Process mapping',
  'User stories & acceptance criteria',
  'UAT support',
  'SQL',
  'Python',
  'Power BI',
  'Tableau',
  'Advanced Excel',
  'Root cause analysis',
  'JIRA',
  'Agile delivery',
] as const

export const SUMMARY =
  'Business Analyst with 3+ years of experience in requirements elicitation, process mapping, and reporting automation across insurance and enterprise client operations. I translate ambiguous business problems into structured requirements, user stories, and acceptance criteria, and build SQL, Python, and BI solutions that cut manual effort. I run stakeholder discovery, support UAT and data validation, and own the documentation that keeps cross-functional teams aligned.'

export type Role = {
  title: string
  company: string
  location: string
  period: string
  points: string[]
}

export const EXPERIENCE: Role[] = [
  {
    title: 'Business Analyst',
    company: 'Intelty, Inc.',
    location: 'Anaheim, CA',
    period: 'Dec 2025 – Present',
    points: [
      'Leading discovery sessions with 7+ business stakeholders, translating ambiguous operational problems into structured requirements and workflow solutions.',
      'Automating 4+ reporting dashboards in SQL, Python, Power BI, and Tableau for enterprise real estate clients including Keller Williams and Cushman & Wakefield, cutting manual reporting effort by roughly 7 hours per week.',
      'Running data validation and root cause analysis on reporting discrepancies, resolving 10+ recurring data quality issues and improving dashboard adoption.',
    ],
  },
  {
    title: 'Data Operations Analyst',
    company: 'University of California, Riverside',
    location: 'Riverside, CA',
    period: 'Oct 2025 – Dec 2025',
    points: [
      'Analyzed cross-functional processes across 4 departments to identify workflow gaps, delivering recommendations that informed process redesign.',
      'Built 3 interactive SQL, Excel, and Power BI dashboards surfacing reporting KPIs and improving cross-group data consistency.',
      'Partnered with department leads to standardize reporting definitions across 5 data sources, cutting downstream discrepancies.',
    ],
  },
  {
    title: 'Risk Analyst',
    company: 'A&M Insurance Broker Pvt. Ltd.',
    location: 'New Delhi, India',
    period: 'Aug 2023 – Aug 2024',
    points: [
      'Managed operational workflows across 500+ client accounts for enterprise real estate developers including DLF, Godrej Properties, Lodha Group, Oberoi Realty, Sobha, Prestige, Brigade, and Embassy Group, resolving data discrepancies to ensure accurate, timely delivery.',
      'Analyzed customer and policy data in Advanced Excel to uncover process inefficiencies, reducing manual processing effort by 20%.',
      'Served as primary escalation point for data quality issues, closing roughly 18 escalations per month before they reached clients.',
    ],
  },
  {
    title: 'Business Analyst',
    company: 'Venus (I) Enterprises Ltd.',
    location: 'New Delhi, India',
    period: 'May 2021 – Jul 2023',
    points: [
      'Gathered and documented business requirements through interviews with 6 stakeholders across chemical manufacturing operations, translating needs into actionable specifications.',
      'Recommended and implemented workflow enhancements that increased adoption of new business processes across 3 teams.',
      'Maintained requirements docs and process maps as a single source of truth, reducing rework between business and technical teams.',
    ],
  },
]

export const EDUCATION = [
  {
    degree: 'Master of Science in Business Analytics',
    school: 'University of California, Riverside',
    location: 'Riverside, CA',
    period: 'Sept 2024 – Dec 2025',
  },
  {
    degree: 'B.B.A. Banking and Insurance',
    school: 'Guru Gobind Singh Indraprastha University',
    location: 'New Delhi, India',
    period: 'Nov 2020 – Aug 2023',
  },
] as const

export const SKILL_GROUPS = [
  {
    category: 'Business Analysis',
    skills: ['Requirements elicitation', 'User stories', 'Acceptance criteria', 'Process mapping', 'Gap analysis', 'Stakeholder interviews', 'UAT support'],
  },
  {
    category: 'Data & Analysis',
    skills: ['SQL', 'Python', 'R', 'Advanced Excel', 'PivotTables', 'Power Query', 'XLOOKUP', 'Data validation', 'Root cause analysis', 'Source reconciliation'],
  },
  {
    category: 'BI & Reporting',
    skills: ['Power BI', 'Tableau', 'Dashboard development', 'KPI design', 'Cohort analysis', 'Trend analysis', 'Executive reporting'],
  },
  {
    category: 'Delivery & Tools',
    skills: ['JIRA', 'SharePoint', 'Agile', 'Waterfall', 'Workflow automation', 'Process improvement', 'Vendor collaboration'],
  },
  {
    // From the project READMEs: what the nine portfolio builds actually use.
    category: 'AI & Product Builds',
    skills: ['RAG (LlamaIndex, LangChain)', 'Hybrid search (SPLADE, BGE, Qdrant)', 'Retrieval evaluation', 'JavaScript', 'Chart.js', 'Plotly', 'Tailwind CSS'],
  },
  {
    category: 'Certifications',
    skills: [
      'Google Data Analytics Professional Certificate',
      'AI Business Solutions in LLM Applications',
      'AI Fluency and Frameworks',
      'Introduction to Generative AI',
      'Claude 101',
    ],
  },
] as const

/** Capability areas, each backed by a resume line or the project set. */
export const CAPABILITIES = [
  {
    number: '01',
    title: 'Requirements & Process Analysis',
    text: 'Discovery with 7+ stakeholders at Intelty; requirements, user stories, acceptance criteria, and process maps maintained as the single source of truth between business and technical teams.',
  },
  {
    number: '02',
    title: 'Reporting Automation & BI',
    text: '4+ dashboards automated in SQL, Python, Power BI, and Tableau for enterprise real estate clients, cutting manual reporting effort by roughly 7 hours per week.',
  },
  {
    number: '03',
    title: 'Data Quality & Root Cause',
    text: '10+ recurring data-quality issues resolved at Intelty; ~18 escalations a month closed at A&M before they reached clients; reporting definitions standardized across 5 data sources.',
  },
  {
    number: '04',
    title: 'Data & AI Decision Tools',
    text: 'Nine self-built products covering supply chain, profit, FinOps, security risk, recruiting, retention, and retrieval-augmented AI — each framed around a business decision.',
  },
] as const
