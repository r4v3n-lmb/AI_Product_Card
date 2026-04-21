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
  const rev = `REV ${pad(time.getUTCMonth()+1)}.${String(time.getUTCFullYear()).slice(2)}`;
  return (
    <div className="topbar">
      <div className="left">
        <span><span className="pulse"></span>SYSTEMS ONLINE</span>
        <span className="faint coord">LAT −26.20 · LNG 28.04</span>
      </div>
      <div className="center up">
        <span>R. LOMBARD · SOLUTIONS ARCHITECT</span>
        <span className="faint mobile-coord">LAT −26.20 · LNG 28.04</span>
      </div>
      <div className="right">
        <span className="faint">{stamp}</span>
        <span>{rev}</span>
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
  const bookContact = (window.CONTACT || []).find(c => String(c.k).toLowerCase() === 'book');
  const bookUrl = bookContact?.href
    || (bookContact?.v ? `https://${String(bookContact.v).replace(/^https?:\/\//, '')}` : 'https://calendly.com/revan_lombard');

  const defaultProfile = {
    primary: [
      { k: 'NAME', v: 'Revan Lombard' },
      { k: 'HANDLE', v: '@r4v3n-lmb' },
      { k: 'ROLE', v: 'Solutions Architect' },
      { k: 'LOCATION', v: 'Johannesburg, ZA' },
      { k: 'LANGUAGES', v: 'EN · AF · +3' },
      { k: 'AVAILABILITY', v: '● Accepting briefs', tone: 'ok' },
    ],
    secondary: [
      { k: 'FOCUS', v: 'Localization · Ops · RAG' },
      { k: 'STACK', v: 'n8n · Python · OpenAI' },
      { k: 'LEAD TIME', v: '1-wk sprint cycle' },
    ],
  };
  const profile = window.PROFILE || defaultProfile;

  return (
    <section className="hero">
      <div className="hero-wrap">
        <div>
          <div className="eyebrow">AI Solutions Architect · Automation Systems · Johannesburg, ZA</div>
          <h1 className="serif">
            Digital <span className="underline">Nervous&nbsp;Systems</span>
            <br /><em>for real&nbsp;businesses.</em>
          </h1>
          <p className="sub">
            I design, build, and deploy <strong>autonomous workflows</strong> that replace manual admin with
            scalable AI. Specialising in <strong>localization</strong>, <strong>process automation</strong>, and
            <strong> system integrity</strong> — from single-operator SMBs to multi-branch fleets.
          </p>
          <div className="cta-row">
            <a className="btn primary" href={bookUrl} target="_blank" rel="noreferrer">
              Book a Demo <span className="arrow">→</span>
            </a>
            <a className="btn" href="https://github.com/r4v3n-lmb" target="_blank" rel="noreferrer">
              View GitHub <span className="arrow">→</span>
            </a>
            <button className="btn" onClick={() => window.dispatchEvent(new Event('open-chat'))}>
              Talk to the AI <span className="arrow">→</span>
            </button>
          </div>
          <div className="hero-avail">
            <span className="pulse"></span>
            <span>Available for new projects &nbsp;·&nbsp; 2-week sprint cycle</span>
          </div>
        </div>
        <div className="hero-aside">
          <button className="tour-trigger" onClick={() => window.dispatchEvent(new Event('start-tour'))}>
            Take The Tour <span className="arrow">→</span>
          </button>
          <aside className="hero-card">
            <div className="title">Identity / Profile</div>
            <dl>
              {profile.primary.map((item) => (
                <React.Fragment key={item.k}>
                  <dt>{item.k}</dt>
                  <dd style={item.tone === 'ok' ? { color: 'var(--ok)' } : undefined}>{item.v}</dd>
                </React.Fragment>
              ))}
            </dl>
            <div className="divider"></div>
            <dl>
              {profile.secondary.map((item) => (
                <React.Fragment key={item.k}>
                  <dt>{item.k}</dt>
                  <dd>{item.v}</dd>
                </React.Fragment>
              ))}
            </dl>
            <div className="hero-card-process">
              {['Brief', 'Build', 'Ship'].map((s, i, arr) => (
                <React.Fragment key={s}>
                  <div className="hero-card-step">
                    <span className="hero-card-step-num">0{i + 1}</span>
                    <span className="hero-card-step-lbl">{s}</span>
                  </div>
                  {i < arr.length - 1 && <span className="hero-card-step-arrow">→</span>}
                </React.Fragment>
              ))}
            </div>
          </aside>
        </div>
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
  const [replay, setReplay] = useState(0);

  useEffect(() => {
    setLines([]); setDone(false);
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
  }, [replay]);

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
        {done && <button className="replay-btn" onClick={() => setReplay(r => r+1)}>↺ REPLAY</button>}
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
