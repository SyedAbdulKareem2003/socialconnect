'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, User } from 'lucide-react'

type PostType = {
  id: string
  author_id: string
  author_username?: string
  author_avatar?: string
  content: string
  image_url?: string
  category?: string
  created_at?: string
  like_count?: number
  comment_count?: number
  profiles?: { username?: string; avatar_url?: string }
  [key: string]: any
}

export default function PostCard({ post }: { post: PostType }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [commentCount, setCommentCount] = useState(post.comment_count || 0)
  const [imageError, setImageError] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [showFullContent, setShowFullContent] = useState(false)

  useEffect(() => {
    async function checkLiked() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setCurrentUserId(user.id)
      const { data } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .single()
      setLiked(!!data)
    }
    checkLiked()
  }, [post.id])

  useEffect(() => {
    async function fetchCommentCount() {
      const { count } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', post.id)
        .eq('is_active', true)
      setCommentCount(count || 0)
    }
    fetchCommentCount()
  }, [post.id])

  async function handleLike() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (liked) {
      await supabase.from('likes').delete().eq('post_id', post.id).eq('user_id', user.id)
      setLiked(false)
      setLikeCount(likeCount - 1)
      await supabase.from('posts').update({ like_count: likeCount - 1 }).eq('id', post.id)
    } else {
      const { error: likeError } = await supabase.from('likes').insert({ post_id: post.id, user_id: user.id })
      if (likeError) {
        alert('Could not like post: ' + likeError.message)
        return
      }
      setLiked(true)
      setLikeCount(likeCount + 1)
      await supabase.from('posts').update({ like_count: likeCount + 1 }).eq('id', post.id)
      // Insert notification for the post author (not for self-likes)
      if (post.author_id && post.author_id !== user.id) {
        const { error: notifError } = await supabase.from('notifications').insert({
          recipient_id: post.author_id,
          sender_id: user.id,
          notification_type: 'like',
          post_id: post.id,
          message: 'liked your post',
        })
        if (notifError) {
          // Optionally handle notification error
        }
      }
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`
    return `${Math.floor(diffInSeconds / 604800)}w`
  }

  const shouldTruncate = post.content && post.content.length > 150
  const displayContent = shouldTruncate && !showFullContent 
    ? post.content.slice(0, 150) + '...' 
    : post.content

  return (
    <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden mb-6 shadow-2xl shadow-black/20 hover:shadow-purple-500/10 transition-all duration-500 group">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center space-x-3">
          <Link href={`/profile/${post.author_username || post.author_id}`} className="group/avatar">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center group-hover/avatar:scale-110 transition-transform duration-300 shadow-lg">
              <User size={18} className="text-white" />
            </div>
          </Link>
          <div className="flex flex-col">
            <Link 
              href={`/profile/${post.author_username || post.author_id}`} 
              className="font-semibold text-white hover:text-pink-400 transition-colors duration-300"
            >
              @{post.author_username || post.author_id}
            </Link>
            <div className="flex items-center space-x-1 text-xs text-gray-400">
              <span className="px-2 py-0.5 bg-white/5 rounded-full text-xs">
                {post.category}
              </span>
              <span>•</span>
              <span>{formatTimeAgo(post.created_at || '')}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-300 text-gray-400 hover:text-white">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-white/90 leading-relaxed">
            {displayContent}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-pink-400 hover:text-pink-300 ml-2 font-medium transition-colors duration-300"
              >
                {showFullContent ? 'Show less' : 'Show more'}
              </button>
            )}
          </p>
        </div>
      )}

      {/* Image */}
      {post.image_url && post.image_url.startsWith('http') && !imageError && (
        <div className="relative overflow-hidden">
          <img
            src={post.image_url}
            alt="Post content"
            className="w-full h-auto max-h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      )}

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`group/like flex items-center space-x-2 transition-all duration-300 ${
                liked 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <div className={`p-2 rounded-full transition-all duration-300 ${
                liked 
                  ? 'bg-red-500/20 group-hover/like:bg-red-500/30' 
                  : 'hover:bg-red-500/20'
              }`}>
                <Heart 
                  size={20} 
                  className={`transition-all duration-300 ${
                    liked ? 'fill-current scale-110' : 'group-hover/like:scale-110'
                  }`} 
                />
              </div>
            </button>

            <Link 
              href={`/posts/${post.id}`}
              className="group/comment flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors duration-300"
            >
              <div className="p-2 rounded-full hover:bg-blue-500/20 transition-all duration-300">
                <MessageCircle size={20} className="group-hover/comment:scale-110 transition-transform duration-300" />
              </div>
            </Link>

            <button className="group/share flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors duration-300">
              <div className="p-2 rounded-full hover:bg-green-500/20 transition-all duration-300">
                <Share size={20} className="group-hover/share:scale-110 transition-transform duration-300" />
              </div>
            </button>
          </div>

          <button className="group/bookmark text-gray-400 hover:text-yellow-400 transition-colors duration-300">
            <div className="p-2 rounded-full hover:bg-yellow-500/20 transition-all duration-300">
              <Bookmark size={20} className="group-hover/bookmark:scale-110 transition-transform duration-300" />
            </div>
          </button>
        </div>

        {/* Like count and comments */}
        <div className="space-y-1">
          {likeCount > 0 && (
            <p className="font-semibold text-white text-sm">
              {likeCount === 1 ? '1 like' : `${likeCount} likes`}
            </p>
          )}
          
          {commentCount > 0 && (
            <Link 
              href={`/posts/${post.id}`} 
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300 block"
            >
              View {commentCount === 1 ? '1 comment' : `all ${commentCount} comments`}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}