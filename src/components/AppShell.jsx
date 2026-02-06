import { NavLink } from 'react-router-dom'

function NavIcon({ type }) {
  if (type === 'home') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  )
  if (type === 'add') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  )
  if (type === 'update') return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
  return null
}

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-soil-100 md:flex">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex md:flex-col md:w-56 lg:w-64 bg-soil-900 text-soil-50 min-h-screen p-5 flex-shrink-0">
        <div className="mb-8">
          <p className="font-body text-soil-500 text-[10px] tracking-widest uppercase">Garden Journal</p>
          <h1 className="font-display text-xl font-semibold tracking-tight mt-0.5">Seedling Tracker</h1>
        </div>

        <div className="space-y-1 flex-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-soil-800 text-white' : 'text-soil-400 hover:text-soil-200 hover:bg-soil-800/50'}`
            }
          >
            <NavIcon type="home" /> Dashboard
          </NavLink>
          <NavLink
            to="/quick-add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-soil-800 text-white' : 'text-soil-400 hover:text-soil-200 hover:bg-soil-800/50'}`
            }
          >
            <NavIcon type="add" /> Quick Add
          </NavLink>
          <NavLink
            to="/quick-update"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-soil-800 text-white' : 'text-soil-400 hover:text-soil-200 hover:bg-soil-800/50'}`
            }
          >
            <NavIcon type="update" /> Quick Update
          </NavLink>
          <NavLink
            to="/sowings/new"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-soil-800 text-white' : 'text-soil-400 hover:text-soil-200 hover:bg-soil-800/50'}`
            }
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c6-3 10-7 10-12A4 4 0 0 0 18 6c-2 0-3.5 1-4.5 2.5a6 6 0 0 0-3-2.5"/><path d="M7 15c-2-1-4-3.5-4-7a3 3 0 0 1 6 0"/><path d="M12 22V10"/></svg>
            Full Sowing Form
          </NavLink>
        </div>

        <NavLink
          to="/print?mode=sheet"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-soil-500 hover:text-soil-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          Print Labels
        </NavLink>
      </nav>

      {/* Main content */}
      <div className="flex-1 md:overflow-y-auto md:h-screen">
        {children}
      </div>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-soil-200 pb-[env(safe-area-inset-bottom)] z-50">
        <div className="flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 min-h-[48px] ${isActive ? 'text-leaf-600' : 'text-soil-400'}`
            }
          >
            <NavIcon type="home" />
            <span className="text-[11px] font-medium mt-0.5">Home</span>
          </NavLink>
          <NavLink
            to="/quick-add"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 min-h-[48px] ${isActive ? 'text-leaf-600' : 'text-soil-400'}`
            }
          >
            <NavIcon type="add" />
            <span className="text-[11px] font-medium mt-0.5">Quick Add</span>
          </NavLink>
          <NavLink
            to="/quick-update"
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 min-h-[48px] ${isActive ? 'text-leaf-600' : 'text-soil-400'}`
            }
          >
            <NavIcon type="update" />
            <span className="text-[11px] font-medium mt-0.5">Update</span>
          </NavLink>
        </div>
      </nav>
    </div>
  )
}
