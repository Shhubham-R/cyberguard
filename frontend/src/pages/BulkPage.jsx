import { useState, useRef } from 'react'
import { Upload, FileText, Download, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { analyzeBulk } from '../services/api'

function BulkPage() {
  const [file, setFile] = useState(null)
  const [texts, setTexts] = useState([])
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleFile = (selectedFile) => {
    if (!selectedFile) return
    
    setFile(selectedFile)
    setResults(null)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result
      
      if (selectedFile.name.endsWith('.csv')) {
        // Parse CSV - assume one text per line or first column
        const lines = content.split('\n').filter(line => line.trim())
        const parsedTexts = lines.map(line => {
          // Handle CSV with quotes
          const match = line.match(/("([^"]*)"|([^,]*))/g)
          return match ? match[0].replace(/^"|"$/g, '') : line
        }).filter(text => text.trim())
        setTexts(parsedTexts)
      } else {
        // Plain text - split by newlines
        const parsedTexts = content.split('\n').filter(line => line.trim())
        setTexts(parsedTexts)
      }
    }
    reader.readAsText(selectedFile)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const handleAnalyze = async () => {
    if (texts.length === 0) return
    
    setLoading(true)
    
    try {
      const data = await analyzeBulk(texts)
      setResults(data)
    } catch (err) {
      console.error(err)
      alert('Analysis failed. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = () => {
    if (!results) return
    
    const csv = [
      ['Text', 'Is Bullying', 'Confidence', 'Severity', 'Category'].join(','),
      ...results.results.map(r => [
        `"${r.text.replace(/"/g, '""')}"`,
        r.is_bullying,
        r.confidence.toFixed(2),
        r.severity,
        r.category
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cyberbullying_analysis_results.csv'
    a.click()
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
          <Upload className="w-8 h-8 text-cyber-accent" />
          Bulk Analyzer
        </h1>

        {/* Upload Area */}
        <div
          className={`glass rounded-xl p-8 mb-6 text-center transition-colors ${
            dragOver ? 'border-cyber-accent bg-cyber-accent/10' : ''
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={(e) => handleFile(e.target.files[0])}
            className="hidden"
          />
          
          <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-lg mb-2">
            {file ? file.name : 'Drag & drop a file here'}
          </p>
          <p className="text-gray-500 text-sm">
            Supports .csv or .txt files (one text per line)
          </p>
        </div>

        {/* File Info */}
        {texts.length > 0 && (
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{file?.name}</p>
                <p className="text-gray-400 text-sm">{texts.length} texts found</p>
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  loading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-cyber-accent text-cyber-dark hover:bg-cyan-400'
                }`}
              >
                {loading ? 'Analyzing...' : 'Start Analysis'}
              </button>
            </div>
          </div>
        )}

        {/* Text Preview */}
        {texts.length > 0 && !results && (
          <div className="glass rounded-xl p-4 mb-6">
            <h3 className="font-semibold mb-3">Text Preview</h3>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {texts.slice(0, 10).map((text, i) => (
                <p key={i} className="text-sm text-gray-400 border-b border-gray-800 pb-2">
                  {i + 1}. {text.substring(0, 100)}{text.length > 100 ? '...' : ''}
                </p>
              ))}
              {texts.length > 10 && (
                <p className="text-sm text-gray-500">... and {texts.length - 10} more</p>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-heading text-xl font-bold">Analysis Results</h3>
                <button
                  onClick={downloadResults}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-white">{results.summary.total}</p>
                  <p className="text-gray-400 text-sm">Total</p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-cyber-danger">{results.summary.bullying_count}</p>
                  <p className="text-gray-400 text-sm">Bullying</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-cyber-safe">{results.summary.safe_count}</p>
                  <p className="text-gray-400 text-sm">Safe</p>
                </div>
                <div className="bg-orange-500/10 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-cyber-orange">{results.summary.high_severity}</p>
                  <p className="text-gray-400 text-sm">High Severity</p>
                </div>
              </div>
            </div>

            {/* Results Table */}
            <div className="glass rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">#</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Text</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Verdict</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Confidence</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((result, i) => (
                      <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4 text-gray-500">{i + 1}</td>
                        <td className="py-3 px-4 text-sm max-w-xs truncate">
                          {result.text.substring(0, 50)}{result.text.length > 50 ? '...' : ''}
                        </td>
                        <td className="py-3 px-4">
                          {result.is_bullying ? (
                            <span className="flex items-center gap-1 text-cyber-danger">
                              <AlertTriangle className="w-4 h-4" />
                              Bullying
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-cyber-safe">
                              <CheckCircle className="w-4 h-4" />
                              Safe
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {(result.confidence * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            result.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                            result.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                            result.severity === 'low' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {result.severity.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BulkPage
