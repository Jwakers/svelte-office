import {
  ROUTES,
  SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  SHOPIFY_TAGS,
  TAGS
} from 'lib/constants';
import { isShopifyError } from 'lib/type-guards';
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from './mutations/cart';
import { inventorySetOnHandQuantitiesMutation } from './mutations/product';
import { getArticleByHandleQuery, getArticlesQuery } from './queries/blogs';
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
  getProductByIdQuery,
  getProductForAlgoliaQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductSkusQuery,
  getProductTagsQuery,
  getProductsForAlgoliaQuery,
  getProductsQuery
} from './queries/product';
import {
  Article,
  Cart,
  Collection,
  CollectionWithProducts,
  Connection,
  Menu,
  Page,
  PageInfo,
  Product,
  ProductAlgolia,
  ShopifyAddToCartOperation,
  ShopifyArticleOperation,
  ShopifyArticlesOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCollection,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionWithProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyGenericFileOperation,
  ShopifyGetProductForAlgolia,
  ShopifyGetProductSkusOperation,
  ShopifyGetProductTags,
  ShopifyGetProductsForAlgolia,
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductByIdOperation,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  ShopifyUpdateStockOperation,
  ShopifyVendors
} from './types';

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const storefrontEndpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const adminEndpoint = `${domain}${SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT}`;
const adminStockManagementAccessToken = process.env.SHOPIFY_STOCK_MANAGEMENT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  revalidate,
  variables,
  adminAccessToken,
  storefontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  revalidate?: NextFetchRequestConfig['revalidate'];
  variables?: ExtractVariables<T>;
  adminAccessToken?: string;
  storefontAccessToken?: string;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(adminAccessToken ? adminEndpoint : storefrontEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [adminAccessToken ? 'X-Shopify-Access-Token' : 'X-Shopify-Storefront-Access-Token']:
          adminAccessToken ? adminAccessToken : storefontAccessToken,
        ...headers
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables })
      }),
      cache,
      ...(tags && { next: { tags, revalidate } })
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
    ...collection
  };
};

const showInProd = (product: ShopifyProduct) =>
  !(product.tags.includes(SHOPIFY_TAGS.hide) && process.env.NODE_ENV === 'production');

const reshapeProduct = (product: ShopifyProduct) => {
  if (!product || !showInProd(product)) {
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

export async function getAllPages<T, K extends string, Args extends any[]>(
  property: K,
  callback: (
    after: string | null,
    ...args: Args
  ) => Promise<{ pageInfo: PageInfo } & { [key in K]: T[] }>,
  ...callbackArgs: Args
) {
  const allItems: T[] = [];
  let hasNextPage = true;
  let after: string | null = null;

  while (hasNextPage) {
    const response = await callback(after, ...callbackArgs);
    const items = response[property];

    if (!items?.length) throw Error(`No items found for property: ${property}`);

    allItems.push(...items);

    hasNextPage = response.pageInfo.hasNextPage;
    after = response.pageInfo.endCursor;
  }

  return allItems;
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
    }
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
    }
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
    }
  });

  if (!res.body.data.collectionByHandle) {
    console.log(`No collection found for \`${handle}\``);
    return undefined;
  }

  const collection = res.body.data.collectionByHandle;

  return {
    ...collection,
    products: reshapeProducts(removeEdgesAndNodes(collection.products)),
    path: `/${ROUTES.categories}/${collection.handle}`
  };
}

export async function getCollections(): Promise<CollectionWithProducts[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections]
  });
  const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
  const shopifyCollectionsWithProducts = shopifyCollections
    .map((collection) => {
      const products = removeEdgesAndNodes(collection.products).filter(showInProd);
      return {
        ...collection,
        products
      };
    })
    .filter((item) => item.hide === null || item.hide.value === true);

  return shopifyCollectionsWithProducts;
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    tags: [TAGS.collections],
    variables: {
      handle
    }
  });
  const checkoutSubDomain = `https://${process.env.SHOPIFY_STORE_CHECKOUT_SUBDOMAIN}`;

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url.replace(checkoutSubDomain, '').replace('/pages', '')
    })) || []
  );
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

