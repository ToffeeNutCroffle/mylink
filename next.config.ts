import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/**": ["./public/fonts/**"],
    },
  },
};

export default nextConfig;
