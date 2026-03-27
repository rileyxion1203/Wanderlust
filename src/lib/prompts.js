import { getBudgetPlan } from "./utils.js";

const SEARCH_RULES = `SEARCH AND PRICING — MANDATORY:
You have web search. You MUST search before recommending anything. Do NOT use training data for prices.

For RESTAURANTS:
- Search "site:yelp.com best restaurants [city]" and "[city] best restaurants 2025 2026"
- Pick restaurants that appear in search results with high ratings (4+ stars on Yelp/Google)
- For pricePerPerson: search "[restaurant name] menu prices" or check the Yelp price range ($ = ~$15, $$ = ~$25, $$$ = ~$45, $$$$ = ~$80+)

For ATTRACTIONS:
- Search "[attraction name] official site admission" and "[attraction name] ticket price 2025 2026"
- Use the EXACT price number from the official website or ticketing page — do NOT round down or guess
- If student discount exists, search "[attraction name] student discount" for the exact student price

For ACCOMMODATION:
- Search "[hotel name] [city] price per night" on booking.com, hotels.com, or Google Hotels
- Use the actual nightly rate from search results, NOT a guess
- pricePerNight = price for ONE ROOM (not per person)

CRITICAL: If a search result says "$30 admission" — put 30. If it says "$109/night" — put 109. Copy the number, don't adjust it.`;

const QUALITY_RULES = `RESTAURANT QUALITY:
- NEVER recommend chain restaurants as must-visit (no McDonald's, Starbucks, Subway, Shake Shack, Ichiran, etc.)
- Must-visit = locally acclaimed, unique-to-the-city, the kind Eater.com or a food writer would recommend
- Mix: 1 upscale/special, 2-3 mid-range local favorites, 1-2 affordable hidden gems (NOT chains)`;

export function buildHighlightsPrompt(destination, days, budgetPerPerson, visitStyle, isStudent) {
  const studentNote = isStudent
    ? "The travelers are students. Search for student ticket prices. Restaurants should still be quality, not fast food."
    : "";
  const repeatVisitorNote = visitStyle === "repeat"
    ? "The traveler has already visited before. Prioritize lesser-known neighborhoods, local hangouts, markets, indie shops, scenic walks, and low-key attractions over famous checklist landmarks."
    : "The traveler is visiting for the first time. Prioritize iconic attractions, classic neighborhoods, and signature local experiences.";
  const budget = getBudgetPlan(days, budgetPerPerson);

  const system = `You are an expert travel planner with web search access.

${SEARCH_RULES}

${QUALITY_RULES}

${studentNote}
${repeatVisitorNote}

BUDGET CONTEXT:
- Hard budget: average total spend must stay at or below $${budget.dailyBudget}/person/day in ${destination}
- Total trip budget: about $${budget.tripBudget}/person for ${days} days
- Target lodging: around $${budget.stayPerNight}/night
- Target food: around $${budget.foodPerDay}/day
- Target attractions: around $${budget.attractionsPerDay}/day
- Prefer places that fit this budget naturally in the local market
- Do NOT recommend luxury options unless they still fit this budget
- Restaurant guardrails: breakfast usually <= $${budget.breakfastCap}, lunch <= $${budget.lunchCap}, dinner <= $${budget.dinnerCap}
- At most one slight splurge meal, and only if the full day still stays inside budget

SEARCH STEPS (do all of these):
1. Search "site:yelp.com best restaurants ${destination}" — pick 3 non-chain spots that fit budget
2. Search "top attractions ${destination} admission price 2025 2026" — pick 4 attractions that fit the trip style
3. Search "${visitStyle === "repeat" ? "best neighborhoods markets shopping streets hidden gems" : "must see attractions iconic neighborhoods"} ${destination}"
4. Search "best hotel ${destination} ${budget.stayPerNight < 70 ? "budget hotel or hostel" : budget.stayPerNight < 150 ? "mid-range hotel" : "comfortable hotel"}" — find 1 real place and use only a reasonable reference nightly price
5. Only verify exact prices for the final attractions you keep

After all searches, output valid JSON ONLY. No markdown, no backticks, no explanation, no citations. Strip all <cite> tags. Just the raw JSON object.

Schema:
{
  "destination": "string",
  "totalDays": ${days},
  "visitStyle": "${visitStyle}",
  "isStudent": ${isStudent},
  "currency": "USD",
  "mustVisitRestaurants": [
    { "name": "string", "cuisine": "string", "highlight": "string (one sentence, NO cite tags)", "pricePerPerson": number, "googleMapsQuery": "string (name + city)" }
  ],
  "mustVisitAttractions": [
    { "name": "string", "category": "string", "highlight": "string (one sentence, NO cite tags)", "entranceFee": number, "studentDiscount": boolean, "googleMapsQuery": "string (name + city)", "bookingUrl": "string (real official URL from search, or empty string)" }
  ],
  "accommodation": {
    "name": "string", "type": "string", "pricePerNight": number, "highlight": "string (one sentence, NO cite tags)", "districtOrArea": "string", "googleMapsQuery": "string (name + city)"
  }
}

- mustVisitRestaurants: exactly 3 from Yelp/Google results
- mustVisitAttractions: exactly 4 with current ticket prices when applicable
- Favor free or low-cost attractions if needed to stay in budget
- If a restaurant is too expensive for this budget, do not include it
- Accommodation price should be a realistic reference price, not a guaranteed live booking quote
- DO NOT include any <cite> or citation markup in any string value — plain text only`;

  const user = `Plan highlights for a ${days}-day trip to ${destination} with a budget of $${budget.dailyBudget}/person/day (about $${budget.tripBudget} total per person). ${visitStyle === "repeat" ? "The traveler has been here before and wants more local or lesser-known picks." : "This is the traveler's first visit and they want strong classic picks."}${isStudent ? " Students — check student prices." : ""}`;

  return { system, user };
}

