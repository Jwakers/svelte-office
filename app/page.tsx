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
        <CollectionPreview />
      </Suspense>
    </>
  );
}
