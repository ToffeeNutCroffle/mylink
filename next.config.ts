import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/opengraph-image": ["./public/fonts/**"],
      "/\\[username\\]/opengraph-image": ["./public/fonts/**"],
    },
  },
};

export default nextConfig;
