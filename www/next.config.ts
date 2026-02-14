import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  },
}


export default nextConfig;
