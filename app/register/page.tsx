'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signUpWithEmail } from '@/lib/auth'
import { Mail, Lock, UserPlus, AlertCircle, CheckCircle, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    const { error } = await signUpWithEmail(email, password)
    if (error) {
      setError(error.message)
    } else {
      setSuccess('Check your email for a confirmation link!')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10"></div>
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <UserPlus size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Join SocialConnect
          </h1>
          <p className="text-gray-400 text-lg">Create your account and start connecting</p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleRegister} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20 space-y-6">
          
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <Mail size={16} />
              <span>Email Address</span>
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-4 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all duration-300"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center space-x-2">
              <Lock size={16} />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-4 pr-12 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:bg-black/40 transition-all duration-300"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Password should be at least 8 characters long
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400">
              <CheckCircle size={20} />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Register Button */}
          <button 
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <UserPlus size={20} />
                <span>Create Account</span>
              </div>
            )}
          </button>

          {/* Terms & Privacy */}
          <div className="text-xs text-gray-500 text-center leading-relaxed">
            By creating an account, you agree to our{' '}
            <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Terms of Service</span>{' '}
            and{' '}
            <span className="text-purple-400 hover:text-purple-300 cursor-pointer">Privacy Policy</span>
          </div>

          {/* Footer Links */}
          <div className="pt-4 border-t border-white/10">
            <div className="text-center text-gray-400 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                Sign In
              </a>
            </div>
          </div>
        </form>

        {/* Bottom Message */}
        <div className="text-center mt-8 text-gray-500 text-sm flex items-center justify-center space-x-2">
          <Sparkles size={16} className="text-purple-400" />
          <p>Join thousands of creators and innovators</p>
          <Sparkles size={16} className="text-pink-400" />
        </div>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="bg-black/10 backdrop-blur-sm border border-white/5 rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Share Content</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Connect</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span>Discover</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}