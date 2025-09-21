// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
// next.config.js
/** 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'tjvpexdouscdsigiyccv.supabase.co', // only the hostname
    ],
  },
};

module.exports = nextConfig;
