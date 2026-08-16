import { Hono } from 'hono'

import { fetchGammaMarkets } from './lib/gamma.ts'
import { toMarket } from './lib/quality.ts'
import { analyzeMarket } from './lib/ai.ts'
import { getExecutor } from './lib/executor.ts'
import { insertPaperTrade } from './lib/ledger.ts'

interface BetBody {
  marketId?: string;
  question?: string;
  side?: string;
  price?: number;
  sizeUsd?: number;
  aiConfidence?: number | null;
  reason?: string;
}

type Env = {
  Bindings: {
    DB: D1Database;
    OPENROUTER_API_KEY?: string;
    POLYMARKET_MODEL?: string;
    RELAYER_API_KEY?: string;
    RELAYER_API_KEY_ADDRESS?: string;
  }
}

const app = new Hono<Env>()

export default app

app.get("/api/markets", async (response) => {
  const limit = Math.min(200, Math.max(1, Number(response.req.query("limit")) || 60));
  const raw = await fetchGammaMarkets({ limit });
  const markets = raw
    .map(toMarket)
    .filter((market) => market.yes !== null)
    .sort((a,b) => b.quality.total - a.quality.total);

  return response.json({ markets });
});

app.post("/api/analyze", async (response) => {
  const { question, yesPrice } = await response.req.json<{ question?: string; yesPrice?: number | null }>();

  if (!question) return response.json({ error: "question is required" }, 400);

  const analysis = await analyzeMarket(response.env, question, yesPrice ?? null);

  return response.json(analysis);
});

app.post("/api/bet", async (response) => {
  const body = await response.req
    .json<BetBody>()
    .catch(() => ({} as BetBody));

  const { marketId, question, side, price, sizeUsd } = body;
  if (!marketId || !question || (side !== "Yes" && side !== "No")) {
    return response.json({ error: "marketId, question and side (Yes|No) are required" }, 400);
  }
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return response.json({ error: "price must be a number" }, 400);
  }
  if (typeof sizeUsd !== "number" || !(sizeUsd > 0)) {
    return response.json({ error: "sizeUsd must be a positive number" }, 400);
  }

  // Paper trading only for now; live mode requires the relayer + key handling.
  const executor = getExecutor("paper", response.env as unknown as Record<string, string | undefined>);

  let fill;
  try {
    fill = await executor.buy({ marketId, side, price, sizeUsd });
  } catch (e) {
    return response.json({ error: (e as Error).message }, 400);
  }

  const trade = await insertPaperTrade(response.env.DB, {
    marketId,
    question,
    side,
    entryPrice: fill.price,
    sizeUsd,
    shares: fill.shares,
    aiConfidence: body.aiConfidence ?? null,
    reason: (body.reason ?? "").slice(0, 280),
  });

  return response.json({ fill, trade });
});

