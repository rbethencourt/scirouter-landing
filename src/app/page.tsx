"use client";
import { useState, useEffect, useRef } from "react";

/* ── Design tokens ── */
const bg = { page: "#020405", card: "#080c14", border: "#111d2a" };
const clr = { cyan: "#22d3ee", green: "#06d6a0", purple: "#a78bfa", amber: "#f59e0b", text: "#f0f4fa", muted: "#5a7590", dim: "#3d5570", faint: "#2d4050", rule: "#0a1018", darkBg: "#030507" };
const ff = { head: "'Outfit', sans-serif", code: "'Fira Code', monospace", body: "'DM Sans', sans-serif" };

/* ── Typing animation code ── */
const codeStr = `import scirouter

# Fold a protein in one line
structure = scirouter.proteins.fold(
    "MVLSPADKTNVKAAWGKVGAHAGEYGAEAL",
    engine="esmfold"
)
print(structure.avg_plddt)  # → 87.3
print(structure.pdb[:50])   # → ATOM  1  N...`;

/* ── Counter hook ── */
function useCounter(end: number, duration: number, inView: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(id); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(id);
  }, [inView, end, duration]);
  return val;
}

/* ── Model data ── */
const models = [
  { icon: "🧬", name: "ESMFold", task: "Protein Structure Prediction", tag: "GPU", tagColor: clr.cyan, desc: "Predict 3D protein structures from amino acid sequences. No MSA needed. Results in ~14 seconds.", api: "proteins.fold()", credits: "5-15 credits" },
  { icon: "🔬", name: "Boltz-2", task: "Biomolecular Complexes", tag: "GPU", tagColor: clr.purple, desc: "Predict protein-ligand-nucleic acid complex structures. Open-source AlphaFold3 alternative.", api: "proteins.complex()", credits: "20-30 credits" },
  { icon: "⚗️", name: "DiffDock", task: "ML Molecular Docking", tag: "GPU", tagColor: clr.amber, desc: "State-of-the-art ML-based molecular docking. Predict binding poses and affinity scores.", api: "docking.diffdock()", credits: "10 credits" },
  { icon: "📊", name: "RDKit", task: "Molecular Properties", tag: "CPU", tagColor: clr.green, desc: "Calculate molecular weight, LogP, TPSA, drug-likeness, fingerprints, and 20+ descriptors.", api: "chemistry.properties()", credits: "1 credit" },
  { icon: "💊", name: "ADMETlab", task: "ADME/Tox Prediction", tag: "CPU", tagColor: clr.green, desc: "Predict absorption, distribution, metabolism, excretion, and toxicity for drug candidates.", api: "pharma.adme()", credits: "2 credits" },
  { icon: "🎯", name: "AutoDock Vina", task: "Classical Docking", tag: "CPU", tagColor: clr.green, desc: "Gold-standard physics-based docking. Validate ML results with established methodology.", api: "docking.vina()", credits: "5 credits" },
];

/* ── Pipeline data ── */
const pipeline = [
  { n: 1, label: "Fold", color: clr.green, desc: "Predict target structure", time: "~14s" },
  { n: 2, label: "Dock", color: clr.cyan, desc: "Score binding affinity", time: "~20s" },
  { n: 3, label: "Filter", color: clr.purple, desc: "ADME/Tox screening", time: "~2s" },
  { n: 4, label: "Validate", color: clr.amber, desc: "Physics-based docking", time: "~120s" },
  { n: 5, label: "Rank", color: clr.green, desc: "Final lead selection", time: "<1s" },
];

