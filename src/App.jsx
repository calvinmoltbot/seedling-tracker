import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import SowingDetail from './pages/SowingDetail'
import NewSowing from './pages/NewSowing'
import QuickNewSowing from './pages/QuickNewSowing'
import QuickStatusUpdate from './pages/QuickStatusUpdate'
import PrintLabels from './pages/PrintLabels'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/print" element={<PrintLabels />} />
        <Route path="*" element={
          <AppShell>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sowings/:id" element={<SowingDetail />} />
              <Route path="/sowings/new" element={<NewSowing />} />
              <Route path="/quick-add" element={<QuickNewSowing />} />
              <Route path="/quick-update" element={<QuickStatusUpdate />} />
            </Routes>
          </AppShell>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
