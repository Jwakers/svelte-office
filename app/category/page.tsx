import IndexString from 'components/index-string';
import { getCollections } from 'lib/shopify';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Collections',
    description: 'All product collections'
  };
}

export default async function Collections() {
  const collections = await getCollections();

  if (!collections.length) return notFound();
  console.log(collections);

  return (
    <section>
      <h1 className="p-3 font-serif text-2xl md:text-3xl">Categories</h1>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {collections.map((collection) => (
          <Link className="group" href={`/category/${collection.handle}`} key={collection.handle}>
            <div className="flex h-full animate-fadeIn flex-col outline outline-1 outline-black">
              <div className="overflow-hidden">
                {collection.image ? (
                  <Image
                    src={collection.image.url}
                    width={450}
                    height={450}
                    alt={collection.image?.altText}
                    className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="flex grow flex-col justify-between border-t border-black bg-white p-3 ">
                <h2 className="mb-1 font-serif text-xl md:text-2xl">{collection.title}</h2>
                <IndexString
                  value={collection.products.length}
                  text="products in
                  this category"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
