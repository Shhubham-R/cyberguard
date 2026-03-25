import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import DashboardPage from './pages/DashboardPage'
import CommentFeedPage from './pages/CommentFeedPage'
import BulkPage from './pages/BulkPage'
import ApiPage from './pages/ApiPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyber-dark">
        <Navbar />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/simulate" element={<CommentFeedPage />} />
            <Route path="/bulk" element={<BulkPage />} />
            <Route path="/api" element={<ApiPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
