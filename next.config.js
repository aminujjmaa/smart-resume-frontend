/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/smart-resume',
        destination: '/',
        permanent: true,
      },
      {
        source: '/smart-resume/:path*',
        destination: '/',
        permanent: true,
      },
      {
        // Redirect old gated upload page to the new public scanner
        source: '/dashboard/upload',
        destination: '/scan',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    // Only proxy in development, or use BACKEND_URL if provided in production
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
