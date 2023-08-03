import { CollectionPreview } from 'components/collections/collection-preview';
import { Hero } from 'components/hero';
import { Suspense } from 'react';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
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
      </Suspense>
    </>
  );
}
