# 🔮 Synthetic Forecast — Polymarket Widget

A single-page prediction-market widget for **Polymarket** with **AI-assisted** betting decisions. Browse live markets, ask an LLM for a recommendation, and place **paper (simulated) bets** in one flow.

> ⚠️ **Geo-restriction:** Polymarket is only accessible from the **United States** region. If you're elsewhere, connect to a **VPN in the US** before using the widget to see live market data.

The UI follows the **Synthetic Forecast** design system — a deep-space navy, glassmorphism aesthetic built for high-density market data (see [`DESIGN.md`](./DESIGN.md)). Created using [Stich](https://stitch.withgoogle.com/).

## 🎬 Demo

![Synthetic Forecast widget demo](public/00-syntetic-forecast.gif)

## ✨ Features

- **Market feed** — top markets from the Polymarket Gamma API, ranked by quality, rendered as glass cards with a live probability bar (Yes/No).
- **AI prediction** — each market gets an LLM recommendation (`yes` / `no` / `avoid`) via OpenRouter, including confidence and fair-value estimate.
- **One-click paper bets** — pick a side (or follow the AI recommendation), choose a size in USDC, and get an instant simulated fill with a persistent trade record.
- **Design-system UI** — Tailwind v4 token theme, Inter + JetBrains Mono, pulsing "active intelligence" AI panel.

## 🧰 Tech Stack

| Layer | Tech |
| --- | --- |
| Client | React 19, TypeScript, Tailwind CSS v4, Vite |
| Server | Hono, run by Vite middleware in dev, Cloudflare Workers / D1 in production |
| AI | OpenRouter (default `anthropic/claude-sonnet-4`) |
| Data | Polymarket Gamma API (`gamma-api.polymarket.com`) |

## 🚀 Getting Started

Requires **Node.js** and **pnpm**.

```sh
pnpm install
cp .env.example .env   # then fill in your keys
pnpm dev               # http://localhost:5173
```

> ⚠️ Remember to **turn on your US VPN** — Gamma returns empty data outside the US.

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | Yes (for AI) | OpenRouter API key used for market analysis |
| `POLYMARKET_MODEL` | No | Model ID to use; defaults to `anthropic/claude-sonnet-4` |
| `RELAYER_API_KEY` | No | Reserved for live trading (not implemented) |
| `RELAYER_API_KEY_ADDRESS` | No | Reserved for live trading (not implemented) |

## 📜 Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server (client + Hono `/api`) |
| `pnpm build` | Type-check (`tsc -b`) and produce a production build |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview the production build locally |

## 🔌 API

The Hono server exposes the following endpoints under `/api`:

| Endpoint | Description |
| --- | --- |
| `GET /api/markets?limit=N` | Top markets from Gamma, mapped + quality-ranked |
| `POST /api/analyze` | Body: `{ question, yesPrice }` → `{ recommendation, confidence, fairValue, rationale }` |
| `POST /api/bet` | Body: `{ marketId, question, side, price, sizeUsd, aiConfidence?, reason? }` → `{ fill, trade }` |

## 🧪 Paper Trading & Persistence

Bets are **paper trades only** — no real money moves. Live execution is intentionally stubbed out and throws unless the relayer integration is built.

- **Dev (`pnpm dev`):** the Vite middleware has no D1 binding, so trades are kept in an **in-memory ledger** for the session.
- **Wrangler / Cloudflare:** trades persist to the D1 `trades` table. Apply the schema with:

```sh
wrangler d1 execute polymarket-widget-db --file=src/server/schema.sql
```

## 📁 Project Structure

```
src/
├── client/          # React UI (theme, App, components, API client)
├── server/          # Hono API (routes, gamma, ai, executor, ledger)
└── shared/          # Types shared between client and server
docs/
├── diagrams/        # PlantUML diagrams (use case, activity, sequence, component)
└── ui/              # Design mockups (atoms, markets, place-bet)
```

More context: [roadmap](./docs/roadmap.md), [diagrams](./docs/diagrams), [design system](./DESIGN.md).

## 👣 Next Steps

The following features would be nice to have in the widget but weren't delivered due to time constraints:

- A search bar to find a market by name.
- A filter system to filter markets by quality, price, and volume.
- Unit tests for the codebase.
- An enabled `live` trading mode to execute real transactions.
- A Dockerized project.
- Persist bet in a store database.

## 📄 License

[MIT](./LICENSE)
