'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Home, Search, PlusSquare, Heart, User, Settings, LogOut, Shield, Menu, X } from 'lucide-react'

const navLinks = [
  { href: '/feed', label: 'Feed', icon: Home },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/posts/new', label: 'New Post', icon: PlusSquare },
  { href: '/notification', label: 'Notifications', icon: Heart },
  { href: '/settings/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function checkAuthAndProfile() {
      const { data } = await supabase.auth.getSession()
      setLoggedIn(!!data.session)

      // If logged in, ensure profile exists and check admin
      if (data.session?.user) {
        const user = data.session.user
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, is_admin')
          .eq('id', user.id)
          .single()
        if (!profile) {
          await supabase.from('profiles').insert({
            id: user.id,
            username: user.email ? user.email.split('@')[0] : `user_${user.id.slice(0, 8)}`,
            bio: '',
            avatar_url: '',
            location: ''
          })
          setIsAdmin(false)
        } else {
          setIsAdmin(!!profile.is_admin)
        }
      } else {
        setIsAdmin(false)
      }
    }
    checkAuthAndProfile()

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoggedIn(!!session)
      if (session?.user) {
        const user = session.user
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, is_admin')
          .eq('id', user.id)
          .single()
        if (!profile) {
          await supabase.from('profiles').insert({
            id: user.id,
            username: user.email ? user.email.split('@')[0] : `user_${user.id.slice(0, 8)}`,
            bio: '',
            avatar_url: '',
            location: ''
          })
          setIsAdmin(false)
        } else {
          setIsAdmin(!!profile.is_admin)
        }
      } else {
        setIsAdmin(false)
      }
    })
    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <>
      <nav className="w-full bg-black/20 backdrop-blur-xl border-b border-white/10 mb-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          {/* Logo */}
          <Link href="/" className="group flex-shrink-0" onClick={closeMobileMenu}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-sm">SC</span>
              </div>
              <span className="hidden sm:block font-bold text-lg lg:text-xl bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-pink-300 group-hover:to-indigo-300 transition-all duration-300">
                SocialConnect
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {loggedIn && (
              <div className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm rounded-2xl p-3">
                {navLinks.map(link => {
                  const Icon = link.icon
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group relative flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={20} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'} flex-shrink-0`} />
                      <span className="font-medium text-sm whitespace-nowrap">{link.label}</span>
                      {isActive && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full"></div>
                      )}
                    </Link>
                  )
                })}
                
                {/* Admin link */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className={`group relative flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                      pathname === '/admin' 
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg shadow-orange-500/25' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Shield size={20} className={`transition-transform duration-300 ${pathname === '/admin' ? 'scale-110' : 'group-hover:scale-110'} flex-shrink-0`} />
                    <span className="font-medium text-sm whitespace-nowrap">Admin</span>
                    {pathname === '/admin' && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-white rounded-full"></div>
                    )}
                  </Link>
                )}
              </div>
            )}

            {/* Desktop Auth Buttons */}
            <div className="flex items-center space-x-3 ml-4">
              {!loggedIn && (
                <>
                  <Link 
                    href="/login" 
                    className="px-4 xl:px-6 py-2.5 text-sm xl:text-base text-white/90 hover:text-white border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 hover:bg-white/10 backdrop-blur-sm"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 xl:px-6 py-2.5 text-sm xl:text-base bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
                  >
                    Register
                  </Link>
                </>
              )}
              {loggedIn && (
                <button
                  className="group flex items-center justify-center w-12 h-12 text-gray-300 hover:text-white hover:bg-red-500/20 hover:border-red-500/40 border border-white/10 rounded-xl transition-all duration-300"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = '/'
                  }}
                  title="Logout"
                >
                  <LogOut size={20} className="transition-transform duration-300 group-hover:scale-110" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              {loggedIn && (
                <div className="space-y-2">
                  {navLinks.map(link => {
                    const Icon = link.icon
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobileMenu}
                        className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    )
                  })}
                  
                  {/* Mobile Admin link */}
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                        pathname === '/admin' 
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Shield size={20} />
                      <span className="font-medium">Admin</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                {!loggedIn && (
                  <>
                    <Link 
                      href="/login" 
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-3 text-center text-white/90 hover:text-white border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 hover:bg-white/10"
                    >
                      Login
                    </Link>
                    <Link 
                      href="/register" 
                      onClick={closeMobileMenu}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-xl transition-all duration-300 shadow-lg"
                    >
                      Register
                    </Link>
                  </>
                )}
                {loggedIn && (
                  <button
                    className="flex items-center justify-center space-x-3 w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 rounded-xl transition-all duration-300"
                    onClick={async () => {
                      await supabase.auth.signOut()
                      window.location.href = '/'
                      closeMobileMenu()
                    }}
                  >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>


    </>
  )
}