/* ── Pricing data ── */
const tiers = [
  { name: "Free", price: "$0", sub: "forever", credits: "500 credits/mo", features: ["All 6 models", "10 req/min", "Community support", "SDK + MCP access"], color: clr.dim, popular: false },
  { name: "Pro", price: "$199", sub: "/month", credits: "20,000 credits/mo", features: ["All 6 models", "60 req/min", "Priority support", "API analytics"], color: clr.cyan, popular: true },
  { name: "Team", price: "$799", sub: "/month", credits: "80,000 credits/mo", features: ["5 team seats", "200 req/min", "Compliance logs", "Dedicated support"], color: clr.purple, popular: false },
  { name: "Enterprise", price: "Custom", sub: "", credits: "Unlimited", features: ["VPC deployment", "Custom SLA", "GxP validation", "Dedicated CSM"], color: clr.amber, popular: false },
];

const navLinks = ["Models", "Pipeline", "Pricing", "Docs"];

export default function Home() {
  const [typed, setTyped] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsInView, setStatsInView] = useState(false);

  /* typing effect */
  useEffect(() => {
    const delay = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        setTyped(codeStr.slice(0, i + 1));
        i++;
        if (i >= codeStr.length) clearInterval(iv);
      }, 22);
      return () => clearInterval(iv);
    }, 1200);
    return () => clearTimeout(delay);
  }, []);

  /* cursor blink */
  useEffect(() => {
    const iv = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(iv);
  }, []);

  /* stats observer */
  useEffect(() => {
    if (!statsRef.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsInView(true); }, { threshold: 0.3 });
    obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const c6 = useCounter(6, 800, statsInView);
  const c91 = useCounter(91, 1000, statsInView);
  const c14 = useCounter(14, 900, statsInView);
  const c0 = useCounter(0, 1, statsInView);

  const smooth = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div style={{ fontFamily: ff.body, color: clr.text, background: bg.page, minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── NAV ── */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(2,4,5,0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: `1px solid ${clr.rule}`, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22d3ee, #06d6a0)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff.head, fontWeight: 800, fontSize: 16, color: "#020405" }}>S</div>
          <span style={{ fontFamily: ff.head, fontWeight: 700, fontSize: 18, color: clr.text }}>SciRouter</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {navLinks.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={smooth(l.toLowerCase())} style={{ fontFamily: ff.body, fontSize: 14, color: clr.muted, textDecoration: "none", transition: "color .2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = clr.text)} onMouseLeave={(e) => (e.currentTarget.style.color = clr.muted)}>{l}</a>
          ))}
          <a href="#waitlist" onClick={smooth("waitlist")} style={{ fontFamily: ff.body, fontSize: 14, fontWeight: 600, color: "#020405", background: "linear-gradient(135deg, #22d3ee, #06d6a0)", padding: "8px 20px", borderRadius: 8, textDecoration: "none", transition: "opacity .2s" }} onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")} onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>Get API Key</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 32px 80px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        {/* grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />
        {/* molecules */}
        {[{ x: "10%", y: "20%", s: 60, c: clr.cyan, d: 8 }, { x: "85%", y: "30%", s: 80, c: clr.green, d: 12 }, { x: "70%", y: "70%", s: 50, c: clr.purple, d: 10 }].map((m, i) => (
          <svg key={i} style={{ position: "absolute", left: m.x, top: m.y, width: m.s, height: m.s, opacity: 0.08, animation: `float ${m.d}s ease-in-out infinite` }} viewBox="0 0 100 100"><polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill="none" stroke={m.c} strokeWidth="2" /></svg>
        ))}

        <div style={{ opacity: 0, animation: "fadeUp .7s ease forwards", animationDelay: "0s", position: "relative", zIndex: 1 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: ff.code, fontSize: 12, color: clr.cyan, background: "#22d3ee08", padding: "6px 16px", borderRadius: 999, marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: clr.green, animation: "pulse 2s ease-in-out infinite" }} />
            NOW IN BETA
          </span>
        </div>

        <h1 style={{ opacity: 0, animation: "fadeUp .7s ease forwards", animationDelay: "0.1s", fontFamily: ff.head, fontSize: 62, fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.05, margin: "24px 0 24px", position: "relative", zIndex: 1 }}>
          Every science model.<br />
          <span style={{ background: "linear-gradient(135deg, #22d3ee, #06d6a0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One API.</span>
        </h1>

        <p style={{ opacity: 0, animation: "fadeUp .7s ease forwards", animationDelay: "0.2s", fontFamily: ff.body, fontSize: 18, color: clr.muted, maxWidth: 640, lineHeight: 1.7, margin: "0 auto 40px", position: "relative", zIndex: 1 }}>
          Protein folding. Molecular docking. ADME prediction. Drug-likeness scoring. SciRouter gives researchers and AI agents instant API access to the tools that power modern drug discovery.
        </p>

        <div style={{ opacity: 0, animation: "fadeUp .7s ease forwards", animationDelay: "0.3s", display: "flex", gap: 16, position: "relative", zIndex: 1 }}>
          <a href="#waitlist" onClick={smooth("waitlist")} style={{ fontFamily: ff.body, fontSize: 15, fontWeight: 600, color: "#020405", background: "linear-gradient(135deg, #22d3ee, #06d6a0)", padding: "14px 32px", borderRadius: 10, textDecoration: "none", transition: "opacity .2s" }}>Start Free →</a>
          <a href="#pipeline" onClick={smooth("pipeline")} style={{ fontFamily: ff.body, fontSize: 15, fontWeight: 600, color: clr.text, background: "transparent", padding: "14px 32px", borderRadius: 10, textDecoration: "none", border: `1px solid #1a2535`, transition: "border-color .2s" }}>See the Pipeline</a>
        </div>

        <p style={{ opacity: 0, animation: "fadeUp .7s ease forwards", animationDelay: "0.4s", fontFamily: ff.code, fontSize: 12, color: clr.dim, marginTop: 24, position: "relative", zIndex: 1 }}>500 free credits/month · No credit card required · MCP + OpenAI compatible</p>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <div ref={statsRef} style={{ borderTop: `1px solid ${clr.rule}`, borderBottom: `1px solid ${clr.rule}`, background: clr.darkBg

      {/* ── CODE DEMO ── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: ff.code, fontSize: 12, color: clr.cyan, letterSpacing: "0.12em", marginBottom: 16 }}>DEVELOPER EXPERIENCE</div>
          <h2 style={{ fontFamily: ff.head, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 20 }}>Three lines of Python.<br />Real science.</h2>
          <p style={{ fontFamily: ff.body, fontSize: 15, color: clr.muted, lineHeight: 1.7, marginBottom: 28 }}>Install the SDK, authenticate with your API key, and call any model in our catalog. Results come back as structured objects — ready for downstream analysis or agent consumption.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {["pip install scirouter", "MCP Server", "OpenAI Tools"].map((b) => (
              <span key={b} style={{ fontFamily: ff.code, fontSize: 12, color: clr.cyan, background: "#22d3ee08", border: "1px solid #22d3ee20", padding: "6px 14px", borderRadius: 8 }}>{b}</span>
            ))}
          </div>
        </div>
        <div style={{ background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 14, boxShadow: "0 24px 80px rgba(0,0,0,0.4)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", borderBottom: `1px solid ${bg.border}` }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#22d3ee" }} />
            <span style={{ fontFamily: ff.code, fontSize: 12, color: clr.dim, marginLeft: "auto" }}>example.py</span>
          </div>
          <pre style={{ fontFamily: ff.code, fontSize: 13, color: "#6b8098", padding: "20px 18px", margin: 0, lineHeight: 1.7, minHeight: 220, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {typed}<span style={{ color: clr.cyan, opacity: showCursor ? 1 : 0, transition: "opacity 0.1s" }}>▌</span>
          </pre>
        </div>
      </section>

      {/* ── MODEL CATALOG ── */}
      <section id="models" style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 32px" }}>
        <div style={{ fontFamily: ff.code, fontSize: 12, color: clr.green, letterSpacing: "0.12em", marginBottom: 16 }}>MODEL CATALOG</div>
        <h2 style={{ fontFamily: ff.head, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 48 }}>Six models. One endpoint.</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {models.map((m) => (
            <div key={m.name} style={{ background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 14, padding: "28px 24px", transition: "transform .25s, box-shadow .25s", cursor: "default" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <span style={{ fontSize: 32 }}>{m.icon}</span>
                <span style={{ fontFamily: ff.code, fontSize: 9, color: m.tagColor, background: m.tagColor + "15", border: `1px solid ${m.tagColor}30`, padding: "3px 8px", borderRadius: 6 }}>{m.tag}</span>
              </div>
              <div style={{ fontFamily: ff.head, fontSize: 18, fontWeight: 700, color: clr.text, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontFamily: ff.code, fontSize: 11, color: clr.cyan, marginBottom: 12 }}>{m.task}</div>
              <p style={{ fontFamily: ff.body, fontSize: 13, color: clr.muted, lineHeight: 1.6, marginBottom: 16 }}>{m.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: ff.code, fontSize: 11, color: clr.dim }}>{m.api}</span>
                <span style={{ fontFamily: ff.code, fontSize: 10, color: clr.faint }}>{m.credits}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PIPELINE ── */}
      <section id="pipeline" style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 32px" }}>
        <div style={{ fontFamily: ff.code, fontSize: 12, color: clr.amber, letterSpacing: "0.12em", marginBottom: 16 }}>DISCOVERY PIPELINE</div>
        <h2 style={{ fontFamily: ff.head, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 48 }}>Idea to molecule. Five API calls.</h2>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, justifyContent: "space-between", position: "relative" }}>
          {/* connecting line */}
          <div style={{ position: "absolute", top: 28, left: 40, right: 40, height: 2, background: `linear-gradient(90deg, ${clr.green}, ${clr.cyan}, ${clr.purple}, ${clr.amber}, ${clr.green})`, opacity: 0.2 }} />
          {pipeline.map((p) => (
            <div key={p.n} style={{ textAlign: "center", flex: 1, position: "relative", zIndex: 1 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: p.color + "18", border: `2px solid ${p.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff.head, fontSize: 22, fontWeight: 800, color: p.color, margin: "0 auto 12px" }}>{p.n}</div>
              <div style={{ fontFamily: ff.head, fontSize: 16, fontWeight: 700, color: clr.text, marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontFamily: ff.body, fontSize: 13, color: clr.muted, marginBottom: 4 }}>{p.desc}</div>
              <div style={{ fontFamily: ff.code, fontSize: 11, color: clr.dim }}>{p.time}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 48, fontFamily: ff.code, fontSize: 13, color: clr.dim, background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 10, padding: "16px 24px", display: "inline-block" }}>Full pipeline: ~2.5 minutes · ~50 credits ($0.50) · Real scientific results</div>
      </section>, padding: "28px 32px", display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }}>
        {[{ n: c6, l: "Science Models" }, { n: c91, l: "% Gross Margin" }, { n: c14, l: "s Protein Fold" }, { n: c0, l: "To Get Started" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: ff.head, fontSize: 32, fontWeight: 800, color: clr.cyan }}>{i === 3 ? "$" : ""}{s.n}{i === 3 ? "" : ""}</div>
            <div style={{ fontFamily: ff.code, fontSize: 12, color: clr.dim, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── AGENT-NATIVE ── */}
      <section style={{ background: "#060a10", borderTop: `1px solid ${clr.rule}`, borderBottom: `1px solid ${clr.rule}`, padding: "100px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: ff.code, fontSize: 12, color: clr.purple, letterSpacing: "0.12em", marginBottom: 16 }}>AGENT-NATIVE</div>
            <h2 style={{ fontFamily: ff.head, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.15, marginBottom: 32 }}>Built for the age of<br />AI agents.</h2>
            {[
              { n: "01", t: "MCP Server", d: "Claude, Cursor, and any MCP client can call science models directly." },
              { n: "02", t: "OpenAI Tools", d: "Drop-in function definitions for GPT-4, Assistants API, and agents." },
              { n: "03", t: "Prepaid Credits", d: "No surprise bills. Agents spend credits you already purchased." },
              { n: "04", t: "SKILLS.md", d: "Teach any agent what SciRouter can do with one markdown file." },
            ].map((f) => (
              <div key={f.n} style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <span style={{ fontFamily: ff.code, fontSize: 13, color: clr.purple, fontWeight: 600, minWidth: 28 }}>{f.n}</span>
                <div>
                  <div style={{ fontFamily: ff.head, fontSize: 15, fontWeight: 700, color: clr.text, marginBottom: 2 }}>{f.t}</div>
                  <div style={{ fontFamily: ff.body, fontSize: 13, color: clr.muted }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 14, padding: "24px", boxShadow: "0 24px 80px rgba(0,0,0,0.4)" }}>
            <div style={{ fontFamily: ff.code, fontSize: 12, color: clr.dim, marginBottom: 12 }}>Claude Desktop — MCP Session</div>
            <div style={{ fontFamily: ff.code, fontSize: 13, color: "#6b8098", lineHeight: 1.7 }}>
              <div style={{ color: clr.muted }}>User: What is the predicted structure of MVLSPADKTNVK?</div>
              <div style={{ marginTop: 12 }}><span style={{ color: clr.purple }}>Agent:</span> I will call <span style={{ color: clr.cyan }}>scirouter.proteins.fold()</span> with your sequence.</div>
              <div style={{ marginTop: 12, padding: "12px", background: "#0a1018", borderRadius: 8, border: `1px solid ${bg.border}` }}>
                <div style={{ color: clr.green }}>✓ Fold completed — pLDDT: 87.3</div>
                <div style={{ color: clr.dim, marginTop: 4 }}>Structure has high confidence. The N-terminal helix is well-resolved.</div>
              </div>
              <div style={{ marginTop: 12, color: clr.cyan }}>{"// Zero integration code. Just MCP."}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: ff.head, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Start free. Scale when ready.</h2>
        <p style={{ fontFamily: ff.body, fontSize: 16, color: clr.muted, marginBottom: 48 }}>1 credit = $0.01. No hidden fees. No contracts.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {tiers.map((t) => (
            <div key={t.name} style={{ background: bg.card, border: `1px solid ${t.popular ? t.color + "40" : bg.border}`, borderRadius: 14, padding: "32px 24px", textAlign: "left", transition: "transform .25s", position: "relative" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
              {t.popular && <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", fontFamily: ff.code, fontSize: 10, fontWeight: 600, color: "#020405", background: `linear-gradient(135deg, ${clr.cyan}, ${clr.green})`, padding: "4px 14px", borderRadius: 999 }}>MOST POPULAR</div>}
              <div style={{ fontFamily: ff.head, fontSize: 18, fontWeight: 700, color: t.color, marginBottom: 8 }}>{t.name}</div>
              <div style={{ fontFamily: ff.head, fontSize: 36, fontWeight: 800, color: clr.text }}>{t.price}<span style={{ fontSize: 14, fontWeight: 400, color: clr.dim }}>{t.sub}</span></div>
              <div style={{ fontFamily: ff.code, fontSize: 12, color: clr.dim, marginBottom: 24, marginTop: 4 }}>{t.credits}</div>
              {t.features.map((f) => (
                <div key={f} style={{ fontFamily: ff.body, fontSize: 13, color: clr.muted, padding: "6px 0", borderBottom: `1px solid ${bg.border}` }}>✓ {f}</div>
              ))}
              <a href="#waitlist" onClick={smooth("waitlist")} style={{ display: "block", textAlign: "center", marginTop: 24, fontFamily: ff.body, fontSize: 14, fontWeight: 600, padding: "12px 0", borderRadius: 8, textDecoration: "none", color: t.popular ? "#020405" : clr.text, background: t.popular ? `linear-gradient(135deg, ${clr.cyan}, ${clr.green})` : "transparent", border: t.popular ? "none" : `1px solid #1a2535`, transition: "opacity .2s" }}>{t.name === "Enterprise" ? "Contact Sales" : "Get Started"}</a>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="waitlist" style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 32px" }}>
        <div style={{ background: "linear-gradient(135deg, #22d3ee06, #06d6a006)", border: `1px solid ${bg.border}`, borderRadius: 20, padding: "64px 32px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(34,211,238,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.015) 1px, transparent 1px)", backgroundSize: "80px 80px", pointerEvents: "none" }} />
          <h2 style={{ fontFamily: ff.head, fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12, position: "relative" }}>Start building with science.</h2>
          <p style={{ fontFamily: ff.body, fontSize: 16, color: clr.muted, marginBottom: 32, position: "relative" }}>Get your API key and 500 free credits. No credit card needed.</p>
          <div style={{ display: "flex", gap: 12, maxWidth: 480, margin: "0 auto", position: "relative" }}>
            <input type="email" placeholder="you@lab.edu" style={{ flex: 1, fontFamily: ff.body, fontSize: 15, color: clr.text, background: bg.card, border: `1px solid ${bg.border}`, borderRadius: 10, padding: "14px 18px", outline: "none" }} />
            <button style={{ fontFamily: ff.body, fontSize: 15, fontWeight: 600, color: "#020405", background: "linear-gradient(135deg, #22d3ee, #06d6a0)", border: "none", borderRadius: 10, padding: "14px 28px", cursor: "pointer", whiteSpace: "nowrap" }}>Get API Key →</button>
          </div>
          <p style={{ fontFamily: ff.code, fontSize: 12, color: clr.dim, marginTop: 16, position: "relative" }}>Free tier includes all 6 models · 500 credits/month · SDK + MCP + REST</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${clr.rule}`, background: clr.darkBg, padding: "60px 32px 32px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 48 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #22d3ee, #06d6a0)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff.head, fontWeight: 800, fontSize: 16, color: "#020405" }}>S</div>
              <span style={{ fontFamily: ff.head, fontWeight: 700, fontSize: 18, color: clr.text }}>SciRouter</span>
            </div>
            <p style={{ fontFamily: ff.body, fontSize: 13, color: clr.muted, lineHeight: 1.6 }}>The unified API for scientific computing.<br />Built for researchers. Designed for agents.</p>
          </div>
          {[
            { title: "Product", links: ["Models", "Pipeline", "Pricing", "API Docs", "SDK"] },
            { title: "Developers", links: ["Quick Start", "MCP Server", "SKILLS.md", "GitHub", "Status"] },
            { title: "Company", links: ["About", "Blog", "Twitter / X", "Contact"] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: ff.head, fontSize: 14, fontWeight: 700, color: clr.text, marginBottom: 16 }}>{col.title}</div>
              {col.links.map((l) => (
                <a key={l} href="#" style={{ display: "block", fontFamily: ff.body, fontSize: 13, color: clr.muted, textDecoration: "none", padding: "4px 0", transition: "color .2s" }} onMouseEnter={(e) => (e.currentTarget.style.color = clr.text)} onMouseLeave={(e) => (e.currentTarget.style.color = clr.muted)}>{l}</a>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1100, margin: "48px auto 0", paddingTop: 24, borderTop: `1px solid ${clr.rule}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: ff.code, fontSize: 11, color: "#1a2535" }}>© 2026 SciRouter. All rights reserved.</span>
          <span style={{ fontFamily: ff.code, fontSize: 11, color: "#1a2535" }}>NVIDIA builds the engines. We build the highway.</span>
        </div>
      </footer>

      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; background: #020405; }
        @media (max-width: 900px) {
          section > div[style*="grid-template-columns: 1fr 1fr"],
          section > div[style*="repeat(3"],
          section > div[style*="repeat(4"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
