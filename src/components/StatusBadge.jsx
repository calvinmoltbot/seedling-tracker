import { STATUS } from '../utils/constants'

export default function StatusBadge({ status, size = 'sm' }) {
  const config = STATUS[status] || STATUS.planted

  if (size === 'lg') {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full font-medium ${config.bg} ${config.text}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        {config.label}
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
