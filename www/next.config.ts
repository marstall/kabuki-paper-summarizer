import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false, // Temporarily disabled for debugging
  productionBrowserSourceMaps: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // turbopack: {
  //   root: __dirname,
  // },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
