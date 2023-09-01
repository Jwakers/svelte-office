import {
  HIDDEN_PRODUCT_TAG,
  SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { inventorySetOnHandQuantitiesQuery, updateProductImageAltQuery } from './mutations/product';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionWithProductsQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery, getPoliciesQuery } from './queries/page';
import {
  getGenericFileQuery,
  getProductImagesQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductSkusQuery,
  getProductsQuery
} from './queries/product';
import {
  Cart,
  Collection,
  CollectionWithProducts,
  Connection,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionWithProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyGenericFileOperation,
  ShopifyGetProductSkus,
  ShopifyGetProductimagesOperation,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  ShopifyUpdateProductImageAltOperation,
  ShopifyUpdateStockOperation
} from './types';

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const storefrontEndpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const adminEndpoint = `${domain}${SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT}`;

const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const adminStockManagementAccessToken = process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN!;
const adminGoogleMerchantFeedAccessToken = process.env.SHOPIFY_GOOGLE_MERCHANT_FEED_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables,
  adminAccessToken
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  adminAccessToken?: string;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(adminAccessToken ? adminEndpoint : storefrontEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [adminAccessToken ? 'X-Shopify-Access-Token' : 'X-Shopify-Storefront-Access-Token']:
          adminAccessToken ? adminAccessToken : storefrontAccessToken,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags } })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
    console.log(JSON.stringify(e, null, 2));

    if (isShopifyError(e)) {
      throw {
        status: e.status || 500,
        message: e.message,
        query
      };
    }

    throw {
      error: e,
      query
    };
  }
}

export const removeEdgesAndNodes = (array: Connection<any>) => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: 'GBP'
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeCollection = (collection: ShopifyCollection): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

const reshapeProduct = (product: ShopifyProduct, filterHiddenProducts: boolean = true) => {
  if (!product || (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))) {
    return undefined;
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants)
  };
};

const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};

const reshapeProductImages = (
  data: { id: string; title: string; images: Connection<{ id: string; altText: string }> }[]
) => {
  return data
    .map((prod) => {
      const images = removeEdgesAndNodes(prod.images);
      const withProdId = images.map((image) => ({
        ...image,
        productId: prod.id,
        productTitle: prod.title
      }));
      return withProdId;
    })
    .flat();
};

export async function getProductimages() {
  const res = await shopifyFetch<ShopifyGetProductimagesOperation>({
    query: getProductImagesQuery
  });

  return reshapeProductImages(removeEdgesAndNodes(res.body.data.products));
}

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function addToCart(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(cartId: string, lineIds: string[]): Promise<Cart> {
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  cartId: string,
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    },
    cache: 'no-store'
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    cache: 'no-store'
  });

  if (!res.body.data.cart) {
    return null;
  }

  return reshapeCart(res.body.data.cart);
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    },
    cache: 'no-store'
  });

  return reshapeCollection(res.body.data.collectionByHandle);
}

export async function getCollectionProducts({
  handle,
  reverse,
  sortKey
}: {
  handle: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle,
      reverse,
      sortKey
    },
    cache: 'no-store'
  });

  if (!res.body.data.collectionByHandle) {
    console.log(`No collection found for \`${handle}\``);
    return [];
  }

  return reshapeProducts(removeEdgesAndNodes(res.body.data.collectionByHandle.products));
}

export async function getCollectionWithProducts({
  handle,
  reverse,
  sortKey,
  limit
}: {
  handle: string;
  reverse?: boolean;
  sortKey?: string;
  limit?: number;
}): Promise<CollectionWithProducts | undefined> {
  const res = await shopifyFetch<ShopifyCollectionWithProductsOperation>({
    query: getCollectionWithProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle,
      reverse,
      sortKey,
      limit
    },
    cache: 'no-store'
  });

  if (!res.body.data.collectionByHandle) {
    console.log(`No collection found for \`${handle}\``);
    return undefined;
  }

  const collection = res.body.data.collectionByHandle;

  return {
    ...collection,
    products: reshapeProducts(removeEdgesAndNodes(collection.products)),
    path: `/categories/${collection.handle}`
  };
}