export function buildItineraryPrompt(destination, days, budgetPerPerson, visitStyle, isStudent, highlights) {
  const studentNote = isStudent ? "The travelers are students — use free/discounted options where possible." : "";
  const repeatVisitorNote = visitStyle === "repeat"
    ? "Lean toward local neighborhoods, relaxed wandering, cafes, markets, and non-obvious stops."
    : "Lean toward iconic sights and classic first-time experiences.";
  const budget = getBudgetPlan(days, budgetPerPerson);

  const system = `You are an expert travel planner. Output valid JSON ONLY. No markdown, no backticks, no preamble. No <cite> tags in any text.

Use the EXACT prices from the pre-selected highlights below. For additional meals/stops not in the highlights, use realistic local prices.

${studentNote}
${repeatVisitorNote}

Given the pre-selected highlights below, generate a day-by-day itinerary. Weave the highlighted restaurants and attractions into the daily schedule naturally. You may add OTHER restaurants for daily meals (breakfast/lunch/dinner) beyond the highlights.

PRE-SELECTED HIGHLIGHTS:
${JSON.stringify(highlights, null, 0)}

Generate this EXACT schema:
{
  "days": [
    {
      "dayNumber": number,
      "theme": "string (short thematic title)",
      "stops": [
        { "time": "string (e.g. 8:00 AM)", "type": "breakfast|attraction|lunch|dinner|nightlife", "name": "string", "highlight": "string (one SHORT sentence)", "cost": number }
      ],
      "dailyTotalPerPerson": number
    }
  ],
  "tripTotalPerPerson": number,
  "tips": ["string", "string", "string"]
}

RULES:
- Each day: breakfast → morning attraction(s) → lunch → afternoon attraction(s) → dinner → evening activity/nightlife (optional)
- Each day: 5-7 stops. All 3 meals (breakfast, lunch, dinner) must be included every day.
- All costs PER PERSON in USD. Use realistic prices.
- Hard budget cap: each day should stay at or below $${budget.dailyBudget}/person unless unavoidable, and never exceed it by more than 10%
- Typical meal caps: breakfast <= $${budget.breakfastCap}, lunch <= $${budget.lunchCap}, dinner <= $${budget.dinnerCap}
- Use free walks, markets, viewpoints, and neighborhoods when needed to protect the budget
- dailyTotalPerPerson = sum of all stop costs for that day
- tripTotalPerPerson = sum of all dailyTotalPerPerson + (accommodation cost per night × ${days} nights)
- tripTotalPerPerson should stay close to or under $${budget.tripBudget}`;

  const user = `Create a ${days}-day itinerary for ${destination} with a budget of $${budget.dailyBudget}/person/day for a solo traveler.${visitStyle === "repeat" ? " Prioritize lesser-known and neighborhood-style experiences." : " Prioritize classic first-time experiences."}${isStudent ? " Students." : ""}`;

  return { system, user };
}
