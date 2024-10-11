import { TAGS } from 'lib/constants';
import { verifyShopifyWebhook } from 'lib/shopify/verify-webhook';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// We always need to respond with a 200 status code to Shopify,
// otherwise it will continue to retry the request.
export async function POST(req: NextRequest): Promise<Response> {
  try {
    await verifyShopifyWebhook(req);

    const collectionWebhooks = ['collections/create', 'collections/delete', 'collections/update'];
    const productWebhooks = ['products/create', 'products/delete', 'products/update'];
    const topic = headers().get('x-shopify-topic') || 'unknown';
    const isCollectionUpdate = collectionWebhooks.includes(topic);
    const isProductUpdate = productWebhooks.includes(topic);

    if (!isCollectionUpdate && !isProductUpdate) {
      // We don't need to revalidate anything for any other topics.
      return NextResponse.json({ status: 200 });
    }

    if (isCollectionUpdate) {
      revalidateTag(TAGS.collections);
    }

    if (isProductUpdate) {
      revalidateTag(TAGS.products);
    }

    return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
