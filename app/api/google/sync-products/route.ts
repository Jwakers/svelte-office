import { content_v2_1, google } from 'googleapis';
import googleAuth from 'lib/google-auth';
import getAllOfType from 'lib/shopify/rest/get-all-of-type';
import { Product } from 'lib/shopify/rest/types';
import { NextResponse } from 'next/server';
import { getRequestBody } from '../get-request-body';

export const dynamic = 'force-dynamic'; // Prevents route running during build

export async function GET() {
  try {
    const shopifyProducts = await getAllOfType<Product>('products');

    if (!shopifyProducts || !shopifyProducts.length) throw Error('No shopify products');

    const auth = googleAuth();

    const content = google.content({
      version: 'v2.1',
      auth
    });

    const googleMerchantProducts = await updateGoogleMerchantProducts(content, shopifyProducts);

    return NextResponse.json(googleMerchantProducts);
  } catch (error) {
    console.error('Error:', error);

    return new Response('Internal Server Error', {
      status: 500
    });
  }
}

async function updateGoogleMerchantProducts(
  contentClient: content_v2_1.Content,
  shopifyProducts: Product[]
) {
  const productData: content_v2_1.Schema$ProductsCustomBatchRequestEntry[] = [];

  for (const shopifyProduct of shopifyProducts) {
    const availableForSale = shopifyProduct.variants.some(
      (variant) => variant.inventory_quantity >= 1
    );
    const hasColourVariants = shopifyProduct.options.some(
      (option) => option.name.toLowerCase() === 'colour'
    );

    shopifyProduct.variants.forEach((variant, i) => {
      const requestBody = getRequestBody(shopifyProduct, variant, {
        isVariant: i >= 1,
        availableForSale,
        hasColourVariants
      });

      productData.push({
        merchantId: process.env.GOOGLE_MERCHANT_ID,
        batchId: productData.length + 1,
        method: 'insert',
        product: requestBody
      });
    });
  }

  const res = await contentClient.products.custombatch({
    requestBody: {
      entries: productData
    }
  });

  return res.data;
}
