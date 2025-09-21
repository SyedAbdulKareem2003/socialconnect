'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function UserProfilePage() {
  const { username } = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 })
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfile() {
      // Get profile by username
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()
      setProfile(profile)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)

      if (profile) {
        // Get stats
        const [{ count: followers }, { count: following }, { count: posts }] = await Promise.all([
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following', profile.id),
          supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower', profile.id),
          supabase.from('posts').select('*', { count: 'exact', head: true }).eq('author_id', profile.id),
        ])
        setStats({
          followers: followers || 0,
          following: following || 0,
          posts: posts || 0,
        })

        // Check if current user is following
        if (user && user.id !== profile.id) {
          const { data: follow } = await supabase
            .from('follows')
            .select('*')
            .eq('follower', user.id)
            .eq('following', profile.id)
            .single()
          setIsFollowing(!!follow)
        }
      }
      setLoading(false)
    }
    fetchProfile()
  }, [username])

  async function handleFollow() {
  if (!profile || !currentUserId) return
  // Try to insert follow
  const { error: followError } = await supabase.from('follows').insert({ follower: currentUserId, following: profile.id })
  if (followError) {
    alert('Could not follow user: ' + followError.message)
    return
  }
  setIsFollowing(true)
  setStats(s => ({ ...s, followers: s.followers + 1 }))

  // Insert notification for the followed user (only if follow succeeded)
  const { error: notifError } = await supabase.from('notifications').insert({
    recipient_id: profile.id,
    sender_id: currentUserId,
    notification_type: 'follow',
    message: 'started following you',
  })
  if (notifError) {
    alert('Could not send notification: ' + notifError.message)
  }
}

  async function handleUnfollow() {
    if (!profile || !currentUserId) return
    await supabase.from('follows').delete().eq('follower', currentUserId).eq('following', profile.id)
    setIsFollowing(false)
    setStats(s => ({ ...s, followers: s.followers - 1 }))
    // (No notification for unfollow)
  }

  if (loading) return <div>Loading...</div>
  if (!profile) return <div>User not found.</div>

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex items-center space-x-4 mb-4">
        {profile.avatar_url && (
          <img src={profile.avatar_url} alt="avatar" className="w-16 h-16 rounded-full" />
        )}
        <div>
          <div className="text-xl font-bold">@{profile.username}</div>
          <div className="text-gray-500">{profile.bio}</div>
          <div className="text-sm text-gray-400">{profile.location}</div>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <div><b>{stats.followers}</b> Followers</div>
        <div><b>{stats.following}</b> Following</div>
        <div><b>{stats.posts}</b> Posts</div>
      </div>
      {/* Show follow/unfollow if not own profile */}
      {currentUserId && profile.id !== currentUserId && (
        isFollowing ? (
          <button className="btn-outline" onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <button className="btn" onClick={handleFollow}>Follow</button>
        )
      )}
    </div>
  )
}