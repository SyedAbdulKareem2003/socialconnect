'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
      if (!session) router.replace('/login')
    })

    // Check on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
      if (!data.session) router.replace('/login')
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>
  if (!session) return null

  return <>{children}</>
}