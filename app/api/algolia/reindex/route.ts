import { getAlgoliaIndex, getRecord } from 'lib/algolia';
import { getAllPages, getProductsForAlgolia } from 'lib/shopify';
import { ProductAlgolia } from 'lib/shopify/types';
import { NextResponse } from 'next/server';

const client = getAlgoliaIndex(true);

export async function GET() {
  try {
    const allProducts = await getAllPages<ProductAlgolia, 'products'>(
      'products',
      getProductsForAlgolia
    );

    const objectsToIndex = allProducts.map(getRecord);

    await client.replaceAllObjects(objectsToIndex);

    return NextResponse.json({ message: 'Reindex complete' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'There was an error', error: err }, { status: 500 });
  }
}
