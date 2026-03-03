/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // Enable static export for Cloudflare Pages
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Helps with Cloudflare Pages routing
};

module.exports = nextConfig;
