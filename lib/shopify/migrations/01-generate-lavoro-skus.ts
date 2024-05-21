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

const SKU_MAP: {
  frame: { [key: string]: string };
  size: { [key: string]: number };
  decor: { [key: string]: string };
} = {
  frame: {
    Anthracite: 'ADUO/',
    Black: 'BDUO/',
    Silver: 'SDUO/',
    White: 'WDUO/'
  },
  size: {
    '1000 x 400 x 18mm': 100040018,
    '1200 x 400 x 18mm': 120040018,
    '1400 x 400 x 18mm': 140040018,
    '1600 x 400 x 18mm': 160040018,
    '1800 x 400 x 18mm': 180040018,
    '1000 x 400 x 25mm': 100040025,
    '1200 x 400 x 25mm': 120040025,
    '1400 x 400 x 25mm': 140040025,
    '1600 x 400 x 25mm': 160040025,
    '1800 x 400 x 25mm': 180040025
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
  const productId = '9311168266541';
  const productResponse = await client.get(`${ROUTES.products}/${productId}`);
  const { product }: { product: Product } = await productResponse.json();

  const variantsToUpdate = product.variants.map((variant) => {
    const { option1, option2, option3 } = variant;
    // const sku = `${SKU_MAP.frame[option1]}${SKU_MAP.size[option2]}${SKU_MAP.decor[option3]}`;

    // Used for accessories
    const sku = `MP${SKU_MAP.size[option1]}/${SKU_MAP.decor[option2]}`;

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
