import type { Market } from '../../shared/types.ts'

function marketLink(slug: string) {
  return slug ? `https://polymarket.com/event/${slug}` : "https://polymarket.com";
}

function cents(price: number | null) {
  return price == null ? "—" : `${(price * 100).toFixed(1)}¢`;
}

const compactUsdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

function compactUsd(n: number) {
  return compactUsdFormatter.format(n);
}

function ProbabilityBar({ yes, no }: { yes: number | null; no: number | null }) {
  const yesPct = yes != null ? Math.round(yes * 100) : 0;
  const noPct = no != null ? Math.round(no * 100) : yes ? 100 - yesPct : 0;
  const yesWidth = Math.max(0, Math.min(100, yesPct));
  const noWidth = Math.max(0, Math.min(100 - yesWidth, noPct));

  return (
    <div className="relative h-6 overflow-hidden rounded border border-border bg-surface-high">
      {yesWidth > 0 && (
        <div
          className="absolute inset-y-0 left-0 bg-linear-to-r from-secondary-deep to-secondary"
          style={{ width: `${yesWidth}%` }}
        />
      )}
      {noWidth > 0 && (
        <div className="absolute inset-y-0 right-0 bg-tertiary" style={{ width: `${noWidth}%` }} />
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="rounded bg-bg/80 px-1.5 font-mono text-[10px] font-semibold leading-4 text-on-surface tabular-nums">
          {yes != null ? `${yesPct}%` : "—"}
        </span>
      </div>
    </div>
  );
}

export function MarketsList({ markets, onAnalyze }: { markets: Market[]; onAnalyze: (market: Market) => void }) {
  if (!markets.length) {
    return (
      <p className="rounded-lg border border-border bg-glass p-6 text-sm text-on-surface-variant">
        Couldn't load markets. The Polymarket Gamma API may be rate-limiting — try again.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {markets.map((market) => (
        <article
          key={market.id}
          className="rounded-lg border border-border bg-glass p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[20px]"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-label-caps font-mono text-muted">
              <span className="inline-block size-1.5 rounded-full bg-secondary animate-pulse-dot" />
              LIVE
            </span>
            <span className="font-mono text-[12px] text-muted tabular-nums">
              {market.quality.grade} · {market.quality.total}
            </span>
          </div>

          <a
            href={marketLink(market.slug)}
            target="_blank"
            rel="noreferrer"
            className="mb-3 block text-[15px] font-medium leading-snug text-on-surface transition hover:text-secondary"
          >
            {market.question}
          </a>

          <ProbabilityBar yes={market.yes} no={market.no} />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-label-caps font-mono text-muted">Volume</p>
              <p className="font-mono text-[12px] leading-5 text-on-surface-variant tabular-nums">
                {compactUsd(market.volume)}
              </p>
            </div>

            <div className="flex items-center gap-4 font-mono text-[12px] tabular-nums">
              <span className="text-secondary">
                {cents(market.yes)} <span className="text-muted">Yes</span>
              </span>
              <span className="text-tertiary-bright">
                {cents(market.no)} <span className="text-muted">No</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => onAnalyze(market)}
              className="rounded bg-primary px-3 py-1.5 text-[12px] font-semibold text-on-primary transition hover:animate-glow"
            >
              IA Insight
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}