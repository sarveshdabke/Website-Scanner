import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import ReportPage from './pages/ReportPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report/:id" element={<ReportPage />} />
      </Routes>
    </div>
  )
}

export default App