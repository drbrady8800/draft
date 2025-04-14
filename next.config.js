/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Since we're using local images, we can disable optimization
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
