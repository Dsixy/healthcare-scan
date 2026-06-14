import { assetUrl } from '../config/site'

export function CoverBanner() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <img
        src={assetUrl('cover.svg')}
        alt="福健健康体检中心"
        className="block h-36 w-full object-cover object-left sm:h-40"
        loading="eager"
        decoding="async"
      />
    </div>
  )
}
