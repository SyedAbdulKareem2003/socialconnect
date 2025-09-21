'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import PostCard from '@/components/PostCard'
import { Search, Users, FileText, Loader2, UserPlus, UserCheck, Compass, Sparkles } from 'lucide-react'

export default function ExplorePage() {
  const [query, setQuery] = useState('')
  const [userResults, setUserResults] = useState<any[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [followingIds, setFollowingIds] = useState<string[]>([])

  // Fetch current user and who they follow
  useEffect(() => {
    async function fetchUserAndFollowing() {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
      if (user) {
        const { data: following } = await supabase
          .from('follows')
          .select('following')
          .eq('follower', user.id)
        setFollowingIds(following ? following.map((f: any) => f.following) : [])
      }
    }
    fetchUserAndFollowing()
  }, [])

  // Fetch posts
  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles:author_id(username, avatar_url)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)
      if (!error && data) {
        setPosts(
          data.map((post: any) => ({
            ...post,
            author_username: post.profiles?.username,
            author_avatar: post.profiles?.avatar_url,
          }))
        )
      }
      setLoading(false)
    }
    fetchPosts()
  }, [])

  // Handle user search
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearching(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, bio')
      .ilike('username', `%${query}%`)
      .limit(20)
    // Exclude yourself from results (optional)
    setUserResults(
      (data || []).filter(u => u.id !== user?.id)
    )
    setSearching(false)
  }

  // Follow/unfollow logic with notification
  async function handleFollow(userId: string) {
  if (!currentUserId) return
  // Try to insert follow
  const { error: followError } = await supabase.from('follows').insert({ follower: currentUserId, following: userId })
  if (followError) {
    alert('Could not follow user: ' + followError.message)
    return
  }
  setFollowingIds(ids => [...ids, userId])

  // Insert notification for the followed user (only if follow succeeded)
  const { error: notifError } = await supabase.from('notifications').insert({
    recipient_id: userId,
    sender_id: currentUserId,
    notification_type: 'follow',
    message: 'started following you',
  })
  if (notifError) {
    
  }
}

  async function handleUnfollow(userId: string) {
    if (!currentUserId) return
    await supabase.from('follows').delete().eq('follower', currentUserId).eq('following', userId)
    setFollowingIds(ids => ids.filter(id => id !== userId))
    // (No notification for unfollow)
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg">
            <Compass size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Explore
            </h1>
            <p className="text-gray-400 text-lg">Discover amazing content and connect with people</p>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl shadow-black/20">
          <div className="flex items-center space-x-3 mb-4">
            <Search size={20} className="text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Find People</h2>
          </div>
          
          <form onSubmit={handleSearch} className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all duration-300 pr-12"
                placeholder="Search users by username..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <Search size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
              type="submit" 
              disabled={searching}
            >
              {searching ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Search size={20} />
              )}
              <span>{searching ? 'Searching...' : 'Search'}</span>
            </button>
          </form>
        </div>

        {/* User Results */}
        {userResults.length > 0 && (
          <div className="mb-8">
            <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Users size={20} className="text-blue-400" />
                <h2 className="text-xl font-semibold text-white">People ({userResults.length})</h2>
              </div>
              
              <div className="grid gap-4">
                {userResults.map(user => {
                  const isFollowing = followingIds.includes(user.id)
                  return (
                    <div key={user.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-black/30 transition-all duration-300 group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="relative">
                            {user.avatar_url ? (
                              <img 
                                src={user.avatar_url} 
                                alt="avatar" 
                                className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-blue-500/30 transition-colors duration-300" 
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Users size={20} className="text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <Link href={`/profile/${user.username}`}>
                              <div className="font-semibold text-white hover:text-blue-400 transition-colors duration-200 truncate">
                                @{user.username}
                              </div>
                            </Link>
                            {user.bio && (
                              <p className="text-gray-400 text-sm mt-1 line-clamp-2">
                                {user.bio}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {isFollowing ? (
                            <button
                              className="flex items-center space-x-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl hover:bg-green-500/20 hover:border-green-500/40 transition-all duration-300"
                              onClick={() => handleUnfollow(user.id)}
                            >
                              <UserCheck size={16} />
                              <span className="text-sm font-medium">Following</span>
                            </button>
                          ) : (
                            <button
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/20 hover:border-blue-500/40 transition-all duration-300"
                              onClick={() => handleFollow(user.id)}
                            >
                              <UserPlus size={16} />
                              <span className="text-sm font-medium">Follow</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Posts Section */}
        <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FileText size={20} className="text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Recent Posts</h2>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Sparkles size={16} />
              <span className="text-sm">Fresh content</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 size={24} className="text-purple-400 animate-spin" />
                </div>
                <p className="text-gray-400">Loading amazing posts...</p>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No Posts Yet</h3>
              <p className="text-gray-400">Be the first to share something amazing!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Stats */}
        <div className="mt-8 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                {posts.length}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Posts Loaded
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                {userResults.length}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Users Found
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                {followingIds.length}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Following
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}