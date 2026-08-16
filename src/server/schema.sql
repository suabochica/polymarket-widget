CREATE TABLE IF NOT EXISTS trades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mode TEXT NOT NULL DEFAULT 'paper',        -- paper | live
  market_id TEXT NOT NULL,
  question TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT '',
  side TEXT NOT NULL,                         -- YES | NO
  entry_price REAL NOT NULL,
  size_usd REAL NOT NULL,
  shares REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',        -- open | closed
  pnl REAL NOT NULL DEFAULT 0,
  exit_price REAL,
  current_price REAL,                         -- last mark-to-market price (open positions)
  ai_confidence REAL,
  reason TEXT NOT NULL DEFAULT '',
  opened_at TEXT NOT NULL DEFAULT (datetime('now')),
  closed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_trades_status ON trades(status);
CREATE INDEX IF NOT EXISTS idx_trades_opened ON trades(opened_at);
CREATE INDEX IF NOT EXISTS idx_trades_market ON trades(market_id);
