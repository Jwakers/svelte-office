import { Product } from './types';

function getNextPageUrl(linkHeader: string | null) {
  if (!linkHeader) {
    return null;
  }

  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}

export default async function getAllProducts() {
  try {
    let url:
      | string
      | null
      | undefined = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json`;
    let products = [];

    while (url) {
      const shopifyResponse = await fetch(url, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_PRODUCT_MANAGEMENT_ACCESS_Token as string
        }
      });

      const data: { products: Product[] } = await shopifyResponse.json();
      const nextPageLink = shopifyResponse.headers.get('link');
      url = getNextPageUrl(nextPageLink);

      products.push(...data.products);
    }

    return products;
  } catch (error) {
    console.error('Error:', error);

    throw Error();
  }
}
