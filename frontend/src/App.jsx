import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SowingsList from './pages/SowingsList'
import SowingDetail from './pages/SowingDetail'
import NewSowing from './pages/NewSowing'
import PrintLabels from './pages/PrintLabels'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-soil-50">
        <Routes>
          <Route path="/" element={<SowingsList />} />
          <Route path="/sowings/:id" element={<SowingDetail />} />
          <Route path="/sowings/new" element={<NewSowing />} />
          <Route path="/print" element={<PrintLabels />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
