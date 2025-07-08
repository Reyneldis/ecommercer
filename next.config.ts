import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tudominio.com',
      },
      {
        protocol: 'https',
        hostname: 'otro.com',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
