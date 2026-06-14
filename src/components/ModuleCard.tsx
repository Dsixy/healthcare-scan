import type { ReportModule } from '../types/report'
import { CollapsibleSection } from './CollapsibleSection'
import { MetricTable } from './MetricTable'

interface ModuleCardProps {
  module: ReportModule
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ModuleCard({ module, open, onOpenChange }: ModuleCardProps) {
  const abnormal = module.abnormalCount ?? 0

  const badge =
    abnormal > 0 ? (
      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
        {abnormal} 项异常
      </span>
    ) : (
      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
        未见异常
      </span>
    )

  const title = module.sectionNo
    ? `${module.sectionNo} ${module.title}`
    : module.title

  return (
    <CollapsibleSection
      sectionId={`module-${module.id}`}
      title={title}
      subtitle={module.titleEn}
      badge={badge}
      open={open}
      onOpenChange={onOpenChange}
    >
      {module.summary && (
        <p className="mb-3 text-xs leading-relaxed text-slate-600">
          <span className="font-medium text-slate-700">医师解读：</span>
          {module.summary}
        </p>
      )}

      <MetricTable metrics={module.metrics} />

      {module.doctorNote && (
        <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] italic text-slate-500">
          检查医师评语：{module.doctorNote}
        </p>
      )}
    </CollapsibleSection>
  )
}
