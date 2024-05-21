import { createAdminRestApiClient } from '@shopify/admin-api-client';
import * as dotenv from 'dotenv';
import { ROUTES } from 'lib/constants';
import { Product } from 'lib/shopify/rest/types';
import { wait } from 'lib/utils';
dotenv.config({ path: '.env.local' });

const client = createAdminRestApiClient({
  storeDomain: process.env.SHOPIFY_STORE_DOMAIN as string,
  accessToken: process.env.SHOPIFY_IMAGE_MANAGEMNET_ACCESS_TOKEN as string,
  apiVersion: '2023-04'
});

async function migrate() {
  const productId = '9130590273837';
  const res = await client.get(`${ROUTES.products}/${productId}`);
  const { product }: { product: Product } = await res.json();

  const imageIds = product.images.map((image) => ({
    id: image.id,
    fileName: image.src.split('/').at(-1)?.split('.')[0],
    variantIds: [] as number[]
  }));

  product.variants.forEach((variant) => {
    const frameColor = variant.option1;
    const deskColor = variant.option3;

    const index = imageIds.findIndex((item) => {
      if (!item.fileName) return;
      const nameArr = item.fileName.split(/(?=[A-Z])/);
      const frame = nameArr[0];
      const color = nameArr.at(-1);

      if (frameColor === frame && color === deskColor) return true;
      return false;

      if (color === deskColor) return true;
      return false;
    });

    if (index === -1) return;
    imageIds[index]?.variantIds.push(variant.id);
  });

  imageIds.forEach(async (item) => {
    if (!item.variantIds.length) return;

    const res = await client.put(`${ROUTES.products}/${product.id}/images/${item.id}`, {
      data: {
        image: {
          variant_ids: item.variantIds
        }
      }
    });
    const data = await res.json();
    console.log(data);
    await wait(1000);
  });
}
migrate();
