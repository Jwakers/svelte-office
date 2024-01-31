import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { Product } from 'lib/shopify/rest/types';
import { wait } from 'lib/utils';
dotenv.config({ path: '.env.local' });

// pnpm tsx migrations/02-generate-lavoro-prices.ts

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2023-04'
});

const COST_MAP: { [key: string]: string } = {
  '1200 x 800mm': '433.00',
  '1400 x 800mm': '443.00',
  '1600 x 800mm': '447.00',
  '1800 x 800mm': '460.00',
  '1200 x 700mm': '433.00',
  '1400 x 700mm': '443.00',
  '1600 x 700mm': '447.00'
};

async function getProduct(id: string) {
  const response = await client.get(`products/${id}`);
  const { product }: { product: Product } = await response.json();

  return product;
}

async function getInventoryItem(id: number) {
  const response = await client.get(`inventory_items/${id}`);
  const inventory_item: { inventory_item: Product } = await response.json();

  return inventory_item;
}

function getPriceWithMargin(cost: string, marginPercentage: number = 30) {
  const costPrice = parseFloat(cost);

  let sellingPrice = costPrice + costPrice * (marginPercentage / 100);
  // Round to the nearest 10
  sellingPrice = Math.ceil(sellingPrice / 10) * 10;
  sellingPrice.toFixed(2);

  return `${sellingPrice.toFixed(2)}`;
}

async function migrate() {
  const productId = '9125048811821';
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
    console.log(data);

    const varRes = await client.put(`variants/${item.variantId}`, {
      data: {
        variant: {
          id: item.variantId,
          price: getPriceWithMargin(cost as string)
        }
      }
    });
    data = varRes.json();
    console.log(data);
    await wait(500);
  }
}
migrate();
