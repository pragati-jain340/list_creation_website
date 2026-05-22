import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Next.js 15+ sometimes places this in experimental, but standard Next.js uses it in root or experimental based on the error.
  },
  // The error specifies it should be at the root:
  allowedDevOrigins: ['192.168.1.19'],
} as any;

export default nextConfig;
