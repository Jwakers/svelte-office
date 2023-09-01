import { UNIT_MAP } from 'lib/constants';
import { bulkOperationRunQuery, pollBulkOperation } from 'lib/shopify';
import { googleMerchantFeedDataQuery } from 'lib/shopify/queries/product';
import { getPublicBaseUrl } from 'lib/utils';
import { NextResponse } from 'next/server';
import RSS from 'rss';
import { Measurement, Product, TypeNames } from './types';
const readline = require('node:readline');
const https = require('https');

export const dynamic = 'force-dynamic'; // Prevents route running during build

const SITE_URL = getPublicBaseUrl();

async function processJSONL(url: string) {
  // Process JSONL back into iterable JSON object
  const formattedData: Product[] = [];

  const requestCallback = async (response: Response) => {
    const rl = readline.createInterface({
      input: response,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      const lineData = JSON.parse(line);
      if (lineData['__parentId'] === undefined) {
        formattedData.push(lineData);
      } else {
        // Find the parent
        const parent: Product | undefined = formattedData.find(
          (par: any) => par.id === lineData.__parentId
        );
        if (!parent) return new Error('Could not find parent');

        const existingData = parent[lineData.__typename as TypeNames];
        // Spread the existing data and add new data to the child object
        parent[lineData.__typename as TypeNames] = [
          ...(existingData ? existingData : []),
          lineData
        ];
      }
    }
  };

  // Get bulk operation data by URL
  https.get(url, requestCallback);

  return formattedData;
}

async function generateRSSFeed(data: Product[]) {
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

  for (const product of data) {
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
        priceRangeV2: priceRange
      } = product,
      url = `${SITE_URL}/products/${handle}`;

    const parseMeasuerment = (measurement: Measurement) => {
      const { value, unit } = JSON.parse(measurement.value);
      return `${value} ${UNIT_MAP[unit as keyof typeof UNIT_MAP] || ''}`;
    };
    const availableForSale = ProductVariant?.some((variant) => variant.availableForSale);

    feed.item({
      title: title,
      description: description,
      url,
      date: updatedAt,
      custom_elements: [
        { 'g:id': id },
        { 'g:title': title },
        { 'g:description': description },
        { 'g:link': url },
        { 'g:image_link': featuredImage.url },
        {
          'g:additional_image_link': Image?.length ? Image.map((img) => img.url).join(',') : null
        },
        { 'g:availability': availableForSale ? 'in_stock' : 'out_of_stock' },
        // { 'g:cost_of_goods_sold': '' },
        {
          'g:price': `${priceRange.minVariantPrice.amount} ${priceRange.minVariantPrice.currencyCode}`
        },
        { 'g:product_lenght': parseMeasuerment(length) },
        { 'g:product_width': parseMeasuerment(width) },
        { 'g:product_height': parseMeasuerment(height) },
        { 'g:product_weight': parseMeasuerment(weight) },
        { 'g:shipping_weight': parseMeasuerment(weight) },
        { 'g:brand': vendor },
        { 'g:color': '' },
        { 'g:item_group_id': id },
        { 'g:google_product_category': '' },
        { 'g:mpn': '' },
        {
          'g:shipping': [{ 'g:country': 'UK' }, { 'g:price': 0 }]
        }
      ]
    });
  }

  return new Response(feed.xml(), {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}

export async function GET() {
  // Start the bulk operation
  const bulkOperation = await bulkOperationRunQuery(googleMerchantFeedDataQuery);
  const { id, status } = bulkOperation.bulkOperationRunQuery;

  // Poll the data once per second for 10 seconds
  try {
    let iterations = 0;
    const poll: any = await new Promise((resolve, reject) => {
      (async function checkStatus() {
        const operation = await pollBulkOperation(id);
        console.log(`iterations ${iterations} - Status: ${operation.currentBulkOperation.status}`);
        if (operation.currentBulkOperation.status === 'COMPLETED' || status === 'COMPLETED')
          return resolve(operation);
        if (iterations >= 10) return reject(new Error('Timeout - 10 polls reached.'));
        iterations++;
        setTimeout(checkStatus, 1000);
      })();
    });

    const data = await processJSONL(poll.currentBulkOperation.url);

    return NextResponse.json({ status: 200, message: 'Google Feed updated' });
  } catch (err) {
    console.error({ err });
    return NextResponse.json({ error: err, status: 408 });
  }
}

// export async function POST(req: Request, res: Response) {
//   console.log('POST START \n \n');

//   console.log('Webhook POST \n', req, res);

//   const bulk = getBulkOperationUrl(req.data.node.url);
// }

// <?xml version="1.0"?>
// <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
// <channel>
// <title>Example - Google Store</title>
// <link>https://store.google.com</link>
// <description>This is an example of a basic RSS 2.0 document containing a single item</description>
// <item>

// <g:id>TV_123456</g:id>
// <g:title>Google Chromecast with Google TV</g:title>
// <g:description>Chromecast with Google TV brings you the entertainment you love, in up to 4K HDR</g:description>
// <g:link>https://store.google.com/product/chromecast_google_tv</g:link> <g:image_link>https://images.example.com/TV_123456.png</g:image_link> <g:condition>new</g:condition>
// <g:availability>in stock</g:availability>
// <g:price>49.99 USD</g:price>
// <g:shipping>

// <g:country>US</g:country>
// <g:service>Standard</g:service>
// <g:price>7.99 USD</g:price>

// </g:shipping>
// <g:gtin>123456789123</g:gtin>
// <g:brand>Google</g:brand>

// </item>
// </channel>
// </rss>
