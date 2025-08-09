import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // set to false if extra renders in dev bother you
  eslint: {
    ignoreDuringBuilds: true, // speeds up build if eslint is heavy
  },
  typescript: {
    ignoreBuildErrors: true, // optional for speed, but hides TS errors during build
  },
  webpack(config) {
    // Reduce big string serialization warning impact
    config.cache = {
      ...config.cache,
      type: "filesystem",
      compression: "gzip",
    };
    return config;
  },
};

export default nextConfig;
