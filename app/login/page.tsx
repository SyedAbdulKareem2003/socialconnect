'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmail, signInWithGoogle } from '@/lib/auth'
import { Mail, Lock, LogIn, Chrome, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    const { error } = await signInWithEmail(email, password)
    if (error) {
      setError(error.message)
    } else {
      router.push('/feed')
    }
    setIsLoading(false)
  }

  async function handleGoogle() {
    setIsLoading(true)
    await signInWithGoogle()
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10"></div>
      
      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <LogIn size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">Sign in to your SocialConnect account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20 space-y-6">
          
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
                placeholder="Enter your password"
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
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login Button */}
          <button 
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <LogIn size={20} />
                <span>Sign In</span>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative bg-black/20 px-4 text-sm text-gray-400">or continue with</div>
          </div>

          {/* Google Button */}
          <button 
            className="w-full py-4 bg-black/30 backdrop-blur-sm border border-white/10 text-white font-medium rounded-2xl hover:bg-white/10 hover:border-white/20 focus:outline-none focus:ring-4 focus:ring-white/10 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            type="button" 
            onClick={handleGoogle}
            disabled={isLoading}
          >
            <div className="flex items-center justify-center space-x-3">
              <Chrome size={20} />
              <span>Sign in with Google</span>
            </div>
          </button>

          {/* Footer Links */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <a href="/auth/reset" className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200">
                Forgot your password?
              </a>
            </div>
            
            <div className="text-center text-gray-400 text-sm">
              Don't have an account?{' '}
              <a href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200">
                Create Account
              </a>
            </div>
          </div>
        </form>

        {/* Bottom Message */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🌟 Welcome to the future of social</p>
        </div>
      </div>
    </div>
  )
}