export async function getCollections(): Promise<CollectionWithProducts[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
    cache: 'no-store'
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const shopifyCollectionsWithProducts = shopifyCollections.map((collection) => ({
    ...collection,
    products: removeEdgesAndNodes(collection.products),
    path: `/categories/${collection.handle}`
  }));

  return shopifyCollectionsWithProducts;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    },
    cache: 'no-store'
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url.replace(domain, '').replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
    cache: 'no-store'
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
    cache: 'no-store'
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle
    },
    cache: 'no-store'
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId
    }
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  limit = 100
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  limit?: number;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey,
      limit
    },
    cache: 'no-store'
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductSkus() {
  const res = await shopifyFetch<ShopifyGetProductSkus>({
    adminAccessToken: adminStockManagementAccessToken,
    query: getProductSkusQuery
  });

  return removeEdgesAndNodes(res.body.data.productVariants).map(
    ({ sku, id, inventoryQuantity, inventoryItem }) => ({
      sku,
      id,
      inventoryQuantity,
      inventoryItemId: inventoryItem.id
    })
  );
}

export async function updateStock(inventoryItemId: string, quantity: number) {
  const res = await shopifyFetch<ShopifyUpdateStockOperation>({
    adminAccessToken: adminStockManagementAccessToken,
    query: inventorySetOnHandQuantitiesQuery,
    variables: {
      input: {
        reason: 'cycle_count_available',
        setQuantities: [
          {
            inventoryItemId,
            locationId: 'gid://shopify/Location/86428975405',
            quantity
          }
        ]
      }
    }
  });

  return res.body.data;
}

export async function updateProductImageAlt(productId: string, imageId: string, altText: string) {
  const res = await shopifyFetch<ShopifyUpdateProductImageAltOperation>({
    adminAccessToken: adminStockManagementAccessToken,
    query: updateProductImageAltQuery,
    variables: {
      productId,
      image: {
        id: imageId,
        altText
      }
    }
  });

  return res.body.data;
}

// export async function webhookSubscriptionCreate({
//   topic,
//   callbackUrl
// }: {
//   topic: WebhookTopics;
//   callbackUrl: string;
// }) {
//   const res = await shopifyFetch<{
//     variables: {
//       topic: WebhookTopics;
//       callbackUrl: string;
//     };
//   }>({
//     adminAccessToken: adminGoogleMerchantFeedAccessToken,
//     query: /* GraphQL */ `
//       mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $callbackUrl: URL!) {
//         webhookSubscriptionCreate(
//           topic: $topic
//           webhookSubscription: { format: JSON, callbackUrl: $callbackUrl }
//         ) {
//           userErrors {
//             field
//             message
//           }
//           webhookSubscription {
//             id
//           }
//         }
//       }
//     `,
//     variables: {
//       topic,
//       callbackUrl
//     }
//   });

//   console.log('Create Webhook \n', JSON.stringify(res, null, 2), '\n');

//   return res;
// }

export async function bulkOperationRunQuery(query: string) {
  const res = await shopifyFetch({
    adminAccessToken: adminGoogleMerchantFeedAccessToken,
    query: /* GraphQL */ `
    mutation {
    bulkOperationRunQuery(
     query: """${query}"""
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }`
  });

  return res.body.data;
}

export async function pollBulkOperation(id: string) {
  const res = await shopifyFetch({
    adminAccessToken: adminGoogleMerchantFeedAccessToken,
    query: /* GraphQL */ `
      query {
        currentBulkOperation {
          id
          status
          errorCode
          createdAt
          completedAt
          objectCount
          fileSize
          url
          partialDataUrl
        }
      }
    `
  });

  return res.body.data;
}

export async function getBulkOperationUrl(id: string) {
  const res = await shopifyFetch<{ variables: { id: string } }>({
    adminAccessToken: adminGoogleMerchantFeedAccessToken,
    query: /* GraphQL */ `
      query getBulkOperationUrl($id: ID!) {
        node(id: $id) {
          ... on BulkOperation {
            url
            partialDataUrl
          }
        }
      }
    `,
    variables: {
      id
    }
  });
  console.log('Get Bulk \n', JSON.stringify(res, null, 2), '\n');
}

export async function getGenericFile(id: string) {
  const res = await shopifyFetch<ShopifyGenericFileOperation>({
    query: getGenericFileQuery,
    variables: {
      id
    }
  });

  return res.body.data.node.url;
}

export async function getPolicies() {
  const res = await shopifyFetch<any>({
    query: getPoliciesQuery
  });

  return res.body.data.shop;
}
