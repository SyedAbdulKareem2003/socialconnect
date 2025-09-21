'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, Trash2, User, Calendar, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase.from('posts').select('*, profiles:author_id(username)').order('created_at', { ascending: false })
      setPosts(data || [])
      setLoading(false)
    }
    fetchPosts()
  }, [])

  async function handleDelete(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    // First, delete notifications for this post
    await supabase.from('notifications').delete().eq('post_id', postId)
    // Then, delete the post
    const { error } = await supabase.from('posts').delete().eq('id', postId)
    if (error) {
      alert('Delete failed: ' + error.message)
      return
    }
    setPosts(posts => posts.filter(p => p.id !== postId))
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
            <FileText size={28} className="text-white" />
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading posts...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="p-2 bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
              <ArrowLeft size={20} className="text-gray-400 hover:text-white" />
            </Link>
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <FileText size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Post Management
              </h1>
              <p className="text-gray-400 text-lg">Moderate and manage user posts</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">{posts.length}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">Total Posts</div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
              <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Posts Found</h3>
              <p className="text-gray-400">There are no posts to manage at the moment.</p>
            </div>
          ) : (
            posts.map(post => (
              <div key={post.id} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 group hover:bg-black/30 transition-all duration-300">
                <div className="flex items-start justify-between">
                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <User size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          @{post.profiles?.username || post.author_id}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Calendar size={14} />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl p-4 mb-4">
                      <p className="text-white leading-relaxed break-words">
                        {post.content}
                      </p>
                    </div>

                    {/* Post Stats */}
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>Post ID: {post.id.slice(0, 8)}...</span>
                      <span>•</span>
                      <span>Character count: {post.content.length}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2 ml-6">
                    <button 
                      onClick={() => handleDelete(post.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300 transition-all duration-300 group/btn"
                    >
                      <Trash2 size={16} className="group-hover/btn:animate-pulse" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {posts.length > 0 && (
          <div className="mt-8 bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText size={20} className="text-purple-400" />
              <span>Post Statistics</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                  {posts.length}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Total Posts
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {new Set(posts.map(p => p.author_id)).size}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Unique Authors
                </div>
              </div>
              
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                  {posts.length > 0 ? Math.round(posts.reduce((acc, post) => acc + post.content.length, 0) / posts.length) : 0}
                </div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                  Avg Characters
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}