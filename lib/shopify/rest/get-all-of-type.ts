import { getNextPageUrl } from 'lib/utils';

type ItemType = 'products' | 'variants';

export default async function getAllOfType<T>(type: ItemType) {
  try {
    let url:
      | string
      | null
      | undefined = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/${type}.json`;
    let items = [];

    while (url) {
      const shopifyResponse = await fetch(url, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_PRODUCT_MANAGEMENT_ACCESS_TOKEN as string
        }
      });

      const data: { [key in ItemType]: T[] } = await shopifyResponse.json();
      const nextPageLink = shopifyResponse.headers.get('link');
      url = getNextPageUrl(nextPageLink);

      items.push(...data[type]);
    }

    return items;
  } catch (error) {
    console.error('Error:', error);

    throw Error();
  }
}
