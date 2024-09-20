import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { ROUTES } from 'lib/constants';
import { Product } from 'lib/shopify/rest/types';
dotenv.config({ path: '.env.local' });

// pnpm tsx lib/shopify/migrations/01-generate-lavoro-skus.ts

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2023-04'
});

const COLOUR_MAP = {
  beech: 'B',
  black: 'K',
  silver: 'S',
  white: 'WH',
  'grey oak': 'GO',
  'grey-oak': 'GO',
  oak: 'O',
  walnut: 'W',
  'white/oak': 'WO',
  'white-oak': 'WO'
};

const FRAME_MAP = {
  black: 'K',
  silver: 'S',
  white: 'WH'
};

const WIDTH_MAP = {
  '800mm': '8',
  '1000mm': 10,
  '1200mm': 12,
  '1400mm': 14,
  '1600mm': 16,
  '1800mm': 18
};

async function migrate() {
  const skuPrefix = 'MH';
  const secondarySkuValue = 'P3';
  const productId = '9810608062765';
  const productResponse = await client.get(`${ROUTES.products}/${productId}`);
  const { product }: { product: Product } = await productResponse.json();

  const variantsToUpdate = product.variants.map((variant) => {
    const { option1, option2, option3 } = variant;
    const selections = [option1, option2, option3];

    let width, frame, tabletop;
    for (const selection of selections) {
      const key = selection?.toLowerCase();
      if (!key) continue;
      if (!width) {
        width = WIDTH_MAP[key as keyof typeof WIDTH_MAP];
        if (width) continue;
      }
      if (!tabletop) {
        tabletop = COLOUR_MAP[key as keyof typeof COLOUR_MAP];
        if (tabletop) continue;
      }
      if (!frame) {
        // Issue: key can match frame and colour maps
        frame = FRAME_MAP[key as keyof typeof FRAME_MAP];
        if (frame) continue;
      }
    }

    let sku = skuPrefix;
    if (width) sku += width;
    if (secondarySkuValue) sku += secondarySkuValue;
    if (frame) sku += frame;
    if (tabletop) sku += tabletop;

    return {
      id: variant.id,
      product_id: product.id,
      sku: sku
    };
  });

  const response = await client.put(`${ROUTES.products}/${productId}`, {
    data: {
      product: {
        variants: variantsToUpdate
      }
    }
  });

  const responseData = await response.json();
  console.log(JSON.stringify(responseData, null, 2));
}
migrate();
