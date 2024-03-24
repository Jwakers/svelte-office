import Results from 'components/layout/search/Results';
import { getAlgoliaIndex } from 'lib/algolia';

export const dynamic = 'force-dynamic';

const index = getAlgoliaIndex();

export const metadata = {
  title: 'Search',
  description: 'Search for products.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue, brand, tag } = searchParams as { [key: string]: string };
  // const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  // let query = searchValue;

  // if (brand) query = `vendor:${brand}`;
  // if (tag) query = `tag:${tag}`;

  // const products = await getProducts({
  //   sortKey,
  //   reverse,
  //   query: query ? decodeURI(query) : undefined
  // });

  return <Results />;
}
