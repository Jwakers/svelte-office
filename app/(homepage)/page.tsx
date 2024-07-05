import { CollectionPreview } from 'components/collections/collection-preview';
import DeliveryBanner from 'components/delivery-banner';
import { FeaturedProduct } from 'components/featured-product';
import HeroCarousel from 'components/hero-carousel';
import LatestProducts from 'components/product/latest';
import PromotionBanner from 'components/promotion-banner';
import USPs from 'components/usps';
import { ROUTES } from 'lib/constants';
import { getPublicBaseUrl } from 'lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowRight } from 'react-feather';

const BASE_URL = getPublicBaseUrl();

export const metadata = {
  alternates: {
    canonical: BASE_URL
  },
  title: 'Svelte Office | Premium Office Furniture for Home Professionals',
  description:
    'Discover premium office furniture at Svelte Office. Elevate your home workspace with ergonomic chairs, modern desks, and stylish storage solutions. Shop now for the perfect blend of comfort and style.',
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
        {/* <FeaturedHero /> */}
        <HeroCarousel />
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
          <Link
            href={`/${ROUTES.categories}`}
            className="group relative border-b border-brand transition-colors hover:bg-brand hover:text-white md:grid-cols-[30%_1fr] md:border-l"
          >
            <div className="sticky top-0 z-10 flex items-center gap-1 self-end border-b border-brand bg-white px-4 py-2 transition-all group-hover:gap-4 md:hidden">
              <h2 className="font-serif text-2xl">View all categories</h2>
              <ArrowRight />
            </div>

            <div className="hidden h-full w-full content-end p-4 md:flex">
              <div className="flex w-full items-center gap-1 self-end">
                <h2 className="max-w-[90%] font-serif text-2xl lg:text-3xl">View all categories</h2>
                <ArrowRight className="transition-transform group-hover:translate-x-2" />
              </div>
            </div>
          </Link>
        </div>
        <DeliveryBanner />
        <FeaturedProduct />
        <PromotionBanner />
        <h2 className="border-brand px-3 py-4 font-serif text-2xl uppercase md:border-b md:py-10 md:text-3xl">
          Latest products
        </h2>
        <LatestProducts />
      </Suspense>
    </>
  );
}
