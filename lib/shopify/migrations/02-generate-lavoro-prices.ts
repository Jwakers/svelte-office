import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { Product } from 'lib/shopify/rest/types';
import { getPriceWithMargin, wait } from 'lib/utils';
dotenv.config({ path: '.env.local' });

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2023-04'
});

const COST_MAP: { [key: string]: string } = {
  '1200 x 800mm': '817.00',
  '1400 x 800mm': '824.00',
  '1600 x 800mm': '831.00',
  '1800 x 800mm': '838.00',
  '1200 x 700mm': '817.00',
  '1400 x 700mm': '824.00',
  '1600 x 700mm': '831.00'
};

async function getProduct(id: string) {
  const response = await client.get(`products/${id}`);
  const { product }: { product: Product } = await response.json();

  return product;
}

async function migrate() {
  const productId = '9130590273837';
  const product = await getProduct(productId);
  const inventoryIds = product.variants.map((variant) => ({
    inventoryId: variant.inventory_item_id,
    variantId: variant.id,
    size: variant.option2
  }));

  for (const item of inventoryIds) {
    const cost = COST_MAP[item.size];
    let data;

    const invRes = await client.put(`inventory_items/${item.inventoryId}`, {
      data: {
        inventory_item: {
          id: item.inventoryId,
          cost
        }
      }
    });
    data = await invRes.json();

    const varRes = await client.put(`variants/${item.variantId}`, {
      data: {
        variant: {
          id: item.variantId,
          price: getPriceWithMargin(cost as string)
        }
      }
    });
    data = varRes.json();
    await wait(500);
  }
}
migrate();
