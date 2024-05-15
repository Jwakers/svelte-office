import { getAlgoliaIndex, getRecord } from 'lib/algolia';
import { getProductsForAlgolia } from 'lib/shopify';
import { NextResponse } from 'next/server';

const client = getAlgoliaIndex(true);

export async function GET() {
  try {
    const products = await getProductsForAlgolia();

    const objectsToIndex = products.map(getRecord);

    client.saveObjects(objectsToIndex);

    if (products.length >= 250)
      console.warn('Reached product fetch limit of 250. Not all products will be indexed.');

    return NextResponse.json({ message: 'Algolia reindex started' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'There was an error', error: err }, { status: 500 });
  }
}
