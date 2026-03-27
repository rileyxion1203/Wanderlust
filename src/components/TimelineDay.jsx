import { useState } from "react";
import { STOP_ICONS, STOP_GRADIENTS, STOP_COLORS } from "../lib/constants.js";
import { mapsLink } from "../lib/utils.js";

function LinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}>
      <path d="M4.5 1.5H2C1.72 1.5 1.5 1.72 1.5 2V10C1.5 10.28 1.72 10.5 2 10.5H10C10.28 10.5 10.5 10.28 10.5 10V7.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
      <path d="M7.5 1.5H10.5V4.5M10.5 1.5L5.5 6.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const S = {
  dayCard: { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--r)", padding: "28px 24px", marginBottom: 16, boxShadow: "none" },
  dayHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid var(--border)" },
  timeline: { display: "flex", flexDirection: "column" },
  tlAltRow: { display: "grid", gridTemplateColumns: "1fr 36px 1fr", gap: 8, minHeight: 72, alignItems: "start" },
  tlAltSide: { display: "flex", flexDirection: "column", minWidth: 0 },
  tlCenter: { display: "flex", flexDirection: "column", alignItems: "center", width: 36, flexShrink: 0, paddingTop: 6 },
  tlLine: { width: 1, flex: 1, background: "var(--border)", marginTop: 4, marginBottom: 4, minHeight: 16 },
  tlDotBtn: { display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", border: "none", cursor: "pointer", transition: "all .18s ease", appearance: "none", WebkitAppearance: "none", background: "transparent" },
  stopPreview: { width: "100%", border: "none", borderRadius: "var(--r)", padding: "10px 14px", cursor: "pointer", transition: "all .18s ease", display: "flex", flexDirection: "column", gap: 3, background: "transparent", appearance: "none", WebkitAppearance: "none", outline: "none", boxShadow: "none" },
  stopPreviewActive: { background: "var(--bg-el)", boxShadow: "inset 0 0 0 1px var(--border)" },
  stopPreviewTime: { fontSize: 11, color: "var(--text-muted)", fontWeight: 500, letterSpacing: 0.5 },
  stopPreviewName: { fontSize: 14, fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.01em" },
  stopDetailAlt: { marginTop: 6, borderRadius: "var(--r)", background: "var(--bg-el)", padding: "14px 16px", animation: "fadeIn .2s ease-out", display: "flex", flexDirection: "column", border: "none" },
  stopTypePill: { fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, padding: "2px 8px", borderRadius: 999 },
  stopActions: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 },
  stopActionBtn: { display: "inline-flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 500, color: "var(--text-muted)", padding: "6px 12px", borderRadius: 999, border: "1px solid var(--border)", background: "var(--bg-card)" },
};

export default function TimelineDay({ day, destination }) {
  const [openStopIndexes, setOpenStopIndexes] = useState([]);
  const [hoveredStopIndex, setHoveredStopIndex] = useState(null);

  const toggleStop = (index) => {
    setOpenStopIndexes((current) => (
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    ));
  };

  return (
    <div style={S.dayCard}>
      <div style={S.dayHeader}>
        <div>
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1.5, color: "var(--accent)" }}>Day {day.dayNumber}</span>
          <h3 style={{ fontFamily: "var(--ff-d)", fontSize: 18, marginTop: 4, letterSpacing: "-0.01em" }}>{day.theme}</h3>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ display: "block", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Per person</span>
          <span style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em" }}>${day.dailyTotalPerPerson}</span>
        </div>
      </div>
      <div style={S.timeline}>
        {day.stops.map((stop, i) => {
          const color = STOP_COLORS[stop.type] || "var(--accent)";
          const grad = STOP_GRADIENTS[stop.type];
          const gradBg = grad ? `linear-gradient(135deg, ${grad[0]}28, ${grad[1]}18)` : `${color}10`;
          const icon = STOP_ICONS[stop.type] || "📍";
          const isLast = i === day.stops.length - 1;
          const isActive = openStopIndexes.includes(i);
          const isHovered = hoveredStopIndex === i;
          const stopQuery = `${stop.name} ${destination}`;
          const alignLeft = i % 2 === 0;

          return (
            <div key={i} style={S.tlAltRow}>
              <div style={{ ...S.tlAltSide, alignItems: alignLeft ? "flex-end" : "flex-start" }}>
                {alignLeft && (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleStop(i)}
                      onMouseEnter={() => setHoveredStopIndex(i)}
                      onMouseLeave={() => setHoveredStopIndex(null)}
                      style={{
                        ...S.stopPreview,
                        alignItems: "flex-end",
                        textAlign: "right",
                        ...((isActive || isHovered) ? { ...S.stopPreviewActive, boxShadow: `inset 0 0 0 1px ${color}45`, background: gradBg } : {}),
                      }}
                    >
                      <span style={S.stopPreviewTime}>{stop.time}</span>
                      <span style={{ ...S.stopTypePill, color, background: `${color}12` }}>{icon} {stop.type}</span>
                      <span style={{ ...S.stopPreviewName, color: "var(--text)" }}>{stop.name}</span>
                    </button>
                    {isActive && (
                      <div style={{ ...S.stopDetailAlt, borderColor: `${color}30`, textAlign: "right", alignItems: "flex-end" }}>
                        <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, marginTop: 10 }}>{stop.highlight}</p>
                        <div style={S.stopActions}>
                          <a href={mapsLink(stopQuery)} target="_blank" rel="noopener noreferrer" style={{ ...S.stopActionBtn, color: "var(--text-sec)" }}>
                            Open in Maps<LinkIcon />
                          </a>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div style={S.tlCenter}>
                <button
                  type="button"
                  onClick={() => toggleStop(i)}
                  onMouseEnter={() => setHoveredStopIndex(i)}
                  onMouseLeave={() => setHoveredStopIndex(null)}
                  style={{
                    ...S.tlDotBtn,
                    boxShadow: (isActive || isHovered) ? `inset 0 0 0 1px ${color}45` : "none",
                    background: (isActive || isHovered) ? `${color}12` : "transparent",
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                      boxShadow: (isActive || isHovered) ? `0 0 0 4px ${color}20` : "none",
                      transition: "all .18s ease",
                    }}
                  />
                </button>
                {!isLast && <div style={S.tlLine} />}
              </div>

              <div style={{ ...S.tlAltSide, alignItems: alignLeft ? "flex-start" : "flex-end" }}>
                {!alignLeft && (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleStop(i)}
                      onMouseEnter={() => setHoveredStopIndex(i)}
                      onMouseLeave={() => setHoveredStopIndex(null)}
                      style={{
                        ...S.stopPreview,
                        alignItems: "flex-start",
                        textAlign: "left",
                        ...((isActive || isHovered) ? { ...S.stopPreviewActive, boxShadow: `inset 0 0 0 1px ${color}45`, background: gradBg } : {}),
                      }}
                    >
                      <span style={S.stopPreviewTime}>{stop.time}</span>
                      <span style={{ ...S.stopTypePill, color, background: `${color}12` }}>{icon} {stop.type}</span>
                      <span style={{ ...S.stopPreviewName, color: "var(--text)" }}>{stop.name}</span>
                    </button>
                    {isActive && (
                      <div style={{ ...S.stopDetailAlt, borderColor: `${color}30`, textAlign: "left", alignItems: "flex-start" }}>
                        <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.5, marginTop: 10 }}>{stop.highlight}</p>
                        <div style={S.stopActions}>
                          <a href={mapsLink(stopQuery)} target="_blank" rel="noopener noreferrer" style={{ ...S.stopActionBtn, color: "var(--text-sec)" }}>
                            Open in Maps<LinkIcon />
                          </a>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
