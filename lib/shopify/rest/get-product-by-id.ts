import { Product } from './types';

export default async function getProductById(id: string): Promise<Product> {
  const url = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products/${id}.json`;

  const shopifyResponse = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_GOOGLE_MERCHANT_FEED_ACCESS_TOKEN as string
    }
  });

  const data = await shopifyResponse.json();

  return data.product;
}
