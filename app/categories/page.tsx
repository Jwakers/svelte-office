import IndexString from 'components/index-string';
import { getCollections } from 'lib/shopify';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'react-feather';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Collections',
    description: 'All product collections'
  };
}

export default async function Collections() {
  const collections = await getCollections();

  if (!collections.length) notFound();

  return (
    <section>
      <h1 className="p-3 font-serif text-2xl md:text-3xl">Categories</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {collections.map((collection) =>
          collection.products.length ? (
            <Link
              href={`/categories/${collection.handle}`}
              key={collection.handle}
              className="group flex h-full flex-col outline outline-1 outline-black"
            >
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  height={320}
                  width={320}
                  alt={collection.image.altText}
                  className="aspect-square w-full animate-fadeIn object-cover"
                />
              ) : null}
              <div className="flex h-full flex-col border-t border-slate-900 bg-white p-3">
                <h2 className="mb-2 font-serif text-lg uppercase md:text-xl">{collection.title}</h2>
                <div className="mt-auto flex justify-between">
                  <IndexString
                    value={collection.products.length}
                    text="products in
                  this category"
                  />
                  <ArrowRight className="transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
                </div>
              </div>
            </Link>
          ) : null
        )}
      </div>
    </section>
  );
}
