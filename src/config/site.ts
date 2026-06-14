export const INSTITUTION = '福健健康体检中心'
export const SITE_TITLE = '福健体检'
export const SITE_TAGLINE = '全身体检 · 在线报告查询'
export const DEVICE_NAME = '福健智能体检系统 v3.2'

/** 部署后的完整站点 URL，用于分享文案；自定义域名后改环境变量 VITE_PUBLIC_URL */
export const PUBLIC_SITE_URL =
  import.meta.env.VITE_PUBLIC_URL ?? 'https://checker-gamma-five.vercel.app'

export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
