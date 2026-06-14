import { INSTITUTION, SITE_TAGLINE } from '../config/site'

export function CoverBanner() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <svg
        viewBox="0 0 800 320"
        role="img"
        aria-label={INSTITUTION}
        className="block h-36 w-full sm:h-40"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="cover-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ecfeff" />
            <stop offset="100%" stopColor="#f0fdfa" />
          </linearGradient>
          <linearGradient id="cover-accent" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0e7490" />
          </linearGradient>
        </defs>
        <rect width="800" height="320" fill="url(#cover-bg)" />
        <rect x="0" y="0" width="800" height="6" fill="url(#cover-accent)" />
        <g opacity="0.12" stroke="#0891b2" strokeWidth="1">
          <path d="M0 80 H800 M0 160 H800 M0 240 H800" />
          <path d="M160 0 V320 M320 0 V320 M480 0 V320 M640 0 V320" />
        </g>
        <circle cx="620" cy="120" r="72" fill="none" stroke="#0891b2" strokeWidth="2" opacity="0.35" />
        <circle cx="620" cy="120" r="52" fill="none" stroke="#0891b2" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
        <ellipse cx="620" cy="118" rx="22" ry="28" fill="#cffafe" stroke="#0891b2" strokeWidth="1.5" />
        <path d="M608 148 Q620 158 632 148" fill="none" stroke="#0891b2" strokeWidth="1.5" />
        <circle cx="612" cy="112" r="2.5" fill="#0e7490" />
        <circle cx="628" cy="112" r="2.5" fill="#0e7490" />
        <text x="48" y="108" fill="#134e4a" fontSize="42" fontWeight="700" fontFamily="PingFang SC, Microsoft YaHei, sans-serif">
          {INSTITUTION}
        </text>
        <text x="48" y="152" fill="#0e7490" fontSize="22" fontFamily="PingFang SC, Microsoft YaHei, sans-serif">
          {SITE_TAGLINE}
        </text>
        <text x="48" y="200" fill="#64748b" fontSize="16" fontFamily="PingFang SC, Microsoft YaHei, sans-serif">
          智能分析 · 多系统评估 · 约 20 分钟出报告
        </text>
        <rect x="48" y="228" width="180" height="36" rx="8" fill="url(#cover-accent)" />
        <text x="68" y="252" fill="#fff" fontSize="15" fontWeight="600" fontFamily="PingFang SC, Microsoft YaHei, sans-serif">
          开始体检
        </text>
      </svg>
    </div>
  )
}
