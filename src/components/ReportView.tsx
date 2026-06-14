import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  FileText,
  Stethoscope,
  User,
} from 'lucide-react'
import type { Report } from '../types/report'
import { countAbnormalMetrics } from '../types/report'
import { CollapsibleSection } from './CollapsibleSection'
import { ModuleCard } from './ModuleCard'

interface ReportViewProps {
  report: Report
  id?: string
}

export function ReportView({ report, id = 'report-content' }: ReportViewProps) {
  const { meta, modules } = report
  const totalAbnormal = countAbnormalMetrics(modules)

  const defaultOpenState = useMemo(() => {
    const state: Record<string, boolean> = {
      summary: true,
      patient: true,
    }
    for (const mod of modules) {
      state[mod.id] = false
    }
    return state
  }, [modules])

  const [openSections, setOpenSections] = useState(defaultOpenState)

  function setSectionOpen(key: string, open: boolean) {
    setOpenSections((prev) => ({ ...prev, [key]: open }))
  }

  function expandAll() {
    const all: Record<string, boolean> = { summary: true, patient: true }
    for (const mod of modules) all[mod.id] = true
    setOpenSections(all)
  }

  function collapseAll() {
    const all: Record<string, boolean> = { summary: true, patient: false }
    for (const mod of modules) all[mod.id] = false
    setOpenSections(all)
  }

  return (
    <div id={id} className="bg-[#F0FDFA] p-3 sm:p-4">
      {/* 报告封面 */}
      <header className="mb-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b-2 border-primary-600 bg-primary-600 px-4 py-3 text-center text-white">
          <div className="flex items-center justify-center gap-2">
            <Stethoscope className="h-5 w-5" aria-hidden />
            <h1 className="font-heading text-base font-bold tracking-wide sm:text-lg">
              {meta.institution}
            </h1>
          </div>
          <p className="mt-1 text-xs text-primary-100">健康体检报告</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-b border-slate-100 px-4 py-3 text-[11px] text-slate-600">
          <div>
            <span className="text-slate-400">报告编号：</span>
            <span className="font-mono font-medium">{meta.id}</span>
          </div>
          <div>
            <span className="text-slate-400">体检日期：</span>
            {meta.timestamp}
          </div>
          <div>
            <span className="text-slate-400">报告日期：</span>
            {meta.reportDate}
          </div>
          <div>
            <span className="text-slate-400">检测设备：</span>
            {meta.device}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="cursor-pointer rounded border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 transition-colors duration-200 hover:bg-slate-50"
            >
              全部展开
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="cursor-pointer rounded border border-slate-200 px-2.5 py-1 text-[11px] text-slate-600 transition-colors duration-200 hover:bg-slate-50"
            >
              全部收起
            </button>
          </div>
          <span className="text-[11px] text-slate-500">
            共 {totalAbnormal} 项需关注
          </span>
        </div>
      </header>

      {/* 受检者信息 */}
      <CollapsibleSection
        title="一、受检者基本信息"
        subtitle="Personal Information"
        open={openSections.patient}
        onOpenChange={(o) => setSectionOpen('patient', o)}
        badge={
          <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] text-primary-700">
            <User className="mr-0.5 inline h-3 w-3" aria-hidden />
            已录入
          </span>
        }
        defaultOpen
      >
        <div className="flex gap-4">
          <img
            src={meta.photoDataUrl}
            alt="受检者采样照片"
            className="h-24 w-20 shrink-0 rounded border border-slate-200 object-cover"
          />
          <dl className="grid flex-1 grid-cols-2 gap-x-3 gap-y-2 text-xs">
            <div>
              <dt className="text-slate-400">性别</dt>
              <dd className="font-medium text-slate-800">{meta.profile.genderLabel}</dd>
            </div>
            <div>
              <dt className="text-slate-400">年龄</dt>
              <dd className="font-medium text-slate-800">{meta.profile.age} 岁</dd>
            </div>
            <div>
              <dt className="text-slate-400">身高</dt>
              <dd className="font-mono text-slate-800">{meta.profile.height} cm</dd>
            </div>
            <div>
              <dt className="text-slate-400">体重</dt>
              <dd className="font-mono text-slate-800">{meta.profile.weight} kg</dd>
            </div>
            <div>
              <dt className="text-slate-400">BMI</dt>
              <dd className="font-mono text-slate-800">{meta.profile.bmi}</dd>
            </div>
            <div>
              <dt className="text-slate-400">体检类型</dt>
              <dd className="text-slate-800">AI 全项体检</dd>
            </div>
          </dl>
        </div>
      </CollapsibleSection>

      {/* 总检结论 */}
      <div className="mt-3">
        <CollapsibleSection
          title="二、体检综述与总检结论"
          subtitle="Summary & Chief Conclusion"
          open={openSections.summary}
          onOpenChange={(o) => setSectionOpen('summary', o)}
          badge={
            totalAbnormal > 0 ? (
              <span className="flex items-center gap-0.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-800">
                <AlertTriangle className="h-3 w-3" aria-hidden />
                {totalAbnormal} 项需关注
              </span>
            ) : undefined
          }
          defaultOpen
        >
          <div className="mb-3 flex items-center justify-between rounded-lg bg-primary-50 px-3 py-2.5">
            <span className="text-xs font-medium text-primary-800">综合健康评分</span>
            <span className="font-heading font-mono text-2xl font-bold text-primary-700">
              {meta.overallScore}
              <span className="text-sm font-normal">/100</span>
            </span>
          </div>

          <p className="mb-3 text-xs leading-relaxed text-slate-700">
            {meta.overallSummary}
          </p>

          <div className="mb-3">
            <h4 className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-800">
              <FileText className="h-3.5 w-3.5 text-primary-600" aria-hidden />
              主要阳性发现
            </h4>
            <ol className="space-y-1.5">
              {meta.positiveFindings.map((item, i) => (
                <li key={item} className="flex gap-2 text-xs leading-relaxed text-slate-700">
                  <span className="shrink-0 font-mono text-slate-400">{i + 1}.</span>
                  {item}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-2.5">
            <h4 className="mb-1 text-xs font-semibold text-slate-800">总检结论</h4>
            <p className="text-xs leading-relaxed text-slate-700">{meta.chiefConclusion}</p>
          </div>

          <div className="mt-3 border-t border-slate-100 pt-2">
            <h4 className="mb-1.5 text-xs font-semibold text-slate-800">建议复查项目</h4>
            <ul className="space-y-1">
              {meta.followUp.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-slate-600">
                  <ChevronDown className="mt-0.5 h-3 w-3 shrink-0 -rotate-90 text-primary-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 flex justify-between border-t border-slate-100 pt-2 text-[11px] text-slate-500">
            <span>主检医师：{meta.physician}</span>
            <span>审核：{meta.reviewer}</span>
          </div>
        </CollapsibleSection>
      </div>

      {/* 分项结果 */}
      <div className="mt-3">
        <h2 className="mb-2 px-1 text-xs font-semibold text-slate-600">
          三、分项检查结果与解读
        </h2>
        <div className="space-y-2">
          {modules.map((mod) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              open={openSections[mod.id] ?? false}
              onOpenChange={(o) => setSectionOpen(mod.id, o)}
            />
          ))}
        </div>
      </div>

      <footer className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-center">
        <p className="text-[10px] leading-relaxed text-slate-400">
          本报告仅供娱乐，非医疗诊断 · 照片未上传至任何服务器
          <br />
          参考区间因检测方法不同可能存在差异，请以机构实际标注为准
        </p>
      </footer>
    </div>
  )
}
