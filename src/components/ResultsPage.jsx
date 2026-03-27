import { RestaurantHighlights, AttractionHighlights, AccommodationHighlight } from "./Highlights.jsx";
import TimelineDay from "./TimelineDay.jsx";
import BudgetOverview from "./BudgetOverview.jsx";

const S = {
  resultsWrap: { maxWidth: 680, margin: "0 auto", padding: "32px 20px 80px", animation: "slideUp .5s ease-out" },
  backBtn: { fontSize: 13, color: "var(--accent)", background: "none", border: "none", fontFamily: "var(--ff)", cursor: "pointer", fontWeight: 500, marginBottom: 16, padding: 0, letterSpacing: .2 },
  disclaimer: { marginTop: 14, padding: "10px 14px", borderRadius: "var(--rs)", background: "var(--bg-el)", border: "none", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 },
};

export default function ResultsPage({ itinerary, budgetPerPerson, onReset, loadingItinerary }) {
  return (
    <div style={S.resultsWrap}>
      <div style={{ marginBottom: 28 }}>
        <button style={S.backBtn} onClick={onReset}>← Plan another trip</button>
        <h1 style={{ fontFamily: "var(--ff-d)", fontSize: "clamp(28px,5vw,40px)", fontWeight: 500, lineHeight: 1.05, marginBottom: 6, letterSpacing: "-0.02em" }}>{itinerary.destination}</h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", letterSpacing: .2 }}>
          {itinerary.totalDays} days · solo traveler · ${budgetPerPerson}/day
          {itinerary.visitStyle === "repeat" ? " · local picks" : " · first-time highlights"}
          {itinerary.isStudent && " · Student"}
        </p>
        <div style={S.disclaimer}>
          Prices are sourced from web search and may vary. Always verify on official websites before booking.
        </div>
      </div>

      <RestaurantHighlights restaurants={itinerary.mustVisitRestaurants || []} />
      <AttractionHighlights attractions={itinerary.mustVisitAttractions || []} isStudent={itinerary.isStudent} />
      <AccommodationHighlight accommodation={itinerary.accommodation} totalNights={itinerary.totalDays} />

      {/* Phase 2: Day-by-day — may still be loading */}
      {loadingItinerary && (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <svg width="40" height="40" viewBox="0 0 80 80" style={{ animation: "pulse 1.5s ease-in-out infinite", marginBottom: 12 }}>
            <circle cx="40" cy="40" r="36" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
            <ellipse cx="40" cy="40" rx="20" ry="36" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.5">
              <animateTransform attributeName="transform" type="rotate" from="0 40 40" to="360 40 40" dur="3s" repeatCount="indefinite" />
            </ellipse>
          </svg>
          <p style={{ fontSize: 14, color: "var(--text-sec)" }}>Building your day-by-day itinerary…</p>
        </div>
      )}

      {!loadingItinerary && itinerary.days && (
        <div style={{ marginTop: 8 }}>
          <h2 style={{ fontFamily: "var(--ff-d)", fontSize: 20, marginBottom: 16, fontWeight: 500, letterSpacing: "-0.01em" }}>Itinerary</h2>
          {itinerary.days.map((day) => <TimelineDay key={day.dayNumber} day={day} destination={itinerary.destination} />)}
        </div>
      )}

      {!loadingItinerary && (Number.isFinite(itinerary.tripTotalPerPerson) || (itinerary.tips && itinerary.tips.length > 0)) && (
        <BudgetOverview itinerary={itinerary} budgetPerPerson={budgetPerPerson} days={itinerary.totalDays} />
      )}
    </div>
  );
}
