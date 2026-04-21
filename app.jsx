const { useState, useEffect, useRef } = React;

/* ============ CONTACT ============ */
function Contact() {
  const bookContact = (window.CONTACT || []).find(c => String(c.k).toLowerCase() === 'book');
  const bookUrl = bookContact?.href
    || (bookContact?.v ? `https://${String(bookContact.v).replace(/^https?:\/\//, '')}` : 'https://calendly.com/techmate-sa');

  const [copied, setCopied] = useState(null);
  const copy = (k, v) => {
    navigator.clipboard?.writeText(v);
    setCopied(k);
    setTimeout(() => setCopied(null), 1400);
  };
  return (
    <section className="contact" id="contact">
      <div>
        <h2 className="contact-lead serif">
          Let&apos;s build you a<br /><em>system that doesn&apos;t sleep.</em>
        </h2>
        <p className="dim" style={{marginTop:28, maxWidth:420, fontSize:13, lineHeight:1.7}}>
          Fastest way in: book a 20-min diagnostic on Calendly, or hit WhatsApp —
          I respond same day. Brief me on the friction, I&apos;ll come back with an architecture sketch.
        </p>
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
            <button className={`copy ${copied===c.k?'copied':''}`} onClick={() => copy(c.k, c.copy)}>
              {copied===c.k ? 'Copied' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ CHAT FLOATER ============ */
function ChatFloater() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { r: 'bot', t: 'Hi — I\'m Revan\'s intake agent. Ask me what he builds, pricing logic, or timelines.' },
  ]);
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
      setMsgs(prev => [...prev, { r: 'bot', t: `AI connection hiccup — try again, or reach Revan directly: ${fallbackContacts}.` }]);
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
          Talk to AI →
        </button>
      </div>
      <div className={`chat-float ${open ? 'open' : ''}`}>
        <div className="chat-head">
          <span><span className="pulse"></span>INTAKE AGENT · ONLINE</span>
          <button className="close" onClick={() => setOpen(false)}>✕ CLOSE</button>
        </div>
        <div className="chat-body" ref={bodyRef}>
          {msgs.map((m, i) => (
            <div key={i} className={`msg ${m.r}`}>{m.t}</div>
          ))}
          {thinking && <div className="msg bot typing">▌ thinking...</div>}
        </div>
        <div className="chat-suggests">
          {suggests.map(s => (
            <button key={s} className="chat-suggest" onClick={() => send(s)}>{s}</button>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about systems, pricing, timing..." />
          <button onClick={() => send()}>SEND</button>
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

/* ============ APP ============ */
function App() {
  return (
    <div className="frame">
      <div className="crosshair ch-tl"></div>
      <div className="crosshair ch-tr"></div>
      <div className="crosshair ch-bl"></div>
      <div className="crosshair ch-br"></div>

      <TopBar />

      <Hero />

      <section data-screen-label="02 Capabilities">
        <SectionLabel num="02" title="Capabilities Terminal · Tech Stack" coord="C-01 / D-08" />
        <div className="split">
          <Terminal />
          <StackGrid />
        </div>
      </section>

      <section data-screen-label="03 Build Catalog">
        <SectionLabel num="03" title="Build Catalog" coord="E-01 / J-12" />
        <Elite10 />
      </section>

      <section data-screen-label="04 Philosophy">
        <SectionLabel num="04" title="Builder's Philosophy" coord="K-01 / K-06" />
        <Philosophy />
      </section>

      <section data-screen-label="05 Proof">
        <SectionLabel num="05" title="Proof of Work · Field Signal" coord="L-01 / M-10" />
        <ProofGrid />
      </section>

      <section data-screen-label="06 Contact">
        <SectionLabel num="06" title="Engagement · Direct Channels" coord="N-01 / N-08" />
        <Contact />
      </section>

      <FooterBar />
      <ChatFloater />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
