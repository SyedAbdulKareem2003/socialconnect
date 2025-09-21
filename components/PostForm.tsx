'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera, Image, Send, AlertCircle, X, Loader2, Sparkles, Hash } from 'lucide-react'

export default function PostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not logged in')
      setLoading(false)
      return
    }
    const fileExt = file.name.split('.').pop()
    const filePath = `posts/${user.id}_${Date.now()}.${fileExt}`
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, { upsert: true })
    if (uploadError) {
      setError(uploadError.message)
      setLoading(false)
      return
    }
    const { data } = supabase.storage.from('images').getPublicUrl(filePath)
    setImageUrl(data.publicUrl)
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Not logged in')
      setLoading(false)
      return
    }
    const { error: insertError } = await supabase
      .from('posts')
      .insert({
        author_id: user.id,
        content,
        image_url: imageUrl,
        category,
      })
    if (insertError) {
      setError(insertError.message)
    } else {
      setContent('')
      setImageUrl('')
      setCategory('general')
      if (fileInputRef.current) fileInputRef.current.value = ''
      onPostCreated()
    }
    setLoading(false)
  }

  const categoryOptions = [
    { value: 'general', label: '✨ General', color: 'from-gray-500 to-gray-600' },
    { value: 'announcement', label: '📢 Announcement', color: 'from-blue-500 to-blue-600' },
    { value: 'question', label: '❓ Question', color: 'from-purple-500 to-purple-600' }
  ]

  const removeImage = () => {
    setImageUrl('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const characterCount = content.length
  const isNearLimit = characterCount > 250
  const isAtLimit = characterCount >= 280

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-6 mb-8 shadow-2xl shadow-black/20">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
          <p className="text-sm text-gray-400">Share what's on your mind</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Input */}
        <div className="relative">
          <textarea
            className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 rounded-2xl px-4 py-4 text-white placeholder-gray-400 resize-none transition-all duration-300 focus:bg-white/10 min-h-[120px]"
            placeholder="What's happening? Share your thoughts..."
            value={content}
            onChange={e => setContent(e.target.value)}
            maxLength={280}
            required
          />
          <div className="absolute bottom-3 right-3 flex items-center space-x-2">
            <span className={`text-xs font-medium ${
              isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-500'
            }`}>
              {characterCount}/280
            </span>
            <div className={`w-8 h-8 rounded-full border-2 relative ${
              isAtLimit ? 'border-red-400' : isNearLimit ? 'border-yellow-400' : 'border-gray-600'
            }`}>
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  isAtLimit ? 'bg-red-400' : isNearLimit ? 'bg-yellow-400' : 'bg-pink-500'
                }`}
                style={{ 
                  transform: `rotate(${(characterCount / 280) * 360}deg)`,
                  clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'
                }}
              />
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="relative">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
            <Hash size={16} />
            <span>Category</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {categoryOptions.map((option) => (
              <label
                key={option.value}
                className={`relative flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  category === option.value
                    ? `bg-gradient-to-r ${option.color} border-transparent text-white shadow-lg`
                    : 'border-white/20 hover:border-white/40 text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={option.value}
                  checked={category === option.value}
                  onChange={e => setCategory(e.target.value)}
                  className="sr-only"
                />
                <span className="font-medium text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="group flex items-center space-x-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span className="font-medium">Add Photo</span>
            </button>
            
            <div className="text-xs text-gray-400">
              JPEG or PNG • Max 2MB
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Image Preview */}
          {imageUrl && (
            <div className="relative inline-block">
              <div className="relative group rounded-2xl overflow-hidden border border-white/20">
                <img 
                  src={imageUrl} 
                  alt="Upload preview" 
                  className="w-full max-w-sm h-48 object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-300"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isAtLimit || !content.trim()}
          className="group w-full flex items-center justify-center space-x-3 px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 disabled:shadow-none"
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Posting...</span>
            </>
          ) : (
            <>
              <Send size={20} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Share Post</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}