'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import ProfileForm from '@/components/ProfileForm'
import PostCard from '@/components/PostCard'
import { User, Users, Heart, FileText, Edit, Trash2, Save, X, Settings, Grid, Loader2, MapPin } from 'lucide-react'

type ProfileType = {
  id: string
  username: string
  bio?: string
  avatar_url?: string
  location?: string
  [key: string]: any
}

type PostType = {
  id: string
  author_id: string
  content: string
  image_url?: string
  category?: string
  created_at?: string
  [key: string]: any
}

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<ProfileType | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [posts, setPosts] = useState<PostType[]>([])
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 })

  async function fetchProfileAndPosts() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    setProfile(profile)

    // Fetch user's posts
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('author_id', user.id)
      .order('created_at', { ascending: false })
    setPosts(posts || [])

    // Fetch stats
    const [{ count: followers }, { count: following }, { count: postCount }] = await Promise.all([
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following', user.id),
      supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower', user.id),
      supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', user.id),
    ])
    setStats({
      followers: followers || 0,
      following: following || 0,
      posts: postCount || 0,
    })

    setLoading(false)
  }

  useEffect(() => {
    fetchProfileAndPosts()
  }, [])

  async function handleDeletePost(postId: string) {
    if (!confirm('Are you sure you want to delete this post?')) return
    await supabase.from('posts').delete().eq('id', postId)
    setPosts(posts => posts.filter(p => p.id !== postId))
    setStats(s => ({ ...s, posts: s.posts - 1 }))
  }

  // For editing posts (optional, simple version)
  const [editingPost, setEditingPost] = useState<PostType | null>(null)
  const [editContent, setEditContent] = useState('')
  const [editCategory, setEditCategory] = useState('general')

  function startEditPost(post: PostType) {
    setEditingPost(post)
    setEditContent(post.content)
   setEditCategory(post.category || 'general')
  }

  async function handleEditPost(e: React.FormEvent) {
    e.preventDefault()
    if (!editingPost) return
    await supabase.from('posts').update({
      content: editContent,
      category: editCategory,
    }).eq('id', editingPost.id)
    setEditingPost(null)
    fetchProfileAndPosts()
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <User size={28} className="text-white" />
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading your profile...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User size={32} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Profile not found</h3>
          <p className="text-gray-400">There was an issue loading your profile. Please try refreshing the page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-gray-400">Manage your profile and posts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 mb-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Profile avatar" 
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white/10 shadow-xl" 
                  />
                ) : (
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/10 shadow-xl">
                    <User size={32} className="text-white" />
                  </div>
                )}
                
                <h2 className="text-xl font-bold text-white mb-2">@{profile.username}</h2>
                {profile.bio && (
                  <p className="text-gray-300 text-sm mb-3 leading-relaxed">{profile.bio}</p>
                )}
                {profile.location && (
                  <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                    <MapPin size={14} />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center group cursor-pointer">
                  <div className="p-2 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors duration-300 mb-2">
                    <Users size={16} className="text-pink-400 mx-auto" />
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-pink-400 transition-colors duration-300">
                    {formatNumber(stats.followers)}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    Followers
                  </div>
                </div>

                <div className="text-center group cursor-pointer">
                  <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300 mb-2">
                    <Heart size={16} className="text-purple-400 mx-auto" />
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                    {formatNumber(stats.following)}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    Following
                  </div>
                </div>

                <div className="text-center group cursor-pointer">
                  <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300 mb-2">
                    <FileText size={16} className="text-blue-400 mx-auto" />
                  </div>
                  <div className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                    {formatNumber(stats.posts)}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                    Posts
                  </div>
                </div>
              </div>

              {/* Edit Profile Button */}
              {!editing && (
                <button 
                  onClick={() => setEditing(true)}
                  className="group w-full flex items-center justify-center space-x-3 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/25"
                >
                  <Edit size={18} className="group-hover:scale-110 transition-transform duration-300" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Edit Profile Form */}
            {editing && (
              <div className="mb-8">
                <ProfileForm
                  profile={profile}
                  onProfileUpdated={() => {
                    setEditing(false)
                    fetchProfileAndPosts()
                  }}
                />
              </div>
            )}

            {/* Posts Section */}
            <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Grid size={20} className="text-pink-400" />
                <h3 className="text-xl font-bold text-white">Your Posts</h3>
                <div className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-300 font-medium">
                  {posts.length}
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">No posts yet</h4>
                  <p className="text-gray-400 max-w-sm mx-auto">
                    Start sharing your thoughts and moments with the world!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map(post =>
                    editingPost && editingPost.id === post.id ? (
                      <div key={post.id} className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                          <Edit size={18} className="text-pink-400" />
                          <span>Edit Post</span>
                        </h4>
                        
                        <form onSubmit={handleEditPost} className="space-y-4">
                          <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            maxLength={280}
                            required
                            rows={4}
                            className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none transition-all duration-300 focus:bg-white/10"
                            placeholder="What's on your mind?"
                          />
                          
                          <select
                            value={editCategory}
                            onChange={e => setEditCategory(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:bg-white/10"
                          >
                            <option value="general">✨ General</option>
                            <option value="announcement">📢 Announcement</option>
                            <option value="question">❓ Question</option>
                          </select>
                          
                          <div className="flex space-x-3">
                            <button 
                              type="submit"
                              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                            >
                              <Save size={16} />
                              <span>Save</span>
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setEditingPost(null)}
                              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-xl font-medium transition-all duration-300"
                            >
                              <X size={16} />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div key={post.id} className="relative group">
                        <PostCard post={post} />
                        
                        {/* Post Actions */}
                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => startEditPost(post)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/40 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-300"
                              title="Edit post"
                            >
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300"
                              title="Delete post"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}