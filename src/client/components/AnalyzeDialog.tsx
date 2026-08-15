import { useState, useEffect } from 'react'
import { type Analysis } from '../../shared/types.ts'
import { api } from '../lib/api';

export interface AnalyzeTarget {
  question: string;
  yes: number | null;
}

export function AnalyzeDialog({ target, onClose }: { target: AnalyzeTarget; onClose: () => void }) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);

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
          </div>
        )}
      </div>
    </div>
  );
}
