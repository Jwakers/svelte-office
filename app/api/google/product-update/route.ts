import { content_v2_1, google } from 'googleapis';
import googleAuth from 'lib/google-auth';
import { Product } from 'lib/shopify/rest/types';
import { verifyShopifyWebhook } from 'lib/shopify/verify-webhook';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestBody } from '../get-request-body';

export const dynamic = 'force-dynamic'; // Prevents route running during build

export async function POST(req: NextRequest) {
  try {
    await verifyShopifyWebhook(req);

    const shopifyProduct: Product = await req.clone().json();
    const auth = googleAuth();
    const googleProductData: content_v2_1.Schema$Product[] = [];
    const content = google.content({
      version: 'v2.1',
      auth
    });
    const availableForSale = shopifyProduct.variants.some(
      (variant) => variant.inventory_quantity >= 1
    );
    const hasColourVariants = shopifyProduct.options.some(
      (option) => option.name.toLowerCase() === 'colour'
    );

    shopifyProduct.variants.forEach(async (variant, i) => {
      const requestBody = getRequestBody(shopifyProduct, variant, {
        isVariant: i >= 1,
        availableForSale,
        hasColourVariants
      });

      console.log(`Updating product: ${shopifyProduct.title}`);

      const googleProduct = await content.products.insert({
        merchantId: process.env.GOOGLE_MERCHANT_ID,
        requestBody
      });
      googleProductData.push(googleProduct as content_v2_1.Schema$Product);
    });

    return NextResponse.json(googleProductData);
  } catch (err) {
    return NextResponse.json(err, { status: 500 });
  }
}
