import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { wait } from 'lib/utils';
import { Product } from '../rest/types';
dotenv.config({ path: '.env.local' });

// pnpm tsx migrations/01-generate-lavoro-skus.ts

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2023-04'
});

async function migrate() {
  const productId = '9130590273837';
  const res = await client.get(`products`, {
    searchParams: { vendor: 'lavoro' }
  });
  const data: { products: Product[] } = await res.json();

  for (const product of data.products) {
    for (const variant of product.variants) {
      console.log(variant.inventory_item_id);
      const res = await client.post(`inventory_levels/set`, {
        data: {
          available: 10,
          inventory_item_id: variant.inventory_item_id,
          location_id: 86428975405
        }
      });
      const data = await res.json();
      await wait(500);
      console.log({ data });
    }
  }
}
migrate();
