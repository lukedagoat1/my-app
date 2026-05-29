import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // When SITE=lucent, redirect the root to /lucent
    // Set this env var in the lucent-studio Vercel project settings
    if (process.env.SITE === 'lucent') {
      return [{ source: '/', destination: '/lucent', permanent: false }]
    }
    return []
  },
};

export default nextConfig;
