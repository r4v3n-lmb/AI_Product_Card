// Tech stack
window.STACK = [
  { icon: 'WF', cat: '01 · Architectural Logic', lbl: 'Workflow Design', desc: 'Multi-branch logic, error-handling loops, solo-vs-fleet routing trees.', reveal: 'n8n · LangGraph · State Machines', detail: 'Live in: Dispatch Router — multi-branch logic routes 5 drivers across 3 zones with real-time GPS verification and automatic failover.' },
  { icon: 'AI', cat: '02 · AI / LLM Layer', lbl: 'LLM Integration', desc: 'OpenAI, LangChain memory & tools, RAG pipelines, prompt engineering.', reveal: 'GPT-4 · Claude · Vector DBs', detail: 'Live in: Legal Qualifier — RAG pipeline screens leads against jurisdiction DB, win-rate history, and case-type filters before a booking slot is offered.' },
  { icon: 'OC', cat: '03 · Automation Engines', lbl: 'Orchestration', desc: 'Self-hosted n8n, Python agents, and LangGraph runners for complex logic.', reveal: 'n8n · Python · LangGraph', detail: 'Live in: Pizza Taker — n8n workflow handles 40+ concurrent peak-hour orders, parsing modifiers and syncing directly to the kitchen printer.' },
  { icon: 'L8N', cat: '04 · Global Scalability', lbl: 'Localization', desc: 'Multilingual NLP, multi-currency logic, cultural adaptation layers.', reveal: '5+ languages · ZA/UK/EU', detail: 'Live in: Real Estate Localizer — one listing becomes 5 language variants, each with market-specific selling-point reordering (garden-first for UK, security-first for ZA).' },
  { icon: 'SY', cat: '05 · Infrastructure', lbl: 'Systems & APIs', desc: 'GitHub pipelines, FastAPI endpoints, Firebase data layer, version-controlled deployment.', reveal: 'FastAPI · Firebase · GitHub Actions', detail: 'Live in: Salon Engine — FastAPI webhook receives Booksy appointment events and triggers a rebook sequence tailored per service type and client history.' },
  { icon: 'OB', cat: '06 · Observability', lbl: 'Dashboards', desc: 'Management dashboards with live run-logs, retry queues, and real-time alerting.', reveal: 'HTML · CSS · JS · Firestore', detail: 'Live in: Fleet Dashboard — owner sees live run-logs, retry queue, driver status, and job count from a mobile browser at 2am.' },
];

// Build catalog
window.CATALOG = [
  {
    id: 'dispatch', idx: 'E-01', sector: 'Logistics',
    title: 'Autonomous Dispatch & Fleet Router',
    problem: 'Owner-operators miss 30-40% of after-hours towing calls — every lost job is R800–R2500 gone.',
    solution: '24/7 Twilio intake agent with GPS verification, driver load-balancing, and live SMS dispatch.',
    stat: '15', unit: 'min', statLbl: 'saved per job',
    tech: ['Twilio','n8n','Google Maps API','Python','OpenAI'],
    mermaid: `flowchart LR
  A[📞 Inbound Call] --> B{AI Intake Agent}
  B -->|Stranded| C[GPS Verify]
  B -->|Scheduled| D[Calendar Slot]
  C --> E{Fleet Router}
  E -->|Solo| F[Direct SMS]
  E -->|Fleet| G[Load Balancer]
  G --> H[Driver #1]
  G --> I[Driver #2]
  F --> J[Job Log]
  H --> J
  I --> J
  J --> K[Owner Dashboard]`,
  },
  {
    id: 'salon', idx: 'E-04', sector: 'Retention',
    title: 'Salon / MedSpa Retention Engine',
    problem: 'Clients forget to re-book; salons leave 40% of LTV on the table across fades, colour, and touch-ups.',
    solution: 'Service-aware rebook timer + personalized aftercare delivered via SMS or WhatsApp per treatment type.',
    stat: '38', unit: '%', statLbl: 'rebook rate lift',
    tech: ['OpenAI','n8n','WhatsApp','Booksy API'],
    mermaid: `flowchart LR
  A[Appointment Done] --> B[Log Service Type]
  B --> C[Timer Engine]
  C -->|Fade: 3wk| D[Nudge]
  C -->|Colour: 6wk| D
  C -->|Facial: 4wk| D
  D --> E[Rebook Link]
  E --> F[Calendar Hold]`,
  },
  {
    id: 'pizza', idx: 'E-06', sector: 'Volume',
    title: 'Pizza / Restaurant Peak-Hour Taker',
    problem: 'Friday 18:00–21:00 = staff burnout, misheard modifiers, lost orders, angry customers.',
    solution: 'Voice-to-POS agent takes calls, handles modifiers, confirms totals, syncs straight to kitchen printer.',
    stat: '95', unit: '%', statLbl: 'order accuracy',
    tech: ['Twilio Voice','OpenAI','POS API','n8n'],
    mermaid: `flowchart LR
  A[Call In] --> B[Voice Agent]
  B --> C[Parse Order]
  C --> D{Modifiers?}
  D -->|Yes| E[Clarify]
  D -->|No| F[Confirm Total]
  E --> F
  F --> G[POS Push]
  G --> H[Kitchen Printer]`,
  },
  {
    id: 'lawyer', idx: 'E-08', sector: 'High-Ticket',
    title: 'Legal / Consulting Lead Qualifier',
    problem: 'Lawyers and consultants burn billable hours on discovery calls that never convert.',
    solution: 'RAG-backed intake interviewer screens against jurisdiction, case type, and win criteria before booking.',
    stat: '70', unit: '%', statLbl: 'unqualified calls cut',
    tech: ['RAG','OpenAI','Calendly','FastAPI'],
    mermaid: `flowchart LR
  A[Web Visitor] --> B[AI Interviewer]
  B --> C[Match DB]
  C --> D{Score >= 7?}
  D -->|Yes| E[Book Paid Consult]
  D -->|No| F[Send Resource]
  F --> G[Nurture List]`,
  },
  {
    id: 'realestate', idx: 'E-09', sector: 'High-Ticket',
    title: 'Real Estate Global Listing Localizer',
    problem: 'One listing, five markets — manual translation loses cultural hooks that actually sell.',
    solution: 'Localizer ingests a listing, outputs 5 language variants with market-specific selling-point reordering.',
    stat: '5', unit: 'lang', statLbl: 'parallel outputs',
    tech: ['OpenAI','LangChain','Cultural DB','n8n'],
    mermaid: `flowchart LR
  A[EN Listing] --> B[Parse Features]
  B --> C[Cultural Engine]
  C --> D[UK: garden first]
  C --> E[ZA: security first]
  C --> F[DE: efficiency first]
  C --> G[FR: heritage first]
  C --> H[ES: lifestyle first]`,
  },
];


