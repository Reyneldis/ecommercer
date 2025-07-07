/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'strapi-backend1-enxe.onrender.com',
        pathname: '/uploads/**',
      },
    ],
    domains: [
      'images.unsplash.com',
      // agrega aquí otros dominios si usas más
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

export default nextConfig;
