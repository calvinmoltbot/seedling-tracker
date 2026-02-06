import { useState, useEffect } from 'react'
import { listSowings, updateSowing } from '../services/api'
import { STATUS, STATUS_TRANSITIONS, ACTION_LABELS } from '../utils/constants'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'

export default function QuickStatusUpdate() {
  const [sowings, setSowings] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    listSowings().then(data => {
      setSowings(data)
      setLoading(false)
    })
  }, [])

  const actionable = sowings.filter(s => {
    const transitions = STATUS_TRANSITIONS[s.status] || []
    return transitions.length > 0
  })

  const filtered = search
    ? actionable.filter(s =>
        s.sowing_code.toLowerCase().includes(search.toLowerCase()) ||
        s.seed_name.toLowerCase().includes(search.toLowerCase()) ||
        (s.variety && s.variety.toLowerCase().includes(search.toLowerCase()))
      )
    : actionable

  async function handleStatusUpdate(id, newStatus) {
    setUpdating(id)
    try {
      const updated = await updateSowing(id, { status: newStatus })
      setSowings(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s))
    } catch (err) {
      console.error('Update failed:', err)
    }
    setUpdating(null)
  }

  return (
    <div className="min-h-screen bg-soil-100">
      <div className="md:hidden">
        <PageHeader title="Quick Update" subtitle="Status Change" />
      </div>

      <div className="p-5 pb-24 md:pb-5">
        <div className="hidden md:block mb-5">
          <h2 className="font-display text-2xl font-semibold text-soil-900">Quick Update</h2>
          <p className="text-soil-500 text-sm mt-1">Walk along the bench, tap to update.</p>
        </div>

        {/* Search */}
        <input
          type="search"
          placeholder="Search by code or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl border border-soil-200 bg-white text-soil-900 placeholder:text-soil-400 text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow mb-4"
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-soil-300 border-t-leaf-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-display text-lg text-soil-700 mb-1">
              {actionable.length === 0 ? 'Nothing to update' : 'No matches'}
            </p>
            <p className="text-soil-400 text-sm">
              {actionable.length === 0
                ? 'All sowings are at their final status'
                : 'Try a different search term'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(s => {
              const transitions = STATUS_TRANSITIONS[s.status] || []
              const isUpdating = updating === s.id

              return (
                <div
                  key={s.id}
                  className={`bg-white rounded-2xl border border-soil-200/60 p-4 transition-all ${isUpdating ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {s.thumbnail ? (
                      <img src={s.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0 ring-1 ring-soil-200" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-soil-100 to-soil-200 flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-base text-soil-400 font-medium">{s.seed_name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="font-mono text-xs text-soil-400 tracking-wide">{s.sowing_code}</span>
                      <p className="font-display text-base font-semibold text-soil-900 truncate">{s.seed_name}</p>
                      {s.variety && <p className="text-sm text-soil-500 truncate">{s.variety}</p>}
                    </div>
                    <StatusBadge status={s.status} />
                  </div>

                  <div className="flex gap-2">
                    {transitions.map(nextStatus => (
                      <button
                        key={nextStatus}
                        onClick={() => handleStatusUpdate(s.id, nextStatus)}
                        disabled={isUpdating}
                        className="flex-1 bg-leaf-600/10 border border-leaf-600/20 text-leaf-700 font-semibold py-3 rounded-xl text-sm active:scale-[0.98] transition-all hover:bg-leaf-600/15 min-h-[44px]"
                      >
                        {ACTION_LABELS[nextStatus]}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
