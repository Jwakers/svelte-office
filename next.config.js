/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    // Disabling on production builds because we're running checks on PRs via GitHub Actions.
    ignoreDuringBuilds: true
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
  async redirects() {
    return [
      {
        source: '/categories/office-chairs',
        destination: '/search?refinementList%5Bcollections%5D%5B0%5D=office-chairs',
        permanent: true
      },
      {
        source: '/categories/office-desks',
        destination: '/search?refinementList%5Bcollections%5D%5B0%5D=office-desks',
        permanent: true
      },
      {
        source: '/categories/bookcases-and-standing-shelves',
        destination:
          '/search?refinementList%5Bcollections%5D%5B0%5D=bookcases-and-standing-shelves',
        permanent: true
      },
      {
        source: '/categories/coffee-tables',
        destination: '/search?refinementList%5Bcollections%5D%5B0%5D=coffee-tables',
        permanent: true
      },
      {
        source: '/categories/office-accessories',
        destination: '/search?refinementList%5Bcollections%5D%5B0%5D=office-accessories',
        permanent: true
      }
    ];
  }
};
