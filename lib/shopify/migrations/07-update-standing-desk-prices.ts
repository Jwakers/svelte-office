// pnpm tsx lib/shopify/migrations/07-update-standing-desk-prices.ts

// ------------------ IMPORTANT ------------------
//
//        TAKE A BACKUP BEFORE RUNNING THIS
//
// ------------------ IMPORTANT ------------------

import * as dotenv from 'dotenv';
import { SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT } from 'lib/constants';
import { wait } from 'lib/utils';
import { removeEdgesAndNodes } from '..';

dotenv.config({ path: '.env.local' });

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;

const collectionQuery = /* GraphQL */ `
  query {
    collection(id: "gid://shopify/Collection/501937832237") {
      id
      title
      products(first: 250) {
        edges {
          node {
            id
            title
            variants(first: 250) {
              edges {
                node {
                  id
                  price
                  compareAtPrice
                }
              }
            }
          }
        }
      }
    }
  }
`;

const updateVariantMutation = /* GraphQL */ `
  mutation updateVariantPrice($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      productVariant {
        id
        price
      }
      userErrors {
        field
        message
      }
    }
  }
`;

async function queryShopify(query: string, variables?: any) {
  const res = await fetch(`${domain}${SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_PRODUCT_MANAGEMENT_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: query,
      ...(variables && { variables })
    })
  });

  return await res.json();
}

async function migrate() {
  const collectionResponse = await queryShopify(collectionQuery);
  const products = removeEdgesAndNodes(collectionResponse.data.collection.products);

  for (const product of products) {
    const variants = removeEdgesAndNodes(product.variants);

    for (const variant of variants) {
      const discountedPrice = String((parseFloat(variant.price) * 0.85).toFixed(2));

      const variables = {
        input: {
          id: variant.id,
          price: discountedPrice,
          compareAtPrice: variant.price
        }
      };

      try {
        // Uncomment to enable update
        // await queryShopify(updateVariantMutation, variables);
        await wait(150); // max 40 requests per minute
        console.log(`Updated: ${variant.id} - ${variant.price} / ${discountedPrice}`);
      } catch (err) {
        console.log(err);
        break;
      }
    }
  }
  console.log('Update finished');
}
migrate();
