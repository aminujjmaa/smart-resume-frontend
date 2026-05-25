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
};

module.exports = nextConfig;