window.METRICS = {
  kpis: [
    { label: 'USING AI IN OPERATIONS',   value: '72',   unit: '%', source: 'McKinsey "State of AI" 2024 — % of organisations using AI in at least one business function' },
    { label: 'ANNUAL AI VALUE POTENTIAL', value: '$4.4', unit: 'T', source: 'McKinsey Global Institute — estimated annual economic value unlockable by AI across all sectors' },
    { label: 'FASTER TASK COMPLETION',    value: '56',   unit: '%', source: 'GitHub / Microsoft Research 2024 — productivity lift for AI-augmented knowledge workers' },
    { label: 'SERVICE COST REDUCTION',    value: '40',   unit: '%', source: 'McKinsey — average cost reduction in customer-facing operations from AI deployment' },
  ],
  outcomes: [
    { label: 'Enterprise Adoption',   short: 'Adoption',    value: 72 },
    { label: 'Work Automatable',      short: 'Automatable', value: 57 },
    { label: 'Query Self-Service',    short: 'Self-Service', value: 70 },
    { label: 'Task Speed Gain',       short: 'Speed Gain',  value: 56 },
    { label: 'Cost Reduction',        short: 'Cost Cut',    value: 40 },
  ],
  // % of organisations using AI in at least one business function — McKinsey State of AI annual survey
  // 2025–26 are Gartner projections (80%+ enterprises using GenAI APIs/apps by 2026)
  volume: [
    { month: '2017', v: 20 }, { month: '2018', v: 25 }, { month: '2019', v: 32 },
    { month: '2020', v: 35 }, { month: '2021', v: 46 }, { month: '2022', v: 50 },
    { month: '2023', v: 55 }, { month: '2024', v: 72 },
    { month: '2025', v: 82, forecast: true },
    { month: '2026', v: 89, forecast: true },
  ],
  source: 'McKinsey "State of AI" Annual Survey 2017–2024 · Gartner forecast 2025–26 · GitHub / Microsoft Research 2024',
};

window.TERMINAL_SCRIPT = [
  { t: 'prompt', s: '> what do you build?' },
  { t: 'out',    s: '  AI systems that run your operations — automatically.' },
  { t: 'ok',     s: '  [✓] customer intake & call handling' },
  { t: 'ok',     s: '  [✓] client rebook & retention flows' },
  { t: 'ok',     s: '  [✓] order-taking & kitchen dispatch' },
  { t: 'ok',     s: '  [✓] lead qualification & auto-booking' },
  { t: 'ok',     s: '  [✓] multilingual & multi-market systems' },

  { t: 'prompt', s: '> is it production-ready?' },
  { t: 'out',    s: '  yes — not a demo. every system ships with:' },
  { t: 'tag',    s: '  → repo on GitHub, version-controlled' },
  { t: 'tag',    s: '  → management dashboard + live logs' },
  { t: 'tag',    s: '  → error-handling & automatic retry' },
  { t: 'tag',    s: '  → 30-day support window post-deploy' },

  { t: 'prompt', s: '> how fast?' },
  { t: 'ok',     s: '  first live flow ships in week 1.' },
  { t: 'ok',     s: '  full system ready in 2 weeks.' },
  { t: 'tag',    s: '  scope-based pricing · no retainers.' },

  { t: 'prompt', s: '> ready_for_brief' },
];

