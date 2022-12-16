/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  output: 'standalone',
  reactStrictMode: false,
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
