/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
  },
  experimental: {
    serverActions: true
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**'
      }
    ]
  },
  async headers() {
    const headers = [];
    // IMPORTANT: Remove before going live properly.
    // This will prevent the site from being indexed.
    headers.push({
      headers: [
        {
          key: 'X-Robots-Tag',
          value: 'noindex'
        }
      ],
      source: '/:path*'
    });

    return headers;
  }
};
