import { Hono } from 'hono'

import { fetchGammaMarkets } from './lib/gamma.ts'
import { toMarket } from './lib/quality.ts'

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

  const tmp = response.json({ markets })

  console.log(tmp)

  return tmp;
});
