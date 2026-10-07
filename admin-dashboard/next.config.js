/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow serving the existing allocation HTML from the parent directory
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
