'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type NotificationType = {
  id: string
  [key: string]: any
}

export default function NotificationsBell() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let channel: any
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      // Fetch unread notifications
      const { data } = await supabase
        .from('notifications')
        .select('id')
        .eq('recipient_id', user.id)
        .eq('is_read', false)
        .order('created_at', { ascending: false })
        .limit(20)
      setCount((data || []).length)

      // Subscribe to real-time notifications
      channel = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${user.id}` },
          payload => {
            setCount(c => c + 1)
          }
        )
        .subscribe()
    }
    fetchNotifications()
    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return (
    <Link href="/notifications" className="relative">
      <span className="material-icons">notifications</span>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs">
          {count}
        </span>
      )}
    </Link>
  )
}