import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getSowing, updateSowing, deleteSowing } from '../services/api'
import { STATUS_TRANSITIONS, ACTION_LABELS } from '../utils/constants'
import { shareLabelImage } from '../utils/labelPrinter'
import StatusBadge from '../components/StatusBadge'
import PageHeader from '../components/PageHeader'

export default function SowingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [sowing, setSowing] = useState(null)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSowing(id)
      .then(data => { setSowing(data); setNotes(data.notes || ''); setLoading(false) })
      .catch(() => navigate('/'))
  }, [id])

  async function handleStatusUpdate(status) {
    const data = await updateSowing(id, { status })
    setSowing(data)
  }

  async function saveNotes() {
    const data = await updateSowing(id, { notes })
    setSowing(data)
    setEditingNotes(false)
  }

  async function handleDelete() {
    if (!window.confirm('Delete this sowing?')) return
    await deleteSowing(id)
    navigate('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-soil-100 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-soil-300 border-t-leaf-500 rounded-full animate-spin" />
    </div>
  )
  if (!sowing) return null

  const packetPhoto = sowing.photos?.find(p => p.photo_type === 'packet')
  const trayPhoto = sowing.photos?.find(p => p.photo_type === 'tray')
  const nextStatuses = STATUS_TRANSITIONS[sowing.status] || []

  return (
    <div className="min-h-screen bg-soil-100">
      <div className="md:hidden">
        <PageHeader title={sowing.seed_name} backTo="/" backLabel="Back">
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-soil-400 text-sm tracking-wide">{sowing.sowing_code}</span>
            <StatusBadge status={sowing.status} />
          </div>
          {sowing.variety && <p className="text-soil-400 text-sm mt-0.5">{sowing.variety}</p>}
        </PageHeader>
      </div>

      <div className="px-5 py-5 pb-24 md:pb-5 space-y-4 max-w-2xl">
        {/* Desktop heading */}
        <div className="hidden md:block">
          <Link to="/" className="inline-flex items-center gap-1 text-soil-400 text-sm mb-3 hover:text-soil-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Back to dashboard
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-mono text-sm text-soil-400 tracking-wide">{sowing.sowing_code}</span>
            <StatusBadge status={sowing.status} size="lg" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-soil-900 tracking-tight">{sowing.seed_name}</h1>
          {sowing.variety && <p className="text-soil-500 mt-0.5">{sowing.variety}</p>}
        </div>

        {/* Photos */}
        {(packetPhoto || trayPhoto) && (
          <div className="flex gap-3 animate-fade-up">
            {packetPhoto && (
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium mb-1.5">Seed packet</p>
                <img
                  src={packetPhoto.filename}
                  alt="Seed packet"
                  className="w-full rounded-2xl object-cover aspect-square ring-1 ring-soil-200"
                />
              </div>
            )}
            {trayPhoto && (
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium mb-1.5">Planted tray</p>
                <img
                  src={trayPhoto.filename}
                  alt="Planted tray"
                  className="w-full rounded-2xl object-cover aspect-square ring-1 ring-soil-200"
                />
              </div>
            )}
          </div>
        )}

        {/* Label code */}
        <div className="bg-white rounded-2xl border border-soil-200/60 p-5 text-center animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium mb-1">Label Code</p>
          <p className="font-mono text-4xl font-bold text-soil-900 tracking-wider">{sowing.sowing_code}</p>
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              onClick={() => shareLabelImage(sowing)}
              className="inline-flex items-center gap-1.5 text-sm text-leaf-600 font-medium hover:text-leaf-700 transition-colors min-h-[44px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              D30 Label
            </button>
            <Link
              to={`/print?ids=${sowing.id}`}
              className="inline-flex items-center gap-1.5 text-sm text-soil-400 font-medium hover:text-soil-600 transition-colors min-h-[44px]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Paper Print
            </Link>
          </div>
        </div>

        {/* Details grid */}
        <div className="bg-white rounded-2xl border border-soil-200/60 p-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-2 gap-4">
            {sowing.brand && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium mb-0.5">Brand</p>
                <p className="text-soil-800 font-medium">{sowing.brand}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium mb-0.5">Sown</p>
              <p className="text-soil-800 font-medium">{sowing.sowing_date}</p>
            </div>
            {sowing.germination_date && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium mb-0.5">Germinated</p>
                <p className="text-soil-800 font-medium">{sowing.germination_date}</p>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-soil-200/60 p-5 animate-fade-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] uppercase tracking-wider text-soil-400 font-medium">Notes</p>
            {!editingNotes && (
              <button onClick={() => setEditingNotes(true)} className="text-sm text-leaf-600 font-medium px-2 py-2 -my-2 min-h-[44px] flex items-center">
                Edit
              </button>
            )}
          </div>
          {editingNotes ? (
            <div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border border-soil-200 rounded-xl p-3 text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                rows={3}
              />
              <div className="flex gap-2 mt-2">
                <button onClick={saveNotes} className="bg-leaf-600 text-white px-4 py-2 rounded-xl text-sm font-medium">
                  Save
                </button>
                <button onClick={() => { setEditingNotes(false); setNotes(sowing.notes || '') }} className="text-soil-400 px-4 py-2 text-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-soil-600 leading-relaxed">{sowing.notes || 'No notes yet.'}</p>
          )}
        </div>

        {/* Status actions */}
        {nextStatuses.length > 0 && (
          <div className="space-y-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            {nextStatuses.map(s => (
              <button
                key={s}
                onClick={() => handleStatusUpdate(s)}
                className="w-full bg-white border-2 border-leaf-600 text-leaf-700 font-semibold py-3.5 rounded-2xl text-sm active:scale-[0.98] transition-transform min-h-[44px]"
              >
                {ACTION_LABELS[s] || `Mark as ${s}`}
              </button>
            ))}
          </div>
        )}

        {/* Delete */}
        <button
          onClick={handleDelete}
          className="w-full text-soil-400 text-sm py-3 hover:text-clay-500 transition-colors min-h-[44px]"
        >
          Delete this sowing
        </button>
      </div>
    </div>
  )
}
