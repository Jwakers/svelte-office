import { CollectionPreview } from 'components/collections/collection-preview';
import { Hero } from 'components/hero';
import LatestProducts from 'components/product/latest';
import { Suspense } from 'react';

export const metadata = {
  alternates: {
    canonical: '/'
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
  return (
    <>
      <Suspense>
        <Hero />
      </Suspense>
      <Suspense>
        <h2 className="border-black px-3 py-4 font-serif text-2xl uppercase md:border-b md:py-10 md:text-3xl">
          Shop by category
        </h2>
        <div className="md:grid md:grid-cols-2">
          <CollectionPreview handle="office-desks" />
          <CollectionPreview handle="office-chairs" />
          <CollectionPreview handle="bookcases-and-standing-shelves" />
          <CollectionPreview handle="coffee-tables" />
        </div>
        <h2 className="border-black px-3 py-4 font-serif text-2xl uppercase md:border-b md:py-10 md:text-3xl">
          Latest products
        </h2>
        <LatestProducts />
      </Suspense>
    </>
  );
}
