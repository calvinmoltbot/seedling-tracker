import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getSowing, listSowings } from '../services/api'

function Label({ sowing, size = 'standard' }) {
  if (size === 'compact') {
    return (
      <div className="label border border-soil-300 rounded-lg p-2 text-center break-inside-avoid">
        <p className="font-mono text-2xl font-bold text-soil-900 leading-none">{sowing.sowing_code}</p>
        <p className="text-xs text-soil-600 mt-0.5 truncate">{sowing.seed_name}</p>
      </div>
    )
  }

  return (
    <div className="label border-2 border-soil-800 rounded-xl p-4 break-inside-avoid">
      <div className="text-center">
        <p className="font-mono text-4xl font-black text-soil-900 tracking-wider leading-none">
          {sowing.sowing_code}
        </p>
        <div className="mt-2 border-t border-soil-200 pt-2">
          <p className="font-display text-base font-semibold text-soil-800">{sowing.seed_name}</p>
          {sowing.variety && (
            <p className="text-sm text-soil-500">{sowing.variety}</p>
          )}
        </div>
        <p className="text-xs text-soil-400 mt-1">{sowing.sowing_date}</p>
      </div>
    </div>
  )
}

export default function PrintLabels() {
  const [searchParams] = useSearchParams()
  const [sowings, setSowings] = useState([])
  const [loading, setLoading] = useState(true)

  const ids = searchParams.get('ids')
  const mode = searchParams.get('mode') || 'single'

  useEffect(() => {
    async function load() {
      if (ids) {
        const idList = ids.split(',')
        const results = await Promise.all(idList.map(id => getSowing(id)))
        setSowings(results)
      } else {
        setSowings(await listSowings())
      }
      setLoading(false)
    }
    load()
  }, [ids])

  if (loading) {
    return (
      <div className="min-h-screen bg-soil-100 flex items-center justify-center print:hidden">
        <div className="w-6 h-6 border-2 border-soil-300 border-t-leaf-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soil-100">
      <div className="print:hidden">
        <header className="relative bg-soil-900 text-soil-50 px-5 pt-12 pb-5 texture-grain overflow-hidden">
          <div className="relative z-10">
            <Link to={ids ? `/sowings/${ids.split(',')[0]}` : '/'} className="inline-flex items-center gap-1 text-soil-400 text-sm mb-3 hover:text-soil-300 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Back
            </Link>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Print Labels</h1>
            <p className="text-soil-400 text-sm mt-1">{sowings.length} label{sowings.length !== 1 ? 's' : ''}</p>
          </div>
        </header>

        <div className="px-5 py-4 space-y-3">
          <div className="flex gap-2">
            {['single', 'sheet', 'compact'].map(m => (
              <Link
                key={m}
                to={`/print?${ids ? `ids=${ids}&` : ''}mode=${m}`}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center ${mode === m ? 'bg-leaf-600 text-white' : 'bg-white text-soil-600 border border-soil-200'}`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Link>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="w-full bg-leaf-600 text-white font-semibold py-3.5 rounded-2xl text-base shadow-md shadow-leaf-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 min-h-[44px]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print
          </button>
        </div>
      </div>

      <div className="px-5 pb-8 print:px-0 print:pb-0">
        {mode === 'single' && (
          <div className="space-y-6 print:space-y-0">
            {sowings.map(s => (
              <div key={s.id} className="print:page-break-after print:p-8">
                <div className="max-w-xs mx-auto">
                  <Label sowing={s} size="standard" />
                </div>
              </div>
            ))}
          </div>
        )}

        {mode === 'sheet' && (
          <div className="grid grid-cols-2 gap-3 print:grid-cols-2 print:gap-4 print:p-6">
            {sowings.map(s => (
              <Label key={s.id} sowing={s} size="standard" />
            ))}
          </div>
        )}

        {mode === 'compact' && (
          <div className="grid grid-cols-3 gap-2 print:grid-cols-4 print:gap-2 print:p-4">
            {sowings.map(s => (
              <Label key={s.id} sowing={s} size="compact" />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
