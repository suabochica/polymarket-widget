import type { Market } from '../../shared/types.ts'
import { MarketsTable } from '../components/MarketsTable.tsx'

export function Markets({ markets, onAnalyze }: { markets: Market[]; onAnalyze: (m: Market) => void }) {
  return (
    <>
      <h2> Markets </h2>
      <MarketsTable markets={markets} onAnalyze={onAnalyze} />
    </>
  )
}
