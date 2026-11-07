import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Server Actions receive image uploads through FormData.
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
