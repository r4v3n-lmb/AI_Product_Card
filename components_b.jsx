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

  return (
    <div className="proof-grid">
      <div className="heatmap-wrap">
        <div className="heatmap-head">
          <div>
            <h4 className="serif">Contribution Activity</h4>
            <div className="faint" style={{fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', marginTop:4}}>52 weeks · {total} contributions</div>
          </div>
          <div style={{textAlign:'right'}}>
            <div className="serif" style={{fontSize:28, color:'var(--accent)', letterSpacing:'-0.02em'}}>{streak}<span style={{fontFamily:'JetBrains Mono', fontSize:11, color:'var(--ink-faint)', marginLeft:4, letterSpacing:'0.1em'}}>days</span></div>
            <div className="faint" style={{fontSize:10, letterSpacing:'0.16em', textTransform:'uppercase', marginTop:4}}>current streak</div>
          </div>
        </div>
        <div className="heatmap">
          {cells.map((l, i) => <div key={i} className="hcell" data-l={l}></div>)}
        </div>
        <div className="heatmap-footer">
          <span>Apr 2025</span>
          <div className="heatmap-legend">
            <span className="faint">less</span>
            <div className="hcell" data-l="0"></div>
            <div className="hcell" data-l="1"></div>
            <div className="hcell" data-l="2"></div>
            <div className="hcell" data-l="3"></div>
            <div className="hcell" data-l="4"></div>
            <span className="faint">more</span>
          </div>
          <span>Apr 2026</span>
        </div>
      </div>
      <div className="testimonial">
        <blockquote className="serif">{window.TESTIMONIAL.q}</blockquote>
        <div className="attr">
          <span>— {window.TESTIMONIAL.who}</span>
          <span className="faint">{window.TESTIMONIAL.company}</span>
        </div>
      </div>
    </div>
  );
}

/* ============ METRICS DASHBOARD ============ */
function KpiCard({ label, value, unit }) {
  return (
    <div className="kpi-card">
      <div className="kpi-value serif">{value}<span className="kpi-unit">{unit}</span></div>
      <div className="kpi-label">{label}</div>
    </div>
  );
}

function OutcomeChart({ data, visible }) {
  return (
    <div className="outcome-chart">
      {data.map((d, i) => (
        <div key={i} className="outcome-row">
          <div className="outcome-label">{d.label}</div>
          <div className="outcome-track">
            <div className="outcome-bar" style={{
              width: visible ? `${d.value}%` : '0%',
              transitionDelay: `${i * 130}ms`,
            }} />
          </div>
          <div className="outcome-val">{d.value}%</div>
        </div>
      ))}
    </div>
  );
}

function VolumeChart({ data }) {
  const W = 480, H = 190;
  const pad = { t: 20, r: 20, b: 34, l: 44 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;
  const CEIL = 1600;
  const x = i => pad.l + (i / (data.length - 1)) * pw;
  const y = v => pad.t + ph - (v / CEIL) * ph;
  const pts = data.map((d, i) => [x(i), y(d.v)]);
  const line = pts.map(([px, py], i) => `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(pad.t + ph).toFixed(1)} L${pad.l.toFixed(1)},${(pad.t + ph).toFixed(1)} Z`;
  const gridVals = [0, 400, 800, 1200, 1600];
  const xIdx = [0, 3, 6, 9, 11];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="volume-svg" preserveAspectRatio="xMidYMid meet">
      {gridVals.map(v => (
        <g key={v}>
          <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="var(--line)" strokeWidth="1" />
          <text x={pad.l - 5} y={y(v) + 4} fill="var(--ink-faint)" fontSize="8.5"
            textAnchor="end" fontFamily="JetBrains Mono, monospace">
            {v === 0 ? '0' : `${v / 1000}k`}
          </text>
        </g>
      ))}
      <path d={area} fill="rgba(122,184,212,0.07)" />
      <path d={line} fill="none" stroke="var(--blueprint)" strokeWidth="1.5" strokeLinejoin="round" />
      {pts.map(([px, py], i) => (
        <circle key={i} cx={px} cy={py} r="2.5" fill="var(--bg)" stroke="var(--blueprint)" strokeWidth="1.5" />
      ))}
      {xIdx.map(i => (
        <text key={i} x={x(i)} y={H - 6} fill="var(--ink-faint)" fontSize="8.5"
          textAnchor="middle" fontFamily="JetBrains Mono, monospace">{data[i].month}</text>
      ))}
    </svg>
  );
}

function MetricsDash() {
  const [visible, setVisible] = useState(false);
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
        {m.kpis.map((k, i) => <KpiCard key={i} {...k} />)}
      </div>
      <div className="metrics-charts">
        <div className="chart-panel">
          <div className="chart-label">BUILD OUTCOMES · PRECISION METRICS</div>
          <OutcomeChart data={m.outcomes} visible={visible} />
        </div>
        <div className="chart-panel">
          <div className="chart-label">WORKFLOW EXECUTION · 12-MONTH VOLUME</div>
          <VolumeChart data={m.volume} />
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CatalogCard, Elite10, Philosophy, ProofGrid, MermaidDiagram, MetricsDash });
