import { Link, useLocation } from 'react-router-dom'
import { Shield, Activity, MessageSquare, Upload, Code, Wifi } from 'lucide-react'
import { useState, useEffect } from 'react'
import { healthCheck } from '../services/api'

function Navbar() {
  const location = useLocation()
  const [status, setStatus] = useState({ mode: 'loading', model_loaded: false })

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await healthCheck()
        setStatus(data)
      } catch {
        setStatus({ mode: 'offline', model_loaded: false })
      }
    }
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { path: '/', label: 'Analyzer', icon: Shield },
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/simulate', label: 'Comment Feed', icon: MessageSquare },
    { path: '/bulk', label: 'Bulk', icon: Upload },
    { path: '/api', label: 'API', icon: Code },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyber-accent" />
            <span className="font-heading text-xl font-bold gradient-text">CyberGuard</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyber-accent/10 text-cyber-accent'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Wifi className={`w-4 h-4 ${status.mode === 'demo' ? 'text-yellow-500' : 'text-green-500'}`} />
            <span className="text-xs text-gray-400">
              Model: {status.mode === 'demo' ? 'Demo' : status.model_loaded ? 'Online' : 'Offline'} ✓
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
