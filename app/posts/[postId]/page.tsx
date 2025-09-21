'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { MessageCircle, Send, User, Calendar, ArrowLeft, Loader2, AlertCircle, Heart, Share2 } from 'lucide-react'
import Link from 'next/link'

export default function PostPage() {
  const { postId } = useParams()
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchPostAndComments() {
      // Fetch post
      const { data: post, error: postError } = await supabase
        .from('posts')
        .select('*, profiles:author_id(username, avatar_url)')
        .eq('id', postId)
        .single()
      setPost(post)

      // Fetch comments
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select('*, profiles:author_id(username, avatar_url)')
        .eq('post_id', postId)
        .eq('is_active', true)
        .order('created_at', { ascending: true })

      setComments(comments || [])
      setLoading(false)
      if (postError || commentsError) setError('Failed to load post or comments.')
    }
    fetchPostAndComments()
  }, [postId])

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('You must be logged in to comment.')
      setIsSubmitting(false)
      return
    }
    
    const { error: insertError } = await supabase.from('comments').insert({
      post_id: postId,
      author_id: user.id,
      content: comment,
    })
    
    if (insertError) {
      setError(insertError.message)
      setIsSubmitting(false)
      return
    }

    // Insert notification for the post author (not for self-comments)
    if (post && post.author_id && post.author_id !== user.id) {
      const { error: notifError } = await supabase.from('notifications').insert({
        recipient_id: post.author_id,
        sender_id: user.id,
        notification_type: 'comment',
        post_id: post.id,
        message: 'commented on your post',
      })
      if (notifError) {
        
      }
    }

    setComment('')
    
    // Refresh comments
    const { data: comments } = await supabase
      .from('comments')
      .select('*, profiles:author_id(username, avatar_url)')
      .eq('post_id', postId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })
    setComments(comments || [])
    setIsSubmitting(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <MessageCircle size={28} className="text-white" />
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading post...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} className="text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Post Not Found</h3>
          <p className="text-gray-400 mb-4">This post may have been deleted or doesn't exist.</p>
          <Link href="/feed" className="btn">
            Back to Feed
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/feed" className="p-2 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
            <ArrowLeft size={20} className="text-gray-400 hover:text-white" />
          </Link>
          <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <MessageCircle size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Post Details
            </h1>
            <p className="text-gray-400">View and engage with this post</p>
          </div>
        </div>

        {/* Main Post */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 mb-8">
          <div className="flex items-start space-x-4 mb-4">
            <div className="relative">
              {post.profiles?.avatar_url ? (
                <img 
                  src={post.profiles.avatar_url} 
                  alt="avatar" 
                  className="w-14 h-14 rounded-full border-2 border-white/10" 
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User size={24} className="text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-white text-lg">
                  @{post.profiles?.username}
                </h3>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-400 mb-4">
                <Calendar size={14} />
                <span>{formatDate(post.created_at)}</span>
              </div>

              <div className="text-white text-lg leading-relaxed mb-4">
                {post.content}
              </div>

              {post.image_url && (
                <div className="mb-4">
                  <img 
                    src={post.image_url} 
                    alt="post" 
                    className="w-full max-h-96 object-cover rounded-2xl border border-white/10" 
                  />
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors cursor-pointer">
                  <MessageCircle size={18} />
                  <span className="text-sm">{comments.length} comments</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  <Heart size={18} />
                  <span className="text-sm">Like</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer">
                  <Share2 size={18} />
                  <span className="text-sm">Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle size={20} className="text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Add a Comment</h2>
          </div>
          
          <form onSubmit={handleAddComment} className="space-y-4">
            <div className="relative">
              <textarea
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all duration-300 resize-none"
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                maxLength={200}
                rows={3}
                required
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {comment.length}/200
              </div>
            </div>
            
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            
            <button 
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-2xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={isSubmitting || !comment.trim()}
            >
              {isSubmitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
              <span>{isSubmitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </form>
        </div>

        {/* Comments Section */}
        <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <MessageCircle size={20} className="text-purple-400" />
              <h2 className="text-xl font-semibold text-white">
                Comments ({comments.length})
              </h2>
            </div>
          </div>

          {comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Comments Yet</h3>
              <p className="text-gray-400">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(c => (
                <div key={c.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-black/30 transition-all duration-300">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      {c.profiles?.avatar_url ? (
                        <img 
                          src={c.profiles.avatar_url} 
                          alt="avatar" 
                          className="w-10 h-10 rounded-full border-2 border-white/10" 
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User size={16} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-white">
                          @{c.profiles?.username}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(c.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}