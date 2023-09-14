import fs from 'fs';
import { UNIT_MAP } from 'lib/constants';
import { bulkOperationRunQuery, getBulkOperation, webhookSubscriptionCreate } from 'lib/shopify';
import { googleMerchantFeedDataQuery } from 'lib/shopify/queries/product';
import { NextRequest, NextResponse } from 'next/server';
import RSS from 'rss';
import { Measurement, Product, TypeNames } from './types';
const readline = require('node:readline');
const https = require('https');

export const dynamic = 'force-dynamic'; // Prevents route running during build

const SITE_URL = `https://${process.env.NEXT_PUBLIC_SITE_URL}`;

async function processJSONL(url: string): Promise<Product[]> {
  // Process JSONL back into iterable JSON object
  return new Promise((resolve, reject) => {
    const formattedData: Product[] = [];

    const requestCallback = async (response: Response) => {
      const rl = readline.createInterface({
        input: response,
        crlfDelay: Infinity
      });

      // Iterate the response stream line by line
      for await (const line of rl) {
        const lineData = JSON.parse(line);

        // If ther is no parent ID this is a parent object (product)
        if (lineData['__parentId'] === undefined) {
          formattedData.push(lineData);
        } else {
          // Find the parent
          const parent: Product | undefined = formattedData.find(
            (par: any) => par.id === lineData.__parentId
          );
          if (!parent) return reject(new Error('Could not find parent'));

          const existingData = parent[lineData.__typename as TypeNames];

          // Spread the existing data and add new data to the child object
          parent[lineData.__typename as TypeNames] = [
            ...(existingData ? existingData : []),
            lineData
          ];
        }
      }
      resolve(formattedData);
    };

    const req = https.get(url, requestCallback);
    req.on('error', (err: Error) => {
      reject(err);
    });
    req.end();
  });
}

function generateRSSFeed(data: Product[]) {
  // Generate the RSS feed data
  const feed = new RSS({
    title: 'Svelte Office - Google Store',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/google-merchant-feed.xml`,
    language: 'en',
    description: 'Svelte Office RSS document for use with Google Merchant',
    custom_namespaces: {
      g: 'http://base.google.com/ns/1.0'
    }
  });

  const addFeedItem = (
    product: Product,
    overrides?: {
      title?: string;
      id?: string;
      color?: string;
      isAvailableForSale?: string;
      price?: string;
      imageUrl?: string;
      barcode?: string;
    }
  ) => {
    // Function to add a feed item be it product or variant
    const {
        id,
        title,
        description,
        handle,
        featuredImage,
        updatedAt,
        width,
        height,
        length,
        weight,
        Image,
        ProductVariant,
        vendor,
        productCategory,
        priceRangeV2: priceRange
      } = product,
      url = `${SITE_URL}/products/${handle}`,
      groupId = ProductVariant[0] ? ProductVariant[0].sku : id;

    const parseMeasuerment = (measurement: Measurement) => {
      if (!measurement) return null;
      const { value, unit } = JSON.parse(measurement.value);
      return `${value} ${UNIT_MAP[unit as keyof typeof UNIT_MAP] || ''}`;
    };
    const availableForSale =
      overrides?.isAvailableForSale !== undefined
        ? overrides.isAvailableForSale
        : ProductVariant?.some((variant) => variant.availableForSale);

    feed.item({
      title: overrides?.title || title,
      description,
      url,
      date: updatedAt,
      guid: overrides?.id || groupId,
      custom_elements: [
        { 'g:id': overrides?.id || groupId },
        { 'g:item_group_id': groupId },
        { 'g:title': overrides?.title || title },
        { 'g:description': description },
        { 'g:link': url },
        { 'g:image_link': overrides?.imageUrl || featuredImage.url },
        {
          'g:additional_image_link': Image?.length ? Image.map((img) => img.url).join(',') : null
        },
        {
          'g:availability': availableForSale ? 'in_stock' : 'out_of_stock'
        },
        {
          'g:price': `${overrides?.price || priceRange.minVariantPrice.amount} ${
            priceRange.minVariantPrice.currencyCode
          }`
        },
        { 'g:product_length': parseMeasuerment(length) },
        { 'g:product_width': parseMeasuerment(width) },
        { 'g:product_height': parseMeasuerment(height) },
        { 'g:product_weight': parseMeasuerment(weight) },
        { 'g:shipping_weight': parseMeasuerment(weight) },
        { 'g:brand': vendor },
        { 'g:color': overrides?.color || null },
        { 'g:google_product_category': productCategory.productTaxonomyNode.fullName },
        // https://support.google.com/merchants/answer/6324461?hl=en-GB
        { 'g:mpn': overrides?.barcode || ProductVariant[0]?.barcode },
        {
          'g:shipping': [{ 'g:country': 'UK' }, { 'g:price': 0 }]
        }
      ]
    });
  };

  for (const product of data) {
    const hasVariants = product.ProductVariant.length > 1;

    addFeedItem(product);

    // If we have more than one variant, add the additional variants as items
    if (hasVariants) {
      const variantData = product.ProductVariant.map((variant) => ({
        id: variant.sku,
        title: variant.displayName,
        color: variant.selectedOptions.value,
        isAvailableForSale: variant.availableForSale,
        price: variant.price,
        imageUrl: variant.image.url,
        barcode: variant.barcode
      }));

      for (const variant of variantData) {
        addFeedItem(product, variant);
      }
    }
  }

  return feed.xml();
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { admin_graphql_api_id } = body;

  const bulkOperation = await getBulkOperation(admin_graphql_api_id);
  const data = await processJSONL(bulkOperation.url);
  const feed = generateRSSFeed(data);

  fs.writeFile('./public/google-feed.xml', feed, (err) => {
    console.error('Error', err);
  });

  return new Response(feed, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

export async function GET() {
  try {
    await webhookSubscriptionCreate(
      `${
        process.env.NODE_ENV === 'production' ? SITE_URL : 'https://eighty-suits-wear.loca.lt'
      }/api/google-merchant-feed`,
      'BULK_OPERATIONS_FINISH'
    );
    const res = await bulkOperationRunQuery(googleMerchantFeedDataQuery);

    return new Response('Success', { status: 200 });
  } catch (err) {
    console.error({ err });
    return NextResponse.json({ error: err, status: 408 });
  }
}