export async function getArticle(handle: string): Promise<Article> {
  const res = await shopifyFetch<ShopifyArticleOperation>({
    query: getArticleByHandleQuery,
    variables: { handle },
    tags: [TAGS.blogs, `${TAGS.blogs}-${handle}`],
    revalidate: process.env.NODE_ENV === 'development' ? 60 : 3600
  });

  return removeEdgesAndNodes(res.body.data.articles)[0];
}

export async function getArticles(): Promise<Article[]> {
  const res = await shopifyFetch<ShopifyArticlesOperation>({
    query: getArticlesQuery,
    tags: [TAGS.blogs],
    revalidate: process.env.NODE_ENV === 'development' ? 60 : 3600
  });

  const articles = removeEdgesAndNodes(res.body.data.articles);

  return articles;
}

export async function getProductByHandle(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products, handle],
    variables: {
      handle
    }
  });

  return reshapeProduct(res.body.data.product);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductByIdOperation>({
    query: getProductByIdQuery,
    tags: [TAGS.products, id],
    variables: {
      id
    }
  });

  return reshapeProduct(res.body.data.product);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products, productId],
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
    }
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductSkus(after: string | null, vendor: ShopifyVendors) {
  const res = await shopifyFetch<ShopifyGetProductSkusOperation>({
    adminAccessToken: adminStockManagementAccessToken,
    query: getProductSkusQuery,
    cache: 'no-cache',
    variables: {
      query: `vendor:${vendor} AND product_status:active`,
      after
    }
  });

  const variants = removeEdgesAndNodes(res.body.data.productVariants).map(
    ({ sku, id, inventoryQuantity, inventoryItem }) => ({
      sku,
      id,
      inventoryQuantity,
      inventoryItemId: inventoryItem.id
    })
  );

  return { variants, pageInfo: res.body.data.productVariants.pageInfo };
}

export async function getProductTags() {
  const res = await shopifyFetch<ShopifyGetProductTags>({
    storefontAccessToken: process.env.SHOPIFY_PRODUCT_STOREFRONT_ACCESS_TOKEN,
    query: getProductTagsQuery
  });

  return res.body.data.productTags.edges.map((item) => item.node);
}

export async function getProductsForAlgolia(
  after: string | null
): Promise<{ products: ProductAlgolia[]; pageInfo: PageInfo }> {
  const res = await shopifyFetch<ShopifyGetProductsForAlgolia>({
    query: getProductsForAlgoliaQuery,
    cache: 'no-store',
    variables: {
      after
    }
  });

  const products = removeEdgesAndNodes(res.body.data.products).map((product) => ({
    ...product,
    variants: removeEdgesAndNodes(product.variants),
    collections: removeEdgesAndNodes(product.collections)
  }));

  return { products, pageInfo: res.body.data.products.pageInfo };
}

export async function getProductForAlgolia(id: string): Promise<ProductAlgolia> {
  const res = await shopifyFetch<ShopifyGetProductForAlgolia>({
    query: getProductForAlgoliaQuery,
    variables: { id }
  });

  const { product } = res.body.data;

  return {
    ...product,
    variants: removeEdgesAndNodes(product.variants),
    collections: removeEdgesAndNodes(product.collections)
  };
}

export async function updateStock(inventoryItemId: string, quantity: number) {
  const res = await shopifyFetch<ShopifyUpdateStockOperation>({
    adminAccessToken: adminStockManagementAccessToken,
    query: inventorySetOnHandQuantitiesMutation,
    variables: {
      input: {
        reason: 'correction',
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

export async function updateBarcode(productId: string, barcode: string) {
  const res = await shopifyFetch<any>({
    adminAccessToken: adminStockManagementAccessToken,
    query: /* GraphQl */ `
    mutation productVariantUpdate($input: ProductVariantInput!) {
      productVariantUpdate(input: $input) {
        productVariant {
          title
        }
        userErrors {
          field
          message
        }
      }
    }`,
    variables: {
      input: {
        id: productId,
        barcode
      }
    }
  });

  return res;
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
