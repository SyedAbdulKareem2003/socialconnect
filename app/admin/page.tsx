'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Shield, Users, FileText, Activity, TrendingUp, Settings, BarChart3, Loader2, ArrowRight } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, posts: 0, activeToday: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      // Total users
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      // Total posts
      const { count: posts } = await supabase.from('posts').select('*', { count: 'exact', head: true })
      // Active today (users who posted today)
      const today = new Date().toISOString().slice(0, 10)
      const { count: activeToday } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today)
      setStats({
        users: users || 0,
        posts: posts || 0,
        activeToday: activeToday || 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const managementLinks = [
    {
      href: '/admin/users',
      title: 'Manage Users',
      description: 'View, edit, and manage user accounts',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      href: '/admin/posts',
      title: 'Manage Posts',
      description: 'Moderate and manage user posts',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Shield size={28} className="text-white" />
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading admin dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Monitor and manage your platform</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Users */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition-colors duration-300">
                <Users size={24} className="text-blue-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                  {formatNumber(stats.users)}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                  Total Users
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-blue-400 text-sm">
              <TrendingUp size={16} />
              <span>Platform growth</span>
            </div>
          </div>

          {/* Total Posts */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-2xl group-hover:bg-purple-500/30 transition-colors duration-300">
                <FileText size={24} className="text-purple-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                  {formatNumber(stats.posts)}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                  Total Posts
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-purple-400 text-sm">
              <BarChart3 size={16} />
              <span>Content created</span>
            </div>
          </div>

          {/* Active Today */}
          <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20 group hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-2xl group-hover:bg-green-500/30 transition-colors duration-300">
                <Activity size={24} className="text-green-400" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                  {formatNumber(stats.activeToday)}
                </div>
                <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                  Active Today
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-400 text-sm">
              <Activity size={16} />
              <span>Daily engagement</span>
            </div>
          </div>
        </div>

        {/* Management Section */}
        <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex items-center space-x-3 mb-8">
            <Settings size={24} className="text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Management Tools</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="group relative bg-black/20 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-2xl"
                >
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${link.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} className={`bg-gradient-to-r ${link.color} bg-clip-text text-transparent`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors duration-300">
                    {link.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-4">
                    {link.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-orange-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                    <span className="text-sm">Access</span>
                    <ArrowRight size={16} className="ml-1" />
                  </div>

                  {/* Hover gradient */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${link.color} rounded-2xl transition-opacity duration-500`}></div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Activity size={20} className="text-orange-400" />
            <span>Quick Stats Overview</span>
          </h3>
          
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
                {stats.users > 0 ? Math.round((stats.activeToday / stats.users) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Daily Active Rate
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
                {stats.users > 0 ? Math.round(stats.posts / stats.users) : 0}
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Posts per User
              </div>
            </div>
            
            <div className="group cursor-pointer">
              <div className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
                {stats.posts > 0 ? Math.round((stats.activeToday / stats.posts) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Content Growth
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}