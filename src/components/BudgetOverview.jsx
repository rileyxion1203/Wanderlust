const S = {
  card: { background: "var(--bg-card)", borderRadius: "var(--r)", border: "1px solid var(--border)", padding: "36px 32px", boxShadow: "var(--shadow)", textAlign: "left" },
  progressTrack: { width: "100%", height: 3, borderRadius: 2, background: "var(--border)", overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 2, background: "var(--accent)", transition: "width .5s ease-out" },
  budgetLabel: { display: "block", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1.2 },
  budgetNum: { display: "block", fontSize: 18, fontWeight: 600, marginTop: 2, letterSpacing: "-0.02em" },
};

export default function BudgetOverview({ itinerary, budgetPerPerson, days }) {
  const hasTripTotal = Number.isFinite(itinerary.tripTotalPerPerson);
  const perPerson = hasTripTotal ? itinerary.tripTotalPerPerson : 0;
  const totalEstimated = perPerson;
  const totalBudget = budgetPerPerson * days;
  const pct = totalBudget > 0 ? Math.min((totalEstimated / totalBudget) * 100, 100) : 0;
  const isOver = hasTripTotal && totalEstimated > totalBudget;

  return (
    <div style={{ ...S.card, marginTop: 12 }}>
      <h3 style={{ fontFamily: "var(--ff-d)", fontSize: 20, marginBottom: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>Budget</h3>
      {hasTripTotal ? (
        <>
          <div style={{ ...S.progressTrack, height: 8 }}>
            <div style={{ ...S.progressFill, height: 8, width: `${pct}%`, background: isOver ? "#d67474" : undefined, borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, marginBottom: 6 }}>
            <div>
              <span style={S.budgetLabel}>Estimated total</span>
              <span style={S.budgetNum}>${totalEstimated}</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={S.budgetLabel}>Daily target</span>
              <span style={S.budgetNum}>${budgetPerPerson}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={S.budgetLabel}>Your budget</span>
              <span style={S.budgetNum}>${totalBudget}</span>
            </div>
          </div>
          {isOver ? (
            <p style={{ fontSize: 12, color: "#d67474", marginTop: 8, padding: "8px 12px", background: "#f8e8e8", borderRadius: 8 }}>⚠ Exceeds budget by ${totalEstimated - totalBudget}</p>
          ) : (
            <p style={{ fontSize: 12, color: "#27ae60", marginTop: 8, padding: "8px 12px", background: "#e8f8f0", borderRadius: 8 }}>✓ ${totalBudget - totalEstimated} remaining</p>
          )}
        </>
      ) : (
        <p style={{ fontSize: 12, color: "var(--text-sec)", marginTop: 8, padding: "8px 12px", background: "var(--bg-el)", borderRadius: 8 }}>
          Day-by-day budget summary is unavailable for this run, but the highlights above are still usable.
        </p>
      )}
      {itinerary.tips && (
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 12, fontWeight: 700, color: "var(--text-sec)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Travel tips</h4>
          {itinerary.tips.map((t, i) => (
            <p key={i} style={{ fontSize: 13, color: "var(--text-sec)", lineHeight: 1.5, marginBottom: 4 }}>→ {t}</p>
          ))}
        </div>
      )}
    </div>
  );
}
