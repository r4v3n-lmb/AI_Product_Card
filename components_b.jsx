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

Object.assign(window, { CatalogCard, Elite10, Philosophy, ProofGrid, MermaidDiagram });
