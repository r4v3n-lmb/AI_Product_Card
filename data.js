// Tech stack
window.STACK = [
  { cat: '01 · Architectural Logic', lbl: 'Workflow Design', desc: 'Multi-branch logic, error-handling loops, solo-vs-fleet routing trees.', reveal: 'n8n · Mermaid · State Machines' },
  { cat: '02 · AI / LLM Layer', lbl: 'LLM Integration', desc: 'OpenAI, LangChain memory & tools, RAG pipelines, prompt engineering.', reveal: 'GPT-4 · Claude · Vector DBs' },
  { cat: '03 · Automation Engines', lbl: 'Orchestration', desc: 'Self-hosted n8n, Make.com, and Python scripting for custom runners.', reveal: 'n8n · Make · Python' },
  { cat: '04 · Global Scalability', lbl: 'Localization', desc: 'Multilingual NLP, multi-currency logic, cultural adaptation layers.', reveal: '5+ languages · ZA/UK/EU' },
  { cat: '05 · Infrastructure', lbl: 'Systems & APIs', desc: 'GitHub pipelines, FastAPI endpoints, version-controlled deployment.', reveal: 'GitHub Actions · FastAPI' },
  { cat: '06 · Observability', lbl: 'Dashboards', desc: 'Management dashboards with live run-logs, retry queues, alerting.', reveal: 'Grafana · Custom UIs' },
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


window.TERMINAL_SCRIPT = [
  { t: 'prompt', s: '> whoami' },
  { t: 'out',    s: 'revan.lombard :: ai-solutions-architect' },
  { t: 'prompt', s: '> load automation_stack.v4' },
  { t: 'out',    s: 'resolving modules...' },
  { t: 'ok',     s: '  [✓] n8n.self_hosted            OK' },
  { t: 'ok',     s: '  [✓] python.custom_runners      OK' },
  { t: 'ok',     s: '  [✓] openai.api_v1              OK' },
  { t: 'ok',     s: '  [✓] langchain.memory+tools     OK' },
  { t: 'ok',     s: '  [✓] rag.vector_store           OK' },
  { t: 'ok',     s: '  [✓] twilio.voice+sms           OK' },
  { t: 'ok',     s: '  [✓] fastapi.endpoints          OK' },
  { t: 'ok',     s: '  [✓] localization.multi_lang    OK' },
  { t: 'prompt', s: '> status --all' },
  { t: 'tag',    s: '  systems_online .............  5 / 5 ' },
  { t: 'tag',    s: '  avg_response_time .......... 420ms' },
  { t: 'tag',    s: '  uptime_30d ................. 99.94%' },
  { t: 'warn',   s: '  queue.depth ................ 3 jobs pending' },
  { t: 'prompt', s: '> ready_for_brief' },
];

window.PHILOSOPHY = [
  { num: '01', h: 'Build Over Talk', p: 'I ship version-controlled prototypes on GitHub. No theoretical slide decks — the repo is the pitch.' },
  { num: '02', h: 'Systems, Not Chatbots', p: 'Every deploy ships with error-handling loops, retry queues, and a management dashboard. Chatbots fail silently. Systems don\'t.' },
  { num: '03', h: 'Localization-First', p: 'A background in localization means the AI doesn\'t just translate — it operates with cultural and linguistic precision for each market.' },
];

window.TESTIMONIAL = {
  q: 'He didn\'t hand us a demo — he handed us a repo, a dashboard, and a system our dispatcher actually uses at 2am.',
  who: 'Ops Lead',
  company: 'Regional Towing Co. · Western Cape',
};

window.PROFILE = {
  primary: [
    { k: 'NAME', v: 'Revan Lombard' },
    { k: 'HANDLE', v: '@r4v3n-lmb' },
    { k: 'ROLE', v: 'AI Solutions Architect' },
    { k: 'LOCATION', v: 'Johannesburg, ZA' },
    { k: 'LANGUAGES', v: 'EN · AF' },
    { k: 'AVAILABILITY', v: '● Accepting briefs', tone: 'ok' },
  ],
  secondary: [
    { k: 'FOCUS', v: 'Localization · Ops · RAG' },
    { k: 'STACK', v: 'n8n · Python · OpenAI' },
    { k: 'LEAD TIME', v: '2-wk sprint cycle' },
  ],
};

window.CONTACT = [
  { k: 'Email',     v: 'r4v3n.lmb@gmail.com',                   href: 'mailto:r4v3n.lmb@gmail.com',              copy: 'r4v3n.lmb@gmail.com' },
  { k: 'Phone',     v: '+27 72 237 5833',                       href: 'tel:+27722375833',                        copy: '+27 72 237 5833' },
  { k: 'Book',      v: 'calendly.com/revan_lombard',              href: 'https://calendly.com/revan_lombard',      copy: 'https://calendly.com/revan_lombard' },
  { k: 'GitHub',    v: 'github.com/r4v3n-lmb',                  href: 'https://github.com/r4v3n-lmb',            copy: 'https://github.com/r4v3n-lmb' },
  { k: 'WhatsApp',  v: 'wa.me/27722375833',                     href: 'https://wa.me/27722375833',               copy: 'https://wa.me/27722375833' },
];
