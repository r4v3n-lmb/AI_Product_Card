const { useState, useEffect, useRef } = React;

/* ============ CONTACT ============ */
function Contact() {
  const bookContact = (window.CONTACT || []).find(c => String(c.k).toLowerCase() === 'book');
  const bookUrl = bookContact?.href
    || (bookContact?.v ? `https://${String(bookContact.v).replace(/^https?:\/\//, '')}` : 'https://calendly.com/techmate-sa');

  return (
    <section className="contact" id="contact">
      <div>
        <h2 className="contact-lead serif">
          Let&apos;s build you a<br /><em>system that doesn&apos;t sleep.</em>
        </h2>
        <p className="dim" style={{marginTop:28, maxWidth:420, fontSize:13, lineHeight:1.7}}>
          Fastest way in: book a 20-min diagnostic on Calendly, or hit WhatsApp —
          I respond same day. Tell me what&apos;s slowing you down, I&apos;ll come back with an architecture sketch.
        </p>
        <div style={{marginTop:20, fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--blueprint)', display:'flex', gap:16, flexWrap:'wrap'}}>
          <span>Scope-based pricing</span>
          <span style={{color:'var(--ink-faint)'}}>·</span>
          <span>No retainers</span>
          <span style={{color:'var(--ink-faint)'}}>·</span>
          <span>Repo-delivered</span>
          <span style={{color:'var(--ink-faint)'}}>·</span>
          <span>Fixed quote within 48h</span>
        </div>
        <div className="cta-row">
          <a className="btn primary" href={bookUrl} target="_blank" rel="noreferrer">
            Book Diagnostic <span className="arrow">→</span>
          </a>
          <a className="btn" href="https://wa.me/27722375833" target="_blank" rel="noreferrer">
            WhatsApp <span className="arrow">→</span>
          </a>
        </div>
      </div>
      <div className="contact-panel">
        <div className="up dim" style={{fontSize:10, marginBottom:14}}>§ 06.1 · Direct Channels</div>
        {window.CONTACT.map(c => (
          <div key={c.k} className="contact-row">
            <span className="k">{c.k}</span>
            <a className="v" href={c.href} target="_blank" rel="noreferrer">{c.v}</a>
            <a className="copy" href={c.href} target="_blank" rel="noreferrer">Open →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ CHAT FLOATER ============ */
function ChatFloater() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(() => {
    try {
      const saved = sessionStorage.getItem('chat_msgs');
      return saved ? JSON.parse(saved) : [{ r: 'bot', t: 'Hi — I\'m Revan\'s intake agent. Ask me what he builds, pricing logic, or timelines.' }];
    } catch { return [{ r: 'bot', t: 'Hi — I\'m Revan\'s intake agent. Ask me what he builds, pricing logic, or timelines.' }]; }
  });
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const bodyRef = useRef(null);
  const bookContact = (window.CONTACT || []).find(c => String(c.k).toLowerCase() === 'book');
  const bookUrl = bookContact?.href
    || (bookContact?.v ? `https://${String(bookContact.v).replace(/^https?:\/\//, '')}` : 'https://calendly.com/techmate-sa');
  const bookDisplay = bookUrl.replace(/^https?:\/\//, '');
  const emailContact = (window.CONTACT || []).find(c => String(c.k).toLowerCase() === 'email');
  const phoneContact = (window.CONTACT || []).find(c => String(c.k).toLowerCase() === 'phone');
  const fallbackContacts = [emailContact?.copy, phoneContact?.copy].filter(Boolean).join(' · ');
  const presetReplies = {
    'What do you build?': 'I build autonomous ops systems: AI intake, dispatch, retention flows, ordering bots, and localization pipelines using n8n, Python, RAG, and API integrations.',
    'Pricing?': `Pricing scales with scope, integrations, and reliability requirements. Typical work starts with a focused sprint, then expands to managed rollout. Book a diagnostic at ${bookDisplay}.`,
    'How fast can you ship?': 'Most projects start with a 1-week sprint for architecture and first live flow. Production-ready rollouts usually take 2-6 weeks depending on integrations and edge cases.',
    'Show me a repo': 'You can review build style and architecture patterns on GitHub: github.com/r4v3n-lmb. If you want, I can point you to the closest project pattern for your use case.',
  };

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-chat', handler);
    return () => window.removeEventListener('open-chat', handler);
  }, []);

  useEffect(() => {
    try { sessionStorage.setItem('chat_msgs', JSON.stringify(msgs)); } catch {}
  }, [msgs]);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, thinking]);

  const getBotReply = async (sys, q) => {
    if (window.claude?.complete) {
      const reply = await window.claude.complete({
        messages: [{ role: 'user', content: `${sys}\n\nUser: ${q}` }]
      });
      return String(reply ?? '').trim();
    }

    if (window.AI_INTAKE_ENDPOINT) {
      const res = await fetch(window.AI_INTAKE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: sys, message: q }),
      });
      if (!res.ok) throw new Error(`endpoint_${res.status}`);
      const data = await res.json();
      return String(data.reply ?? data.message ?? '').trim();
    }

    throw new Error('ai_client_not_configured');
  };

  const send = async (txt) => {
    const q = (txt ?? input).trim();
    if (!q) return;
    setInput('');
    setMsgs(prev => [...prev, { r: 'user', t: q }]);

    if (presetReplies[q]) {
      setThinking(true);
      setTimeout(() => {
        setMsgs(prev => [...prev, { r: 'bot', t: presetReplies[q] }]);
        setThinking(false);
      }, 450);
      return;
    }

    setThinking(true);
    try {
      const sys = `You are Revan Lombard's intake agent on his portfolio site. Revan is an AI Solutions Architect based in Johannesburg, ZA. He builds autonomous systems (n8n, Python, OpenAI, RAG, Twilio, WhatsApp APIs) for SMBs — dispatch & fleet routing, salon retention, restaurant ordering, legal lead qualification, real-estate localization. Keep replies concise (under 60 words), direct, confident, slightly technical. If asked about pricing, say it scales with scope and invite them to book at ${bookDisplay}. If asked for contact, give email r4v3n.lmb@gmail.com. Never make up client names.`;
      const reply = await getBotReply(sys, q);
      setMsgs(prev => [...prev, { r: 'bot', t: reply.trim() }]);
    } catch (e) {
      const isOffline = !window.AI_INTAKE_ENDPOINT;
      setMsgs(prev => [...prev, { r: 'bot', t: isOffline ? `Agent offline — reach Revan directly: ${fallbackContacts}.` : `Couldn't connect — try again, or reach Revan directly: ${fallbackContacts}.` }]);
    } finally {
      setThinking(false);
    }
  };

  const suggests = ['What do you build?', 'Pricing?', 'How fast can you ship?', 'Show me a repo'];

  return (
    <>
      <div className="floater" style={{display: open ? 'none' : 'flex'}}>
        <a className="float-btn" href="https://wa.me/27722375833" target="_blank" rel="noreferrer">
          WhatsApp →
        </a>
        <button className="float-btn ghost" onClick={() => setOpen(true)}>
          <span className="pulse-ai"></span>Talk to AI →
        </button>
      </div>
      <div className={`chat-float ${open ? 'open' : ''}`}>
        <div className="chat-head">
          <div className="dots"><span></span><span></span><span></span></div>
          <span><span className="pulse"></span>INTAKE AGENT · ONLINE</span>
          <button className="close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="chat-body" ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`line ${m.r === 'bot' ? 'tag2' : 'prompt'}`}>
              {m.r === 'user' ? `> ${m.t}` : `  ${m.t}`}
            </div>
          ))}
          {thinking && <div className="line tag2">  ▌<span className="caret"></span></div>}
        </div>
        <div className="chat-suggests">
          {suggests.map(s => (
            <button key={s} className="chat-suggest" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
        <div className="chat-input">
          <span className="chat-prompt-sym">&gt;&nbsp;</span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="ask anything..."
            spellCheck={false}
            autoComplete="off" />
          <button onClick={() => send()}>↵</button>
        </div>
      </div>
    </>
  );
}

/* ============ FOOTER BAR ============ */
function FooterBar() {
  return (
    <div className="footer-bar">
      <span>© 2026 · R. LOMBARD</span>
      <div className="dots"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
      <span>BUILT, NOT BOUGHT</span>
    </div>
  );
}

/* ============ TOUR ============ */
const TOUR_STEPS = [
  { target: '.hero h1',      title: 'IDENT · 01',        pos: 'bottom', body: 'Revan Lombard — AI Solutions Architect, Johannesburg. I design and deploy autonomous ops systems for SMBs that need to run 24/7 without a human in the loop.' },
  { target: '.terminal',     title: 'STACK BOOT · 02',   pos: 'right',  body: 'Stack boot sequence. Every [✓] is a live module — n8n self-hosted, Python runners, OpenAI, LangChain, RAG vector store, Twilio, FastAPI. Not a demo stack.' },
  { target: '.stack-grid',   title: 'CAPABILITIES · 02', pos: 'left',   body: 'Six capability layers, each with a specific production role. Hover any cell to reveal the exact tools running underneath.' },
  { target: '#s03',          title: 'BUILD CATALOG · 03',pos: 'bottom', body: 'Five production systems across Logistics, Retention, High-Volume, and High-Ticket sectors. Click any card to expand the full flow diagram and tech stack.' },
  { target: '#s04',          title: 'PHILOSOPHY · 04',   pos: 'bottom', body: 'Three non-negotiable build principles: ship repos not decks, build observable systems not chatbots, localise by default.' },
  { target: '.metrics-dash', title: 'METRICS · 06',      pos: 'bottom', body: 'Live performance data across all deployed systems — outcome precision, AI response coverage, and 12-month execution volume, all grounded in real build stats.' },
  { target: '.heatmap-wrap', title: 'PROOF · 07',        pos: 'right',  body: '52 weeks of commit activity. The testimonials to the right are from live deployments — including a towing dispatcher running at 2am in the Western Cape.' },
  { target: '.contact',      title: 'ENGAGE · 08',       pos: 'top',    body: 'Fastest route in: WhatsApp or a 20-min diagnostic on Calendly. Tell me what\'s slowing you down — I\'ll return with an architecture sketch, not a proposal deck.' },
  { target: '.floater',      title: 'INTAKE AGENT',      pos: 'top',    body: 'The AI agent bottom-right is live. It knows the build catalog, pricing logic, and timelines. Use it to scope your project before booking a call.' },
];

function Tour() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const total = TOUR_STEPS.length;

  useEffect(() => {
    const handler = () => { setStep(0); setActive(true); };
    window.addEventListener('start-tour', handler);
    return () => window.removeEventListener('start-tour', handler);
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = document.querySelector(TOUR_STEPS[step].target);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const update = () => {
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const t = setTimeout(update, 550);
    window.addEventListener('scroll', update, { passive: true });
    return () => { clearTimeout(t); window.removeEventListener('scroll', update); };
  }, [step, active]);

  const close = () => { setActive(false); setRect(null); };
  const next  = () => step < total - 1 ? setStep(s => s + 1) : close();
  const prev  = () => setStep(s => s - 1);

  if (window.innerWidth < 900) return null;

  if (!active) return null;

  const { title, body, pos } = TOUR_STEPS[step];
  const PAD = 12; const TW = 340; const TH = 230; const GAP = 16;
  const vw = window.innerWidth; const vh = window.innerHeight;

  const spotStyle = rect ? {
    top:    rect.top  - PAD,
    left:   rect.left - PAD,
    width:  rect.width  + PAD * 2,
    height: rect.height + PAD * 2,
    boxShadow: '0 0 0 9999px rgba(7,9,11,0.88)',
  } : { top: -9999, left: -9999, width: 0, height: 0 };

  // Spotlight outer bounds (element + padding)
  const sb = rect ? {
    top:    rect.top    - PAD,
    left:   rect.left   - PAD,
    right:  rect.left   + rect.width  + PAD,
    bottom: rect.top    + rect.height + PAD,
  } : null;

  // Available clear space in each direction from the spotlight edge
  const space = sb ? {
    bottom: vh - sb.bottom - GAP,
    top:    sb.top         - GAP,
    right:  vw - sb.right  - GAP,
    left:   sb.left        - GAP,
  } : null;

  // Pick preferred direction; fall back to whichever side has the most room
  const needed = { bottom: TH, top: TH, right: TW, left: TW };
  const dir = (space && space[pos] >= needed[pos])
    ? pos
    : space ? Object.entries(space).sort((a, b) => b[1] - a[1])[0][0] : 'bottom';

  let tx = GAP, ty = GAP;
  if (sb) {
    if (dir === 'bottom') { ty = sb.bottom + GAP; tx = Math.max(GAP, Math.min(rect.left, vw - TW - GAP)); }
    else if (dir === 'top') { ty = sb.top - TH - GAP; tx = Math.max(GAP, Math.min(rect.left, vw - TW - GAP)); }
    else if (dir === 'right') { tx = sb.right + GAP; ty = Math.max(GAP, Math.min(rect.top, vh - TH - GAP)); }
    else { tx = sb.left - TW - GAP; ty = Math.max(GAP, Math.min(rect.top, vh - TH - GAP)); }
    // Final viewport clamp
    tx = Math.max(GAP, Math.min(tx, vw - TW - GAP));
    ty = Math.max(GAP, Math.min(ty, vh - TH - GAP));
  }

  return (
    <>
      <div className="tour-spotlight" style={spotStyle} />
      <div className="tour-tooltip" style={{ top: ty, left: tx }}>
        <div className="tour-header">
          <span className="tour-title">{title}</span>
          <button className="tour-close" onClick={close}>✕ SKIP</button>
        </div>
        <p className="tour-body">{body}</p>
        <div className="tour-footer">
          <div className="tour-progress">
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} className={`tour-pip ${i === step ? 'active' : ''}`} />
            ))}
          </div>
          <div className="tour-nav">
            {step > 0 && <button className="tour-btn-nav" onClick={prev}>← PREV</button>}
            <button className="tour-btn-nav primary" onClick={next}>
              {step < total - 1 ? 'NEXT →' : 'FINISH'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ============ SECTION NAV ============ */
function SectionNav() {
  const [active, setActive] = useState('');
  const ids = ['s01','s02','s03','s04','s-process','s05','s06','s07'];
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.25 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return (
    <nav className="section-nav">
      {ids.map(id => (
        <button key={id} className={`nav-dot ${active === id ? 'active' : ''}`}
          title={`§${id.slice(1)}`}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })} />
      ))}
    </nav>
  );
}

