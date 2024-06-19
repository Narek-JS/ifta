/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  images: {
    disableStaticImages: true,
    loader: 'custom'
  },
  async headers() {
    return [
      {
        source: '/(.*).jpg',
        headers: [
          {
            key: 'Cache-Control',
            value: 'must-revalidate, public, max-age=31536000, s-maxage=31536000, immutable stale-while-revalidate=31536000',
          },
        ],
      },
      {
        source: '/(.*).png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'must-revalidate, public, max-age=31536000, s-maxage=31536000, immutable stale-while-revalidate=31536000',
          },
        ],
      },
      {
        // Adjust the source pattern to match Next.js image assets
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'must-revalidate, public, max-age=31536000, s-maxage=31536000, immutable stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig