/** @type {import('next').NextConfig} */
const nextConfig = {
  // Browser calls /api/server/* (same origin) -> Next proxies it to Express.
  // Same origin = HTTPOnly cookie is sent automatically, no CORS/cookie problem in production.
  async rewrites() {
    return [
      {
        source: "/api/server/:path*",
        destination: `${process.env.SERVER_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
