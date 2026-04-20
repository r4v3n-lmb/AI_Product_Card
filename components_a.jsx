const { useState, useEffect, useRef, useMemo } = React;

/* ============ TOP BAR ============ */
function TopBar() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  const stamp = `${time.getUTCFullYear()}.${pad(time.getUTCMonth()+1)}.${pad(time.getUTCDate())} · ${pad(time.getUTCHours())}:${pad(time.getUTCMinutes())}:${pad(time.getUTCSeconds())} UTC`;
  return (
    <div className="topbar">
      <div className="left">
        <span><span className="pulse"></span>SYSTEMS ONLINE</span>
        <span className="faint">LAT −33.92 · LNG 18.42</span>
      </div>
      <div className="center up">R. LOMBARD · SOLUTIONS ARCHITECT</div>
      <div className="right">
        <span className="faint">{stamp}</span>
        <span>REV 04.26</span>
      </div>
    </div>
  );
}

/* ============ SECTION LABEL ============ */
function SectionLabel({ num, title, coord }) {
  return (
    <div className="section-label">
      <span className="tag">§ {num} · {title}</span>
      <span className="rule"></span>
      <span className="coord">{coord}</span>
    </div>
  );
}

/* ============ HERO ============ */
function Hero() {
  return (
    <section className="hero">
      <div className="hero-wrap">
        <div>
          <div className="eyebrow">AI Solutions Architect · Automation Systems · Cape Town, ZA</div>
          <h1 className="serif">
            Digital <span className="underline">Nervous&nbsp;Systems</span>
            <br /><em>for real businesses.</em>
          </h1>
          <p className="sub">
            I design, build, and deploy <strong>autonomous workflows</strong> that replace manual admin with
            scalable AI. Specialising in <strong>localization</strong>, <strong>process automation</strong>, and
            <strong> system integrity</strong> — from single-operator SMBs to multi-branch fleets.
          </p>
          <div className="cta-row">
            <a className="btn primary" href="https://github.com/r4v3n-lmb" target="_blank" rel="noreferrer">
              View GitHub <span className="arrow">→</span>
            </a>
            <a className="btn" href="https://calendly.com/techmate-sa" target="_blank" rel="noreferrer">
              Book a Demo <span className="arrow">→</span>
            </a>
            <button className="btn" onClick={() => window.dispatchEvent(new Event('open-chat'))}>
              Talk to the AI <span className="arrow">→</span>
            </button>
          </div>
        </div>
        <aside className="hero-card">
          <div className="title">Identity / Profile</div>
          <dl>
            <dt>NAME</dt>        <dd>Revan Lombard</dd>
            <dt>HANDLE</dt>      <dd>@r4v3n-lmb</dd>
            <dt>ROLE</dt>        <dd>Solutions Architect</dd>
            <dt>LOCATION</dt>    <dd>Cape Town, ZA</dd>
            <dt>LANGUAGES</dt>   <dd>EN · AF · +3</dd>
            <dt>AVAILABILITY</dt><dd style={{color:'var(--ok)'}}>● Accepting briefs</dd>
          </dl>
          <div className="divider"></div>
          <dl>
            <dt>FOCUS</dt>    <dd>Localization · Ops · RAG</dd>
            <dt>STACK</dt>    <dd>n8n · Python · OpenAI</dd>
            <dt>LEAD TIME</dt><dd>1-wk sprint cycle</dd>
          </dl>
        </aside>
      </div>
      <div className="dim-line">
        <span>⟨ A-01</span>
        <span>FIG. 001 · ARCHITECTURE OF OPERATIONS</span>
        <span>B-07 ⟩</span>
      </div>
    </section>
  );
}

/* ============ TERMINAL ============ */
function Terminal() {
  const [lines, setLines] = useState([]);
  const [done, setDone] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let timeouts = [];
    const script = window.TERMINAL_SCRIPT;
    let delay = 500;
    script.forEach((l, idx) => {
      const lineDelay = l.t === 'prompt' ? 500 : (l.t === 'ok' ? 180 : 260);
      delay += lineDelay;
      const id = setTimeout(() => {
        if (cancelled) return;
        setLines(prev => [...prev, l]);
        if (idx === script.length - 1) setDone(true);
      }, delay);
      timeouts.push(id);
    });
    return () => { cancelled = true; timeouts.forEach(clearTimeout); };
  }, []);

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [lines]);

  const render = (l, i) => {
    const last = i === lines.length - 1;
    let cls = '';
    if (l.t === 'ok') cls = 'ok';
    else if (l.t === 'warn') cls = 'warn';
    else if (l.t === 'tag') cls = 'tag2';
    else if (l.t === 'prompt') cls = 'prompt';
    return (
      <div key={i} className={`line ${cls}`}>
        {l.s}{last && !done && <span className="caret"></span>}
      </div>
    );
  };

  return (
    <div className="terminal">
      <div className="terminal-head">
        <div className="dots"><span></span><span></span><span></span></div>
        <span>zsh · revan@architect · ~/ops</span>
      </div>
      <div className="terminal-body" ref={bodyRef}>
        {lines.map(render)}
        {done && <div className="line prompt">&gt; <span className="caret"></span></div>}
      </div>
    </div>
  );
}

/* ============ STACK GRID ============ */
function StackGrid() {
  return (
    <div className="stack-grid">
      {window.STACK.map((s, i) => (
        <div key={i} className="stack-cell">
          <div className="cat">{s.cat}</div>
          <div className="lbl serif">{s.lbl}</div>
          <div className="desc">{s.desc}</div>
          <div className="reveal">→ {s.reveal}</div>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { TopBar, Hero, Terminal, StackGrid, SectionLabel });
