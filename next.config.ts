import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home dir confuses Next's workspace-root
  // inference — pin it to this project.
  outputFileTracingRoot: path.join(__dirname),
  images: {
    // Article covers can be uploaded to Supabase Storage or pulled from Unsplash/Pexels (RN-006).
    remotePatterns: [
      { protocol: "https", hostname: "capfxriewljazpfvfncc.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
};

export default nextConfig;
