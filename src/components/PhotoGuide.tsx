import { Camera, Check, ImageIcon, X } from 'lucide-react'

const PHOTO_DOS = [
  '正面面对镜头，面部完整入镜',
  '使用近期照片（建议 3 个月内）',
  '光线均匀，五官清晰可见',
  '仅包含本人单人人脸',
]

const PHOTO_DONTS = [
  '侧脸、遮挡面部或戴墨镜',
  '模糊、过暗或滤镜过重的图片',
  '合影、证件照截图或非本人照片',
]

export function PhotoGuide() {
  return (
    <div className="rounded-xl border border-primary-100 bg-primary-50/50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
          2
        </span>
        <h3 className="text-sm font-semibold text-slate-900">人脸采样</h3>
      </div>
      <p className="mb-3 text-sm leading-relaxed text-slate-700">
        请<strong className="font-medium text-slate-900">现场拍摄</strong>
        或<strong className="font-medium text-slate-900">上传近期正脸照</strong>
        ，系统将据此进行面部特征分析并生成体检报告。
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <ul className="space-y-2">
          {PHOTO_DOS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs text-slate-600">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
        <ul className="space-y-2">
          {PHOTO_DONTS.map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs text-slate-500">
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        照片仅用于本次报告生成，在您的设备本地处理，不会上传至服务器。
      </p>
    </div>
  )
}

interface PhotoUploadButtonsProps {
  onCamera: () => void
  onGallery: () => void
  loading?: boolean
}

export function PhotoUploadButtons({ onCamera, onGallery, loading }: PhotoUploadButtonsProps) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onCamera}
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-base font-medium text-white shadow-md transition-colors duration-200 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-60"
      >
        <Camera className="h-5 w-5" aria-hidden />
        拍摄近期正脸照
      </button>
      <button
        type="button"
        onClick={onGallery}
        disabled={loading}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary-200 bg-white py-3 text-sm font-medium text-primary-700 transition-colors duration-200 hover:bg-primary-50 disabled:opacity-60"
      >
        <ImageIcon className="h-4 w-4" aria-hidden />
        从相册选择照片
      </button>
      <p className="text-center text-[11px] text-slate-400">
        建议优先使用摄像头现场拍摄，以保证照片为近期正脸
      </p>
    </div>
  )
}
