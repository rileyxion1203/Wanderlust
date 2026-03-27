# ✦ Wanderlust — AI Travel Planner

An AI-powered travel itinerary generator built with React and Claude API. Enter a destination, trip length, and budget — get a complete day-by-day travel plan in seconds.

![Wanderlust Screenshot](./docs/screenshot-landing.png)

## Live Demo

> ⚡ [Try it here](#) _(deploy link)_

## Features

- **AI-Generated Itineraries** — Structured day-by-day plans with real places, restaurants, and activities
- **3 Budget Tiers** — Budget ($50-100/day), Comfort ($150-300/day), Luxury ($400-800/day)
- **Smart Budget Tracking** — Visual comparison of estimated costs vs. budget ceiling
- **Responsive Design** — Clean UI that works on desktop, tablet, and mobile
- **Dark Mode** — Automatic theme switching via `prefers-color-scheme`
- **Error Handling** — Graceful fallbacks for API failures, input validation, loading states

## Tech Stack

| Layer     | Tech                          |
| --------- | ----------------------------- |
| Frontend  | React 18, Vite                |
| Styling   | CSS Modules + CSS Variables   |
| AI        | Claude API (Anthropic)        |
| Hosting   | Vercel / Netlify (suggested)  |

## Project Structure

```
ai-travel-planner/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── claude.js          # API layer — prompt engineering + fetch logic
│   ├── components/
│   │   ├── LandingPage.jsx    # Input form with destination, days, budget
│   │   ├── LoadingScreen.jsx  # Animated loading state
│   │   ├── ErrorScreen.jsx    # Error fallback with retry
│   │   ├── ResultsPage.jsx    # Full itinerary display
│   │   ├── DayCard.jsx        # Single day itinerary card
│   │   ├── TimeSlot.jsx       # Morning/Afternoon/Evening block
│   │   ├── RestaurantCard.jsx # Restaurant recommendation
│   │   ├── AccommodationCard.jsx
│   │   └── BudgetOverview.jsx # Budget summary + tips
│   ├── hooks/
│   │   └── useItinerary.js    # Custom hook for generation state machine
│   ├── styles/
│   │   ├── variables.css      # Design tokens (colors, spacing, radius)
│   │   ├── global.css         # Reset + animations
│   │   └── components/        # Per-component CSS modules
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Anthropic API key ([get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ai-travel-planner.git
cd ai-travel-planner

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Anthropic API key

# Start dev server
npm run dev
```

The app will be running at `http://localhost:5173`.

### Environment Variables

| Variable              | Description                | Required |
| --------------------- | -------------------------- | -------- |
| `VITE_ANTHROPIC_KEY`  | Anthropic API key          | Yes      |

## How It Works

1. **User inputs** destination, number of days (1–14), and budget level
2. **Prompt engineering** constructs a structured system prompt that forces Claude to output valid JSON matching a strict schema
3. **Claude API** generates a complete itinerary with real locations, restaurants, costs, and travel tips
4. **React frontend** renders the structured data as interactive day cards with budget tracking

### Prompt Design

The system prompt enforces a strict JSON schema so the AI output is always parseable:

```
System: You are a travel planning expert. Generate a detailed
day-by-day itinerary as valid JSON ONLY...

User: Plan a 5-day trip to Tokyo with a moderate ($150-300/day)
budget. Include real, well-known places and restaurants...
```

See [`src/api/claude.js`](./src/api/claude.js) for the full prompt template.

## Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Set `VITE_ANTHROPIC_KEY` in your Vercel project's environment variables.

### Netlify

```bash
npm run build
# Deploy the `dist/` folder
```

## Design Decisions

- **No backend server** — API calls go directly from client to Anthropic. For production, add a proxy server to protect the API key.
- **CSS Variables over Tailwind** — Keeps the bundle small and demonstrates raw CSS architecture skills.
- **State machine pattern** — App state transitions (`input → loading → results | error`) are explicit and predictable.
- **Separated concerns** — API logic, UI components, and styling are in distinct directories.

## Future Enhancements (Out of MVP Scope)

- [ ] User auth + saved itineraries
- [ ] Interactive map visualization (Mapbox/Google Maps)
- [ ] PDF export of itineraries
- [ ] Multi-language support
- [ ] Streaming API response for real-time generation feedback

## License

MIT

---

Built as a portfolio project demonstrating React architecture, API integration, prompt engineering, and UI design.
