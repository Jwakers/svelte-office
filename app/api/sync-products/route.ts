// pages/api/sync-products.js
import { content as contentApi } from '@googleapis/content';
// import axios from 'axios';
import { authenticateGoogleApi } from 'lib/utils';

export async function GET() {
  try {
    // Fetch Shopify products (replace with your Shopify store credentials)
    // const shopifyProducts = await fetchShopifyProducts();

    // Load credentials from your service account key file
    const auth = await authenticateGoogleApi();

    // Create Content API client
    const content = contentApi({ version: 'v2.1', auth });

    console.log('Products:');

    const products = await content.products.list({
      merchantId: process.env.GOOGLE_MERCHANT_ID,
      maxResults: 10
    });
    console.log(products);

    console.log('Data feeds:');
    const datafeeds = await content.datafeeds.list({
      merchantId: '5081471706',
      maxResults: 2
    });
    console.log(datafeeds);

    // Example: Populate Google Merchant Shopping data
    // const googleMerchantData = await populateGoogleMerchantData(content, shopifyProducts);

    // Send the response data as JSON
    // res.status(200).json(googleMerchantData);
    // res.status(200).json({
    //   content
    // });

    return Response.json(products);
  } catch (error) {
    console.error('Error:', error.message);
    // Send an error response
    new Response('Internal Server Error', {
      status: 500
    });
  }
}

async function fetchShopifyProducts() {
  // Implement Shopify API request logic here (replace with your Shopify API request logic)
  // Example using Axios:
  //   const shopifyResponse = await axios.get(
  //     'https://your-shopify-store.myshopify.com/admin/api/2022-01/products.json',
  //     {
  //       headers: {
  //         'X-Shopify-Access-Token': 'your-shopify-access-token'
  //       }
  //     }
  //   );
  //   return shopifyResponse.data.products;
}

async function populateGoogleMerchantData(content, shopifyProducts) {
  // Implement logic to transform Shopify products into Google Merchant data
  // and update Google Merchant Shopping data using the Content API
  // Example: For each Shopify product, create or update a corresponding Google Merchant product
  //   const googleMerchantData = [];
  //   for (const shopifyProduct of shopifyProducts) {
  //     const googleMerchantProduct = await createOrUpdateGoogleMerchantProduct(
  //       content,
  //       shopifyProduct
  //     );
  //     googleMerchantData.push(googleMerchantProduct);
  //   }
  //   return googleMerchantData;
}

async function createOrUpdateGoogleMerchantProduct(content, shopifyProduct) {
  // Implement logic to create or update a Google Merchant product using the Content API
  // Example: Use the 'content.products.insert' or 'content.products.update' method
  //   const response = await content.products.insert({
  //     merchantId: 'your-merchant-id',
  //     resource: {
  //       offerId: shopifyProduct.id.toString(),
  //       // Map other relevant fields from Shopify to Google Merchant product data
  //       title: shopifyProduct.title,
  //       description: shopifyProduct.body_html
  //       // ... other fields
  //     }
  //   });

  return response.data;
}
