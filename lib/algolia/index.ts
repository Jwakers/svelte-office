import algoliasearch from 'algoliasearch';
import { ALGOLIA } from 'lib/constants';

export function getAlgoliaClient(isAdmin?: boolean) {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    isAdmin ? process.env.ALGOLIA_ADMIN_API_KEY! : process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
  );

  return client;
}

export function getAlgoliaIndex(isAdmin?: boolean, indexName: string = ALGOLIA.index.products) {
  const client = getAlgoliaClient(isAdmin);
  const index = client.initIndex(indexName);

  return index;
}
