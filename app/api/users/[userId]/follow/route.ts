import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.id === userId) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 })

  // Check if already following
  const { data: existing } = await supabase
    .from('follows')
    .select('*')
    .eq('follower', user.id)
    .eq('following', userId)
    .single()

  if (existing) return NextResponse.json({ error: 'Already following' }, { status: 400 })

  const { error } = await supabase
    .from('follows')
    .insert({ follower: user.id, following: userId })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest, { params }: { params: { userId: string } }) {
  const { userId } = params
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabase
    .from('follows')
    .delete()
    .eq('follower', user.id)
    .eq('following', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}