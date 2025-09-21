'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { User, MapPin, FileText, Camera, Save, CheckCircle, AlertCircle, Loader2, Upload, X } from 'lucide-react'

export default function ProfileForm({ profile, onProfileUpdated }: { profile: any, onProfileUpdated: () => void }) {
  const [username, setUsername] = useState(profile?.username || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      setError('Not logged in')
      setLoading(false)
      return
    }

    // Update profile row
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username, bio, location, avatar_url: avatarUrl })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
    } else {
      setSuccess('Profile updated!')
      onProfileUpdated()
    }
    setLoading(false)
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setError('Only JPEG or PNG images allowed')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Max file size is 2MB')
      return
    }

    setUploadingAvatar(true)
    setError('')
    setSuccess('')

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (!user || userError) {
      setError('Not logged in')
      setUploadingAvatar(false)
      return
    }
    const fileExt = file.name.split('.').pop()
    const filePath = `avatars/${user.id}.${fileExt}`

    // Remove old avatar if exists (optional)
    await supabase.storage.from('images').remove([`avatars/${user.id}.jpg`, `avatars/${user.id}.png`])

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      setError('Upload error: ' + uploadError.message)
      console.error('Upload error:', uploadError)
      setUploadingAvatar(false)
      return
    }

    // Get public URL
    const { data } = supabase.storage.from('images').getPublicUrl(filePath)
    setAvatarUrl(data.publicUrl)
    setSuccess('Avatar uploaded! Click Save Profile to update.')
    setUploadingAvatar(false)
  }

  const removeAvatar = () => {
    setAvatarUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const bioCharacterCount = bio.length
  const isNearBioLimit = bioCharacterCount > 140
  const isAtBioLimit = bioCharacterCount >= 160

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
          <User size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <p className="text-gray-400">Customize your profile information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block mb-6">
            {avatarUrl ? (
              <div className="relative group">
                <img 
                  src={avatarUrl} 
                  alt="Profile avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-2xl group-hover:border-white/20 transition-all duration-300" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-300"
                  >
                    <X size={20} className="text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center border-4 border-white/10 shadow-2xl">
                <User size={40} className="text-white" />
              </div>
            )}
            
            {uploadingAvatar && (
              <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                <Loader2 size={24} className="text-white animate-spin" />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="group flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera size={18} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">{avatarUrl ? 'Change Avatar' : 'Upload Avatar'}</span>
            </button>
            
            <div className="text-xs text-gray-400 text-center sm:text-left">
              JPEG or PNG • Max 2MB
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>

        {/* Username Field */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
            <User size={16} />
            <span>Username</span>
            <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            pattern="^[a-zA-Z0-9_]{3,30}$"
            title="3-30 chars, letters, numbers, underscores"
            className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10"
            placeholder="Enter your username"
          />
          <p className="text-xs text-gray-500">
            3-30 characters, letters, numbers, and underscores only
          </p>
        </div>

        {/* Bio Field */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
            <FileText size={16} />
            <span>Bio</span>
          </label>
          <div className="relative">
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={160}
              rows={4}
              className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none transition-all duration-300 focus:bg-white/10"
              placeholder="Tell us about yourself..."
            />
            <div className="absolute bottom-3 right-3 flex items-center space-x-2">
              <span className={`text-xs font-medium ${
                isAtBioLimit ? 'text-red-400' : isNearBioLimit ? 'text-yellow-400' : 'text-gray-500'
              }`}>
                {bioCharacterCount}/160
              </span>
              <div className={`w-6 h-6 rounded-full border-2 relative ${
                isAtBioLimit ? 'border-red-400' : isNearBioLimit ? 'border-yellow-400' : 'border-gray-600'
              }`}>
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-300 ${
                    isAtBioLimit ? 'bg-red-400' : isNearBioLimit ? 'bg-yellow-400' : 'bg-pink-500'
                  }`}
                  style={{ 
                    transform: `rotate(${(bioCharacterCount / 160) * 360}deg)`,
                    clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location Field */}
        <div className="space-y-3">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300">
            <MapPin size={16} />
            <span>Location</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10"
            placeholder="Where are you located?"
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <span className="text-green-400 text-sm">{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isAtBioLimit || !username.trim()}
          className="group w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Save Profile</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}