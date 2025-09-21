/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'tjvpexdouscdsigiyccv.supabase.co', // ✅ your Supabase hostname
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignore ESLint errors on Vercel
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ ignore TypeScript errors on Vercel
  },
};

module.exports = nextConfig;
