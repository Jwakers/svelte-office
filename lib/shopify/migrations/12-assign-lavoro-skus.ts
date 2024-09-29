import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { ROUTES } from 'lib/constants';
import { Product } from 'lib/shopify/rest/types';
dotenv.config({ path: '.env.local' });

// pnpm tsx lib/shopify/migrations/12-assign-lavoro-skus.ts 9819989672237

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2024-04'
});

const FRAME = {
  'Black (frame)': 'BADVS/',
  'Anthracite (frame)': 'AADVS/',
  'Dark grey (frame)': 'DGADVS/',
  'Silver (frame)': 'SADVS/',
  'Light grey (frame)': 'LGADVS/',
  'White (frame)': 'WADVS/',
  'Raw steel (frame)': 'RADVS/'
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

function getImageFileName(frameOption: string, tabletopOption: string): string {
  const framePart = frameOption
    .replace(' (frame)', '')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
  const tabletopPart = tabletopOption
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return `${framePart}Advance${tabletopPart}`;
}

async function migrate(productId: string, widthCode: string) {
  try {
    const productResponse = await client.get(`${ROUTES.products}/${productId}`);
    const { product }: { product: Product } = await productResponse.json();

    const variantsToUpdate = product.variants.map((variant) => {
      const { option1: frameOption, option2: tabletopOption } = variant;
      const frameChoice = FRAME[frameOption as keyof typeof FRAME];
      const tabletopChoice = TABLETOP[tabletopOption as keyof typeof TABLETOP];

      if (!frameChoice) {
        throw new Error(`Unknown frame option: ${frameOption}`);
      }
      if (!tabletopChoice) {
        throw new Error(`Unknown tabletop option: ${tabletopOption}`);
      }

      const sku = `${frameChoice}${widthCode}${tabletopChoice}`;
      const imageName = getImageFileName(frameOption, tabletopOption);
      const image = product.images.find((img) => img.src.includes(imageName));

      if (!image) console.warn(`Image not found for ${imageName}`);

      return {
        id: variant.id,
        product_id: product.id,
        sku: sku,
        image_id: image ? image.id : null
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
const widthCode = process.argv[3];
if (!productId) {
  console.error('Please provide a product ID');
  process.exit(1);
}
if (!widthCode) {
  console.error('Please provide a width code e.g. 1200800');
  process.exit(1);
}

migrate(productId, widthCode);
