# Wanderlust

**Enter a destination, budget, and trip length — get a complete itinerary with restaurants, attractions, hotels, and real prices.**

## The Problem

Planning a trip takes hours. You're toggling between Google Maps, TripAdvisor, booking sites, and blog posts — copying restaurant names into spreadsheets, cross-referencing prices, and trying to build a schedule that makes geographic sense. AI chatbots help, but they hallucinate prices and give you a wall of text you still have to organize yourself.

## The Solution

Wanderlust runs a **two-phase API pipeline** to solve both problems. Phase 1 uses **Gemini 2.5 Flash** with **web search grounding** to pull real-time pricing and availability data. Phase 2 structures everything into a day-by-day itinerary with restaurants, attractions, and hotels — organized by geography so you're not zigzagging across the city.

The result: a trip plan you can actually use, generated in seconds, with prices sourced from the live web.


![React](https://img.shields.io/badge/React_18-61DAFB?logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite_6-646CFF?logo=vite&logoColor=white) ![Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?logo=google&logoColor=white)


https://github.com/user-attachments/assets/71bb3389-2a4a-4d5d-9ae0-a1251b10ad80

<img width="2764" height="1632" alt="b0bab9b385db6d81edf97ba831da9406" src="https://github.com/user-attachments/assets/be141ddd-f20d-447a-9e5f-fcf9d2806f76" />


---


---

## Features

- **One-click generation** — enter destination, budget, and trip length, get a full itinerary instantly
- **Real pricing** — web search grounding via **Gemini 2.5 Flash** pulls actual prices, not hallucinated numbers
- **Day-by-day schedule** — organized by location proximity, not random order
- **Restaurant picks** — curated dining recommendations with cuisine type and price range
- **Attraction highlights** — key sights with visit duration and cost estimates
- **Hotel recommendations** — accommodation options matched to your stated budget
- **Two-phase API architecture** — Phase 1 gathers web data, Phase 2 structures the itinerary
- **Japanese-inspired design** — clean typography using **Noto Serif JP** and **Zen Maru Gothic**

---

## How It Works

### User Flow

```
Enter destination + budget + trip length
              ↓
    Phase 1: Gemini API + Web Search
    (pulls real prices, ratings, hours)
              ↓
    Phase 2: Gemini API + Structuring
    (builds day-by-day itinerary)
              ↓
    Rendered itinerary with restaurants,
    attractions, hotels, and schedule
```

### Two-Phase API Pipeline

| Phase | What It Does |
|---|---|
| **Phase 1 — Research** | Calls **Gemini 2.5 Flash** with web search grounding enabled. Gathers real-time data: restaurant menus, hotel rates, attraction hours, ticket prices. |
| **Phase 2 — Structuring** | Takes Phase 1 output and organizes it into a structured, day-by-day plan. Groups locations by geography, balances activities across days, fits within the stated budget. |

This two-phase approach separates data collection from planning — the same pattern used in production AI systems to reduce hallucination and improve output quality.

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/rileyxion1203/Wanderlust.git
cd Wanderlust
npm install
```

### 2. Set up your API key

Create a `.env` file in the project root:

```
VITE_GEMINI_KEY=your_gemini_api_key_here
```

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:5173`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | **React 18**, **Vite 6** |
| AI Engine | **Google Gemini 2.5 Flash** (with web search grounding) |
| Styling | **CSS Variables** + Inline Styles |
| Typography | **Noto Serif JP**, **Zen Maru Gothic** |

---

## Project Structure

```
├── src/                # React application source
├── docs/               # Demo GIFs and documentation assets
├── index.html          # Entry point
├── vite.config.js      # Vite configuration
├── package.json        # Dependencies and scripts
└── .env.example        # API key template
```

---

## Why Two Phases Instead of One?

A single LLM call tries to research and plan at the same time — leading to hallucinated prices, missing details, and poor structure. By splitting the pipeline into research (Phase 1) and planning (Phase 2), Wanderlust gets the best of both: grounded data from the live web and a well-organized itinerary that actually fits your budget and timeline. This is the same retrieval-then-generate pattern behind production RAG systems.

---

## License

MIT

---

Built by [Riley Xiong](https://github.com/rileyxion1203)
