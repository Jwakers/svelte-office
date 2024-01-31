import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { Product } from 'lib/shopify/rest/types';
dotenv.config({ path: '.env.local' });

// pnpm tsx migrations/01-generate-lavoro-skus.ts

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2023-04'
});

const SKU_MAP: {
  frame: { [key: string]: string };
  size: { [key: string]: number };
  decor: { [key: string]: string };
} = {
  frame: {
    Anthracite: 'AADVS/',
    Black: 'BADVS/',
    Silver: 'SADVS/',
    White: 'WADVS/'
  },
  size: {
    '1200 x 800mm': 1200800,
    '1400 x 800mm': 1400800,
    '1600 x 800mm': 1600800,
    '1800 x 800mm': 1800800,
    '1200 x 700mm': 1200700,
    '1400 x 700mm': 1400700,
    '1600 x 700mm': 1600700
  },
  decor: {
    Black: 'BLA',
    Graphite: 'GRA',
    Grey: 'GRY',
    White: 'WHI',
    Wenge: 'WEN',
    'Anthracite Sherman Oak': 'ASO',
    'Natural Dijon Walnut': 'NDW',
    Timber: 'TIM',
    'Grey Nebraska Oak': 'GNO',
    Beech: 'BEE',
    Oak: 'OAK',
    Maple: 'MAP',
    'Cascina Pine': 'CAS',
    Concrete: 'CON',
    'Ferro Bronze': 'FER',
    'Black Ply Edge': 'BLA/PE',
    'Graphite Ply Edge': 'GRA/PE',
    'White Ply Edge': 'WHI/PE'
  }
};

async function migrate() {
  const productId = '9125048811821';
  const productResponse = await client.get(`products/${productId}`);
  const { product }: { product: Product } = await productResponse.json();

  const variantsToUpdate = product.variants.map((variant) => {
    const { option1, option2, option3 } = variant;
    const sku = `${SKU_MAP.frame[option1]}${SKU_MAP.size[option2]}${SKU_MAP.decor[option3]}`;

    return {
      id: variant.id,
      product_id: product.id,
      sku: sku
    };
  });

  const response = await client.put(`products/${productId}`, {
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
