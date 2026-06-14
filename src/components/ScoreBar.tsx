import type { Status } from '../types/report'

interface ScoreBarProps {
  score: number
  status: Status
}

const BAR_COLORS: Record<Status, string> = {
  normal: 'bg-emerald-500',
  attention: 'bg-amber-500',
  'mild-impairment': 'bg-red-500',
}

export function ScoreBar({ score, status }: ScoreBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all ${BAR_COLORS[status]}`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className="font-mono text-xs text-slate-500">{score}</span>
    </div>
  )
}
