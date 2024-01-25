import { content_v2_1, google } from 'googleapis';
import googleAuth from 'lib/google-auth';
import { verifyWebhook } from 'lib/shopify/verify-webhook';
import { NextResponse } from 'next/server';
import { Product } from '../types';

export async function POST(req: Request) {
  verifyWebhook(req);
  const data: Product = await req.clone().json();

  const auth = googleAuth();

  const content = google.content({
    version: 'v2.1',
    auth
  });

  const SITE_URL = `https://${process.env.NEXT_PUBLIC_SITE_URL}`;

  const url = `${SITE_URL}/products/${data.handle}`;
  const availableForSale = data.variants.some((variant) => variant.inventory_quantity >= 1);
  const hasColourVariants = data.options.some((option) => option.name.toLowerCase() === 'colour');
  const googleProductData: content_v2_1.Schema$Product[] = [];

  data.variants.forEach(async (variant, i) => {
    const isVariant = i >= 1;
    let title = data.title;
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
      description: data.body_html,
      link: url,
      imageLink: data.images[0] && data.images[0].src,
      additionalImageLinks: data.images.map((image) => image.src),
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
      brand: data.vendor,
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

    console.log(`Updating product: ${title}`);

    const googleProduct = await content.products.insert({
      merchantId: process.env.GOOGLE_MERCHANT_ID,
      requestBody
    });
    googleProductData.push(googleProduct as content_v2_1.Schema$Product);
  });

  return NextResponse.json(googleProductData);
}
