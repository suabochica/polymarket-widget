import { useState, useEffect } from 'react'
import { type Analysis, type BetResult } from '../../shared/types.ts'
import { api } from '../lib/api.ts';

export interface AnalyzeTarget {
  id: string;
  question: string;
  yes: number | null;
  no: number | null;
}

const USDC = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function AnalyzeDialog({ target, onClose }: { target: AnalyzeTarget; onClose: () => void }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sizeUsd, setSizeUsd] = useState(10);
  const [submitting, setSubmitting] = useState(false);
  const [betError, setBetError] = useState<string | null>(null);
  const [result, setResult] = useState<BetResult | null>(null);

  useEffect(() => {
    let live = true;
    api
      .analyze(target.question, target.yes)
      .then((a) => live && setAnalysis(a))
      .catch((e) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, [target.question, target.yes]);

  const side = analysis?.recommendation === "yes" ? ("Yes" as const) : analysis?.recommendation === "no" ? ("No" as const) : null;

  const noFallback = target.no ?? (target.yes != null ? 1 - target.yes : null);
  const price = side === "Yes" ? target.yes : side === "No" ? noFallback : null;
  const tradable = side !== null && price != null && price > 0 && price < 1;

  const placeBet = async () => {
    if (!tradable || !analysis || !side || price == null) return;
    setSubmitting(true);
    setBetError(null);
    try {
      const res = await api.bet({
        marketId: target.id,
        question: target.question,
        side,
        price,
        sizeUsd,
        aiConfidence: analysis.confidence,
        reason: analysis.rationale,
      });
      setResult(res);
    } catch (e) {
      setBetError((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.16)]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Analyze Dialog</h2>
        {error && <p className="p-4 text-sm">{error}</p>}
        {!error && !analysis && <p className="p-4 text-sm">Analyzing…</p>}
        {analysis && (
          <div className="p-4 text-sm">
            <p>{target.question}</p>
            <p>
              Recommendation: {analysis.recommendation} ({Math.round(analysis.confidence * 100)}% confident)
            </p>
            {analysis.fairValue != null && <p>Fair value: {(analysis.fairValue * 100).toFixed(1)}¢</p>}
            <p>{analysis.rationale}</p>

            {tradable ? (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <label htmlFor="bet-size" title="Paper-trade notional in USDC">
                    Bet {side}
                  </label>
                  <input
                    id="bet-size"
                    type="number"
                    min={1}
                    step={1}
                    value={sizeUsd}
                    onChange={(e) => setSizeUsd(Number(e.target.value) || 0)}
                    className="w-24 rounded border border-border bg-surface-sunken px-2 py-1 text-[12px]"
                  />
                  <span className="text-[12px] text-muted">
                    at {(price! * 100).toFixed(1)}¢ → {(sizeUsd / price!).toFixed(1)} shares
                  </span>
                </div>
                {betError && <p className="text-[12px] text-red-500">{betError}</p>}
                {!result && (
                  <button
                    type="button"
                    onClick={placeBet}
                    disabled={submitting}
                    className="rounded border border-border px-2 py-1 text-[12px] hover:bg-surface-sunken disabled:opacity-50"
                  >
                    {submitting ? "Placing…" : "Bet"}
                  </button>
                )}
                {result && (
                  <p className="text-[12px]">
                    Bought {result.fill.shares.toFixed(1)} shares of {side} at {(result.fill.price * 100).toFixed(1)}¢
                    for {USDC.format(result.trade.sizeUsd)} — paper trade #{result.trade.id}.
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-3 text-[12px] text-muted">No trade — the AI recommends avoiding this market.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}