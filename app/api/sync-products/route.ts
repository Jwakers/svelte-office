import { readFileSync } from 'fs';
import { content_v2_1, google } from 'googleapis';
import { Vendors } from 'lib/constants';

// TODO\
// Move type definitions
// Abstract auth function
// Consider converting to use graphQL
// Create a version that works from webhooks to update single products
// Make it functional on vercel too

type Variant = {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  updated_at: string;
  taxable: false;
  barcode: string;
  grams: number;
  image_id: string | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
};

type Option = {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
};

type Image = {
  id: number;
  alt: string;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[] | [];
};

type Product = {
  id: number;
  title: string;
  body_html: string;
  vendor: Vendors;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  published_scope: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: Variant[];
  options: Option[];
  images: Image[];
};

const SITE_URL = `https://${process.env.NEXT_PUBLIC_SITE_URL}`;

export async function GET() {
  try {
    const shopifyProducts = await fetchShopifyProducts();

    if (!shopifyProducts || !shopifyProducts.length) throw Error('No shopify products');

    const serviceAccountKey = JSON.parse(readFileSync('./svelte-office-4cfac2233c0d.json', 'utf8'));

    const auth = new google.auth.GoogleAuth({
      credentials: serviceAccountKey,
      scopes: ['https://www.googleapis.com/auth/content']
    });

    const content = google.content({
      version: 'v2.1',
      auth
    });

    const googleMerchantProducts = await updateGoogleMerchantProducts(content, shopifyProducts);

    return Response.json(googleMerchantProducts);
  } catch (error) {
    console.error('Error:', error);

    new Response('Internal Server Error', {
      status: 500
    });
  }
}

function getNextPageUrl(linkHeader: string | null) {
  if (!linkHeader) {
    return null;
  }

  const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
  return match ? match[1] : null;
}

async function fetchShopifyProducts() {
  try {
    let url:
      | string
      | null
      | undefined = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/products.json`;
    let products = [];

    while (url) {
      const shopifyResponse = await fetch(url, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_GOOGLE_MERCHANT_FEED_ACCESS_TOKEN as string
        }
      });

      const data: { products: Product[] } = await shopifyResponse.json();
      const nextPageLink = shopifyResponse.headers.get('link');
      url = getNextPageUrl(nextPageLink);

      products.push(...data.products);
    }

    return products;
  } catch (error) {
    console.error('Error:', error);

    new Response('Internal Server Error', {
      status: 500
    });
  }
}

async function updateGoogleMerchantProducts(
  contentClient: content_v2_1.Content,
  shopifyProducts: Product[]
) {
  const productData: content_v2_1.Schema$ProductsCustomBatchRequestEntry[] = [];

  for (const shopifyProduct of shopifyProducts) {
    const url = `${SITE_URL}/products/${shopifyProduct.handle}`;
    const availableForSale = shopifyProduct.variants.some(
      (variant) => variant.inventory_quantity >= 1
    );
    const hasColourVariants = shopifyProduct.options.some(
      (option) => option.name.toLowerCase() === 'colour'
    );

    shopifyProduct.variants.forEach((variant, i) => {
      const isVariant = i >= 1;
      let title = shopifyProduct.title;
      let availability = availableForSale ? 'in_stock' : 'out_of_stock';

      if (isVariant) {
        title += ` - ${variant.title}`;
        availability = variant.inventory_quantity > 0 ? 'in_stock' : 'out_of_stock';
      }

      const requestBody: content_v2_1.Schema$Product = {
        offerId: `shopify_GB_${variant.product_id}_${variant.id}`,
        itemGroupId: isVariant ? `shopify_GB_${variant.product_id}` : undefined,
        channel: 'online',
        contentLanguage: 'en',
        targetCountry: 'GB',
        title,
        description: shopifyProduct.body_html,
        link: url,
        imageLink: shopifyProduct.images[0] && shopifyProduct.images[0].src,
        additionalImageLinks: shopifyProduct.images.map((image) => image.src),
        availability,
        price: {
          currency: 'GBP',
          value: variant?.price
        },
        // product specifications are a seperate api endpoint, or convert to graphQL (Will need to use pagination)
        productLength: undefined,
        productHeight: undefined,
        productWidth: undefined,
        productWeight: undefined,
        shippingWeight: {
          unit: variant?.weight_unit,
          value: variant?.weight
        },
        brand: shopifyProduct.vendor,
        color: hasColourVariants ? variant.title : undefined,
        googleProductCategory: undefined, // GraphQl - productCategory.productTaxonomyNode.fullName
        mpn: variant?.barcode,
        shipping: [
          {
            country: 'UK',
            price: undefined
          }
        ]
      };

      const merchantId = process.env.GOOGLE_MERCHANT_ID;

      productData.push({
        merchantId,
        batchId: productData.length + 1,
        method: 'insert',
        product: requestBody
      });
    });
  }

  const res = await contentClient.products.custombatch({
    requestBody: {
      entries: productData
    }
  });

  return res.data;
}
