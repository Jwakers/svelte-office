import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { ROUTES } from 'lib/constants';
import { Product } from 'lib/shopify/rest/types';
dotenv.config({ path: '.env.local' });

// pnpm tsx lib/shopify/migrations/12-assign-lavoro-skus.ts

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2024-04'
});

const FRAME = {
  'Black (frame)': 'BADVS/',
  'Anthracite (frame)': 'AADVS/',
  'Dark Grey (frame)': 'DGADVS/',
  'Silver (frame)': 'SADVS/',
  'Light Grey (frame)': 'LGADVS/',
  'White (frame)': 'WADVS/',
  'Raw Steel (frame)': 'RADVS/'
};
const TABLETOP = {
  Black: 'BLA',
  'Soft Black': 'SBL',
  Anthracite: 'ANT',
  Graphite: 'GRA',
  Stone: 'STO',
  Cashmere: 'CSH',
  'Light Grey': 'GRY',
  White: 'WHI',
  'Light Concrete': 'LCO',
  'Dark Concrete': 'DCO',
  'Ferro Bronze': 'FER',
  'Anthracite Sherman Oak': 'ASO',
  'Grey Nebraska Oak': 'GNO',
  'Brown Oak': 'BOA',
  'Natural Oak': 'NOA',
  'Natural Dijon Walnut': 'NDW',
  Timber: 'TIM',
  Beech: 'BEE',
  Maple: 'MAP',
  'Cascina Pine': 'CAS'
};

async function migrate(productId: string) {
  try {
    const widthCode = '1800800';
    const productResponse = await client.get(`${ROUTES.products}/${productId}`);
    const { product }: { product: Product } = await productResponse.json();

    const variantsToUpdate = product.variants.map((variant) => {
      const { option1: frameOption, option2: tabletopOption } = variant;

      if (!FRAME[frameOption as keyof typeof FRAME]) {
        throw new Error(`Unknown frame option: ${frameOption}`);
      }
      if (!TABLETOP[tabletopOption as keyof typeof TABLETOP]) {
        throw new Error(`Unknown tabletop option: ${tabletopOption}`);
      }

      const sku = `${FRAME[frameOption as keyof typeof FRAME]}${widthCode}${
        TABLETOP[tabletopOption as keyof typeof TABLETOP]
      }`;

      return {
        id: variant.id,
        product_id: product.id,
        sku: sku
      };
    });

    try {
      const response = await client.put(`${ROUTES.products}/${productId}`, {
        data: {
          product: {
            variants: variantsToUpdate
          }
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          `API responded with status ${response.status}: ${JSON.stringify(responseData)}`
        );
      }

      console.log(
        `Successfully updated ${responseData.product.variants.length} variants for product ${productId}`
      );
      console.log('Updated SKUs:');
      responseData.product.variants.forEach((variant: any) => {
        console.log(`  ${variant.title}: ${variant.sku}`);
      });
    } catch (error) {
      console.error(`Error updating product`, error);
      process.exit(1);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const productId = process.argv[2];

if (!productId) {
  console.error('Please provide a product ID');
  process.exit(1);
}
migrate(productId);
