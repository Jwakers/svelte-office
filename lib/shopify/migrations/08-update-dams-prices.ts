// pnpm tsx lib/shopify/migrations/08-update-dams-prices.ts

// ------------------ IMPORTANT ------------------
//
//        TAKE A BACKUP BEFORE RUNNING THIS
//
// ------------------ IMPORTANT ------------------

import * as dotenv from 'dotenv';
import { SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT } from 'lib/constants';
import { getPriceWithMargin, wait } from 'lib/utils';
import { removeEdgesAndNodes } from '..';

dotenv.config({ path: '.env.local' });

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;

const productsQuery = /* GraphQL */ `
  query {
    products(first: 250, query: "vendor:Dams") {
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
                inventoryItem {
                  unitCost {
                    amount
                  }
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
  const response = await queryShopify(productsQuery);
  const products = removeEdgesAndNodes(response.data.products);

  for (const product of products) {
    const variants = removeEdgesAndNodes(product.variants);

    for (const variant of variants) {
      const price = getPriceWithMargin(variant.inventoryItem.unitCost.amount, 35);

      const variables = {
        input: {
          id: variant.id,
          price
        }
      };

      try {
        // Uncomment to enable update
        await queryShopify(updateVariantMutation, variables);
        await wait(150); // max 40 requests per minute
        console.log(`Updated: ${variant.id} - ${variant.inventoryItem.unitCost.amount} / ${price}`);
      } catch (err) {
        console.log(err);
        break;
      }
    }
  }
  console.log('Update finished');
}
migrate();
