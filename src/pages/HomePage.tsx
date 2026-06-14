import { Activity, Camera, ChevronDown, Shield } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Gender, UserProfile } from '../types/profile'
import { DEFAULT_PROFILE } from '../types/profile'
import { compressImage, readFileAsDataUrl, saveProfile } from '../lib/storage'

export function HomePage() {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const loadingRef = useRef(false)
  const [showAdvanced, setShowAdvanced] = useState(true)
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)

  function updateProfile<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  async function handleFile(file: File) {
    if (loadingRef.current) return
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }
    if (profile.age < 18 || profile.age > 80) {
      alert('请输入 18–80 之间的年龄')
      return
    }
    loadingRef.current = true
    try {
      saveProfile(profile)
      const raw = await readFileAsDataUrl(file)
      const compressed = await compressImage(raw)
      sessionStorage.setItem('healthscan:photo', compressed)
      navigate('/scan', { state: { photoDataUrl: compressed, profile } })
    } catch {
      alert('图片读取失败，请重试')
    } finally {
      loadingRef.current = false
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-8">
      <div className="flex-1">
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img
            src="/og.png"
            alt="HealthScan Pro AI 全身体检"
            className="h-36 w-full object-cover sm:h-44"
          />
          <div className="px-4 py-3 text-center">
            <h1 className="font-heading text-xl font-bold text-primary-800">HealthScan Pro</h1>
            <p className="mt-0.5 text-sm text-slate-600">AI 全身体检 · 3 分钟出报告</p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full cursor-pointer items-center justify-between text-left"
          >
            <h2 className="text-base font-semibold text-slate-900">基本信息</h2>
            <ChevronDown
              className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                showAdvanced ? 'rotate-180' : ''
              }`}
              aria-hidden
            />
          </button>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div className="col-span-2">
                <label htmlFor="gender" className="mb-1 block text-xs font-medium text-slate-600">
                  性别
                </label>
                <select
                  id="gender"
                  value={profile.gender}
                  onChange={(e) => updateProfile('gender', e.target.value as Gender)}
                  className="w-full cursor-pointer rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>

              <div>
                <label htmlFor="age" className="mb-1 block text-xs font-medium text-slate-600">
                  年龄
                </label>
                <input
                  id="age"
                  type="number"
                  inputMode="numeric"
                  min={18}
                  max={80}
                  value={profile.age}
                  onChange={(e) => updateProfile('age', Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div>
                <label htmlFor="height" className="mb-1 block text-xs font-medium text-slate-600">
                  身高 (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  inputMode="decimal"
                  min={140}
                  max={220}
                  value={profile.height}
                  onChange={(e) => updateProfile('height', Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>

              <div className="col-span-2">
                <label htmlFor="weight" className="mb-1 block text-xs font-medium text-slate-600">
                  体重 (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  min={35}
                  max={150}
                  value={profile.weight}
                  onChange={(e) => updateProfile('weight', Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                />
              </div>
            </div>
          )}

          <p className="text-sm leading-relaxed text-slate-600">
            上传正面照片，AI 将结合您的基本信息生成多系统健康体检报告。
          </p>

          <ul className="space-y-2 text-xs text-slate-500">
            <li className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden />
              照片仅在本地处理，不上传服务器
            </li>
            <li className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden />
              含血常规、生化、辅助检查等 9 大模块
            </li>
          </ul>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleFile(file)
            }}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-base font-medium text-white shadow-md transition-colors duration-200 hover:bg-primary-700 active:bg-primary-800"
          >
            <Camera className="h-5 w-5" aria-hidden />
            拍照 / 选择照片
          </button>
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] text-slate-400">
        本服务仅供娱乐，非医疗诊断
      </p>
    </div>
  )
}
