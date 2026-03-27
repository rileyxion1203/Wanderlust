import { useState, useRef } from "react";
import { fetchHighlights, fetchItinerary } from "./api/gemini.js";
import LandingPage from "./components/LandingPage.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import ErrorScreen from "./components/ErrorScreen.jsx";
import ResultsPage from "./components/ResultsPage.jsx";
import "./styles/theme.css";

export default function App() {
  const [view, setView] = useState("input");
  const [itinerary, setItinerary] = useState(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [budgetPP, setBudgetPP] = useState(200);
  const [errorMsg, setErrorMsg] = useState("");
  const lastParams = useRef(null);
  const activeRequestId = useRef(0);
  const activeAbortController = useRef(null);

  const cancelActiveRequest = () => {
    if (activeAbortController.current) {
      activeAbortController.current.abort();
      activeAbortController.current = null;
    }
  };

  const handleSubmit = async (params) => {
    cancelActiveRequest();
    const controller = new AbortController();
    const requestId = activeRequestId.current + 1;

    activeRequestId.current = requestId;
    activeAbortController.current = controller;
    lastParams.current = params;
    setBudgetPP(params.budgetPerPerson);
    setErrorMsg("");
    setView("loading");

    try {
      // Phase 1: Fetch highlights (fast — restaurants, attractions, hotel)
      const highlights = await fetchHighlights(
        params.destination, params.days, params.budgetPerPerson, params.visitStyle, params.isStudent, controller.signal
      );

      if (activeRequestId.current !== requestId || controller.signal.aborted) return;

      // Show results immediately with highlights
      setItinerary(highlights);
      setLoadingItinerary(true);
      setView("results");

      // Phase 2: Fetch day-by-day itinerary in background
      try {
        const daily = await fetchItinerary(
          params.destination, params.days, params.budgetPerPerson, params.visitStyle, params.isStudent, highlights, controller.signal
        );
        if (activeRequestId.current !== requestId || controller.signal.aborted) return;
        setItinerary((prev) => ({ ...prev, ...daily }));
      } catch (err) {
        if (err.name === "AbortError") return;
        if (activeRequestId.current !== requestId || controller.signal.aborted) return;
        console.error("Itinerary generation failed:", err);
        setItinerary((prev) => ({
          ...prev,
          days: [],
          tripTotalPerPerson: null,
          tips: ["Day-by-day itinerary could not be generated. Try again or plan manually using the highlights above."],
        }));
      }
      if (activeRequestId.current !== requestId || controller.signal.aborted) return;
      setLoadingItinerary(false);
    } catch (err) {
      if (err.name === "AbortError") return;
      if (activeRequestId.current !== requestId || controller.signal.aborted) return;
      setErrorMsg(err.message || "Failed to generate itinerary.");
      setLoadingItinerary(false);
      setView("error");
    } finally {
      if (activeRequestId.current === requestId) {
        activeAbortController.current = null;
      }
    }
  };

  const handleRetry = () => lastParams.current ? handleSubmit(lastParams.current) : setView("input");
  const handleReset = () => {
    cancelActiveRequest();
    activeRequestId.current += 1;
    setView("input");
    setItinerary(null);
    setLoadingItinerary(false);
    setErrorMsg("");
  };

  return (
    <div style={{ fontFamily: "var(--ff)", background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      {view === "input" && <LandingPage onSubmit={handleSubmit} />}
      {view === "loading" && <LoadingScreen />}
      {view === "error" && <ErrorScreen message={errorMsg} onRetry={handleRetry} />}
      {view === "results" && itinerary && (
        <ResultsPage itinerary={itinerary} budgetPerPerson={budgetPP} onReset={handleReset} loadingItinerary={loadingItinerary} />
      )}
    </div>
  );
}
