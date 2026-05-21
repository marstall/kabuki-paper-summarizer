import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false, // Temporarily disabled for debugging
  productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.devtool = 'source-map';
    }
    return config;
  },
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
