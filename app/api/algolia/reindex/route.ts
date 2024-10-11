import { verifyShopifyWebhook } from '@/lib/shopify/verify-webhook';
import { getAlgoliaIndex, getRecord } from 'lib/algolia';
import { getAllPages, getProductsForAlgolia } from 'lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

const client = getAlgoliaIndex(true);

export async function POST(req: NextRequest) {
  try {
    await verifyShopifyWebhook(req);
    const allProducts = await getAllPages('products', getProductsForAlgolia);

    const objectsToIndex = await Promise.all(
      allProducts.map(async (product) => await getRecord(product))
    );

    await client.replaceAllObjects(objectsToIndex);

    return NextResponse.json({ message: 'Reindex complete' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'There was an error', error: err }, { status: 500 });
  }
}
