import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@ilerti/shared'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
