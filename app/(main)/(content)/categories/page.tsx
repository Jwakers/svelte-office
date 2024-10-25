import Breadcrumbs from '@/components/breadcrumbs';
import IndexString from 'components/index-string';
import { getURIComponent } from 'lib/algolia';
import { ROUTES } from 'lib/constants';
import { getCollections } from 'lib/shopify';
import { getImageSizes } from 'lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'All Categories',
  description:
    'Browse all categories at Svelte Office. Discover a wide range of premium office furniture, including ergonomic chairs, modern desks, and stylish storage solutions.'
};

export default async function Collections() {
  const collections = await getCollections();

  if (!collections.length) notFound();

  return (
    <>
      <Breadcrumbs current="Categories" />
      <section>
        <h1 className="p-3 font-serif text-2xl md:text-3xl">Categories</h1>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {collections.map((collection) =>
            collection.products.length ? (
              <Link
                href={`/${ROUTES.search}?${getURIComponent(
                  'refinementList',
                  'collections',
                  collection.handle
                )}`}
                key={collection.handle}
                className="group flex h-full flex-col shadow-border"
              >
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    width={collection.image.width}
                    height={collection.image.height}
                    alt={collection.image.altText}
                    sizes={getImageSizes({ sm: '100vw', md: '50vw', lg: '33vw', xl: '25vw' })}
                    className="aspect-square w-full animate-fadeIn object-cover"
                  />
                ) : null}
                <div className="flex h-full flex-col border-t bg-white p-3">
                  <h2 className="mb-2 font-serif text-lg uppercase md:text-xl">
                    {collection.title}
                  </h2>
                  <div className="mt-auto flex justify-between">
                    <IndexString
                      value={collection.products.length}
                      text="products in this category"
                    />
                    <ArrowRight className="transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            ) : null
          )}
        </div>
      </section>
    </>
  );
}
