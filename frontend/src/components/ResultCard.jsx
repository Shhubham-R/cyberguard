import { AlertTriangle, CheckCircle, Zap, Target, Lightbulb } from 'lucide-react'
import SeverityBadge from './SeverityBadge'

function ResultCard({ result }) {
  const { is_bullying, confidence, severity, category, highlighted_words, recommended_action } = result

  const confidencePercent = Math.round(confidence * 100)

  // Highlight toxic words in text
  const highlightText = (text, words) => {
    if (!words || words.length === 0) return text
    
    let highlighted = text
    words.forEach(word => {
      const regex = new RegExp(`(${word})`, 'gi')
      highlighted = highlighted.replace(regex, '<mark class="bg-red-500/40 text-red-200 px-1 rounded">$1</mark>')
    })
    return highlighted
  }

  return (
    <div className="glass rounded-xl p-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {is_bullying ? (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-8 h-8 text-cyber-danger" />
              <span className="text-2xl font-heading font-bold text-cyber-danger">
                ⚠️ CYBERBULLYING DETECTED
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-8 h-8 text-cyber-safe" />
              <span className="text-2xl font-heading font-bold text-cyber-safe">
                ✅ CONTENT IS SAFE
              </span>
            </div>
          )}
        </div>
        
        <SeverityBadge severity={severity} />
      </div>

      {/* Confidence */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Confidence</span>
          <span className="font-mono font-bold text-cyber-accent">{confidencePercent}%</span>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${is_bullying ? 'bg-gradient-to-r from-yellow-500 to-red-500' : 'bg-gradient-to-r from-green-500 to-cyber-accent'}`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {/* Category */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400 text-sm">Category</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-cyber-accent/20 text-cyber-accent border border-cyber-accent/50 text-sm">
            {category.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Highlighted Words */}
      {highlighted_words && highlighted_words.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Trigger Words</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {highlighted_words.map((word, i) => (
              <span 
                key={i}
                className="px-2 py-1 rounded bg-red-500/20 text-red-300 text-sm border border-red-500/30"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action */}
      <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-400 text-sm">Recommended Action</span>
        </div>
        <p className="text-white">{recommended_action}</p>
      </div>
    </div>
  )
}

export default ResultCard
