import type { Metric } from '../types/report'
import {
  STATUS_BG,
  STATUS_COLORS,
  STATUS_LABELS,
  TREND_SYMBOL,
} from '../types/report'
import { ScoreBar } from './ScoreBar'

interface MetricTableProps {
  metrics: Metric[]
  showScoreBars?: boolean
}

export function MetricTable({ metrics, showScoreBars }: MetricTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] text-slate-500">
            <th className="px-2 py-2 font-medium">检查项目</th>
            <th className="px-2 py-2 font-medium">结果</th>
            <th className="px-2 py-2 font-medium">参考范围</th>
            <th className="px-2 py-2 font-medium text-right">提示</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((metric) => {
            const trend = metric.trend && metric.trend !== 'normal' ? TREND_SYMBOL[metric.trend] : ''
            const valueText = metric.unit
              ? `${metric.value} ${metric.unit}${trend}`
              : `${metric.value}${trend}`

            return (
              <tr
                key={metric.name}
                className={`border-b border-slate-100 last:border-0 ${
                  metric.status !== 'normal' ? STATUS_BG[metric.status] : ''
                }`}
              >
                <td className="px-2 py-2.5 align-top text-slate-800">
                  <div>{metric.name}</div>
                  {metric.nameEn && (
                    <div className="text-[10px] text-slate-400">{metric.nameEn}</div>
                  )}
                </td>
                <td className="px-2 py-2.5 align-top font-mono text-slate-900">
                  {valueText}
                </td>
                <td className="px-2 py-2.5 align-top font-mono text-slate-500">
                  {metric.reference}
                </td>
                <td className={`px-2 py-2.5 align-top text-right ${STATUS_COLORS[metric.status]}`}>
                  {STATUS_LABELS[metric.status]}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {showScoreBars && (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
          {metrics
            .filter((m) => m.score !== undefined)
            .map((m) => (
              <div key={`bar-${m.name}`}>
                <div className="mb-1 flex justify-between text-[11px] text-slate-600">
                  <span>{m.name}</span>
                  <span className="font-mono">{m.score}/100</span>
                </div>
                <ScoreBar score={m.score!} status={m.status} />
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
