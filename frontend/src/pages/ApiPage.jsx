import { useState } from 'react'
import { Code, Copy, Check, Play } from 'lucide-react'
import { analyzeText } from '../services/api'

function ApiPage() {
  const [apiKey] = useState('demo-key-123')
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [copied, setCopied] = useState('')

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(''), 2000)
  }

  const testApi = async () => {
    if (!testInput.trim()) return
    setTesting(true)
    try {
      const result = await analyzeText(testInput, apiKey)
      setTestResult(result)
    } catch (err) {
      setTestResult({ error: err.message })
    } finally {
      setTesting(false)
    }
  }

  const endpoints = [
    {
      method: 'POST',
      path: '/api/analyze',
      description: 'Analyze a single text for cyberbullying',
      request: {
        text: 'You are so ugly and nobody likes you',
        api_key: 'demo-key-123'
      },
      response: {
        text: 'You are so ugly and nobody likes you',
        is_bullying: true,
        confidence: 0.94,
        severity: 'high',
        category: 'body_shaming',
        highlighted_words: ['ugly', 'nobody likes you'],
        recommended_action: 'Remove this comment immediately'
      }
    },
    {
      method: 'POST',
      path: '/api/analyze/bulk',
      description: 'Analyze multiple texts at once',
      request: {
        texts: ['comment 1', 'comment 2', 'comment 3'],
        api_key: 'demo-key-123'
      },
      response: {
        results: [],
        summary: { total: 3, bullying_count: 1, safe_count: 2, high_severity: 1 }
      }
    },
    {
      method: 'GET',
      path: '/api/stats',
      description: 'Get system statistics',
      request: {},
      response: {
        total_analyzed: 1204,
        bullying_detected: 387,
        safe_content: 817,
        accuracy: 0.94,
        model_version: '1.0.0',
        uptime_hours: 48,
        mode: 'production'
      }
    },
    {
      method: 'GET',
      path: '/api/history?page=1&page_size=10',
      description: 'Get analysis history',
      request: {},
      response: {
        items: [],
        total: 100,
        page: 1,
        page_size: 10
      }
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
          <Code className="w-8 h-8 text-cyber-accent" />
          API Reference
        </h1>

        {/* Intro */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <p className="text-gray-400 mb-4">
            CyberGuard provides a RESTful API for integrating cyberbullying detection into your applications.
            The base URL is:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <code className="text-cyber-accent">http://localhost:8000</code>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Authentication</h3>
          <p className="text-gray-400 mb-4">
            Include your API key in the request body or use the demo key:
          </p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
            <code className="text-green-400">api_key: "demo-key-123"</code>
          </div>
        </div>

        {/* Endpoints */}
        {endpoints.map((endpoint, idx) => (
          <div key={idx} className="glass rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded font-mono text-sm font-bold ${
                endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {endpoint.method}
              </span>
              <code className="text-white">{endpoint.path}</code>
            </div>
            
            <p className="text-gray-400 mb-4">{endpoint.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* Request */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-400">Request</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(endpoint.request, null, 2), `req-${idx}`)}
                    className="text-gray-500 hover:text-white"
                  >
                    {copied === `req-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
                  <code className="text-gray-300">{JSON.stringify(endpoint.request, null, 2)}</code>
                </pre>
              </div>
              
              {/* Response */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-400">Response</span>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(endpoint.response, null, 2), `res-${idx}`)}
                    className="text-gray-500 hover:text-white"
                  >
                    {copied === `res-${idx}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <pre className="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
                  <code className="text-gray-300">{JSON.stringify(endpoint.response, null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>
        ))}

        {/* Try It */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-cyber-accent" />
            Try It Live
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Text to Analyze</label>
              <textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter text to analyze..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-accent"
                rows={3}
              />
            </div>
            
            <button
              onClick={testApi}
              disabled={!testInput.trim() || testing}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                testInput.trim() && !testing
                  ? 'bg-cyber-accent text-cyber-dark hover:bg-cyan-400'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {testing ? 'Testing...' : 'Send Request'}
            </button>
            
            {testResult && (
              <div>
                <span className="text-sm font-semibold text-gray-400 mb-2 block">Response</span>
                <pre className="bg-gray-900 rounded-lg p-4 text-sm overflow-x-auto">
                  <code className="text-gray-300">{JSON.stringify(testResult, null, 2)}</code>
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiPage
