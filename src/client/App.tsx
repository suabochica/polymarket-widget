import { useState, useEffect, useCallback } from "react"

import type { Market } from '../shared/types.ts'
import { api } from './lib/api.ts'

import './App.css'
import { Markets } from './pages/Markets.tsx'

function App() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMarkets = useCallback(async () => {
    setLoading(true);

    try {
      const [markets] = await Promise.all([
        api.markets(40).catch(() => [])
      ])

      setMarkets(markets);
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => { loadMarkets() }, [loadMarkets])

  return (
    <>
      <section id="center">
        <div>
          <h1>Polymarket Widget</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <Markets markets={markets}/>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
