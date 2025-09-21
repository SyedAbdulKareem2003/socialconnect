'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Heart, MessageCircle, UserPlus, Bell, Check, User, Eye } from 'lucide-react'
import Link from 'next/link'

type NotificationType = {
  id: string
  recipient_id: string
  sender_id: string
  notification_type: string
  post_id?: string
  message: string
  is_read: boolean
  created_at: string
  profiles?: { username?: string; avatar_url?: string }
  [key: string]: any
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setIsLoading(false)
        return
      }
      const { data } = await supabase
        .from('notifications')
        .select('*, profiles:sender_id(username, avatar_url)')
        .eq('recipient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data || [])
      setIsLoading(false)
    }
    fetchNotifications()
  }, [])

  async function markAllRead() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('recipient_id', user.id)
      .eq('is_read', false)
    setNotifications(notifications.map(n => ({ ...n, is_read: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={18} className="text-red-400 fill-current" />
      case 'comment':
        return <MessageCircle size={18} className="text-blue-400" />
      case 'follow':
        return <UserPlus size={18} className="text-green-400" />
      default:
        return <Bell size={18} className="text-purple-400" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const notifDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - notifDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 604800)}w ago`
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="min-h-screen pb-20 lg:pb-6">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-gray-400 text-sm">
                  {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={markAllRead}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 text-white/90 hover:text-white backdrop-blur-sm"
            >
              <Check size={16} />
              <span className="text-sm font-medium">Mark all read</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Bell size={32} className="text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              When someone likes your posts or follows you, you&apos;ll see their activity here.
            </p>
          </div>
        )}

        {/* Notifications List */}
        {!isLoading && notifications.length > 0 && (
          <div className="space-y-3">
            {notifications.map(notification => (
              <div
                key={notification.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10 ${
                  notification.is_read
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-purple-500/10 border-purple-500/20 hover:border-purple-500/40 shadow-lg shadow-purple-500/5'
                }`}
              >
                {/* Unread indicator */}
                {!notification.is_read && (
                  <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
                )}

                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <User size={18} className="text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        {getNotificationIcon(notification.notification_type)}
                        <p className="text-white leading-relaxed">
                          <span className="font-semibold text-pink-400 hover:text-pink-300 transition-colors">
                            @{notification.profiles?.username || 'Unknown user'}
                          </span>
                          <span className="text-white/80 ml-1">
                            {notification.message}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400 font-medium">
                          {formatTimeAgo(notification.created_at)}
                        </span>

                        {/* Action Button */}
                        {(notification.notification_type === 'like' || notification.notification_type === 'comment') && notification.post_id && (
                          <Link
                            href={`/posts/${notification.post_id}`}
                            className="flex items-center space-x-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-lg transition-all duration-300 text-xs font-medium text-white/90 hover:text-white group/link"
                          >
                            <Eye size={14} className="group-hover/link:scale-110 transition-transform duration-300" />
                            <span>View post</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover effect gradient */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5 transition-opacity duration-300 pointer-events-none rounded-2xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Load More (placeholder for future pagination) */}
        {notifications.length >= 50 && (
          <div className="mt-8 text-center">
            <button className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 text-white/90 hover:text-white backdrop-blur-sm font-medium">
              Load more notifications
            </button>
          </div>
        )}
      </div>
    </div>
  )
}