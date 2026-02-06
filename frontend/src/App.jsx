import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SowingsList from './pages/SowingsList'
import SowingDetail from './pages/SowingDetail'
import NewSowing from './pages/NewSowing'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<SowingsList />} />
          <Route path="/sowings/:id" element={<SowingDetail />} />
          <Route path="/sowings/new" element={<NewSowing />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
