import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
