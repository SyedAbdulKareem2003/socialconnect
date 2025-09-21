'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'

// Minimal post type for feed
type FeedPost = {
  id: string
  author_id: string
  content: string
  image_url?: string
  category?: string
  created_at?: string
  profiles?: { username?: string; avatar_url?: string }
  author_username?: string
  author_avatar?: string
  [key: string]: any // for any extra fields
}

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeed() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setLoading(false)

      // Get users you follow
      const { data: following } = await supabase
        .from('follows')
        .select('following')
        .eq('follower', user.id)

      const followingIds = following ? following.map((f: { following: string }) => f.following) : []
      followingIds.push(user.id) // include own posts

      // Fetch posts from followed users + self
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles:author_id(username, avatar_url)')
        .in('author_id', followingIds)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        console.error(error)
      } else if (data) {
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
    fetchFeed()
  }, [])

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Feed</h1>
      {loading && <div>Loading...</div>}
      {posts.length === 0 && !loading && <div>No posts yet.</div>}
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}