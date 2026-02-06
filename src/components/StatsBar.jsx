export default function StatsBar({ stats }) {
  const items = [
    { label: 'Total', value: stats.total, color: 'text-soil-800' },
    { label: 'Active', value: stats.active, color: 'text-leaf-600' },
    { label: 'Germ. Rate', value: `${stats.germinationRate}%`, color: 'text-sky-500' },
    { label: 'Potted', value: stats.pottedCount, color: 'text-clay-500' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3">
      {items.map(item => (
        <div key={item.label} className="bg-white rounded-2xl border border-soil-200/60 p-4 text-center">
          <p className={`font-display text-3xl lg:text-5xl font-semibold ${item.color}`}>
            {item.value}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium mt-1">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  )
}
