import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocialConnect",
  description: "A simple social media app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {/* Beautiful Background - Global */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 -z-10"></div>
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-900/0 to-slate-900/0 -z-10"></div>
        
        {/* Subtle animated grid */}
        <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] -z-10 opacity-30"></div>
        
        {/* Animated background particles */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        {/* Glassmorphism overlay */}
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-none -z-5"></div>
        
        {/* Main content */}
        <div className="relative z-10">
          <Navbar />
          <main className="relative">
            {children}
          </main>
        </div>
        
        {/* Floating orbs for extra visual appeal */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-60 animate-bounce"></div>
          <div className="absolute bottom-10 left-10 w-6 h-6 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-40 animate-bounce animation-delay-500"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-50 animate-bounce animation-delay-1000"></div>
        </div>
      </body>
    </html>
  );
}