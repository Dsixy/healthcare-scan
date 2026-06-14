import { ChevronDown } from 'lucide-react'
import { useId, useState, type ReactNode } from 'react'

interface CollapsibleSectionProps {
  title: string
  subtitle?: string
  badge?: ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  highlight?: boolean
  children: ReactNode
  sectionId?: string
}

export function CollapsibleSection({
  title,
  subtitle,
  badge,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  highlight,
  children,
  sectionId,
}: CollapsibleSectionProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : internalOpen
  const panelId = useId()

  function toggle() {
    const next = !open
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  return (
    <section
      id={sectionId}
      className={`overflow-hidden rounded-lg border bg-white ${
        highlight ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'
      }`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3.5 text-left transition-colors duration-200 ${
          highlight ? 'bg-amber-50/80 hover:bg-amber-50' : 'hover:bg-slate-50'
        }`}
      >
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-primary-600 transition-transform duration-200 ${
            open ? 'rotate-0' : '-rotate-90'
          }`}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {badge}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="border-t border-slate-100 px-4 pb-4 pt-3"
      >
        {children}
      </div>
    </section>
  )
}
