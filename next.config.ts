import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'api-website.cinestar.com.vn',
      },
    ],
    domains: ['localhost', 'upload.wikimedia.org', 'api-website.cinestar.com.vn'],
  },
};

export default nextConfig;
