import { useState } from 'react'
import { Link } from 'react-router-dom'
import { createSowing, uploadPhoto } from '../services/api'
import PageHeader from '../components/PageHeader'
import PhotoUpload from '../components/PhotoUpload'

const STEPS = ['Packet', 'Details', 'Tray', 'Confirm']

export default function NewSowing() {
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [created, setCreated] = useState(null)

  const [packetPhoto, setPacketPhoto] = useState(null)
  const [trayPhoto, setTrayPhoto] = useState(null)
  const [form, setForm] = useState({
    seed_name: '',
    variety: '',
    brand: '',
    sowing_date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  function updateForm(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function canAdvance() {
    if (step === 1) return form.seed_name.trim() && form.sowing_date
    return true
  }

  async function handleSave() {
    setSaving(true)
    try {
      let packet_photo_url = null
      let tray_photo_url = null

      if (packetPhoto) {
        const uploaded = await uploadPhoto(packetPhoto)
        packet_photo_url = uploaded.url
      }
      if (trayPhoto) {
        const uploaded = await uploadPhoto(trayPhoto)
        tray_photo_url = uploaded.url
      }

      const sowing = await createSowing({
        ...form,
        packet_photo_url,
        tray_photo_url,
      })
      setCreated(sowing)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  if (created) {
    return (
      <div className="min-h-screen bg-soil-100 flex flex-col">
        <div className="md:hidden">
          <PageHeader title="Sowing Created" subtitle="Success" />
        </div>

        <div className="flex-1 px-5 py-6 pb-24 md:pb-6 flex flex-col items-center">
          <div className="bg-white rounded-3xl border-2 border-leaf-200 p-8 text-center mb-6 shadow-sm animate-fade-up w-full max-w-sm">
            <p className="text-[11px] uppercase tracking-widest text-soil-400 font-medium mb-2">Write this on your label</p>
            <p className="font-mono text-6xl font-bold text-leaf-700 mb-3 tracking-wider">{created.sowing_code}</p>
            <p className="font-display text-xl text-soil-800">{created.seed_name}</p>
            {created.variety && <p className="text-soil-500 mt-0.5">{created.variety}</p>}
          </div>

          <div className="space-y-3 mt-auto w-full max-w-sm animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <Link
              to={`/print?ids=${created.id}`}
              className="flex items-center justify-center gap-2 w-full bg-soil-800 text-white font-semibold py-3.5 rounded-2xl text-base active:scale-[0.98] transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print Label
            </Link>
            <button
              onClick={() => { setCreated(null); setStep(0); setPacketPhoto(null); setTrayPhoto(null); setForm({ seed_name: '', variety: '', brand: '', sowing_date: new Date().toISOString().split('T')[0], notes: '' }) }}
              className="w-full bg-leaf-600 text-white font-semibold py-3.5 rounded-2xl text-base shadow-md shadow-leaf-600/20 active:scale-[0.98] transition-transform"
            >
              Plant Another
            </button>
            <Link
              to="/"
              className="block w-full text-center border-2 border-soil-200 text-soil-700 font-semibold py-3.5 rounded-2xl text-base"
            >
              View All Sowings
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soil-100 flex flex-col">
      <div className="md:hidden">
        <PageHeader title="New Sowing" backTo="/" backLabel="Cancel" />
      </div>

      {/* Desktop heading */}
      <div className="hidden md:block px-5 pt-5">
        <Link to="/" className="inline-flex items-center gap-1 text-soil-400 text-sm mb-3 hover:text-soil-600 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          Cancel
        </Link>
        <h2 className="font-display text-2xl font-semibold text-soil-900">New Sowing</h2>
      </div>

      {/* Step indicator */}
      <div className="flex px-5 pt-4 pb-1 gap-2 max-w-lg">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1">
            <div className={`h-1.5 rounded-full transition-colors duration-300 ${i <= step ? 'bg-leaf-500' : 'bg-soil-200'}`} />
            <p className={`text-[11px] mt-1.5 transition-colors ${i === step ? 'text-leaf-700 font-semibold' : 'text-soil-400'}`}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 px-5 py-4 pb-24 md:pb-4 flex flex-col max-w-lg">
        <div className="flex-1 animate-fade-up" key={step}>
          {step === 0 && (
            <div className="space-y-4">
              <p className="text-soil-600">Snap the seed packet so you remember what you planted.</p>
              <PhotoUpload photo={packetPhoto} onCapture={setPacketPhoto} label="Take photo of seed packet" />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-soil-500 font-medium mb-1.5">
                  Seed Name <span className="text-clay-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.seed_name}
                  onChange={e => updateForm('seed_name', e.target.value)}
                  placeholder="e.g. Tomato"
                  className="w-full px-4 py-3.5 border border-soil-200 bg-white rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-soil-500 font-medium mb-1.5">Variety</label>
                <input
                  type="text"
                  value={form.variety}
                  onChange={e => updateForm('variety', e.target.value)}
                  placeholder="e.g. Gardener's Delight"
                  className="w-full px-4 py-3.5 border border-soil-200 bg-white rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-soil-500 font-medium mb-1.5">Brand</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={e => updateForm('brand', e.target.value)}
                  placeholder="e.g. Suttons"
                  className="w-full px-4 py-3.5 border border-soil-200 bg-white rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-soil-500 font-medium mb-1.5">
                  Sowing Date <span className="text-clay-500">*</span>
                </label>
                <input
                  type="date"
                  value={form.sowing_date}
                  onChange={e => updateForm('sowing_date', e.target.value)}
                  className="w-full px-4 py-3.5 border border-soil-200 bg-white rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-soil-500 font-medium mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => updateForm('notes', e.target.value)}
                  placeholder="Any notes about this sowing..."
                  rows={3}
                  className="w-full px-4 py-3.5 border border-soil-200 bg-white rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-leaf-400/40 focus:border-leaf-400 transition-shadow"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-soil-600">Photo the tray so you know what's where.</p>
              <PhotoUpload photo={trayPhoto} onCapture={setTrayPhoto} label="Take photo of planted tray" />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-soil-600 mb-2">Everything look right?</p>
              <div className="bg-white rounded-2xl border border-soil-200/60 p-5 space-y-3">
                <p className="font-display text-xl font-semibold text-soil-900">{form.seed_name}</p>
                {form.variety && <p className="text-soil-600">Variety: {form.variety}</p>}
                {form.brand && <p className="text-soil-600">Brand: {form.brand}</p>}
                <p className="text-soil-600">Sowing date: {form.sowing_date}</p>
                {form.notes && <p className="text-soil-500 text-sm italic">"{form.notes}"</p>}
                <div className="flex gap-3 pt-1">
                  {packetPhoto && (
                    <span className="inline-flex items-center gap-1 text-xs text-leaf-600 bg-leaf-100 px-2.5 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Packet photo
                    </span>
                  )}
                  {trayPhoto && (
                    <span className="inline-flex items-center gap-1 text-xs text-leaf-600 bg-leaf-100 px-2.5 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Tray photo
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-6 pb-4">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 border-2 border-soil-200 text-soil-700 font-semibold py-3.5 rounded-2xl active:scale-[0.98] transition-transform min-h-[44px]"
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
              className="flex-1 bg-leaf-600 text-white font-semibold py-3.5 rounded-2xl disabled:opacity-40 active:scale-[0.98] transition-transform shadow-md shadow-leaf-600/20 min-h-[44px]"
            >
              {step === 0 ? (packetPhoto ? 'Next' : 'Skip') : 'Next'}
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-leaf-600 text-white font-semibold py-3.5 rounded-2xl disabled:opacity-40 active:scale-[0.98] transition-transform shadow-md shadow-leaf-600/20 min-h-[44px]"
            >
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : 'Save Sowing'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
