import { useState, useEffect } from "react"

import type { Market } from '../shared/types.ts'
import { api } from './lib/api.ts'

import { type AnalyzeTarget, AnalyzeDialog } from './components/AnalyzeDialog.tsx'
import { MarketsList } from './components/MarketsList.tsx'

function App() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [analyze, setAnalyze] = useState<AnalyzeTarget | null>(null);

  useEffect(() => {
    let cancelled = false;

    api.markets(40)
      .then((data) => { if (!cancelled) setMarkets(data) })
      .catch((error) => { if (!cancelled) console.error(error) });

    return () => { cancelled = true };
  }, [])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-glass backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <h1 className="text-[18px] font-semibold leading-6 tracking-[-0.01em]">Synthetic Forecast</h1>
          <span className="text-label-caps font-mono text-muted">Polymarket · Paper</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <MarketsList
          markets={markets}
          onAnalyze={(m) => setAnalyze({ id: m.id, question: m.question, yes: m.yes, no: m.no })}
        />
      </main>

      {analyze && <AnalyzeDialog key={analyze.question} target={analyze} onClose={() => setAnalyze(null)} />}
    </>
  )
}

export default App