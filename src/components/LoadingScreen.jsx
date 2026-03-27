import { useState, useEffect } from "react";
import { LOADING_MSGS } from "../lib/constants.js";

const S = {
  centerWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  loadingInner: { textAlign: "center", maxWidth: 280, animation: "fadeIn .5s ease-out" },
  progressTrack: { width: "100%", height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2, background: "var(--accent)", transition: "width .5s ease-out" },
};

export default function LoadingScreen() {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MSGS.length), 2400);
    const b = setInterval(() => setProgress((p) => Math.min(p + Math.random() * 8, 92)), 600);
    return () => { clearInterval(a); clearInterval(b); };
  }, []);

  return (
    <div style={S.centerWrap}>
      <div style={S.loadingInner}>
        <svg width="72" height="72" viewBox="0 0 80 80" style={{ marginBottom: 20, animation: "pulse 2s ease-in-out infinite" }}>
          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
          <ellipse cx="40" cy="40" rx="20" ry="36" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="4s" repeatCount="indefinite" />
          </ellipse>
          <circle cx="40" cy="40" r="4" fill="var(--accent)"><animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" /></circle>
        </svg>
        <p style={{ fontSize: 15, color: "var(--text-sec)", marginBottom: 20 }}>{LOADING_MSGS[msgIdx]}</p>
        <div style={S.progressTrack}><div style={{ ...S.progressFill, width: `${progress}%` }} /></div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
