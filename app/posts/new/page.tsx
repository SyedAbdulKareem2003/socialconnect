'use client'
import AuthGuard from '@/components/AuthGuard'
import PostForm from '@/components/PostForm'

export default function NewPostPage() {
  return (
    <AuthGuard>
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Create Post</h1>
        <PostForm onPostCreated={() => window.location.href = '/feed'} />
      </div>
    </AuthGuard>
  )
}