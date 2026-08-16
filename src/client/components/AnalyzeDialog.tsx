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
  const [sideChoice, setSideChoice] = useState<"Yes" | "No" | null>(null);
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

  const aiSide: "Yes" | "No" | null =
    analysis?.recommendation === "yes" ? "Yes" : analysis?.recommendation === "no" ? "No" : null;
  const side = sideChoice ?? aiSide;

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

  const sideBadge = side
    ? side === "Yes"
      ? "border-secondary/40 bg-secondary/15 text-secondary"
      : "border-tertiary/40 bg-tertiary/15 text-tertiary-bright"
    : "border-border bg-container/60 text-muted";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/60 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-lg border-2 bg-glass-panel backdrop-blur-[32px] animate-pulse-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <span className="text-label-caps font-mono text-secondary">AI Prediction</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-[14px] leading-none text-muted transition hover:text-on-surface"
          >
            ✕
          </button>
        </div>

        {error && <p className="px-5 py-4 text-sm text-error">{error}</p>}
        {!error && !analysis && <p className="px-5 py-4 text-sm text-on-surface-variant">Analyzing…</p>}

        {analysis && (
          <div className="space-y-4 px-5 py-4 text-sm">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[15px] font-medium leading-snug text-on-surface">{target.question}</p>
              {analysis.recommendation !== "avoid" && (
                <span className={`shrink-0 rounded border px-2 py-0.5 text-label-caps font-mono ${sideBadge}`}>
                  {side ? `Buy ${side}` : "Check"}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 rounded border border-border bg-container/60 p-3">
              <div>
                <p className="text-label-caps font-mono text-muted">Confidence</p>
                <p className="font-mono text-data-lg text-on-surface tabular-nums">
                  {Math.round(analysis.confidence * 100)}%
                </p>
              </div>
              <div>
                <p className="text-label-caps font-mono text-muted">Fair value</p>
                <p className="font-mono text-data-lg text-on-surface tabular-nums">
                  {analysis.fairValue != null ? `${(analysis.fairValue * 100).toFixed(1)}¢` : "—"}
                </p>
              </div>
            </div>

            <p className="leading-relaxed text-on-surface-variant">{analysis.rationale}</p>

            {tradable ? (
              <div className="space-y-4">
                <div>
                  <p className="text-label-caps font-mono text-muted">Side</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-1 rounded border border-border bg-container p-1">
                    <button
                      type="button"
                      onClick={() => setSideChoice("Yes")}
                      className={
                        side === "Yes"
                          ? "rounded bg-linear-to-r from-secondary-deep to-secondary px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_0_18px_rgba(76,214,251,0.45)]"
                          : "rounded px-3 py-1.5 text-[12px] font-semibold text-muted transition hover:text-on-surface"
                      }
                    >
                      Buy Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setSideChoice("No")}
                      className={
                        side === "No"
                          ? "rounded bg-linear-to-r from-error-container to-tertiary px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_0_18px_rgba(230,57,70,0.45)]"
                          : "rounded px-3 py-1.5 text-[12px] font-semibold text-muted transition hover:text-on-surface"
                      }
                    >
                      Buy No
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="bet-size" className="text-label-caps font-mono text-muted">
                    Size
                  </label>
                  <input
                    id="bet-size"
                    type="number"
                    min={1}
                    step={1}
                    value={sizeUsd}
                    onChange={(e) => setSizeUsd(Number(e.target.value) || 0)}
                    className="w-24 rounded border border-border bg-container px-2 py-1 font-mono text-[12px] text-on-surface tabular-nums outline-none transition focus:border-secondary/60"
                  />
                  <span className="font-mono text-[12px] text-on-surface-variant tabular-nums">
                    @ {(price! * 100).toFixed(1)}¢ → {(sizeUsd / price!).toFixed(1)} shares
                  </span>
                </div>

                {betError && <p className="text-[12px] text-error">{betError}</p>}

                {!result && (
                  <button
                    type="button"
                    onClick={placeBet}
                    disabled={submitting}
                    className={
                      side === "Yes"
                        ? "w-full rounded bg-linear-to-r from-secondary-deep to-secondary px-4 py-2 text-[13px] font-semibold text-white transition hover:animate-glow disabled:opacity-50"
                        : "w-full rounded bg-linear-to-r from-error-container to-tertiary px-4 py-2 text-[13px] font-semibold text-white transition hover:shadow-[0_0_20px_rgba(230,57,70,0.4)] disabled:opacity-50"
                    }
                  >
                    {submitting ? "Placing…" : `Buy ${side} · ${USDC.format(sizeUsd)}`}
                  </button>
                )}

                {result && (
                  <div className="rounded border border-secondary/40 bg-secondary/10 px-3 py-2 font-mono text-[12px] text-secondary tabular-nums">
                    Bought {result.fill.shares.toFixed(1)} shares of {side} at {(result.fill.price * 100).toFixed(1)}¢
                    for {USDC.format(result.trade.sizeUsd)} — paper trade #{result.trade.id}.
                  </div>
                )}
              </div>
            ) : (
              <p className="rounded border border-border bg-container/60 px-3 py-2 text-[12px] text-muted">
                No trade — the AI recommends avoiding this market.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}