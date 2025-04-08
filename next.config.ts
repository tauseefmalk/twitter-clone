import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "tauseef-twitter-dev.s3.ap-south-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
