import type { Report } from '../types/report'
import type { UserProfile } from '../types/profile'
import { DEFAULT_PROFILE } from '../types/profile'

const PHOTO_KEY = 'healthscan:photo'
const REPORT_KEY = 'healthscan:report'
const PROFILE_KEY = 'healthscan:profile'

export function saveProfile(profile: UserProfile): void {
  sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function loadProfile(): UserProfile {
  const raw = sessionStorage.getItem(PROFILE_KEY)
  if (!raw) return DEFAULT_PROFILE
  try {
    return JSON.parse(raw) as UserProfile
  } catch {
    return DEFAULT_PROFILE
  }
}

export function saveSession(photoDataUrl: string, report: Report): void {
  sessionStorage.setItem(PHOTO_KEY, photoDataUrl)
  sessionStorage.setItem(REPORT_KEY, JSON.stringify(report))
}

export function loadReport(): Report | null {
  const raw = sessionStorage.getItem(REPORT_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Report
  } catch {
    return null
  }
}

export function loadPhoto(): string | null {
  return sessionStorage.getItem(PHOTO_KEY)
}

export function clearSession(): void {
  sessionStorage.removeItem(PHOTO_KEY)
  sessionStorage.removeItem(REPORT_KEY)
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function compressImage(dataUrl: string, maxSize = 640): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas not supported'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = dataUrl
  })
}
