import type { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";
const repoName = "Personal-Website";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: isProduction ? `/${repoName}` : "",
  assetPrefix: isProduction ? `/${repoName}/` : undefined,
};

export default nextConfig;
