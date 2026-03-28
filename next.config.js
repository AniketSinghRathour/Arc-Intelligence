/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['cheerio'],
  },

  eslint: {
    // ✅ Allows build even if ESLint has errors (useful for now)
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ✅ Allows build even if there are type errors (optional)
    ignoreBuildErrors: true,
  },

  images: {
    // Optional: allow external images if needed
    domains: [],
  },

  reactStrictMode: true,
};

module.exports = nextConfig;
