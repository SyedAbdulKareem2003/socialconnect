'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, User, Trash2, Search, Filter, Calendar, MapPin, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState<any[]>([])
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      setUsers(data || [])
      setFilteredUsers(data || [])
      setLoading(false)
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    
    setDeleteLoading(userId)
    try {
      await supabase.from('profiles').delete().eq('id', userId)
      setUsers(users => users.filter(u => u.id !== userId))
      setFilteredUsers(filtered => filtered.filter(u => u.id !== userId))
    } catch (error) {
      alert('Failed to delete user')
    } finally {
      setDeleteLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users size={28} className="text-white" />
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="font-medium">Loading users...</span>
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
            <Link 
              href="/admin"
              className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">User Management</h1>
              <p className="text-gray-400">Manage all registered users</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{filteredUsers.length}</div>
            <div className="text-sm text-gray-400">Total Users</div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by username, bio, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10"
              />
            </div>
            
            {/* Filter Button */}
            <button className="flex items-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 text-white">
              <Filter size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="bg-black/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600/20 to-gray-700/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No users found</h3>
              <p className="text-gray-400">
                {searchTerm ? 'Try adjusting your search criteria' : 'No users have registered yet'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {filteredUsers.map((user, index) => (
                <div 
                  key={user.id} 
                  className="p-6 hover:bg-white/5 transition-colors duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {user.avatar_url ? (
                          <img 
                            src={user.avatar_url} 
                            alt="User avatar" 
                            className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-white/20 transition-colors duration-300" 
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center border-2 border-white/10 group-hover:border-white/20 transition-colors duration-300">
                            <User size={20} className="text-blue-400" />
                          </div>
                        )}
                      </div>

                      {/* User Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-1">
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                            @{user.username || 'No username'}
                          </h3>
                          <span className="text-xs text-gray-500">#{index + 1}</span>
                        </div>
                        
                        <div className="space-y-1">
                          {user.bio && (
                            <p className="text-sm text-gray-300 line-clamp-1">
                              {user.bio}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            {user.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin size={12} />
                                <span>{user.location}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-1">
                              <Calendar size={12} />
                              <span>Joined {formatDate(user.created_at)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={deleteLoading === user.id}
                        className="group/delete flex items-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteLoading === user.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} className="group-hover/delete:scale-110 transition-transform duration-300" />
                        )}
                        <span className="text-xs font-medium">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warning Notice */}
        <div className="mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-400 mb-1">Deletion Warning</h4>
              <p className="text-red-300 text-sm">
                Deleting a user will permanently remove their account, posts, and all associated data. 
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}