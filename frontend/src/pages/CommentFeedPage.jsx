import { useState } from 'react'
import { MessageSquare, Send, AlertTriangle, CheckCircle, Eye, EyeOff, User } from 'lucide-react'
import { analyzeText } from '../services/api'

function CommentFeedPage() {
  const [comments, setComments] = useState([
    { id: 1, user: 'Sarah', text: 'This is such a great post! Thanks for sharing 📸', is_bullying: false, severity: 'none', show: true },
    { id: 2, user: 'Mike', text: 'Lol everyone knows you\'re just jealous 😂', is_bullying: false, severity: 'none', show: true },
    { id: 3, user: 'Anon', text: 'You\'re so stupid and nobody likes you', is_bullying: true, severity: 'high', show: false },
    { id: 4, user: 'Jenny', text: 'Love the vibes here!', is_bullying: false, severity: 'none', show: true },
    { id: 5, user: 'Troll', text: 'You should just quit, you\'re worthless', is_bullying: true, severity: 'medium', show: false },
  ])
  const [newComment, setNewComment] = useState('')
  const [posting, setPosting] = useState(false)
  const [warningCount, setWarningCount] = useState(0)

  const handlePost = async () => {
    if (!newComment.trim()) return

    setPosting(true)
    
    try {
      const result = await analyzeText(newComment)
      
      const comment = {
        id: Date.now(),
        user: 'You',
        text: newComment,
        is_bullying: result.is_bullying,
        severity: result.severity,
        show: !result.is_bullying
      }

      setComments([comment, ...comments])
      setNewComment('')

      // Update warning count
      if (result.is_bullying && result.severity === 'high') {
        setWarningCount(prev => prev + 1)
      }
    } catch (err) {
      console.error(err)
      // Add comment anyway without analysis
      setComments([{ id: Date.now(), user: 'You', text: newComment, is_bullying: false, severity: 'none', show: true }, ...comments])
      setNewComment('')
    } finally {
      setPosting(false)
    }
  }

  const toggleShow = (id) => {
    setComments(comments.map(c => c.id === id ? { ...c, show: !c.show } : c))
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-cyber-accent" />
          Comment Feed Simulator
        </h1>

        {/* Early Warning Banner */}
        {warningCount >= 3 && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <p className="font-bold text-red-400">⚠️ Early Warning</p>
              <p className="text-red-300 text-sm">Multiple high-severity detections detected. Consider reviewing community guidelines.</p>
            </div>
          </div>
        )}

        {/* Mock Post */}
        <div className="glass rounded-xl overflow-hidden mb-6">
          {/* Post Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-accent to-purple-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold">Page Admin</p>
                <p className="text-gray-500 text-sm">2 hours ago</p>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="p-4">
            <p className="text-lg">Just finished my new project! 🎉 Really excited to share it with everyone. What do you think?</p>
          </div>

          {/* Post Image Placeholder */}
          <div className="bg-gray-800 h-48 flex items-center justify-center">
            <span className="text-gray-500">📷 Image</span>
          </div>

          {/* Engagement */}
          <div className="p-4 border-t border-gray-800 flex gap-6 text-gray-400">
            <span>❤️ 42</span>
            <span>💬 {comments.length}</span>
            <span>🔄 5</span>
          </div>
        </div>

        {/* Comment Input */}
        <div className="glass rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-400" />
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyber-accent resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handlePost()
                  }
                }}
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-500">Press Enter to post</span>
                <button
                  onClick={handlePost}
                  disabled={!newComment.trim() || posting}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    newComment.trim() && !posting
                      ? 'bg-cyber-accent text-cyber-dark hover:bg-cyan-400'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {posting ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Feed */}
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`glass rounded-xl p-4 transition-all ${
                comment.is_bullying
                  ? 'border-2 border-red-500/50 bg-red-500/5'
                  : 'border-green-500/20'
              }`}
            >
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{comment.user}</span>
                    {comment.is_bullying && (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">
                          Flagged
                        </span>
                      </>
                    )}
                    {!comment.is_bullying && (
                      <CheckCircle className="w-4 h-4 text-green-400 opacity-50" />
                    )}
                  </div>

                  {/* Comment Text */}
                  {comment.is_bullying && !comment.show ? (
                    <div className="relative">
                      <p className="blur-md select-none">{comment.text}</p>
                      <button
                        onClick={() => toggleShow(comment.id)}
                        className="absolute inset-0 flex items-center justify-center bg-gray-900/80 rounded"
                      >
                        <span className="flex items-center gap-2 text-gray-400">
                          <Eye className="w-4 h-4" />
                          Show anyway
                        </span>
                      </button>
                    </div>
                  ) : (
                    <p className={comment.is_bullying ? 'text-red-300' : 'text-gray-300'}>
                      {comment.text}
                    </p>
                  )}

                  {/* Severity Badge */}
                  {comment.is_bullying && (
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        comment.severity === 'high' ? 'bg-red-500/30 text-red-400' :
                        comment.severity === 'medium' ? 'bg-orange-500/30 text-orange-400' :
                        'bg-yellow-500/30 text-yellow-400'
                      }`}>
                        {comment.severity.toUpperCase()} SEVERITY
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommentFeedPage
