import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const STATUS = {
  planted: { label: 'Planted', bg: 'bg-sky-400/15', text: 'text-sky-500', dot: 'bg-sky-400' },
  germinated: { label: 'Sprouted', bg: 'bg-leaf-400/15', text: 'text-leaf-600', dot: 'bg-leaf-400' },
  potted: { label: 'Potted', bg: 'bg-clay-500/15', text: 'text-clay-500', dot: 'bg-clay-400' },
  shared: { label: 'Shared', bg: 'bg-berry-500/15', text: 'text-berry-500', dot: 'bg-berry-400' },
  discarded: { label: 'Gone', bg: 'bg-soil-300/20', text: 'text-soil-400', dot: 'bg-soil-300' },
}

export default function SowingsList() {
  const [sowings, setSowings] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sowings')
      .then(r => r.json())
      .then(data => { setSowings(data); setLoading(false) })
  }, [])

  const filtered = search
    ? sowings.filter(s =>
        s.sowing_code.toLowerCase().includes(search.toLowerCase()) ||
        s.seed_name.toLowerCase().includes(search.toLowerCase()) ||
        (s.variety && s.variety.toLowerCase().includes(search.toLowerCase()))
      )
    : sowings

  return (
    <div className="min-h-screen bg-soil-100">
      {/* Header */}
      <header className="relative bg-soil-900 text-soil-50 px-5 pt-12 pb-6 texture-grain overflow-hidden">
        <div className="relative z-10">
          <p className="font-body text-soil-400 text-xs tracking-widest uppercase mb-1">Garden Journal</p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Seedling Tracker
          </h1>
        </div>
        {/* Decorative leaf accent */}
        <div className="absolute -right-4 -top-2 w-32 h-32 rounded-full bg-leaf-700/10 blur-2xl" />
        <div className="absolute right-8 bottom-2 w-16 h-16 rounded-full bg-leaf-600/8 blur-xl" />
      </header>

      <div className="px-5 -mt-3 relative z-10">
        {/* Search */}
        <div className="animate-fade-up">
          <input
            type="search"
            placeholder="Search by code or name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-4 py-3.5 rounded-2xl border border-soil-200 bg-white text-soil-900 placeholder:text-soil-400 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow"
          />
        </div>

        {/* New Sowing button */}
        <Link
          to="/sowings/new"
          className="mt-4 flex items-center justify-center gap-2 w-full bg-leaf-600 hover:bg-leaf-700 active:scale-[0.98] text-white font-semibold px-5 py-3.5 rounded-2xl text-base shadow-md shadow-leaf-600/20 transition-all animate-fade-up"
          style={{ animationDelay: '0.08s' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Sowing
        </Link>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-soil-300 border-t-leaf-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-soil-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-soil-400"><path d="M12 22c6-3 10-7 10-12A4 4 0 0 0 18 6c-2 0-3.5 1-4.5 2.5a6 6 0 0 0-3-2.5"/><path d="M7 15c-2-1-4-3.5-4-7a3 3 0 0 1 6 0"/><path d="M12 22V10"/></svg>
            </div>
            <p className="font-display text-xl text-soil-700 mb-1">Nothing planted yet</p>
            <p className="text-soil-400 text-sm">Tap the button above to log your first sowing</p>
          </div>
        ) : (
          <div className="mt-5 space-y-3 stagger-children pb-8">
            {filtered.map(s => {
              const status = STATUS[s.status] || STATUS.planted
              return (
                <Link
                  key={s.id}
                  to={`/sowings/${s.id}`}
                  className="block bg-white rounded-2xl p-4 border border-soil-200/60 shadow-sm hover:shadow-md active:scale-[0.99] transition-all"
                >
                  <div className="flex items-start gap-3">
                    {s.thumbnail ? (
                      <img
                        src={`/uploads/${s.thumbnail}`}
                        alt=""
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 ring-1 ring-soil-200"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-soil-100 to-soil-200 flex items-center justify-center flex-shrink-0">
                        <span className="font-display text-lg text-soil-400 font-medium">{s.seed_name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs text-soil-400 tracking-wide">{s.sowing_code}</span>
                        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                      <p className="font-display text-base font-semibold text-soil-900 truncate leading-snug">{s.seed_name}</p>
                      {s.variety && (
                        <p className="text-sm text-soil-500 truncate">{s.variety}</p>
                      )}
                      <p className="text-xs text-soil-400 mt-1">Sown {s.sowing_date}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-soil-300 flex-shrink-0 mt-5"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
