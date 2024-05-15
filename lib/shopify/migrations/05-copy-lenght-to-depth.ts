// pnpm tsx lib/shopify/migrations/05-copy-lenght-to-depth.ts

// IMPORTANT
// Code overrites all meta details incorectly. Needs testing update and review before using again

import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { ROUTES } from 'lib/constants';
import getAllOfType from '../rest/get-all-of-type';
import { Metafield, Product } from '../rest/types';

dotenv.config({ path: '.env.local' });

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2024-04'
});

async function migrate() {
  const products = await getAllOfType<Product>('products');
  const depthFieldId = 33820041117997;

  for (const product of products) {
    const res = await client.get(`${ROUTES.products}/${product.id}/metafields`, {
      searchParams: {
        namespace: 'specification',
        key: 'length'
      }
    });
    const data: { metafields: Metafield[] } = await res.json();
    if (!data?.metafields?.length) continue;

    const [length] = data?.metafields;
    console.log(length?.value);

    // const update = await client.put(`${ROUTES.products}/${product.id}/metafields/${depthFieldId}`, {
    //   data: {
    //     metafield: {
    //       product_id: product.id,
    //       value: length?.value,
    //       key: "depth",
    //       namespace: "specification"
    //     }
    //   }
    // });
    // const updateJson = await update.json();
    // console.log(updateJson);
    // await wait(500);
  }
}
migrate();