/* ============ SCROLL TOP ============ */
function ScrollTop() {
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const handler = () => setVis(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  if (!vis) return null;
  return <button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>;
}

/* ============ BOOT SCREEN ============ */
function BootScreen() {
  const [lines, setLines] = useState([]);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(() => !!sessionStorage.getItem('booted'));

  const script = [
    { t: 'tag',    s: 'REVAN.LOMBARD.OPS  ·  SYSTEM BOOT v4.0' },
    { t: 'out',    s: 'initialising interface...' },
    { t: 'ok',     s: '  [✓] identity profile      loaded' },
    { t: 'ok',     s: '  [✓] ops stack             online' },
    { t: 'ok',     s: '  [✓] intake agent          ready' },
    { t: 'ok',     s: '  [✓] build catalog         mounted' },
    { t: 'prompt', s: '> LAUNCHING INTERFACE' },
  ];

  useEffect(() => {
    if (gone) return;
    let delay = 300;
    script.forEach((l, idx) => {
      delay += l.t === 'prompt' ? 450 : l.t === 'ok' ? 160 : 240;
      setTimeout(() => {
        setLines(prev => [...prev, l]);
        if (idx === script.length - 1) {
          setTimeout(() => {
            setFading(true);
            setTimeout(() => { sessionStorage.setItem('booted', '1'); setGone(true); }, 700);
          }, 500);
        }
      }, delay);
    });
  }, []);

  if (gone) return null;
  return (
    <div className={`boot-screen${fading ? ' fade' : ''}`}>
      <div className="boot-terminal">
        {lines.map((l, i) => (
          <div key={i} className={`line${l.t === 'ok' ? ' ok' : l.t === 'tag' ? ' tag2' : l.t === 'prompt' ? ' prompt' : ''}`}>
            {l.s}
          </div>
        ))}
        {lines.length > 0 && !fading && <span className="caret"></span>}
      </div>
    </div>
  );
}

/* ============ APP ============ */
function App() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.06 }
    );
    document.querySelectorAll('.reveal-section').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
    <BootScreen />
    <div className="frame">
      <div className="crosshair ch-tl"></div>
      <div className="crosshair ch-tr"></div>
      <div className="crosshair ch-bl"></div>
      <div className="crosshair ch-br"></div>

      <TopBar />
      <Hero />

      <section id="s02" className="reveal-section" data-screen-label="02 Capabilities">
        <SectionLabel num="02" title="Capabilities Terminal · Tech Stack" coord="C-01 / D-08" />
        <div className="split">
          <Terminal />
          <StackGrid />
        </div>
      </section>

      <section id="s03" className="reveal-section" data-screen-label="03 Build Catalog">
        <SectionLabel num="03" title="Build Catalog" coord="E-01 / J-12" />
        <Elite10 />
      </section>

      <section id="s04" className="reveal-section" data-screen-label="04 Philosophy">
        <SectionLabel num="04" title="Builder's Philosophy" coord="K-01 / K-06" />
        <Philosophy />
      </section>

      <section id="s-process" className="reveal-section" data-screen-label="05 Process">
        <SectionLabel num="05" title="Process · How It Works" coord="K-07 / K-10" />
        <HowItWorks />
      </section>

      <section id="s05" className="reveal-section" data-screen-label="06 Metrics">
        <SectionLabel num="06" title="System Metrics · Performance Intelligence" coord="L-01 / L-14" />
        <MetricsDash />
      </section>

      <section id="s06" className="reveal-section" data-screen-label="07 Proof">
        <SectionLabel num="07" title="Proof of Work · Field Signal" coord="M-01 / M-10" />
        <ProofGrid />
      </section>

      <section id="s07" className="reveal-section" data-screen-label="08 Contact">
        <SectionLabel num="08" title="Engagement · Direct Channels" coord="N-01 / N-08" />
        <Contact />
      </section>

      <FooterBar />
      <ChatFloater />
      <Tour />
      <SectionNav />
      <ScrollTop />
    </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
