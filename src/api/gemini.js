import { buildHighlightsPrompt, buildItineraryPrompt } from "../lib/prompts.js";
import { parseGeminiJson, normalizeHighlights, normalizeItinerary } from "../lib/parsers.js";

function getApiKey() {
  const key = import.meta.env.VITE_GEMINI_KEY;
  if (!key) throw new Error("Missing API key. Add VITE_GEMINI_KEY to your .env file.");
  return key;
}

const GEMINI_MODEL = "gemini-2.5-flash";

/**
 * Call Gemini API with robust handling for thinking-model responses.
 *
 * Key fixes:
 * 1. Filter out `thought` parts — 2.5-flash returns thinking/reasoning
 *    in parts with { thought: true, text: "..." }. Mixing them in
 *    corrupts JSON parsing.
 * 2. Set a thinking budget so the model doesn't burn all tokens on reasoning.
 * 3. Increase maxOutputTokens to give enough room for both thinking + JSON.
 * 4. Retry up to 2 extra times on parse failure before giving up.
 */
async function callGemini(system, user, useSearch = false, signal) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${getApiKey()}`;

  const body = {
    system_instruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts: [{ text: user }] }],
    generationConfig: {
      maxOutputTokens: useSearch ? 16000 : 12000,
      temperature: 0.7,
      thinkingConfig: { thinkingBudget: useSearch ? 4096 : 2048 },
    },
  };

  if (useSearch) {
    body.tools = [{ google_search: {} }];
  }

  async function attempt(withJsonMime) {
    const reqBody = JSON.parse(JSON.stringify(body));
    if (!useSearch && withJsonMime) {
      reqBody.generationConfig.responseMimeType = "application/json";
    }

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqBody),
      signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`API request failed (${response.status}): ${errorBody || response.statusText}`);
    }

    const data = await response.json();

    const candidate = data.candidates?.[0];
    if (!candidate?.content?.parts?.length) {
      console.error("No content in Gemini response:", JSON.stringify(data));
      throw new Error("Could not extract results. Please try again.");
    }

    // Filter OUT thinking parts — only keep actual output text
    const text = candidate.content.parts
      .filter((p) => p.text && !p.thought)
      .map((p) => p.text)
      .join("");

    if (!text) {
      // Fallback: try ALL parts if filtering left nothing
      const allText = candidate.content.parts
        .filter((p) => p.text)
        .map((p) => p.text)
        .join("");
      console.warn("No non-thought text found, trying all parts. Length:", allText.length);

      if (allText) {
        const parsed = parseGeminiJson(allText);
        if (parsed) return parsed;
      }
      throw new Error("Empty response from API. Please try again.");
    }

    const parsed = parseGeminiJson(text);
    if (parsed) return parsed;

    throw new Error("No JSON found in response.");
  }

  // Retry wrapper — up to 3 total attempts
  async function attemptWithRetry(withJsonMime, maxRetries = 2) {
    let lastError;
    for (let i = 0; i <= maxRetries; i++) {
      if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
      try {
        return await attempt(withJsonMime);
      } catch (e) {
        lastError = e;
        if (e.name === "AbortError") throw e;
        if (i < maxRetries) {
          console.warn(`Attempt ${i + 1} failed (${withJsonMime ? "JSON mime" : "plain"}), retrying...`, e.message);
        }
      }
    }
    throw lastError;
  }

  // For non-search: try strict JSON mode first, fallback to plain text
  if (!useSearch) {
    try {
      return await attemptWithRetry(true, 1);
    } catch (e) {
      if (e.name === "AbortError") throw e;
      console.warn("JSON mime mode failed, retrying without:", e.message);
      return await attemptWithRetry(false, 1);
    }
  }

  return await attemptWithRetry(false, 2);
}

export async function fetchHighlights(destination, days, budgetPerPerson, visitStyle, isStudent, signal) {
  const { system, user } = buildHighlightsPrompt(destination, days, budgetPerPerson, visitStyle, isStudent);
  const data = await callGemini(system, user, true, signal);
  const normalized = normalizeHighlights(data, destination, days, visitStyle, isStudent);

  if (!normalized.accommodation || normalized.mustVisitRestaurants.length === 0 || normalized.mustVisitAttractions.length === 0) {
    throw new Error("Highlights response was incomplete. Please try again.");
  }

  return normalized;
}

export async function fetchItinerary(destination, days, budgetPerPerson, visitStyle, isStudent, highlights, signal) {
  const { system, user } = buildItineraryPrompt(destination, days, budgetPerPerson, visitStyle, isStudent, highlights);
  const data = await callGemini(system, user, false, signal);
  return normalizeItinerary(data, highlights, days);
}
