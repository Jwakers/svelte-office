const skus = [
  '5414142',
  '5414141',
  '5414693',
  '5401562',
  '5416966',
  '10824',
  '11225',
  '40104',
  '40106',
  '10420',
  '2516141',
  '1508',
  '0235',
  '1610',
  'ZRMONTREALBURG',
  'OUK780SLF',
  '1100BLK/1163',
  '1100BLU/1163',
  '1100PUBLK/1163',
  '1100PUWHI/1163',
  '2900BLK/1163',
  '2900BLU/1163',
  '1850/1163',
  '6600',
  '002',
  '83428A ',
  '10418',
  '5412314',
  '8512KC',
  '8512MDK',
  '6933BLU',
  'ATLANTACR',
  'CHICAGOBLK',
  '5420194',
  '5420114',
  'CHICAGOCR',
  'CHICAGOBN',
  '5414836',
  '5418295',
  '5418294',
  '6903BLK',
  '6904CR',
  '5418227',
  '6947RED',
  '6947WHITE',
  '5417061',
  '1574BL',
  '1608',
  '5418269',
  '5408761',
  '6911',
  '0164',
  '1609',
  '5418706',
  '5402174',
  'M0001BL',
  'M0001BU',
  'M0001CH',
  'M0001GR',
  'M0001LGR',
  'M0001PK',
  '80452',
  '5416488',
  '5420329',
  '5420330',
  'B99OKVBL',
  'B99OKVCH',
  '5419232',
  '5424944',
  '5418902',
  'B8801BL',
  'B8801BU',
  'B8801CH',
  '5418705',
  '5418702',
  '5418891',
  '5414720',
  '5412885',
  '5410421',
  '5419228',
  '5419233',
  '5414729',
  '9200BLK',
  '9200BL',
  '6945',
  '5420285',
  'ZRMONTREALNATURAL',
  '5419229',
  '5420276',
  '5423023',
  '5423028',
  '5423412',
  '5424170',
  '5426055',
  '5420032',
  '5420275',
  '5426133',
  'ZRDENVERBROWN',
  'ZRDENVERCREAM',
  '8099BL',
  '5423547',
  '5419230',
  '5410421',
  '5423024',
  '5422097'
];

// pnpm tsx lib/shopify/migrations/test.ts

import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import getAllOfType from '../rest/get-all-of-type';
import { Product } from '../rest/types';

dotenv.config({ path: '.env.local' });

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN as string,
  apiVersion: '2024-04'
});

async function migrate() {
  const products = await getAllOfType<Product>('products');

  for (const product of products) {
    const variantSkus: string[] = product.variants.map((variant) => variant.sku);
    for (const varSku of variantSkus) {
      if (skus.includes(varSku)) console.log(varSku, product.title);
    }
  }
}
migrate();
