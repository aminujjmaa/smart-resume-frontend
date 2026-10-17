function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

const apiOrigin = originOf(process.env.NEXT_PUBLIC_API_URL || "");

// Shipped as Report-Only first so violations can be reviewed before enforcing.
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://checkout.razorpay.com https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${apiOrigin} https://api.razorpay.com https://lumberjack.razorpay.com https://va.vercel-scripts.com https://vitals.vercel-insights.com`.trim(),
  "frame-src 'self' blob: https://api.razorpay.com https://checkout.razorpay.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.razorpay.com",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
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
