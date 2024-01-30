require('dotenv').config({ path: `.env.local` });
import getProductById from 'lib/shopify/rest/get-product-by-id';

const SKU_MAP = {
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
  const product = await getProductById(productId);

  const variantsToUpdate = product.variants.map((variant) => {
    const { option1, option2, option3 } = variant;
    const sku = `${SKU_MAP.frame[option1]}${SKU_MAP.size[option2]}${SKU_MAP.decor[option3]}`;

    return {
      id: variant.id,
      product_id: product.id,
      sku: sku
    };
  });

  const shopifyResponse = await fetch(
    `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products/${productId}.json`,
    {
      method: 'PUT',
      body: JSON.stringify({
        product: {
          variants: variantsToUpdate
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN
      }
    }
  );

  if (shopifyResponse.ok) {
    const responseData = await shopifyResponse.json();
    console.log('Update successful:', JSON.stringify(responseData, null, 2));
  } else {
    console.error('Update failed:', await shopifyResponse.text());
  }
}
migrate();

// Next migration - update inventory - /admin/api/2024-01/inventory_items/808950810.json
// Refactor to use Shopify client library
