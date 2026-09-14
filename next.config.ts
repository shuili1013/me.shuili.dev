import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Two root layouts ((site) and (studio)) → 404 lives in app/global-not-found.tsx.
  experimental: { globalNotFound: true },
  // A stray lockfile in a parent dir makes Next guess the wrong workspace root.
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