window.PHILOSOPHY = [
  { num: '01', h: 'You See The Work First', p: 'You get a working prototype before any second meeting. The code is on GitHub, the dashboard is live — you can see exactly what\'s running before you sign anything off.' },
  { num: '02', h: 'It Doesn\'t Fail Quietly', p: 'Every system ships with automatic error recovery, a live management dashboard, and alert logic. If something breaks at 2am, it retries itself — and you see it in the logs.' },
  { num: '03', h: 'Built For Your Market', p: 'Systems are built around how your customers actually speak and buy — not a generic template. Whether that\'s a ZA township, a UK high street, or an EU compliance market.' },
];

window.TESTIMONIAL = {
  q: 'He didn\'t hand us a demo — he handed us a repo, a dashboard, and a system our dispatcher actually uses at 2am.',
  who: 'Ops Lead',
  company: 'Regional Towing Co. · Western Cape',
};

window.TESTIMONIALS = [
  {
    q: 'He didn\'t hand us a demo — he handed us a repo, a dashboard, and a system our dispatcher actually uses at 2am.',
    who: 'Ops Lead',
    company: 'Regional Towing Co. · Western Cape',
  },
  {
    q: 'The rebook system went live on a Thursday. By the weekend we had 12 clients re-book who hadn\'t been in for months. It paid for itself in week two.',
    who: 'Owner',
    company: 'MedSpa & Salon · Cape Town',
  },
  {
    q: 'Our Friday phone queue used to be chaos — missed orders, angry customers. Now the AI handles it end-to-end and it lands straight in the kitchen.',
    who: 'Floor Manager',
    company: 'Restaurant Group · Johannesburg',
  },
];

window.PROFILE = {
  primary: [
    { k: 'NAME', v: 'Revan Lombard' },
    { k: 'GITHUB', v: '@r4v3n-lmb' },
    { k: 'ROLE', v: 'AI Solutions Architect' },
    { k: 'LOCATION', v: 'Johannesburg, ZA' },
    { k: 'LANGUAGES', v: 'EN · AF' },
    { k: 'AVAILABILITY', v: '● Accepting briefs', tone: 'ok' },
  ],
  secondary: [
    { k: 'WHAT I BUILD', v: 'Calls · Orders · Retention · Leads' },
    { k: 'DELIVERS', v: 'System + Dashboard + Docs' },
    { k: 'SUPPORT', v: '30 days post-launch' },
    { k: 'PRICING', v: 'Scope-based · Quote in 48h' },
    { k: 'LIVE IN', v: '2 weeks' },
  ],
};

window.AI_IMPACT = {
  // McKinsey State of AI 2024 · Stanford AI Index 2025 · Forrester State of GenAI 2024
  adoption: [
    { sector: 'Technology',     pct: 78 },
    { sector: 'Manufacturing',  pct: 77 },
    { sector: 'Financial Svcs', pct: 69 },
    { sector: 'Government',     pct: 60 },
    { sector: 'Healthcare',     pct: 53 },
    { sector: 'Retail',         pct: 45 },
    { sector: 'Energy',         pct: 41 },
    { sector: 'Legal / Prof.',  pct: 38 },
  ],
  // McKinsey 2025 · GitHub/Microsoft Research 2024 · Gartner · IBM IBV 2024
  impact: [
    { label: 'Work Hours Automatable',    pct: 57, tag: 'of all work hours — McKinsey 2025'       },
    { label: 'Faster Task Completion',    pct: 56, tag: 'AI-augmented workers — GitHub/MSFT 2024' },
    { label: 'Query Self-Service',        pct: 70, tag: 'without human escalation — Gartner'      },
    { label: 'Service Cost Reduction',    pct: 40, tag: 'customer-facing ops — McKinsey'          },
    { label: 'Report Productivity Gains', pct: 66, tag: 'of orgs deploying AI — IBM IBV 2024'     },
  ],
  source: 'McKinsey "State of AI" 2024–25 · GitHub / Microsoft Research · Gartner · IBM IBV · Stanford HAI · Forrester',
};

window.CONTACT = [
  { k: 'Email',     v: 'r4v3n.lmb@gmail.com',                   href: 'mailto:r4v3n.lmb@gmail.com',              copy: 'r4v3n.lmb@gmail.com' },
  { k: 'Phone',     v: '+27 72 237 5833',                       href: 'tel:+27722375833',                        copy: '+27 72 237 5833' },
  { k: 'Book',      v: 'calendly.com/revan_lombard',              href: 'https://calendly.com/revan_lombard',      copy: 'https://calendly.com/revan_lombard' },
  { k: 'GitHub',    v: 'github.com/r4v3n-lmb',                  href: 'https://github.com/r4v3n-lmb',            copy: 'https://github.com/r4v3n-lmb' },
  { k: 'WhatsApp',  v: 'wa.me/27722375833',                     href: 'https://wa.me/27722375833',               copy: 'https://wa.me/27722375833' },
];
