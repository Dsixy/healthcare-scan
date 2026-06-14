import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { generateReportFromPhoto } from '../lib/generateReport'
import { loadPhoto, loadProfile, saveSession } from '../lib/storage'
import type { UserProfile } from '../types/profile'

const STEPS = [
  { label: '正在解析面部几何特征…', duration: 3500, featurePoints: true },
  { label: '估算骨龄与代谢年龄…', duration: 3000 },
  { label: '关联 cardiovascular 风险模型…', duration: 3200 },
  { label: '扫描 micro-expression 压力指数…', duration: 3000 },
  { label: '运行 neuro-cognitive 关联推断…', duration: 4000, highlight: true },
  { label: '生成多系统综合报告…', duration: 2800 },
]

const TOTAL_DURATION = STEPS.reduce((s, x) => s + x.duration, 0)

export function ScanPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { photoDataUrl?: string; profile?: UserProfile } | null
  const photoDataUrl = state?.photoDataUrl ?? loadPhoto()
  const profile = state?.profile ?? loadProfile()
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [featureCount] = useState(() => 450 + Math.floor(Math.random() * 30))
  const finishingRef = useRef(false)

  const currentStep = STEPS[stepIndex]
  const isHighlight = currentStep?.highlight

  useEffect(() => {
    if (!photoDataUrl) {
      navigate('/', { replace: true })
      return
    }

    let cancelled = false
    let elapsed = 0
    const startTime = Date.now()

    const timer = window.setInterval(() => {
      if (cancelled || finishingRef.current) return

      elapsed = Date.now() - startTime
      const pct = Math.min(99, Math.round((elapsed / TOTAL_DURATION) * 100))
      setProgress(pct)

      let accumulated = 0
      for (let i = 0; i < STEPS.length; i++) {
        accumulated += STEPS[i].duration
        if (elapsed < accumulated) {
          setStepIndex(i)
          break
        }
      }

      if (elapsed >= TOTAL_DURATION) {
        finishingRef.current = true
        clearInterval(timer)
        setProgress(100)
        setStepIndex(STEPS.length - 1)

        void generateReportFromPhoto(photoDataUrl, profile).then((report) => {
          if (cancelled) return
          saveSession(photoDataUrl, report)
          setTimeout(() => {
            if (!cancelled) navigate('/report', { replace: true })
          }, 600)
        })
      }
    }, 50)

    return () => {
      cancelled = true
      clearInterval(timer)
    }
  }, [photoDataUrl, navigate])

  if (!photoDataUrl) return null

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-8">
      <div className="mb-6 text-center">
        <h1 className="text-lg font-semibold text-primary-700">AI 分析中</h1>
        <p className="mt-1 text-xs text-slate-500">HealthScan Pro v3.2</p>
      </div>

      <div className="relative mx-auto mb-8 aspect-square w-full max-w-xs overflow-hidden rounded-2xl border-2 border-primary-200 bg-slate-900 shadow-lg">
        <img
          src={photoDataUrl}
          alt="分析中"
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,168,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,168,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
        <div className="scan-line absolute inset-x-0 h-16" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border-2 border-white/30 p-1">
            <div className="h-32 w-32 rounded-full border-2 border-dashed border-primary-300/60" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>分析进度</span>
          <span className="font-mono">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className={`h-full rounded-full transition-[width] duration-150 ease-linear ${
              isHighlight ? 'bg-orange-500' : 'bg-primary-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={`rounded-xl border p-4 transition-colors ${
          isHighlight
            ? 'border-orange-300 bg-orange-50'
            : 'border-slate-200 bg-white'
        }`}
      >
        <p className="text-sm font-medium text-slate-800">
          {currentStep?.label ?? '准备中…'}
        </p>
        {currentStep?.featurePoints && (
          <p className="mt-2 font-mono text-xs text-primary-600">
            已定位 {featureCount} 个面部特征点
          </p>
        )}
        {isHighlight && (
          <p className="mt-2 text-xs text-orange-700">
            正在运行神经认知关联模型…
          </p>
        )}
      </div>

      <p className="mt-6 text-center text-[10px] text-slate-400">
        请保持页面打开，分析即将完成
      </p>
    </div>
  )
}
