import { useState, useEffect } from "react"

import type { Market } from '../shared/types.ts'
import { api } from './lib/api.ts'

import './App.css'

import { type AnalyzeTarget, AnalyzeDialog } from './components/AnalyzeDialog.tsx'
import { MarketsTable } from './components/MarketsTable.tsx'

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
      <section id="center">
        <div>
          <h1>Polymarket Widget</h1>
        </div>
      </section>

      <MarketsTable
        markets={markets}
        onAnalyze={(m) => setAnalyze({ id: m.id, question: m.question, yes: m.yes, no: m.no })}
      />
      {analyze && <AnalyzeDialog key={analyze.question} target={analyze} onClose={() => setAnalyze(null)} />}
      <section id="spacer"></section>
    </>
  )
}

export default App
