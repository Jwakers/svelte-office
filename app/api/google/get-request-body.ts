import { content_v2_1 } from 'googleapis';
import { Product, Variant } from './types';

type Options = {
  isVariant: boolean;
  availableForSale: boolean;
  hasColourVariants: boolean;
};

const SITE_URL = `https://${process.env.NEXT_PUBLIC_SITE_URL}`;

export function getRequestBody(product: Product, variant: Variant, options: Options) {
  const { isVariant, availableForSale, hasColourVariants } = options;
  const url = `${SITE_URL}/products/${product.handle}`;
  let title = product.title;
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
    description: product.body_html,
    link: url,
    imageLink: product.images[0] && product.images[0].src,
    additionalImageLinks: product.images.map((image) => image.src),
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
    brand: product.vendor,
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

  return requestBody;
}
