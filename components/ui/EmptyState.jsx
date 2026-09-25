import { Inbox } from 'lucide-react'

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className = '',
  compact = false,
}) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] px-4 text-center ${compact ? 'py-7' : 'py-12'} ${className}`}>
      <div className={`mb-4 flex items-center justify-center rounded-2xl border border-[#30343d] bg-[#15171c] text-[#8a8f98] ${compact ? 'size-11' : 'size-14'}`}>
        <Icon className={compact ? 'size-5' : 'size-6'} aria-hidden="true" />
      </div>
      <p className="text-sm font-semibold text-white">{title}</p>
      {description && <p className="mt-1.5 w-full text-xs leading-5 text-[#8a8f98] sm:text-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
