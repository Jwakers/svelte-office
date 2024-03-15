import ProductTile from 'components/product/product-tile';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';

export const metadata = {
  title: 'Search',
  description: 'Search for products.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue, brand } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const query = brand ? `vendor:${brand}` : searchValue;

  const products = await getProducts({ sortKey, reverse, query });
  const resultsText = products.length > 1 ? 'results' : 'result';

  return (
    <>
      {query ? (
        <p className="mt-4 border-b border-brand p-4 md:mt-0">
          {products.length === 0
            ? 'There are no products that match '
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{brand || searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li>
              <ProductTile product={product} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}
