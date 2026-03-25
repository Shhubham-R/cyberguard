import { useState } from 'react'
import { Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react'
import { analyzeText } from '../services/api'
import ResultCard from '../components/ResultCard'
import SeverityBadge from '../components/SeverityBadge'

function Home() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const examples = [
    "You're so stupid and nobody likes you",
    "Hey, great job on your project!",
    "You should just kill yourself"
  ]

  const handleAnalyze = async () => {
    if (!text.trim()) return
    
    setLoading(true)
    setError('')
    setResult(null)
    
    try {
      const data = await analyzeText(text)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleExample = (example) => {
    setText(example)
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Shield className="w-16 h-16 text-cyber-accent animate-pulse-glow rounded-full p-3" />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Detect Cyberbullying <span className="gradient-text">in Real Time</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Advanced AI-powered content moderation to keep your platform safe.
            Paste any text below to analyze it for cyberbullying content.
          </p>
        </div>

        {/* Input */}
        <div className="glass rounded-xl p-6 mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a comment, message, or social media post here..."
            className="w-full h-48 bg-gray-900/50 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent resize-none font-body"
          />
          
          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
            <div className="flex gap-2">
              {examples.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => handleExample(ex)}
                  className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  Try example {i + 1}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || loading}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                text.trim() && !loading
                  ? 'bg-cyber-accent text-cyber-dark hover:bg-cyan-400 animate-pulse-glow'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Zap className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Analyze Text</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Result */}
        {result && <ResultCard result={result} />}
      </div>
    </div>
  )
}

export default Home
