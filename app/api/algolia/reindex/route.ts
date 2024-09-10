import { getAlgoliaIndex, getRecord } from 'lib/algolia';
import { getProductsForAlgolia } from 'lib/shopify';
import { PageInfo, ProductAlgolia } from 'lib/shopify/types';
import { NextResponse } from 'next/server';

const client = getAlgoliaIndex(true);

async function recursiveFetch<T, K extends string>(
  property: K,
  callback: (after: string | null) => Promise<{ pageInfo: PageInfo } & { [key in K]: T[] }>
) {
  const allItems: T[] = [];
  let hasNextPage = true;
  let after = null;

  while (hasNextPage) {
    const response = await callback(after);
    const items = response[property];

    if (!items?.length) throw Error(`No items found for property: ${property}`);

    allItems.push(...items);

    hasNextPage = response.pageInfo.hasNextPage;
    after = response.pageInfo.endCursor;
  }

  return allItems;
}

export async function GET() {
  try {
    const allProducts = await recursiveFetch<ProductAlgolia, 'products'>(
      'products',
      getProductsForAlgolia
    );

    const objectsToIndex = allProducts.map(getRecord);

    await client.replaceAllObjects(objectsToIndex);

    return NextResponse.json({ message: 'Algolia reindex started' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'There was an error', error: err }, { status: 500 });
  }
}
