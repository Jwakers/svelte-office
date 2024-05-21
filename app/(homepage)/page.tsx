import { CollectionPreview } from 'components/collections/collection-preview';
import DeliveryBanner from 'components/delivery-banner';
import { FeaturedProduct } from 'components/featured-product';
import { FeaturedHero } from 'components/hero';
import LatestProducts from 'components/product/latest';
import USPs from 'components/usps';
import { ROUTES } from 'lib/constants';
import { getPublicBaseUrl } from 'lib/utils';
import { Suspense } from 'react';

const BASE_URL = getPublicBaseUrl();

export const metadata = {
  alternates: {
    canonical: BASE_URL
  },
  description:
    'Upgrade your workspace with premium office furniture. Shop our exclusive collection of ergonomic chairs, modern desks, and storage solutions. Transform your office into a stylish and efficient hub today.',
  openGraph: {
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(process.env.SITE_NAME || '')}`,
        width: 1200,
        height: 630
      }
    ],
    type: 'website'
  }
};

export default async function HomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/${ROUTES.search}?q={search_term_string`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense>
        {/* <Hero /> */}
        <FeaturedHero />
      </Suspense>
      <Suspense>
        <USPs />
        <h2 className="border-brand px-3 py-4 font-serif text-2xl uppercase md:border-b md:py-10 md:text-3xl">
          Shop by category
        </h2>
        <div className="md:grid md:grid-cols-2">
          <CollectionPreview handle="office-desks" />
          <CollectionPreview handle="office-chairs" />
          <CollectionPreview handle="bookcases-and-standing-shelves" />
          <CollectionPreview handle="coffee-tables" />
        </div>
        <DeliveryBanner />
        <FeaturedProduct />
        <h2 className="border-brand px-3 py-4 font-serif text-2xl uppercase md:border-b md:py-10 md:text-3xl">
          Latest products
        </h2>
        <LatestProducts />
      </Suspense>
    </>
  );
}
