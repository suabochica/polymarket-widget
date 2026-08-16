import type { Market } from '../../shared/types.ts'

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th
      className={`bg-surface-sunken px-3 py-2.5 text-[12px] font-semibold tracking-[0.04em] text-muted ${right ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  );
}

function Td({ children, right, className }: { children?: React.ReactNode; right?: boolean; className?: string }) {
  return (
    <td className={`px-3 py-2.5 align-middle ${right ? "text-right tnum" : ""} ${className || ""}`}>{children}</td>
  );
}

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

function Question({ q, slug }: { q: string; slug: string }) {
  return (
    <a href={marketLink(slug)} target="_blank" rel="noreferrer" className="hover:underline">
      {q}
    </a>
  );
}

export function MarketsTable({ markets, onAnalyze }: { markets: Market[]; onAnalyze: (market: Market) => void }) {
  if (!markets.length) return <p>Couldn't load markets. The Polymarket Gamma API may be rate-limiting — try again.</p>;
  return (
    <div className="-mx-5 -mb-4 overflow-x-auto">
      <table className="w-full border-collapse text-[13px]">
        <thead>
          <tr>
            <Th>Market</Th>
            <Th right>YES</Th>
            <Th right>Volume</Th>
            <Th>Quality</Th>
            <Th />
          </tr>
        </thead>
        <tbody>
          {markets.map((market) => (
            <tr key={market.id} className="border-t border-border hover:bg-surface-sunken">
              <Td><Question q={market.question} slug={market.slug} /></Td>
              <Td right>{cents(market.yes)}</Td>
              <Td right>{compactUsd(market.volume)}</Td>
              <Td>{market.quality.grade} · {market.quality.total}</Td>
              <Td right>
                <button
                  type="button"
                  onClick={() => onAnalyze(market)}
                  className="rounded border border-border px-2 py-1 text-[12px] hover:bg-surface-sunken"
                >
                  Analyze
                </button>
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
