import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      bufferutil: false,
      "utf-8-validate": false, // wrap in quotes to avoid TS/ESLint red underline
    };
    return config;
  },
};

export default nextConfig;
