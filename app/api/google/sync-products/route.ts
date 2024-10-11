import { verifyShopifyWebhook } from '@/lib/shopify/verify-webhook';
import { content_v2_1, google } from 'googleapis';
import { SHOPIFY_TAGS } from 'lib/constants';
import googleAuth from 'lib/google-auth';
import getAllOfType from 'lib/shopify/rest/get-all-of-type';
import { Product } from 'lib/shopify/rest/types';
import { NextRequest, NextResponse } from 'next/server';
import { getRequestBody } from '../get-request-body';

export const dynamic = 'force-dynamic'; // Prevents route running during build

export async function POST(req: NextRequest) {
  try {
    await verifyShopifyWebhook(req);
    const shopifyProducts = await getAllOfType<Product>('products');
    const filteredProducts = shopifyProducts.filter(
      (product) => !product.tags.includes(SHOPIFY_TAGS.noindexGoogle)
    );

    console.log(
      `Filtered out ${
        shopifyProducts.length - filteredProducts.length
      } products with the noindexGoogle tag`
    );

    if (filteredProducts.length === 0) {
      console.warn('All products were filtered out. No updates will be sent to Google Merchant.');
      return NextResponse.json({ message: 'No products to update' });
    }

    const auth = googleAuth();

    const content = google.content({
      version: 'v2.1',
      auth
    });

    const googleMerchantProducts = await updateGoogleMerchantProducts(content, filteredProducts);

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
      (variant) => variant.inventory_quantity >= 1 || variant.inventory_management === null
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
