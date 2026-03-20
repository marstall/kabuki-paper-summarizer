import type { NextConfig } from "next";
const { withPlausibleProxy } = require('next-plausible')

const nextConfig: NextConfig = withPlausibleProxy()({
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
});

export default nextConfig;
