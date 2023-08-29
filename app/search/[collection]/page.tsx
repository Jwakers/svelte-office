import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProductTile from 'components/product/product-tile';
import { defaultSort, sorting } from 'lib/constants';
import { getCollection, getCollectionProducts } from 'lib/shopify';

export async function generateMetadata({
  params
}: {
  params: { collection: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.collection);

  if (!collection) notFound();

  return {
    title: collection.seo?.title || collection.title,
    description: collection.seo?.description || collection.description || `${collection.title}`
  };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: { collection: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const products = await getCollectionProducts({ handle: params.collection, sortKey, reverse });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li>
              <ProductTile product={product} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
