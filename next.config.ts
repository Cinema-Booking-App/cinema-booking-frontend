// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Cho phép tất cả hostname với giao thức https
      },
      {
        protocol: 'http',
        hostname: '**', // Cho phép tất cả hostname với giao thức http (bao gồm localhost)
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
