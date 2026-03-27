import { useState } from "react";

const S = {
  landingWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" },
  bgGrid: { position: "absolute", inset: 0, opacity: 0, pointerEvents: "none" },
  landingContent: { position: "relative", width: "100%", maxWidth: 480, textAlign: "center", animation: "fadeIn .6s ease-out" },
  heroTitle: { fontFamily: "var(--ff-d)", fontSize: "3.75rem", fontWeight: 700, lineHeight: 1.1, marginBottom: 6, letterSpacing: "-0.01em" },
  card: { background: "var(--bg-card)", borderRadius: "var(--r)", border: "1px solid var(--border)", padding: "36px 32px", boxShadow: "var(--shadow)", textAlign: "left" },
  field: { marginBottom: 24 },
  label: { display: "block", fontFamily: "var(--ff-l)", fontSize: "0.75rem", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 },
  input: { width: "100%", padding: "12px 16px", fontSize: 15, fontFamily: "var(--ff)", border: "1px solid var(--border)", borderRadius: "var(--rs)", background: "var(--bg)", color: "var(--text)", outline: "none", transition: "border-color .2s, box-shadow .2s" },
  chip: { padding: "8px 16px", fontSize: 13, fontWeight: 500, fontFamily: "var(--ff)", border: "1px solid var(--border)", borderRadius: 9999, background: "transparent", color: "var(--text)", cursor: "pointer", transition: "all .15s" },
  chipActive: { borderColor: "var(--text)", background: "var(--text)", color: "#fff" },
  toggleRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", border: "1px solid var(--border)", borderRadius: "var(--rs)", transition: "border-color .2s" },
  submitBtn: { width: "100%", padding: "14px", fontSize: 14, fontWeight: 600, fontFamily: "var(--ff)", border: "none", borderRadius: "var(--rs)", background: "var(--accent)", color: "#fff", cursor: "pointer", letterSpacing: .3, marginTop: 12, transition: "opacity .15s", boxShadow: "none" },
};

function ToggleSwitch({ on, onToggle }) {
  return (
    <div
      onClick={onToggle}
      style={{ ...S.toggleRow, borderColor: on ? "var(--accent-a30)" : "var(--border)", cursor: "pointer" }}
    >
      <span style={{ fontSize: 13, color: on ? "var(--accent)" : "var(--text-sec)", fontWeight: on ? 500 : 400, transition: "all .2s" }}>
        Student rates
      </span>
      <div style={{ width: 40, height: 22, borderRadius: 11, background: on ? "var(--accent)" : "var(--border)", position: "relative", transition: "background .2s", flexShrink: 0 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 21 : 3, transition: "left .2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} />
      </div>
    </div>
  );
}

export default function LandingPage({ onSubmit }) {
  const [dest, setDest] = useState("");
  const [days, setDays] = useState(3);
  const [customDays, setCustomDays] = useState("");
  const [useCustomDays, setUseCustomDays] = useState(false);
  const [budgetPP, setBudgetPP] = useState(200);
  const [isStudent, setIsStudent] = useState(false);
  const [visitStyle, setVisitStyle] = useState("first");
  const [shake, setShake] = useState(false);

  const effectiveDays = useCustomDays ? (parseInt(customDays) || 1) : days;

  const handleSubmit = () => {
    if (!dest.trim()) { setShake(true); setTimeout(() => setShake(false), 500); return; }
    onSubmit({ destination: dest.trim(), days: Math.min(Math.max(effectiveDays, 1), 30), budgetPerPerson: budgetPP, isStudent, visitStyle });
  };

  return (
    <div style={S.landingWrap}>
      <div style={S.bgGrid} />
      <div style={S.landingContent}>
        <h1 style={S.heroTitle}>Wanderlust</h1>
        <p style={{ fontFamily: "var(--ff)", fontSize: "0.875rem", color: "#737373", marginBottom: 40, letterSpacing: "0.05em", fontWeight: 400 }}>One-Click Travel Planner</p>

        <div style={S.card}>
          {/* Destination */}
          <div style={S.field}>
            <label style={S.label}>Where to?</label>
            <input
              style={{ ...S.input, ...(shake ? { animation: "shake .4s ease-in-out", borderColor: "#d67474" } : {}) }}
              placeholder="Tokyo, Paris, Bali…"
              value={dest}
              onChange={(e) => setDest(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          {/* Days: 4 chips + custom */}
          <div style={S.field}>
            <label style={S.label}>Days</label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[1, 2, 3, 5].map((d) => (
                <button
                  key={d}
                  style={{ ...S.chip, width: 40, height: 40, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", ...((!useCustomDays && days === d) ? S.chipActive : {}) }}
                  onClick={() => { setDays(d); setUseCustomDays(false); setCustomDays(""); }}
                >{d}</button>
              ))}
              <input
                style={{ ...S.input, width: 72, padding: "9px 12px", fontSize: 14, textAlign: "center", borderRadius: 9999, borderColor: useCustomDays ? "var(--accent)" : "var(--border)" }}
                type="number"
                min={1}
                max={30}
                placeholder="Other"
                value={customDays}
                onChange={(e) => { setCustomDays(e.target.value); setUseCustomDays(true); }}
                onFocus={() => setUseCustomDays(true)}
              />
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Trip style</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                style={{ ...S.chip, ...(visitStyle === "first" ? { borderColor: "var(--accent-warm)", background: "var(--accent-warm)", color: "#fff" } : {}) }}
                onClick={() => setVisitStyle("first")}
              >
                First time here
              </button>
              <button
                style={{ ...S.chip, ...(visitStyle === "repeat" ? { borderColor: "var(--accent-warm)", background: "var(--accent-warm)", color: "#fff" } : {}) }}
                onClick={() => setVisitStyle("repeat")}
              >
                Been here before
              </button>
            </div>
          </div>

          {/* Budget per person */}
          <div style={S.field}>
            <label style={S.label}>Budget per person per day (USD)</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 17, color: "var(--text-muted)", fontWeight: 600 }}>$</span>
              <input
                style={{ ...S.input, paddingLeft: 32 }}
                type="number"
                min={20}
                value={budgetPP}
                onChange={(e) => setBudgetPP(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value) || 0))}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          </div>

          {/* Student toggle */}
          <div style={{ marginBottom: 20 }}>
            <ToggleSwitch on={isStudent} onToggle={() => setIsStudent(!isStudent)} />
          </div>

          <button style={S.submitBtn} onClick={handleSubmit}>Generate My Itinerary →</button>
        </div>

        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 28, letterSpacing: .5, fontWeight: 400 }}>Powered by Gemini AI</p>
      </div>
    </div>
  );
}
