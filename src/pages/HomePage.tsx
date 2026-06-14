import { Activity, ChevronDown, Shield } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CoverBanner } from '../components/CoverBanner'
import { PhotoGuide, PhotoUploadButtons } from '../components/PhotoGuide'
import { SITE_TAGLINE, SITE_TITLE } from '../config/site'
import type { Gender, UserProfile } from '../types/profile'
import { DEFAULT_PROFILE } from '../types/profile'
import { compressImage, readFileAsDataUrl, saveProfile } from '../lib/storage'

export function HomePage() {
  const navigate = useNavigate()
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const loadingRef = useRef(false)
  const [showAdvanced, setShowAdvanced] = useState(true)
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE)
  const [uploading, setUploading] = useState(false)

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
      alert('请先填写 18–80 之间的年龄')
      return
    }
    loadingRef.current = true
    setUploading(true)
    try {
      saveProfile(profile)
      const raw = await readFileAsDataUrl(file)
      const compressed = await compressImage(raw)
      sessionStorage.setItem('healthscan:photo', compressed)
      navigate('/scan', { state: { photoDataUrl: compressed, profile } })
    } catch {
      alert('图片读取失败，请换一张近期正脸照重试')
    } finally {
      loadingRef.current = false
      setUploading(false)
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) void handleFile(file)
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-5 py-8">
      <div className="flex-1">
        <div className="mb-6">
          <CoverBanner />
          <div className="mt-3 text-center">
            <h1 className="font-heading text-xl font-bold text-primary-800">{SITE_TITLE}</h1>
            <p className="mt-0.5 text-sm text-slate-600">{SITE_TAGLINE}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex w-full cursor-pointer items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                  1
                </span>
                <h2 className="text-base font-semibold text-slate-900">填写基本信息</h2>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                  showAdvanced ? 'rotate-180' : ''
                }`}
                aria-hidden
              />
            </button>

            {showAdvanced && (
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
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

            <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <li className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden />
                信息仅保存在本机，用于生成报告
              </li>
              <li className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden />
                含血常规、生化、辅助检查等 9 大模块
              </li>
            </ul>
          </div>

          <PhotoGuide />

          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={onFileChange}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileChange}
          />

          <PhotoUploadButtons
            loading={uploading}
            onCamera={() => cameraInputRef.current?.click()}
            onGallery={() => galleryInputRef.current?.click()}
          />
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] text-slate-400">
        本服务仅供娱乐，非医疗诊断
      </p>
    </div>
  )
}
