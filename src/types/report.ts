export type Status = 'normal' | 'attention' | 'mild-impairment'
export type Trend = 'high' | 'low' | 'normal'

export interface Metric {
  name: string
  nameEn?: string
  value: string
  unit?: string
  reference: string
  status: Status
  trend?: Trend
  score?: number
  note?: string
}

export interface ReportModule {
  id: string
  sectionNo?: string
  title: string
  titleEn?: string
  highlight?: boolean
  summary?: string
  doctorNote?: string
  metrics: Metric[]
  abnormalCount?: number
}

export interface UserProfileSnapshot {
  gender: 'male' | 'female'
  genderLabel: string
  age: number
  height: number
  weight: number
  bmi: number
}

export interface ReportMeta {
  id: string
  institution: string
  timestamp: string
  reportDate: string
  device: string
  photoDataUrl: string
  profile: UserProfileSnapshot
  overallScore: number
  overallSummary: string
  chiefConclusion: string
  positiveFindings: string[]
  followUp: string[]
  physician: string
  reviewer: string
}

export interface Report {
  meta: ReportMeta
  modules: ReportModule[]
}

export const STATUS_LABELS: Record<Status, string> = {
  normal: '正常',
  attention: '偏高',
  'mild-impairment': '轻度障碍',
}

export const STATUS_COLORS: Record<Status, string> = {
  normal: 'text-emerald-700',
  attention: 'text-amber-700',
  'mild-impairment': 'text-red-700 font-semibold',
}

export const STATUS_BG: Record<Status, string> = {
  normal: 'bg-emerald-50',
  attention: 'bg-amber-50',
  'mild-impairment': 'bg-red-50',
}

export const TREND_SYMBOL: Record<Trend, string> = {
  high: '↑',
  low: '↓',
  normal: '',
}

export function countAbnormalMetrics(modules: ReportModule[]): number {
  return modules.reduce(
    (sum, m) => sum + m.metrics.filter((x) => x.status !== 'normal').length,
    0,
  )
}

export function countModuleAbnormal(mod: ReportModule): number {
  return mod.metrics.filter((x) => x.status !== 'normal').length
}
