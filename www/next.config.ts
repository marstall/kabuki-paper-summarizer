import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
