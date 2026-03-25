function SeverityBadge({ severity }) {
  const colors = {
    high: 'bg-red-500/20 text-red-400 border-red-500/50',
    medium: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    low: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    none: 'bg-green-500/20 text-green-400 border-green-500/50'
  }

  const icons = {
    high: '🔴',
    medium: '🟠',
    low: '🟡',
    none: '🟢'
  }

  return (
    <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full border text-sm font-medium ${colors[severity] || colors.none}`}>
      <span>{icons[severity]}</span>
      <span>{severity.toUpperCase()}</span>
    </span>
  )
}

export default SeverityBadge
