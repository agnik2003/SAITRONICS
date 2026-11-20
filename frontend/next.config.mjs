/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['zustand'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
