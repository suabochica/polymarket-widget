import type { Side, Trade } from "../../../src/shared/types.ts";

// A paper trade captured from POST /api/bet, before it is persisted.
export interface NewTrade {
  marketId: string;
  question: string;
  side: Side;
  entryPrice: number;
  sizeUsd: number;
  shares: number;
  aiConfidence: number | null;
  reason: string;
}

// Persists a paper fill. Uses the D1 binding when available (wrangler dev /
// Cloudflare). The Vite dev middleware (vite.config.ts) only exposes .env vars,
// so without a DB binding we fall back to an in-memory ledger for the session.
export async function insertPaperTrade(db: D1Database | undefined, t: NewTrade): Promise<Trade> {
  if (db) {
    const res = await db
      .prepare(
        `INSERT INTO trades
           (mode, market_id, question, side, entry_price, size_usd, shares, status, pnl, exit_price, current_price, ai_confidence, reason, opened_at)
         VALUES ('paper', ?, ?, ?, ?, ?, ?, 'open', 0, NULL, ?, ?, ?, datetime('now'))
         RETURNING *`,
      )
      .bind(t.marketId, t.question, t.side, t.entryPrice, t.sizeUsd, t.shares, t.entryPrice, t.aiConfidence, t.reason)
      .first<TradeRow>();

    if (res) return hydrate(res);
    throw new Error("Trade insert returned no row.");
  }

  const id = memSeq++;
  const trade: Trade = {
    id,
    mode: "paper",
    marketId: t.marketId,
    question: t.question,
    side: t.side,
    entryPrice: t.entryPrice,
    sizeUsd: t.sizeUsd,
    shares: t.shares,
    status: "open",
    pnl: 0,
    exitPrice: null,
    currentPrice: t.entryPrice,
    aiConfidence: t.aiConfidence,
    reason: t.reason,
    openedAt: new Date().toISOString(),
    closedAt: null,
  };
  memTrades.push(trade);
  return trade;
}

interface TradeRow {
  id: number;
  market_id: string;
  question: string;
  side: Side;
  entry_price: number;
  size_usd: number;
  shares: number;
  status: "open" | "closed";
  pnl: number;
  exit_price: number | null;
  current_price: number | null;
  ai_confidence: number | null;
  reason: string;
  opened_at: string;
  closed_at: string | null;
}

function hydrate(r: TradeRow): Trade {
  return {
    id: r.id,
    mode: "paper",
    marketId: r.market_id,
    question: r.question,
    side: r.side,
    entryPrice: r.entry_price,
    sizeUsd: r.size_usd,
    shares: r.shares,
    status: r.status,
    pnl: r.pnl,
    exitPrice: r.exit_price ?? null,
    currentPrice: r.current_price ?? null,
    aiConfidence: r.ai_confidence ?? null,
    reason: r.reason,
    openedAt: r.opened_at,
    closedAt: r.closed_at ?? null,
  };
}

let memSeq = 1;
const memTrades: Trade[] = [];