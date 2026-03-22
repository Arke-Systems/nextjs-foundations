import type { NextConfig } from "next";

const blogUrl = process.env.BLOG_URL || "http://localhost:3001";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/blog",
        destination: `${blogUrl}`,
      },
      {
        source: "/blog/:path*",
        destination: `${blogUrl}/:path*`,
      },
    ];
  },
  cacheComponents: true, // Top-level in Next.js 16.1.x+
  cacheLife: {
    blog: {
      stale: 3600, // 1 hour
      revalidate: 86400, // 24 hours
      expire: 604800, // 1 week
    },
    products: {
      stale: 300, // 5 minutes
      revalidate: 900, // 15 minutes
      expire: 3600, // 1 hour
    },
    social: {
      stale: 60, // 1 minute
      revalidate: 300, // 5 minutes
      expire: 600, // 10 minutes
    },
  },
  images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "picsum.photos",
          pathname: "/**",
        },
      ],
      // Match Tailwind breakpoints
      deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
      // Common UI sizes
      imageSizes: [32, 48, 64, 96, 128, 192, 256],
      // Restrict quality values (required in Next.js 16)
      qualities: [75, 85],
      // Modern formats
      formats: ["image/avif", "image/webp"],
    },
};

export default nextConfig;
