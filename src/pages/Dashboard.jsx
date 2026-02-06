import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listSowings, getStats } from '../services/api'
import { STATUS } from '../utils/constants'
import StatusBadge from '../components/StatusBadge'
import StatsBar from '../components/StatsBar'
import CalendarView from '../components/CalendarView'
import PageHeader from '../components/PageHeader'

function SowingRow({ sowing, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-soil-50 transition-colors text-left border-b border-soil-100 last:border-0"
    >
      {sowing.thumbnail ? (
        <img src={sowing.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 ring-1 ring-soil-200" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-soil-100 to-soil-200 flex items-center justify-center flex-shrink-0">
          <span className="font-display text-sm text-soil-400 font-medium">{sowing.seed_name.charAt(0)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-soil-400 tracking-wide">{sowing.sowing_code}</span>
          <StatusBadge status={sowing.status} />
        </div>
        <p className="font-display text-sm font-semibold text-soil-900 truncate">{sowing.seed_name}</p>
      </div>
      <span className="text-xs text-soil-400 flex-shrink-0">{sowing.sowing_date}</span>
    </button>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [sowings, setSowings] = useState([])
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([listSowings(), getStats()])
      .then(([data, statsData]) => {
        setSowings(data)
        setStats(statsData)
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    let result = sowings

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(s =>
        s.sowing_code.toLowerCase().includes(q) ||
        s.seed_name.toLowerCase().includes(q) ||
        (s.variety && s.variety.toLowerCase().includes(q))
      )
    }

    if (statusFilter) {
      result = result.filter(s => s.status === statusFilter)
    }

    if (selectedDate) {
      result = result.filter(s =>
        s.sowing_date === selectedDate || s.germination_date === selectedDate
      )
    }

    return result
  }, [sowings, search, statusFilter, selectedDate])

  if (loading) {
    return (
      <div className="min-h-screen bg-soil-100">
        <PageHeader title="Seedling Tracker" subtitle="Garden Journal" />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-soil-200/60 p-4 h-20 animate-pulse" />
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-soil-200/60 p-5 h-80 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soil-100">
      {/* Mobile header - hidden on desktop since AppShell has sidebar */}
      <div className="md:hidden">
        <PageHeader title="Seedling Tracker" subtitle="Garden Journal" />
      </div>

      <div className="p-5 pb-24 md:pb-5 space-y-5">
        {/* Desktop title */}
        <div className="hidden md:block">
          <h1 className="font-display text-3xl lg:text-4xl font-semibold text-soil-900 tracking-tight">Dashboard</h1>
          <p className="text-soil-500 text-sm mt-1">Your garden at a glance</p>
        </div>

        {stats && <StatsBar stats={stats} />}

        {/* Desktop: calendar + table side by side */}
        <div className="md:grid md:grid-cols-[1fr_2fr] md:gap-5">
          <CalendarView
            sowings={sowings}
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
          />

          <div className="mt-5 md:mt-0">
            {/* Search + filters */}
            <div className="flex gap-2 mb-3">
              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-soil-200 bg-white text-soil-900 placeholder:text-soil-400 text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow"
              />
              <select
                value={statusFilter || ''}
                onChange={e => setStatusFilter(e.target.value || null)}
                className="px-3 py-2.5 rounded-xl border border-soil-200 bg-white text-soil-700 text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
              >
                <option value="">All status</option>
                {Object.entries(STATUS).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Buttons row */}
            <div className="flex gap-2 mb-3 md:hidden">
              <Link
                to="/quick-add"
                className="flex-1 flex items-center justify-center gap-2 bg-leaf-600 hover:bg-leaf-700 active:scale-[0.98] text-white font-semibold px-4 py-3 rounded-2xl text-sm shadow-md shadow-leaf-600/20 transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Quick Add
              </Link>
              {sowings.length > 0 && (
                <Link
                  to="/print?mode=sheet"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-soil-200 hover:border-soil-300 active:scale-[0.98] text-soil-600 font-semibold px-3 py-3 rounded-2xl text-sm transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                </Link>
              )}
            </div>

            {selectedDate && (
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-soil-500">Showing events for {selectedDate}</span>
                <button onClick={() => setSelectedDate(null)} className="text-sm text-leaf-600 font-medium px-2 py-1 -my-1 min-h-[44px] flex items-center">Clear</button>
              </div>
            )}

            {/* Sowing list */}
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-soil-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-soil-400"><path d="M12 22c6-3 10-7 10-12A4 4 0 0 0 18 6c-2 0-3.5 1-4.5 2.5a6 6 0 0 0-3-2.5"/><path d="M7 15c-2-1-4-3.5-4-7a3 3 0 0 1 6 0"/><path d="M12 22V10"/></svg>
                </div>
                <p className="font-display text-lg text-soil-700 mb-1">
                  {sowings.length === 0 ? 'Nothing planted yet' : 'No matches'}
                </p>
                <p className="text-soil-400 text-sm">
                  {sowings.length === 0
                    ? 'Tap Quick Add to log your first sowing'
                    : 'Try a different search or filter'}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-soil-200/60 overflow-hidden">
                {filtered.map(s => (
                  <SowingRow
                    key={s.id}
                    sowing={s}
                    onClick={() => navigate(`/sowings/${s.id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
