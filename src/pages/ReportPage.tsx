import html2canvas from 'html2canvas'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ReportView } from '../components/ReportView'
import { loadReport } from '../lib/storage'

export function ReportPage() {
  const navigate = useNavigate()
  const report = loadReport()
  const [exporting, setExporting] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  if (!report) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-5">
        <p className="text-sm text-slate-600">暂无报告，请先完成检测</p>
        <Link
          to="/"
          className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm text-white transition-colors hover:bg-primary-700"
        >
          开始检测
        </Link>
      </div>
    )
  }

  async function handleExport() {
    const el = reportRef.current
    if (!el || exporting) return
    setExporting(true)
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#F0FDFA',
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `HealthScan-${report!.meta.id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      alert('保存失败，请尝试截图分享')
    } finally {
      setExporting(false)
    }
  }

  async function handleShare() {
    if (!report) return
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'HealthScan Pro 体检报告',
          text: `我的 AI 全身体检报告已出，编号 ${report.meta.id}`,
          url: window.location.origin,
        })
        return
      } catch {
        /* user cancelled */
      }
    }
    void handleExport()
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-24">
      <div ref={reportRef}>
        <ReportView report={report} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-lg gap-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex-1 cursor-pointer rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            再测一次
          </button>
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={exporting}
            className="flex-1 cursor-pointer rounded-xl border border-primary-200 py-3 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50 disabled:opacity-50"
          >
            {exporting ? '生成中…' : '保存长图'}
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex-1 cursor-pointer rounded-xl bg-primary-600 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            分享
          </button>
        </div>
      </div>
    </div>
  )
}
