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
    ];
  },
};

module.exports = nextConfig;
