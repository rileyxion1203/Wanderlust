const S = {
  centerWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 },
  card: { background: "var(--bg-card)", borderRadius: "var(--r)", border: "1px solid var(--border)", padding: "36px 32px", boxShadow: "var(--shadow)", textAlign: "left" },
  btnOutline: { padding: "10px 28px", fontSize: 13, fontWeight: 500, fontFamily: "var(--ff)", border: "1px solid var(--accent)", borderRadius: "var(--rs)", background: "transparent", color: "var(--accent)", cursor: "pointer" },
};

export default function ErrorScreen({ message, onRetry }) {
  return (
    <div style={S.centerWrap}>
      <div style={{ ...S.card, maxWidth: 400, textAlign: "center", padding: 36, animation: "fadeIn .4s ease-out" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#f8e8e8", color: "#d67474", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, margin: "0 auto 14px" }}>✕</div>
        <h3 style={{ fontFamily: "var(--ff-d)", fontSize: 20, marginBottom: 8 }}>Something went wrong</h3>
        <p style={{ fontSize: 13, color: "var(--text-sec)", marginBottom: 20, lineHeight: 1.5 }}>{message}</p>
        <button style={S.btnOutline} onClick={onRetry}>Try Again</button>
      </div>
    </div>
  );
}
