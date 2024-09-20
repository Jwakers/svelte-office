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
      },
      {
        source: '/products/shelby-mesh-back-operator',
        destination: '/products/shelby-mesh-back-operator-office-chair',
        permanent: true
      },
      {
        source: '/products/yokohama-gaming-chair',
        destination: '/products/yokohama-gaming-chair-office-chair',
        permanent: true
      },
      {
        source: '/products/warwick-noir',
        destination: '/products/warwick-noir-office-chair',
        permanent: true
      },
      {
        source: '/products/warwick-grey',
        destination: '/products/warwick-grey-office-chair',
        permanent: true
      },
      {
        source: '/products/warrwick',
        destination: '/products/warrwick-office-chair',
        permanent: true
      },
      {
        source: '/products/vintage-white',
        destination: '/products/vintage-white-office-chair',
        permanent: true
      },
      {
        source: '/products/vintage',
        destination: '/products/vintage-office-chair',
        permanent: true
      },
      {
        source: '/products/skyline',
        destination: '/products/skyline-office-chair',
        permanent: true
      },
      { source: '/products/siesta', destination: '/products/siesta-office-chair', permanent: true },
      {
        source: '/products/samson-heavy-duty',
        destination: '/products/samson-heavy-duty-office-chair',
        permanent: true
      },
      {
        source: '/products/richmond',
        destination: '/products/richmond-office-chair',
        permanent: true
      },
      {
        source: '/products/rapport',
        destination: '/products/rapport-office-chair',
        permanent: true
      },
      {
        source: '/products/quantum-executive-mesh-white-frame',
        destination: '/products/quantum-executive-mesh-white-frame-office-chair',
        permanent: true
      },
      {
        source: '/products/plush-ergo-executive',
        destination: '/products/plush-ergo-executive-office-chair',
        permanent: true
      },
      {
        source: '/products/piano-executive',
        destination: '/products/piano-executive-office-chair',
        permanent: true
      },
      {
        source: '/products/milan-fabric',
        destination: '/products/milan-fabric-office-chair',
        permanent: true
      },
      { source: '/products/milan', destination: '/products/milan-office-chair', permanent: true },
      {
        source: '/products/lombard',
        destination: '/products/lombard-office-chair',
        permanent: true
      },
      {
        source: '/products/knightsbridge',
        destination: '/products/knightsbridge-office-chair',
        permanent: true
      },
      {
        source: '/products/kingston-executive',
        destination: '/products/kingston-executive-office-chair',
        permanent: true
      },
      { source: '/products/kendal', destination: '/products/kendal-office-chair', permanent: true },
      { source: '/products/hoxton', destination: '/products/hoxton-office-chair', permanent: true },
      {
        source: '/products/hercules',
        destination: '/products/hercules-office-chair',
        permanent: true
      },
      {
        source: '/products/harmony',
        destination: '/products/harmony-office-chair',
        permanent: true
      },
      {
        source: '/products/grayson',
        destination: '/products/grayson-office-chair',
        permanent: true
      },
      {
        source: '/products/goliath-white',
        destination: '/products/goliath-white-office-chair',
        permanent: true
      },
      {
        source: '/products/goliath-light-executive',
        destination: '/products/goliath-light-executive-office-chair',
        permanent: true
      },
      {
        source: '/products/goliath-duo-ink-blue-fabric',
        destination: '/products/goliath-duo-ink-blue-fabric-office-chair',
        permanent: true
      },
      {
        source: '/products/goliath-duo-fabric',
        destination: '/products/goliath-duo-fabric-office-chair',
        permanent: true
      },
      {
        source: '/products/goliath-duo-bark-brown-fabric',
        destination: '/products/goliath-duo-bark-brown-fabric-office-chair',
        permanent: true
      },
      {
        source: '/products/goliath-duo',
        destination: '/products/goliath-duo-office-chair',
        permanent: true
      },
      {
        source: '/products/goliath',
        destination: '/products/goliath-office-chair',
        permanent: true
      },
      {
        source: '/products/gloucester',
        destination: '/products/gloucester-office-chair',
        permanent: true
      },
      {
        source: '/products/glencoe',
        destination: '/products/glencoe-office-chair',
        permanent: true
      },
      {
        source: '/products/elegance-medium',
        destination: '/products/elegance-medium-office-chair',
        permanent: true
      },
      {
        source: '/products/elegance-high',
        destination: '/products/elegance-high-office-chair',
        permanent: true
      },
      {
        source: '/products/deco-executive',
        destination: '/products/deco-executive-office-chair',
        permanent: true
      },
      { source: '/products/curve', destination: '/products/curve-office-chair', permanent: true },
      { source: '/products/cobham', destination: '/products/cobham-office-chair', permanent: true },
      {
        source: '/products/city-leather',
        destination: '/products/city-leather-office-chair',
        permanent: true
      },
      {
        source: '/products/city-fabric',
        destination: '/products/city-fabric-office-chair',
        permanent: true
      },
      { source: '/products/breeze', destination: '/products/breeze-office-chair', permanent: true },
      { source: '/products/zero', destination: '/products/zero-sit-stand-desk', permanent: true },
      { source: '/products/solo', destination: '/products/solo-sit-stand-desk', permanent: true },
      { source: '/products/mini', destination: '/products/mini-sit-stand-desk', permanent: true },
      {
        source: '/products/forge-corner',
        destination: '/products/forge-sit-stand-corner-desk',
        permanent: true
      },
      { source: '/products/forge', destination: '/products/forge-sit-stand-desk', permanent: true },
      { source: '/products/five', destination: '/products/five-sit-stand-desk', permanent: true },
      { source: '/products/duo', destination: '/products/duo-sit-stand-desk', permanent: true },
      { source: '/products/crown', destination: '/products/crown-sit-stand-desk', permanent: true },
      {
        source: '/products/cromo-corner',
        destination: '/products/cromo-sit-stand-corner-desk',
        permanent: true
      },
      { source: '/products/cromo', destination: '/products/cromo-sit-stand-desk', permanent: true },
      {
        source: '/products/advance-corner',
        destination: '/products/advance-sit-stand-corner-desk',
        permanent: true
      },
      {
        source: '/products/advance',
        destination: '/products/advance-sit-stand-desk',
        permanent: true
      },
      {
        source: '/collections/premium-furniture-collection',
        destination: '/collections/furniture',
        permanent: true
      }
    ];
  }
};
