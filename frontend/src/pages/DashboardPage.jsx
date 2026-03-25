import { useState, useEffect } from 'react'
import { Activity, Shield, AlertTriangle, TrendingUp, History } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { getStats, getHistory } from '../services/api'

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, historyData] = await Promise.all([
          getStats(),
          getHistory(1, 10)
        ])
        setStats(statsData)
        setHistory(historyData.items)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-accent"></div>
      </div>
    )
  }

  // Chart data
  const severityData = [
    { name: 'Safe', value: stats?.safe_content || 0, color: '#22c55e' },
    { name: 'Bullying', value: stats?.bullying_detected || 0, color: '#ef4444' }
  ]

  const categoryData = [
    { name: 'Harassment', count: 12 },
    { name: 'Hate Speech', count: 8 },
    { name: 'Threats', count: 5 },
    { name: 'Personal Attack', count: 15 },
    { name: 'Body Shaming', count: 7 }
  ]

  // Mock trend data
  const trendData = Array.from({ length: 20 }, (_, i) => ({
    analysis: i + 1,
    bullying: Math.random() > 0.5 ? 1 : 0
  }))

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
          <Activity className="w-8 h-8 text-cyber-accent" />
          Dashboard
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Analyzed</p>
                <p className="text-3xl font-bold text-white">{stats?.total_analyzed || 0}</p>
              </div>
              <Shield className="w-10 h-10 text-cyber-accent opacity-50" />
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bullying Detected</p>
                <p className="text-3xl font-bold text-cyber-danger">{stats?.bullying_detected || 0}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-cyber-danger opacity-50" />
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Safe Content</p>
                <p className="text-3xl font-bold text-cyber-safe">{stats?.safe_content || 0}</p>
              </div>
              <Shield className="w-10 h-10 text-cyber-safe opacity-50" />
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Confidence</p>
                <p className="text-3xl font-bold text-cyber-accent">{Math.round((stats?.accuracy || 0.8) * 100)}%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-cyber-accent opacity-50" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Bullying vs Safe</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {severityData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-400">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#00d4ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="glass rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Analysis Trend (Last 20)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={trendData}>
              <XAxis dataKey="analysis" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="bullying" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* History Table */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Analyses
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Text</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Verdict</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Severity</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-sm truncate max-w-xs">{item.text}</td>
                    <td className="py-3 px-4">
                      <span className={item.is_bullying ? 'text-cyber-danger' : 'text-cyber-safe'}>
                        {item.is_bullying ? '⚠️ Bullying' : '✅ Safe'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                        item.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                        item.severity === 'low' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {item.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      No analysis history yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
