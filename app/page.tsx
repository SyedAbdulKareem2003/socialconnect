import { Heart, Camera, Users, MessageCircle, User, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      icon: Heart,
      title: "Connect & Share",
      description: "View your personalized Feed and Explore trending posts from the community",
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
      link: "/feed"
    },
    {
      icon: Camera,
      title: "Create Stories",
      description: "Share your moments with stunning photos and engaging captions",
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-500/10",
      link: "/posts/new"
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Discover amazing people and build meaningful connections",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      link: "/explore"
    },
    {
      icon: MessageCircle,
      title: "Engage & Interact",
      description: "Like, comment, and engage with posts that inspire you",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
      link: "/notification"
    },
    {
      icon: User,
      title: "Express Yourself",
      description: "Customize your profile and showcase your unique personality",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-500/10",
      link: "/settings/profile"
    }
  ]

  return (
    <div className="min-h-screen pb-20 lg:pb-8 relative">
      {/* Beautiful Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 -z-10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/0 to-slate-900/0 -z-10"></div>
      
      {/* Subtle animated grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] -z-10 opacity-30"></div>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-purple-400/20 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          {/* Main Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Sparkles size={18} className="text-yellow-400 mr-2" />
              <span className="text-sm font-medium text-white/80">Welcome to the future of social</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Social
              </span>
              <span className="text-white">Connect</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              Where creativity meets community. Share your world, discover amazing content, 
              and connect with people who inspire you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/feed"
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40"
            >
              <span>Explore Feed</span>
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link
              href="/posts/new"
              className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white rounded-2xl font-semibold transition-all duration-300 backdrop-blur-sm"
            >
              Create Post
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Everything you need to 
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> connect</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Discover powerful features designed to help you share, connect, and grow your community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                href={feature.link}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-3xl p-8 transition-all duration-500 hover:bg-white/10 hover:scale-105 hover:shadow-2xl"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} className={`bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-white/70 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center text-pink-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-2">
                  <span className="text-sm">Explore</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>

                {/* Hover gradient */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${feature.color} rounded-3xl transition-opacity duration-500`}></div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Join the growing community
            </h3>
            <p className="text-white/60">
              Be part of something amazing. Start sharing your story today.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                1M+
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">Posts Shared</div>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                50K+
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">Active Users</div>
            </div>
            <div className="group">
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                2M+
              </div>
              <div className="text-sm text-white/60 uppercase tracking-wider">Connections Made</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}