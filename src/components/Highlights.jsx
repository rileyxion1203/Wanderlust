import { useState } from "react";
import { tagColor } from "../lib/constants.js";
import { mapsLink, bookingSearchLink } from "../lib/utils.js";

const S = {
  hlSection: { marginBottom: 32 },
  hlHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 14 },
  hlTitle: { fontFamily: "var(--ff-d)", fontSize: 20, fontWeight: 500, letterSpacing: "-0.01em" },
  hlGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 },
  hlCard: { padding: "18px 20px", borderRadius: "var(--r)", border: "1px solid var(--border)", background: "var(--bg-card)", transition: "all .2s ease", boxShadow: "none" },
  hlCardActive: { transform: "translateY(-1px)", boxShadow: "var(--shadow-lg)" },
  priceTag: { fontSize: 14, fontWeight: 600, color: "var(--accent)", whiteSpace: "nowrap", letterSpacing: "-0.02em" },
  tagChip: { display: "inline-block", fontSize: 11, padding: "3px 10px", borderRadius: "var(--rs)", background: "var(--bg-el)", color: "var(--text-muted)", fontWeight: 500, letterSpacing: .2 },
  linkBtn: { display: "inline-flex", alignItems: "center", fontSize: 12, fontWeight: 500, color: "var(--text-muted)", marginTop: 10, padding: "4px 0", transition: "color .15s" },
};

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}>
      <path d="M4.5 1.5H2C1.72 1.5 1.5 1.72 1.5 2V10C1.5 10.28 1.72 10.5 2 10.5H10C10.28 10.5 10.5 10.28 10.5 10V7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M7.5 1.5H10.5V4.5M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function RestaurantHighlights({ restaurants }) {
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  return (
    <div style={S.hlSection}>
      <div style={S.hlHeader}><h2 style={S.hlTitle}>Restaurants</h2></div>
      <div style={S.hlGrid}>
        {restaurants.map((r, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveCardIndex(i)}
            onMouseLeave={() => setActiveCardIndex(null)}
            style={{
              ...S.hlCard,
              ...(activeCardIndex === i ? S.hlCardActive : {}),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{r.name}</h4>
              <span style={S.priceTag}>${r.pricePerPerson}/pp</span>
            </div>
            <span style={{ ...S.tagChip, background: tagColor(r.cuisine).bg, color: tagColor(r.cuisine).color }}>{r.cuisine}</span>
            <p style={{ fontSize: 13.5, color: "var(--text-sec)", lineHeight: 1.5, marginTop: 6 }}>{r.highlight}</p>
            {r.googleMapsQuery && (
              <a href={mapsLink(r.googleMapsQuery)} target="_blank" rel="noopener noreferrer" style={S.linkBtn}>
                View on Maps<LinkIcon />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AttractionHighlights({ attractions, isStudent }) {
  const [activeCardIndex, setActiveCardIndex] = useState(null);

  return (
    <div style={S.hlSection}>
      <div style={S.hlHeader}><h2 style={S.hlTitle}>Attractions</h2></div>
      <div style={S.hlGrid}>
        {attractions.map((a, i) => (
          <div
            key={i}
            onMouseEnter={() => setActiveCardIndex(i)}
            onMouseLeave={() => setActiveCardIndex(null)}
            style={{
              ...S.hlCard,
              ...(activeCardIndex === i ? S.hlCardActive : {}),
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 6 }}>
              <h4 style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{a.name}</h4>
              <span style={S.priceTag}>
                {a.entranceFee === 0 ? "Free" : `$${a.entranceFee}`}
                {a.studentDiscount && isStudent && <span style={{ marginLeft: 4, fontSize: 12 }}>🎓</span>}
              </span>
            </div>
            <span style={{ ...S.tagChip, background: tagColor(a.category).bg, color: tagColor(a.category).color }}>{a.category}</span>
            <p style={{ fontSize: 13.5, color: "var(--text-sec)", lineHeight: 1.5, marginTop: 6 }}>{a.highlight}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              {a.googleMapsQuery && (
                <a href={mapsLink(a.googleMapsQuery)} target="_blank" rel="noopener noreferrer" style={S.linkBtn}>Maps<LinkIcon /></a>
              )}
              {a.bookingUrl && (
                <a href={a.bookingUrl} target="_blank" rel="noopener noreferrer" style={{ ...S.linkBtn, color: "var(--accent)" }}>Tickets<LinkIcon /></a>
              )}
              {!a.bookingUrl && a.googleMapsQuery && (
                <a href={bookingSearchLink(a.googleMapsQuery)} target="_blank" rel="noopener noreferrer" style={{ ...S.linkBtn, color: "var(--accent)" }}>Tickets<LinkIcon /></a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccommodationHighlight({ accommodation, totalNights }) {
  const total = accommodation.pricePerNight * totalNights;
  const [isActive, setIsActive] = useState(false);

  return (
    <div style={S.hlSection}>
      <div style={S.hlHeader}><h2 style={S.hlTitle}>Accommodation</h2></div>
      <div
        onMouseEnter={() => setIsActive(true)}
        onMouseLeave={() => setIsActive(false)}
        style={{
          ...S.hlCard,
          border: "1px solid var(--border-acc)",
          ...(isActive ? S.hlCardActive : {}),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
          <div>
            <h4 style={{ fontSize: 17, fontWeight: 600 }}>{accommodation.name}</h4>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{accommodation.type} · {accommodation.districtOrArea}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>${accommodation.pricePerNight}</span>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>/night</span>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: "var(--text-sec)", lineHeight: 1.5, marginTop: 8 }}>{accommodation.highlight}</p>
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--border)", fontSize: 13, color: "var(--text-sec)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>${accommodation.pricePerNight} × {totalNights} nights = <strong style={{ color: "var(--text)" }}>${total}</strong></span>
            {accommodation.googleMapsQuery && (
              <a href={mapsLink(accommodation.googleMapsQuery)} target="_blank" rel="noopener noreferrer" style={{ ...S.linkBtn, color: "var(--accent)" }}>
                Open in Maps<LinkIcon />
              </a>
            )}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
            Reference price only. Final rates can change by date, room type, and availability.
          </p>
        </div>
      </div>
    </div>
  );
}
