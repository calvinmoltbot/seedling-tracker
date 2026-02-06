import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createSowing, uploadPhoto } from '../services/api'
import PageHeader from '../components/PageHeader'

export default function QuickNewSowing() {
  const [seedName, setSeedName] = useState('')
  const [photo, setPhoto] = useState(null)
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(null)

  async function handleSave() {
    if (!seedName.trim()) return
    setSaving(true)

    try {
      let packet_photo_url = null
      if (photo) {
        const uploaded = await uploadPhoto(photo)
        packet_photo_url = uploaded.url
      }

      const sowing = await createSowing({
        seed_name: seedName.trim(),
        sowing_date: new Date().toISOString().split('T')[0],
        packet_photo_url,
      })
      setCreated(sowing)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  function reset() {
    setCreated(null)
    setSeedName('')
    setPhoto(null)
  }

  if (created) {
    return (
      <div className="min-h-screen bg-soil-100 flex flex-col">
        <div className="md:hidden">
          <PageHeader title="Sowing Created" subtitle="Success" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-5 pb-24 md:pb-5">
          <div className="bg-white rounded-3xl border-2 border-leaf-200 p-8 text-center mb-6 shadow-sm animate-fade-up w-full max-w-sm">
            <p className="text-[11px] uppercase tracking-widest text-soil-400 font-medium mb-2">Write this on your label</p>
            <p className="font-mono text-6xl font-bold text-leaf-700 mb-3 tracking-wider">{created.sowing_code}</p>
            <p className="font-display text-xl text-soil-800">{created.seed_name}</p>
          </div>

          <div className="space-y-3 w-full max-w-sm animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <Link
              to={`/print?ids=${created.id}`}
              className="flex items-center justify-center gap-2 w-full bg-soil-800 text-white font-semibold py-3.5 rounded-2xl text-base active:scale-[0.98] transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Label
            </Link>
            <button
              onClick={reset}
              className="w-full bg-leaf-600 text-white font-semibold py-3.5 rounded-2xl text-base shadow-md shadow-leaf-600/20 active:scale-[0.98] transition-transform"
            >
              Plant Another
            </button>
            <Link
              to={`/sowings/${created.id}`}
              className="block w-full text-center text-sm text-leaf-600 font-medium py-2"
            >
              Add more details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soil-100 flex flex-col">
      <div className="md:hidden">
        <PageHeader title="Quick Add" subtitle="New Sowing" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-5 pb-24 md:pb-5">
        <div className="w-full max-w-sm space-y-5">
          <div className="hidden md:block mb-2">
            <h2 className="font-display text-2xl font-semibold text-soil-900">Quick Add</h2>
            <p className="text-soil-500 text-sm mt-1">Name it, snap it, done.</p>
          </div>

          {/* Big seed name input */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-soil-500 font-medium mb-1.5">
              What are you planting?
            </label>
            <input
              type="text"
              value={seedName}
              onChange={e => setSeedName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              placeholder="e.g. Tomato"
              autoFocus
              className="w-full px-4 py-4 border border-soil-200 bg-white rounded-2xl text-lg font-display font-semibold focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow placeholder:text-soil-300 placeholder:font-normal"
            />
          </div>

          {/* Optional photo */}
          {photo ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(photo)}
                alt="Packet"
                className="w-full rounded-2xl object-cover aspect-[4/3] ring-1 ring-soil-200"
              />
              <button
                onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 w-8 h-8 bg-soil-900/60 text-white rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ) : (
            <label className="flex items-center gap-3 w-full bg-white border border-soil-200 rounded-2xl px-4 py-3.5 cursor-pointer active:bg-soil-50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-soil-400 flex-shrink-0"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <span className="text-soil-500 text-sm font-medium">Snap seed packet (optional)</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={e => e.target.files[0] && setPhoto(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}

          {/* Date shown but not editable in quick mode */}
          <p className="text-xs text-soil-400 text-center">
            Sowing date: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>

          <button
            onClick={handleSave}
            disabled={!seedName.trim() || saving}
            className="w-full bg-leaf-600 text-white font-semibold py-4 rounded-2xl text-base disabled:opacity-40 active:scale-[0.98] transition-transform shadow-md shadow-leaf-600/20"
          >
            {saving ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : 'Plant It'}
          </button>

          <Link
            to="/sowings/new"
            className="block text-center text-sm text-soil-400 hover:text-soil-600 transition-colors"
          >
            Need more options? Use the full form
          </Link>
        </div>
      </div>
    </div>
  )
}
