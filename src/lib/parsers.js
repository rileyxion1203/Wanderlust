import { toFiniteNumber } from "./utils.js";

export function extractJsonBlock(text) {
  const stripped = text
    .replace(/```json\s*|```\s*/gi, "")
    .trim();

  if (!stripped) return null;

  if (stripped.startsWith("{") || stripped.startsWith("[")) {
    return stripped;
  }

  const start = stripped.search(/[\[{]/);
  if (start === -1) return null;

  const stack = [];
  let inString = false;
  let escaped = false;

  for (let i = start; i < stripped.length; i++) {
    const char = stripped[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      stack.push(char);
      continue;
    }

    if (char === "}" || char === "]") {
      const last = stack[stack.length - 1];
      if ((char === "}" && last === "{") || (char === "]" && last === "[")) {
        stack.pop();
        if (stack.length === 0) {
          return stripped.slice(start, i + 1);
        }
      }
    }
  }

  return stripped.slice(start);
}

export function parseGeminiJson(text) {
  const rawJson = extractJsonBlock(text);
  if (!rawJson) return null;

  const attempts = [
    rawJson,
    rawJson.replace(/,\s*([}\]])/g, "$1"),
    rawJson.replace(/[\u201C\u201D]/g, "\"").replace(/[\u2018\u2019]/g, "'"),
  ];

  for (const candidate of attempts) {
    try {
      return JSON.parse(candidate);
    } catch {
      // Try the next cleanup pass.
    }
  }

  return null;
}

export function normalizeHighlights(data, destination, days, visitStyle, isStudent) {
  return {
    destination: typeof data?.destination === "string" && data.destination.trim() ? data.destination.trim() : destination,
    totalDays: toFiniteNumber(data?.totalDays, days),
    visitStyle: data?.visitStyle === "repeat" ? "repeat" : visitStyle,
    isStudent: typeof data?.isStudent === "boolean" ? data.isStudent : isStudent,
    currency: data?.currency || "USD",
    mustVisitRestaurants: Array.isArray(data?.mustVisitRestaurants) ? data.mustVisitRestaurants : [],
    mustVisitAttractions: Array.isArray(data?.mustVisitAttractions) ? data.mustVisitAttractions : [],
    accommodation: data?.accommodation || null,
  };
}

export function normalizeItinerary(data, highlights, days) {
  const normalizedDays = Array.isArray(data?.days)
    ? data.days
      .map((day, index) => ({
        dayNumber: toFiniteNumber(day?.dayNumber, index + 1),
        theme: typeof day?.theme === "string" && day.theme.trim() ? day.theme.trim() : `Day ${index + 1}`,
        stops: Array.isArray(day?.stops)
          ? day.stops.map((stop) => ({
              time: typeof stop?.time === "string" ? stop.time : "",
              type: typeof stop?.type === "string" ? stop.type : "attraction",
              name: typeof stop?.name === "string" ? stop.name : "Stop",
              highlight: typeof stop?.highlight === "string" ? stop.highlight : "",
              cost: toFiniteNumber(stop?.cost, 0),
            }))
          : [],
        dailyTotalPerPerson: toFiniteNumber(day?.dailyTotalPerPerson, 0),
      }))
      .filter((day) => day.stops.length > 0)
    : [];

  const hasEnoughDays = normalizedDays.length > 0 && normalizedDays.length >= Math.min(days, 2);
  if (!hasEnoughDays) {
    throw new Error("Incomplete itinerary response.");
  }

  const nightlyStay = toFiniteNumber(highlights?.accommodation?.pricePerNight, 0);
  const fallbackTripTotal = normalizedDays.reduce((sum, day) => sum + day.dailyTotalPerPerson, 0) + (nightlyStay * days);

  return {
    days: normalizedDays,
    tripTotalPerPerson: toFiniteNumber(data?.tripTotalPerPerson, fallbackTripTotal),
    tips: Array.isArray(data?.tips) ? data.tips.filter((tip) => typeof tip === "string" && tip.trim()) : [],
  };
}
