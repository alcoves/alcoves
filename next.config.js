/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
