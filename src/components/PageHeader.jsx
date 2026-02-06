import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, backTo, backLabel = 'Back', children }) {
  return (
    <header className="relative bg-soil-900 text-soil-50 px-5 pt-12 pb-6 texture-grain overflow-hidden">
      <div className="relative z-10">
        {backTo && (
          <Link to={backTo} className="inline-flex items-center gap-1 text-soil-400 text-sm mb-3 hover:text-soil-300 transition-colors py-2 -my-2 pr-4 min-h-[44px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            {backLabel}
          </Link>
        )}
        {subtitle && (
          <p className="font-body text-soil-400 text-xs tracking-widest uppercase mb-1">{subtitle}</p>
        )}
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight">{title}</h1>
        {children}
      </div>
      <div className="absolute -right-4 -top-2 w-32 h-32 rounded-full bg-leaf-700/10 blur-2xl" />
      <div className="absolute right-8 bottom-2 w-16 h-16 rounded-full bg-leaf-600/8 blur-xl" />
    </header>
  )
}
