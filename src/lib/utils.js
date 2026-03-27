export function toFiniteNumber(value, fallback = 0) {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function getBudgetPlan(days, dailyBudget) {
  const tripBudget = dailyBudget * days;
  const lodgingShare = dailyBudget < 120 ? 0.35 : dailyBudget < 220 ? 0.38 : 0.42;
  const foodShare = dailyBudget < 120 ? 0.42 : dailyBudget < 220 ? 0.38 : 0.34;
  const stayPerNight = Math.max(25, Math.round(dailyBudget * lodgingShare));
  const foodPerDay = Math.max(25, Math.round(dailyBudget * foodShare));
  const attractionsPerDay = Math.max(0, dailyBudget - stayPerNight - foodPerDay);

  return {
    dailyBudget,
    tripBudget,
    stayPerNight,
    foodPerDay,
    attractionsPerDay,
    breakfastCap: Math.max(8, Math.round(foodPerDay * 0.2)),
    lunchCap: Math.max(12, Math.round(foodPerDay * 0.32)),
    dinnerCap: Math.max(15, Math.round(foodPerDay * 0.48)),
  };
}

export function mapsLink(query) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

export function bookingSearchLink(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query + " book tickets")}`;
}
