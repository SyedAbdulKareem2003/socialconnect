'use client'

import { useState } from 'react'
import { resetPassword } from '@/lib/auth'

export default function ResetPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    const { error } = await resetPassword(email)
    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for a password reset link!')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleReset} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Reset Password</h1>
        <input
          className="input w-full"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        {message && <div className="text-green-500">{message}</div>}
        <button className="btn w-full" type="submit">Send Reset Link</button>
        <div className="text-sm">
          <a href="/login" className="text-blue-500">Back to login</a>
        </div>
      </form>
    </div>
  )
}