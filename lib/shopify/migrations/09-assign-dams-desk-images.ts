// pnpm tsx lib/shopify/migrations/09-assign-dams-desk-images.ts

import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { Product } from 'lib/shopify/rest/types';
import { wait } from 'lib/utils';
dotenv.config({ path: '.env.local' });

const COLOUR_MAP = {
  beech: 'B',
  black: 'K',
  silver: 'S',
  white: 'WH',
  'grey oak': 'GO',
  oak: 'O',
  walnut: 'W',
  'white/oak': 'WO'
};

type ColourMapKey = keyof typeof COLOUR_MAP;

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_IMAGE_MANAGEMNET_ACCESS_TOKEN as string,
  apiVersion: '2023-04'
});

async function migrate() {
  const productId = '9795838509357';
  const res = await client.get(`products/${productId}`);
  const { product }: { product: Product } = await res.json();

  const imageIds = product.images.map((image) => ({
    id: image.id,
    fileName: image.src.split('/').at(-1)?.split('.')[0],
    variantIds: [] as number[]
  }));

  product.variants.forEach((variant) => {
    const width = parseInt(variant.option1);
    const tabletopColour = variant.option2;
    const frameColor = variant.option3;
    const tabletopKey = COLOUR_MAP[tabletopColour.toLowerCase() as ColourMapKey];
    const frameKey = COLOUR_MAP[frameColor.toLowerCase() as ColourMapKey];

    console.log({ width, tabletopColour, frameColor, tabletopKey, frameKey });

    const index = imageIds.findIndex((item) => {
      if (!item.fileName) return;
      // Width, top, frame
      const [_, w, f, t] = item.fileName.split('-');

      if (!w || !t || !f) return false;

      if (parseInt(w) === width && t === tabletopKey.toLowerCase() && f === frameKey.toLowerCase())
        return true;

      return false;
    });

    if (index === -1) return;
    imageIds[index]?.variantIds.push(variant.id);
  });

  for (const item of imageIds) {
    if (!item.variantIds.length) return;

    const res = await client.put(`products/${product.id}/images/${item.id}`, {
      data: {
        image: {
          variant_ids: item.variantIds
        }
      }
    });

    const data = await res.json();
    console.log(data);
    await wait(150);
  }

  console.log('Migration complete');
}
migrate();
