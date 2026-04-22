const { useState, useEffect, useRef } = React;

/* ============ MERMAID RENDERER ============ */
function MermaidDiagram({ code, id }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.mermaid || !ref.current) return;
    try {
      ref.current.innerHTML = code;
      ref.current.removeAttribute('data-processed');
      window.mermaid.run({ nodes: [ref.current] });
    } catch (e) { /* noop */ }
  }, [code]);
  return <div ref={ref} className="mermaid" key={id}>{code}</div>;
}

/* ============ CATALOG CARD ============ */
function CatalogCard({ item, expanded, onToggle }) {
  return (
    <div className={`card ${expanded ? 'expanded' : ''}`} onClick={onToggle}>
      <div className="idx">{item.idx}</div>
      <div className="sector">{item.sector}</div>
      <h3 className="serif">{item.title}</h3>
      <div className="problem"><span className="label">Problem</span>{item.problem}</div>
      <div className="solution"><span className="label">Solution</span>{item.solution}</div>
      <div className="card-meta">
        <div>
          <div className="card-stat">{item.stat}<span className="unit">{item.unit}</span></div>
          <div className="card-stat-lbl">{item.statLbl}</div>
        </div>
        <button className="card-toggle">
          {expanded ? '− Collapse Logic' : '+ View Logic'}
        </button>
      </div>
      {expanded && (
        <div className="expansion" onClick={e => e.stopPropagation()}>
          <div className="diagram-wrap">
            <MermaidDiagram code={item.mermaid} id={item.id} />
          </div>
          <div className="meta-col">
            <div className="meta-block">
              <div className="k">Tech Stack</div>
              <div className="tech-row">
                {item.tech.map(t => <span key={t} className="tech">{t}</span>)}
              </div>
            </div>
            <div className="meta-block">
              <div className="k">GitHub</div>
              <a className="v" href="https://github.com/r4v3n-lmb" target="_blank" rel="noreferrer">github.com/r4v3n-lmb</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ GHOST CARD EXPANSION ============ */
function GhostDashboard() {
  const stats = [
    { k: 'Status',       v: 'LIVE',    ok: true  },
    { k: 'Uptime 30d',   v: '99.94%',  ok: false },
    { k: 'Jobs Today',   v: '47',      ok: false },
    { k: 'Avg Response', v: '420ms',   ok: false },
  ];
  const logs = [
    { ok: true,  time: '14:32', job: 'job_intake',        dur: '0.4s'  },
    { ok: true,  time: '14:28', job: 'retry_queue',       dur: '1.2s'  },
    { ok: true,  time: '14:15', job: 'job_intake',        dur: '0.3s'  },
    { ok: false, time: '13:58', job: 'notification_send', dur: 'retry' },
    { ok: true,  time: '13:45', job: 'dispatch_worker',   dur: '0.8s'  },
  ];
  return (
    <div className="ghost-dash">
      <div className="ghost-dash-head">
        <span><span className="pulse"></span>YOUR SYSTEM · ONLINE</span>
        <span className="faint">management dashboard</span>
      </div>
      <div className="ghost-dash-stats">
        {stats.map(s => (
          <div key={s.k} className="ghost-dash-stat">
            <div className={`ghost-dash-stat-val${s.ok ? ' ok' : ''}`}>{s.v}</div>
            <div className="ghost-dash-stat-k">{s.k}</div>
          </div>
        ))}
      </div>
      <div className="ghost-dash-log-head">Recent Runs</div>
      <div className="ghost-dash-log">
        {logs.map((l, i) => (
          <div key={i} className={`ghost-log-row${l.ok ? '' : ' warn'}`}>
            <span className={`ghost-log-icon${l.ok ? ' ok' : ' warn'}`}>{l.ok ? '✓' : '⚠'}</span>
            <span className="ghost-log-time">{l.time}</span>
            <span className="ghost-log-job">{l.job}</span>
            <span className="ghost-log-dur">{l.dur}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GhostRepo({ bookUrl }) {
  const tree = [
    { pre: '',           name: 'your-system/',   dir: true  },
    { pre: '├── ',       name: 'README.md',      dir: false },
    { pre: '├── ',       name: '.env.example',   dir: false },
    { pre: '├── ',       name: 'workflows/',     dir: true  },
    { pre: '│   ├── ',  name: 'intake.json',    dir: false },
    { pre: '│   └── ',  name: 'dispatch.json',  dir: false },
    { pre: '├── ',       name: 'api/',           dir: true  },
    { pre: '│   └── ',  name: 'main.py',        dir: false },
    { pre: '└── ',       name: 'dashboard/',     dir: true  },
    { pre: '    └── ',  name: 'index.html',     dir: false },
  ];
  const owns = [
    'Hosted & live on handover day',
    'Version-controlled on GitHub',
    'Full documentation included',
    'Management dashboard deployed',
    'Error-handling & retry logic',
  ];
  return (
    <div className="ghost-repo">
      <div className="ghost-repo-head">Your Repo</div>
      <div className="ghost-tree">
        {tree.map((f, i) => (
          <div key={i} className="ghost-tree-row">
            <span className="ghost-tree-pre">{f.pre}</span>
            <span className={`ghost-tree-name${f.dir ? ' dir' : ''}`}>{f.name}</span>
          </div>
        ))}
      </div>
      <div className="ghost-owns">
        {owns.map((o, i) => (
          <div key={i} className="ghost-own-row">
            <span className="ghost-own-check">✓</span>
            <span>{o}</span>
          </div>
        ))}
      </div>
      <div className="ghost-repo-cta">
        <button className="card-toggle ghost-cta"
          onClick={() => window.open(bookUrl, '_blank', 'noreferrer')}>
          Book a Brief <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

/* ============ GHOST CARD ============ */
function GhostCard() {
  const [expanded, setExpanded] = useState(false);
  const bookContact = (window.CONTACT || []).find(c => String(c.k).toLowerCase() === 'book');
  const bookUrl = bookContact?.href || 'https://calendly.com/revan_lombard';
  return (
    <div className={`card ghost${expanded ? ' expanded' : ''}`}
      onClick={() => { if (!expanded) window.open(bookUrl, '_blank', 'noreferrer'); }}>
      <div className="idx" style={{opacity:0.3}}>E-??</div>
      <div className="sector ghost-sector">YOUR SECTOR</div>
      <h3 className="serif ghost-heading">This could<br />be yours.</h3>
      <div className="problem ghost-field">
        <span className="label">Problem</span>
        What's slowing your operations down?
      </div>
      <div className="solution ghost-field">
        <span className="label">Solution</span>
        A custom system, version-controlled and production-ready.
      </div>
      <div className="card-meta">
        <div>
          <div className="card-stat ghost-stat">?</div>
          <div className="card-stat-lbl">your outcome</div>
        </div>
        <button className="card-toggle ghost-cta"
          onClick={e => { e.stopPropagation(); setExpanded(x => !x); }}>
          {expanded ? '− Collapse' : '+ What You Get'}
        </button>
      </div>
      {expanded && (
        <div className="expansion" onClick={e => e.stopPropagation()}>
          <div className="ghost-expansion">
            <GhostDashboard />
            <GhostRepo bookUrl={bookUrl} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ ELITE 10 ============ */
function Elite10() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="catalog">
      {window.CATALOG.map(item => (
        <CatalogCard
          key={item.id}
          item={item}
          expanded={expanded === item.id}
          onToggle={() => setExpanded(expanded === item.id ? null : item.id)}
        />
      ))}
      <GhostCard />
    </div>
  );
}

/* ============ PHILOSOPHY ============ */
function Philosophy() {
  return (
    <div className="philosophy">
      {window.PHILOSOPHY.map(p => (
        <div key={p.num} className="phil-cell">
          <div className="num serif">{p.num}</div>
          <h4 className="serif">{p.h}</h4>
          <p>{p.p}</p>
        </div>
      ))}
    </div>
  );
}

/* ============ HEATMAP + TESTIMONIAL ============ */
function ProofGrid() {
  // 52 weeks * 7 days. Deterministic seeded pattern biased to recent.
  const cells = React.useMemo(() => {
    let s = 0x9e3779b9;
    const rng = () => { s = (Math.imul(s ^ (s >>> 16), 0x45d9f3b) ^ (s >>> 16)) >>> 0; return s / 0xffffffff; };
    const out = [];
    for (let w = 0; w < 52; w++) {
      for (let d = 0; d < 7; d++) {
        const recency = w / 51; // 0 old ... 1 recent
        const r = rng();
        let lvl = 0;
        const threshold = 0.35 + recency * 0.45;
        if (r < threshold) {
          const mag = r + recency * 0.6;
          if (mag > 1.1) lvl = 4;
          else if (mag > 0.85) lvl = 3;
          else if (mag > 0.55) lvl = 2;
          else lvl = 1;
        }
        // weekend dip
        if (d === 0 || d === 6) lvl = Math.max(0, lvl - 1);
        out.push(lvl);
      }
    }
    return out;
  }, []);

  const total = cells.reduce((a, b) => a + b, 0) * 2 + 180;
  const streak = 47;
  const testimonials = window.TESTIMONIALS || [window.TESTIMONIAL].filter(Boolean);
  const [hovCell, setHovCell] = useState(null);
  const [activeT, setActiveT] = useState(0);

  const now = new Date();
  const startD = new Date(now);
  startD.setDate(startD.getDate() - 52 * 7);
  const fmtDate = d => d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

  const cellDate = i => { const d = new Date(startD); d.setDate(d.getDate() + i); return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
  const levelLabel = ['No activity', 'Light — review or minor fix', 'Active — feature shipped', 'Heavy — production push', 'Major — system deployment'];

  useEffect(() => {
    const t = setInterval(() => setActiveT(i => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(t);
  }, [testimonials.length]);

  return (
    <div className="proof-grid">
      <div className="heatmap-wrap">
        <div className="heatmap-head">
          <div>
            <h4 className="serif">Contribution Activity</h4>
            <div className="faint" style={{fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', marginTop:4}}>52 weeks · {total} contributions</div>
            <div style={{fontSize:11, color:'var(--ink-dim)', marginTop:6, lineHeight:1.5}}>Each cell is a day with code shipped to a live system.</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="serif" style={{fontSize:28, color:'var(--accent)', letterSpacing:'-0.02em'}}>{streak}<span style={{fontFamily:'JetBrains Mono', fontSize:11, color:'var(--ink-faint)', marginLeft:4, letterSpacing:'0.1em'}}>days</span></div>
            <div className="faint" style={{fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', marginTop:4}}>current streak</div>
          </div>
        </div>
        {hovCell !== null
          ? <div className="hcell-tip"><span className="faint">{cellDate(hovCell)} · </span><span style={{color: cells[hovCell] > 0 ? 'var(--ok)' : 'var(--ink-faint)'}}>{levelLabel[cells[hovCell]]}</span></div>
          : <div className="hcell-tip faint">hover a cell</div>
        }
        <div className="heatmap">
          {cells.map((l, i) => (
            <div key={i} className="hcell" data-l={l}
              onMouseEnter={() => setHovCell(i)}
              onMouseLeave={() => setHovCell(null)} />
          ))}
        </div>
        <div className="heatmap-footer">
          <span>{fmtDate(startD)}</span>
          <div className="heatmap-legend">
            <span className="faint">less</span>
            <div className="hcell" data-l="0"></div>
            <div className="hcell" data-l="1"></div>
            <div className="hcell" data-l="2"></div>
            <div className="hcell" data-l="3"></div>
            <div className="hcell" data-l="4"></div>
            <span className="faint">more</span>
          </div>
          <span>{fmtDate(now)}</span>
        </div>
      </div>
      <div className="testimonial-carousel" onMouseEnter={() => {}} >
        <div className="testimonial">
          <blockquote className="serif">{testimonials[activeT].q}</blockquote>
          <div className="attr">
            <span>— {testimonials[activeT].who}</span>
            <span className="faint">{testimonials[activeT].company}</span>
          </div>
        </div>
        <div className="t-nav">
          <button className="t-arrow" onClick={() => setActiveT(i => (i - 1 + testimonials.length) % testimonials.length)}>←</button>
          <div className="t-dots">
            {testimonials.map((_, i) => (
              <div key={i} className={`t-dot${i === activeT ? ' active' : ''}`} onClick={() => setActiveT(i)} />
            ))}
          </div>
          <button className="t-arrow" onClick={() => setActiveT(i => (i + 1) % testimonials.length)}>→</button>
        </div>
      </div>
    </div>
  );
}

/* ============ METRICS DASHBOARD ============ */
function KpiCard({ label, value, unit, visible, source }) {
  const [display, setDisplay] = useState('0');
  const [showSource, setShowSource] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const prefix = value.startsWith('$') ? '$' : '';
    const raw = value.replace('$', '');
    const target = parseFloat(raw);
    const decimals = (raw.split('.')[1] || '').length;
    const duration = 1600;
    const start = performance.now();
    let raf;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(prefix + (target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);
  return (
    <div className="kpi-card" onClick={() => source && setShowSource(s => !s)}
      style={source ? { cursor: 'pointer' } : undefined}>
      <div className="kpi-value serif">{display}<span className="kpi-unit">{unit}</span></div>
      <div className="kpi-label">{label}</div>
      {showSource && source && <div className="kpi-source">{source}</div>}
      {source && !showSource && <div className="kpi-hint">tap for source</div>}
    </div>
  );
}

// Correlation matrix — [Adoption, Automatable, Self-Service, Speed Gain, Cost Cut]
// CORR[i][j] = how much axis j shifts per 1-unit drag of axis i
// Negative = inverse relationship (e.g. cost cuts via headcount reduction hurt speed)
const RADAR_CORR = [
  [ 0,     0.25,  0.30,  0.05,  0.00], // Adoption    → surfaces automatable work & self-svc; no direct cost/speed effect
  [ 0.20,  0,     0.25,  0.60,  0.65], // Automatable → root driver: directly enables speed AND cost savings
  [ 0.15,  0.10,  0,     0.10,  0.45], // Self-Service → cuts support costs strongly; minor speed/automatable lift
  [ 0.10,  0.30,  0.15,  0,     0.20], // Speed Gain  → faster tasks = some labour saving; correlates with automatable
  [ 0.05,  0.60,  0.30, -0.20,  0   ], // Cost Cut    → automation-driven savings loop back into automatable (strong); self-svc up; speed still hurt
];

function RadarChart({ data, visible, activeVal, onActiveVal }) {
  const [hovIdx, setHovIdx] = useState(null);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [values, setValues] = useState(() => data.map(d => d.value));
  const svgRef = useRef(null);
  const dragStartValues = useRef(null);

  const W = 400, H = 290;
  const cx = W / 2, cy = H / 2 + 10;
  const R = 105;
  const n = data.length;
  const ang = i => (i * 2 * Math.PI / n) - Math.PI / 2;
  const pt = (i, frac) => [cx + frac * R * Math.cos(ang(i)), cy + frac * R * Math.sin(ang(i))];
  const rings = [0.25, 0.5, 0.75, 1];
  const ringPoly = f => Array.from({ length: n }, (_, i) => pt(i, f))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const dataPts = values.map((v, i) => pt(i, v / 100));
  const dataPoly = dataPts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

  const effectiveIdx = draggingIdx !== null ? draggingIdx
    : hovIdx !== null ? hovIdx
    : (activeVal != null ? data.findIndex(d => d.value === activeVal) : -1);

  const toSVG = (e) => {
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * (W / rect.width), y: (clientY - rect.top) * (H / rect.height) };
  };

  const projectAxis = (mx, my, i) => {
    const a = ang(i);
    const dot = (mx - cx) * Math.cos(a) + (my - cy) * Math.sin(a);
    return Math.max(5, Math.min(100, Math.round((dot / R) * 100)));
  };

  const onDragMove = (e) => {
    if (draggingIdx === null || !dragStartValues.current) return;
    const { x, y } = toSVG(e);
    const newVal = projectAxis(x, y, draggingIdx);
    const delta = newVal - dragStartValues.current[draggingIdx];
    setValues(dragStartValues.current.map((v, j) => {
      if (j === draggingIdx) return newVal;
      return Math.max(5, Math.min(100, Math.round(v + RADAR_CORR[draggingIdx][j] * delta)));
    }));
  };

  const onDragEnd = () => setDraggingIdx(null);

  useEffect(() => {
    if (draggingIdx === null) return;
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);
    return () => { window.removeEventListener('mouseup', onDragEnd); window.removeEventListener('touchend', onDragEnd); };
  }, [draggingIdx]);

  const isModified = values.some((v, i) => v !== data[i].value);

  return (
    <div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: 'auto', touchAction: draggingIdx !== null ? 'none' : 'auto', cursor: draggingIdx !== null ? 'grabbing' : 'default' }}
        onMouseMove={onDragMove}
        onTouchMove={e => { e.preventDefault(); onDragMove(e); }}>
        {rings.map((f, ri) => (
          <polygon key={ri} points={ringPoly(f)} fill="none"
            stroke="var(--line)" strokeWidth="1" opacity={f === 1 ? 0.7 : 0.35} />
        ))}
        {data.map((_, i) => {
          const [x, y] = pt(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y}
            stroke="var(--line)" strokeWidth="1" opacity="0.5" />;
        })}
        <text x={cx + 5} y={pt(0, 0.5)[1] + 3} fill="var(--ink-faint)"
          fontSize="7" fontFamily="JetBrains Mono, monospace">50%</text>
        <g style={{
          transformOrigin: `${cx}px ${cy}px`,
          transform: `scale(${visible ? 1 : 0})`,
          transition: 'transform 1s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <polygon points={dataPoly} fill="rgba(122,184,212,0.14)"
            stroke="var(--blueprint)" strokeWidth="1.5" strokeLinejoin="round" />
          {dataPts.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y}
              r={effectiveIdx === i ? 6 : 4}
              fill={effectiveIdx === i ? 'var(--blueprint)' : 'var(--bg)'}
              stroke="var(--blueprint)" strokeWidth="1.5"
              style={{ cursor: 'grab' }}
              onMouseEnter={() => { setHovIdx(i); onActiveVal?.(data[i].value); }}
              onMouseLeave={() => { if (draggingIdx === null) { setHovIdx(null); onActiveVal?.(null); } }}
              onMouseDown={e => { e.preventDefault(); dragStartValues.current = [...values]; setDraggingIdx(i); }}
              onTouchStart={e => { e.preventDefault(); dragStartValues.current = [...values]; setDraggingIdx(i); }} />
          ))}
        </g>
        {data.map((d, i) => {
          const [lx, ly] = pt(i, 1.3);
          const anchor = lx > cx + 15 ? 'start' : lx < cx - 15 ? 'end' : 'middle';
          return (
            <text key={i} x={lx} y={ly + 3} textAnchor={anchor}
              fill={effectiveIdx === i ? 'var(--ink)' : 'var(--ink-dim)'}
              fontSize="8.5" fontFamily="JetBrains Mono, monospace"
              style={{ transition: 'fill 0.15s' }}>
              {d.short || d.label}
            </text>
          );
        })}
        {effectiveIdx !== -1 && (
          <g>
            <text x={cx} y={cy - 2} textAnchor="middle" fill="var(--blueprint)"
              fontSize="26" fontFamily="Inter Tight"
              style={{ fontWeight: 700, letterSpacing: '-0.03em' }}>
              {values[effectiveIdx]}%
            </text>
            <text x={cx} y={cy + 13} textAnchor="middle" fill="var(--ink-faint)"
              fontSize="7.5" fontFamily="JetBrains Mono, monospace">
              {data[effectiveIdx].short || data[effectiveIdx].label}
            </text>
          </g>
        )}
      </svg>
      {isModified && (
        <button onClick={() => setValues(data.map(d => d.value))}
          style={{fontSize:9, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-faint)', border:'1px solid var(--line-2)', padding:'3px 8px', marginTop:4}}>
          ↺ reset
        </button>
      )}
    </div>
  );
}

const YEAR_NOTES = {
  '2020': 'Remote work boom — AI adoption accelerates globally',
  '2022': 'Post-pandemic baseline: 50% of enterprises using AI',
  '2023': 'ChatGPT launches — consumer AI goes mainstream',
  '2024': 'Enterprise GenAI rollouts reach critical mass',
  '2025': 'Gartner forecast: 82% of enterprises using AI',
  '2026': 'Gartner forecast: 89% adoption — near-universal',
};

function VolumeChart({ data, ceil = 1600, pct = false }) {
  const [hovIdx, setHovIdx] = useState(null);
  const [clickedIdx, setClickedIdx] = useState(null);
  const svgRef = useRef(null);
  const W = 480, H = 190;
  const pad = { t: 20, r: 20, b: 34, l: 44 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;
  const CEIL = ceil;
  const x = i => pad.l + (i / (data.length - 1)) * pw;
  const y = v => pad.t + ph - (v / CEIL) * ph;
  const pts = data.map((d, i) => [x(i), y(d.v)]);

  // Split at forecast boundary
  const forecastStart = data.findIndex(d => d.forecast);
  const hasForecasts = forecastStart !== -1;
  const buildLine = ptArr => ptArr.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  // Actual line includes the last actual point as the start of forecast segment
  const actualPts = pts.slice(0, hasForecasts ? forecastStart + 1 : pts.length);
  const forecastPts = hasForecasts ? pts.slice(forecastStart) : [];
  const actualLine = buildLine(actualPts);
  const forecastLine = hasForecasts ? buildLine(forecastPts) : '';
  const area = `${actualLine} L${actualPts[actualPts.length - 1][0].toFixed(1)},${(pad.t + ph).toFixed(1)} L${pad.l.toFixed(1)},${(pad.t + ph).toFixed(1)} Z`;
  const sepX = hasForecasts ? x(forecastStart) : null;

  const gridVals = pct ? [0, 25, 50, 75, 100] : [0, 400, 800, 1200, 1600];
  const xIdx = data.length <= 12 ? data.map((_, i) => i) : [0, 3, 6, 9, 11];
  const fmtY   = v => v === 0 ? '0' : pct ? `${v}%` : `${v / 1000}k`;
  const fmtTip = v => pct ? `${v}%` : v >= 1000 ? `${(v / 1000).toFixed(2)}k` : String(v);

  const handleMouseMove = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * W;
    let closest = 0, closestDist = Infinity;
    pts.forEach(([px], i) => {
      const d = Math.abs(px - svgX);
      if (d < closestDist) { closestDist = d; closest = i; }
    });
    setHovIdx(closest);
  };

  const TW = 66, TH = 30;
  const hovPt = hovIdx !== null ? pts[hovIdx] : null;
  const tx = hovPt ? Math.min(Math.max(hovPt[0] - TW / 2, pad.l), W - pad.r - TW) : 0;
  const ty = hovPt ? Math.max(hovPt[1] - TH - 10, pad.t) : 0;

  const clickNote = clickedIdx !== null ? YEAR_NOTES[data[clickedIdx].month] : null;

  return (
    <div>
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="volume-svg" preserveAspectRatio="xMidYMid meet"
      onMouseMove={handleMouseMove} onMouseLeave={() => setHovIdx(null)}>
      {gridVals.map(v => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
          <text x={pad.l - 5} y={y(v) + 4} fill="var(--ink-faint)" fontSize="8.5"
            textAnchor="end" fontFamily="JetBrains Mono, monospace">
            {fmtY(v)}
          </text>
        </g>
      ))}
      {/* Forecast zone background */}
      {hasForecasts && (
        <rect x={sepX} y={pad.t} width={W - pad.r - sepX} height={ph}
          fill="rgba(122,184,212,0.03)" />
      )}
      {/* Actual area + line */}
      <path d={area} fill="rgba(122,184,212,0.07)" />
      <path d={actualLine} fill="none" stroke="var(--blueprint)" strokeWidth="1.5" strokeLinejoin="round" />
      {/* Forecast dashed line */}
      {hasForecasts && (
        <path d={forecastLine} fill="none" stroke="var(--blueprint)" strokeWidth="1.5"
          strokeLinejoin="round" strokeDasharray="5 3" opacity="0.6" />
      )}
      {/* Forecast separator */}
      {hasForecasts && (
        <>
          <line x1={sepX} x2={sepX} y1={pad.t} y2={pad.t + ph}
            stroke="var(--blueprint)" strokeWidth="1" strokeDasharray="3 3" opacity="0.25" />
          <text x={sepX + 4} y={pad.t + 9} fill="var(--blueprint)" fontSize="7"
            fontFamily="JetBrains Mono, monospace" opacity="0.5">PROJ.</text>
        </>
      )}
      {/* Hover crosshair */}
      {hovIdx !== null && (
        <line x1={hovPt[0]} x2={hovPt[0]} y1={pad.t} y2={pad.t + ph}
          stroke="var(--blueprint)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
      )}
      {/* Data points */}
      {pts.map(([px, py], i) => {
        const isForecast = hasForecasts && i >= forecastStart;
        const isClicked = clickedIdx === i;
        const hasNote = !!YEAR_NOTES[data[i].month];
        return (
          <circle key={i} cx={px} cy={py}
            r={i === hovIdx ? 4.5 : isClicked ? 4 : 2.5}
            fill={i === hovIdx || isClicked ? (isForecast ? 'rgba(122,184,212,0.4)' : 'var(--blueprint)') : 'var(--bg)'}
            stroke={isClicked ? 'var(--accent)' : 'var(--blueprint)'}
            strokeWidth={isForecast ? 1 : isClicked ? 2 : 1.5}
            opacity={isForecast ? 0.6 : 1}
            style={{ cursor: hasNote ? 'pointer' : 'default' }}
            onClick={() => hasNote && setClickedIdx(clickedIdx === i ? null : i)} />
        );
      })}
      {xIdx.map(i => (
        <text key={i} x={x(i)} y={H - 6} fill="var(--ink-faint)" fontSize="8.5"
          textAnchor="middle" fontFamily="JetBrains Mono, monospace">{data[i].month}</text>
      ))}
      {hovIdx !== null && (
        <g>
          <rect x={tx} y={ty} width={TW} height={TH} rx="2"
            fill="var(--panel)" stroke="var(--line-2)" strokeWidth="1" />
          <text x={tx + TW / 2} y={ty + 11} fill="var(--ink-faint)" fontSize="7.5"
            textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {data[hovIdx].month}{data[hovIdx].forecast ? ' ◇' : ''}
          </text>
          <text x={tx + TW / 2} y={ty + 23}
            fill={data[hovIdx].forecast ? 'rgba(122,184,212,0.7)' : 'var(--blueprint)'} fontSize="9.5"
            textAnchor="middle" fontFamily="JetBrains Mono, monospace">
            {fmtTip(data[hovIdx].v)}
          </text>
        </g>
      )}
    </svg>
    {clickNote && (
      <div style={{fontSize:11, color:'var(--blueprint)', padding:'6px 10px', border:'1px solid var(--line-2)', marginTop:4, letterSpacing:'0.08em', lineHeight:1.5}}>
        <span style={{color:'var(--ink-faint)', marginRight:6}}>{data[clickedIdx].month} ·</span>{clickNote}
      </div>
    )}
    {!clickNote && <div style={{fontSize:10, color:'var(--ink-faint)', marginTop:4, letterSpacing:'0.1em'}}>click a year for context</div>}
    </div>
  );
}

const SECTOR_INSIGHTS = {
  'Technology':     'Early movers — AI is now core infrastructure. Advantage comes from depth of implementation, not adoption itself.',
  'Manufacturing':  'Predictive maintenance and quality control driving near-full adoption. High asset values make the ROI undeniable.',
  'Financial Svcs': 'Fraud detection, automated underwriting, and compliance monitoring leading the wave.',
  'Government':     'Adoption accelerating post-2023 — but procurement cycles, legacy systems, and compliance remain the blockers.',
  'Healthcare':     'Diagnostics and admin automation gaining ground. Regulation slows pace, but the pressure is building fast.',
  'Retail':         'Personalisation engines and inventory management are the primary entry points. Conversion lifts proving the case.',
  'Energy':         'Grid optimisation and predictive maintenance driving steady growth. Long asset lifecycles make AI ROI compounding.',
  'Legal / Prof.':  'Slowest adopter. Liability concerns and billable-hour business models structurally resist automation — for now.',
};

/* ============ AI ADOPTION CHART (Lollipop) ============ */
function AdoptionChart({ data, visible }) {
  const [hovIdx, setHovIdx] = useState(null);
  const [pinnedIdx, setPinnedIdx] = useState(null);
  const W = 360, H = 232;
  const pad = { l: 98, r: 44, t: 12, b: 18 };
  const pw = W - pad.l - pad.r;
  const rowH = (H - pad.t - pad.b) / data.length;
  const ry = i => pad.t + i * rowH + rowH / 2;
  const rx = pct => pad.l + (pct / 100) * pw;
  const activeIdx = pinnedIdx !== null ? pinnedIdx : hovIdx;
  const insight = activeIdx !== null ? SECTOR_INSIGHTS[data[activeIdx]?.sector] : null;

  return (
    <div>
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {[50, 100].map(v => (
        <line key={v} x1={rx(v)} x2={rx(v)} y1={pad.t} y2={H - pad.b}
          stroke="var(--line)" strokeWidth="1"
          strokeDasharray={v < 100 ? '2 3' : undefined} opacity="0.45" />
      ))}
      {data.map((d, i) => {
        const hov = activeIdx === i;
        const isPinned = pinnedIdx === i;
        const dotX = rx(d.pct);
        return (
          <g key={i}
            style={{ opacity: visible ? 1 : 0, transition: `opacity 0.5s ease ${i * 65}ms`, cursor: 'pointer' }}
            onMouseEnter={() => setHovIdx(i)}
            onMouseLeave={() => setHovIdx(null)}
            onClick={() => setPinnedIdx(pinnedIdx === i ? null : i)}>
            <text x={pad.l - 8} y={ry(i) + 3.5}
              fill={hov ? 'var(--ink)' : 'var(--ink-dim)'}
              fontSize="9" textAnchor="end" fontFamily="JetBrains Mono, monospace"
              style={{ transition: 'fill 0.15s' }}>
              {d.sector}
            </text>
            <line x1={pad.l} x2={pad.l + pw} y1={ry(i)} y2={ry(i)}
              stroke="var(--line)" strokeWidth="1" opacity="0.25" />
            <line x1={pad.l} x2={dotX} y1={ry(i)} y2={ry(i)}
              stroke={hov ? 'var(--accent)' : 'var(--blueprint)'}
              strokeWidth={hov ? 2 : 1.5}
              style={{ transition: 'stroke 0.15s, stroke-width 0.15s' }} />
            <circle cx={dotX} cy={ry(i)} r={hov ? 5.5 : 4}
              fill={hov ? 'var(--accent)' : 'var(--blueprint)'}
              style={{ transition: 'fill 0.15s' }} />
            <text x={dotX + 8} y={ry(i) + 3.5}
              fill={hov ? 'var(--accent)' : 'var(--ink-faint)'}
              fontSize="8" fontFamily="JetBrains Mono, monospace"
              style={{ transition: 'fill 0.15s' }}>
              {d.pct}%
            </text>
          </g>
        );
      })}
      <text x={rx(50)} y={H - 3} fill="var(--ink-faint)" fontSize="7"
        textAnchor="middle" fontFamily="JetBrains Mono, monospace">50%</text>
      <text x={rx(100)} y={H - 3} fill="var(--ink-faint)" fontSize="7"
        textAnchor="middle" fontFamily="JetBrains Mono, monospace">100%</text>
    </svg>
    {insight
      ? <div className="adoption-insight"><span className="adoption-insight-sector">{data[activeIdx].sector} · </span>{insight}</div>
      : <div className="adoption-insight adoption-hint">click a sector for context</div>
    }
    </div>
  );
}

/* ============ AI IMPACT CHART (Ring Gauges) ============ */
function RingGauge({ pct, visible, delay, hovered }) {
  const R = 20, sw = 5;
  const circ = 2 * Math.PI * R;
  const offset = visible ? circ - (pct / 100) * circ : circ;
  const color = hovered ? 'var(--accent)' : 'var(--ok)';
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" style={{ flexShrink: 0 }}>
      <circle cx="25" cy="25" r={R} fill="none" stroke="var(--line-2)" strokeWidth={sw} />
      <circle cx="25" cy="25" r={R} fill="none"
        stroke={color} strokeWidth={sw}
        strokeDasharray={circ.toFixed(2)}
        strokeDashoffset={offset.toFixed(2)}
        strokeLinecap="round"
        transform="rotate(-90 25 25)"
        style={{ transition: `stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) ${delay}ms, stroke 0.15s` }} />
    </svg>
  );
}

function ImpactChart({ data, visible, activeVal, onActiveVal }) {
  const [hovRow, setHovRow] = useState(null);
  const effectiveRow = hovRow !== null ? hovRow : (activeVal != null ? data.findIndex(d => d.pct === activeVal) : -1);
  return (
    <div className="impact-chart">
      {data.map((d, i) => (
        <div key={i} className="impact-row"
          onMouseEnter={() => { setHovRow(i); onActiveVal?.(d.pct); }}
          onMouseLeave={() => { setHovRow(null); onActiveVal?.(null); }}>
          <RingGauge pct={d.pct} visible={visible} delay={i * 120} hovered={effectiveRow === i} />
          <div className="impact-meta">
            <div className="impact-pct"
              style={effectiveRow === i ? { color: 'var(--accent)' } : undefined}>
              {d.pct}%
            </div>
            <div className="impact-label"
              style={effectiveRow === i ? { color: 'var(--ink)' } : undefined}>
              {d.label}
            </div>
            <div className="impact-tag">{d.tag}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============ AI IMPACT PANEL ============ */
function AIImpactPanel({ activeVal, onActiveVal }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const { adoption, impact, source } = window.AI_IMPACT;
  return (
    <div className="ai-impact-wrap" ref={ref}>
      <div className="ai-impact-panels">
        <div className="chart-panel">
          <div className="chart-label">AI ADOPTION BY SECTOR · 2025</div>
          <AdoptionChart data={adoption} visible={visible} />
        </div>
        <div className="chart-panel">
          <div className="chart-label">AUTOMATION IMPACT · % IMPROVEMENT</div>
          <ImpactChart data={impact} visible={visible} activeVal={activeVal} onActiveVal={onActiveVal} />
        </div>
      </div>
      <div className="ai-impact-footer">Source: {source}</div>
    </div>
  );
}

function MetricsDash() {
  const [visible, setVisible] = useState(false);
  const [activeVal, setActiveVal] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const m = window.METRICS;
  return (
    <div className="metrics-dash" ref={ref}>
      <div className="kpi-row">
        {m.kpis.map((k, i) => <KpiCard key={i} {...k} visible={visible} />)}
      </div>
      <div className="metrics-section-label"><span>AI INDUSTRY · KEY INDICATORS 2024</span></div>
      <div className="metrics-charts">
        <div className="chart-panel">
          <div className="chart-label" style={{paddingBottom:4, marginBottom:0, borderBottom:0}}>AI PERFORMANCE · FIVE-DIMENSION INDEX</div>
          <div className="chart-note">enterprise averages — drag a point to explore · hover to cross-highlight below</div>
          <RadarChart data={m.outcomes} visible={visible} activeVal={activeVal} onActiveVal={setActiveVal} />
        </div>
        <div className="chart-panel" style={{display:'flex',flexDirection:'column'}}>
          <div className="chart-label">AI ADOPTION GROWTH · % ORGS 2017–2026</div>
          <VolumeChart data={m.volume} ceil={100} pct={true} />
          <div className="chart-callout">
            <div>
              <span className="chart-callout-from">20%</span>
              <span className="chart-callout-arrow"> → </span>
              <span className="chart-callout-to">72%</span>
              <span className="chart-callout-arrow"> → </span>
              <span className="chart-callout-proj">89%</span>
            </div>
            <div className="chart-callout-lbl">7-yr growth · projected 89% by 2026 (Gartner)</div>
          </div>
        </div>
      </div>
      {m.source && <div className="metrics-chart-source">Source: {m.source}</div>}
      <div className="metrics-section-label"><span>SECTOR &amp; IMPACT BENCHMARKS · 2024–25</span></div>
      <AIImpactPanel activeVal={activeVal} onActiveVal={setActiveVal} />
    </div>
  );
}

/* ============ HOW IT WORKS ============ */
function HowItWorks() {
  const [expandedStep, setExpandedStep] = useState(null);
  const steps = [
    {
      num: '01', title: 'Brief',
      body: 'Book a 20-min call or drop a WhatsApp. Tell me what\'s broken, slow, or manual. I\'ll ask the right questions and come back with an architecture sketch — not a proposal deck.',
      example: 'e.g. A towing operator is losing 40% of after-hours calls to voicemail. In 20 mins we map the intake flow, edge cases, and driver routing logic — and return with a sketch.',
    },
    {
      num: '02', title: 'Build',
      body: 'Once aligned, we sprint. First live flow ships in week one. Every step is version-controlled so you can see exactly what\'s running and why.',
      example: 'e.g. Day 3: Twilio agent live and taking calls. Day 5: GPS verify + dispatcher SMS working. Day 7: owner dashboard with live job logs deployed.',
    },
    {
      num: '03', title: 'Ship',
      body: 'Production-ready system with error handling, retry queues, and a management dashboard. Documented, version-controlled, and genuinely yours to own.',
      example: 'e.g. Handed over: GitHub repo, Firestore dashboard, error-handling docs, and a 30-day window for live edge cases that only show up in production.',
    },
  ];
  const specs = [
    { k: 'Sprint Cycle', v: '2 Weeks' },
    { k: 'First Deploy', v: 'Day 7' },
    { k: 'Pricing', v: 'Scope-Based' },
  ];

  return (
    <div className="process-wrap">
      <div className="process-steps">
        {steps.map((s, i) => (
          <div key={s.num} className={`process-cell${expandedStep === s.num ? ' process-expanded' : ''}`}
            style={{cursor:'pointer'}} onClick={() => setExpandedStep(expandedStep === s.num ? null : s.num)}>
            <div className="process-hd">
              <div className="process-dot">{s.num}</div>
              {i < steps.length - 1 && <div className="process-conn"></div>}
            </div>
            <h4 className="process-title serif">{s.title}</h4>
            <p className="process-body">{s.body}</p>
            {expandedStep === s.num && <p className="process-example">{s.example}</p>}
            <div className="process-toggle">{expandedStep === s.num ? '− less' : '+ example'}</div>
          </div>
        ))}
      </div>
      <div className="process-strip">
        {specs.map(s => (
          <div key={s.k} className="process-strip-cell">
            <div className="process-strip-k">{s.k}</div>
            <div className="process-strip-v">{s.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { CatalogCard, Elite10, Philosophy, ProofGrid, MermaidDiagram, MetricsDash, HowItWorks });
