import { useState, useMemo } from 'react'

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function CalendarView({ sowings, onSelectDate, selectedDate }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const eventMap = useMemo(() => {
    const map = {}
    for (const s of sowings) {
      if (s.sowing_date) {
        if (!map[s.sowing_date]) map[s.sowing_date] = { sowing: 0, germination: 0 }
        map[s.sowing_date].sowing++
      }
      if (s.germination_date) {
        if (!map[s.germination_date]) map[s.germination_date] = { sowing: 0, germination: 0 }
        map[s.germination_date].germination++
      }
    }
    return map
  }, [sowings])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const monthName = new Date(viewYear, viewMonth).toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="bg-white rounded-2xl border border-soil-200/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2.5 hover:bg-soil-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h3 className="font-display text-lg font-semibold text-soil-800">{monthName}</h3>
        <button onClick={nextMonth} className="p-2.5 hover:bg-soil-100 rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-[11px] uppercase tracking-wider text-soil-400 font-medium py-1">{d}</div>
        ))}

        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const date = formatDate(viewYear, viewMonth, day)
          const events = eventMap[date]
          const isSelected = selectedDate === date
          const isToday = date === formatDate(today.getFullYear(), today.getMonth(), today.getDate())

          return (
            <button
              key={day}
              onClick={() => onSelectDate(isSelected ? null : date)}
              className={`relative p-2 rounded-lg text-sm transition-colors min-h-[40px] flex flex-col items-center justify-center
                ${isSelected ? 'bg-leaf-600 text-white' : isToday ? 'bg-soil-100 text-soil-900 font-semibold' : 'hover:bg-soil-50 text-soil-700'}
              `}
            >
              {day}
              {events && (
                <div className="flex gap-0.5 justify-center mt-0.5">
                  {events.sowing > 0 && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-leaf-400'}`} />}
                  {events.germination > 0 && <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-sky-400'}`} />}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-soil-100 text-[11px] text-soil-400">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-leaf-400" /> Sown</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> Germinated</span>
      </div>
    </div>
  )
}
