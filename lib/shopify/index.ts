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
import { inventorySetOnHandQuantitiesQuery } from './mutations/product';
import { getCartQuery } from './queries/cart';
import {
  getCollectionProductsQuery,
  getCollectionQuery,
  getCollectionWithProductsQuery,
  getCollectionsQuery
} from './queries/collection';
import { getMenuQuery } from './queries/menu';
import { getPageQuery, getPagesQuery } from './queries/page';
import {
  getGenericFileQuery,
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
  ShopifyMenuOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  ShopifyUpdateStockOperation
} from './types';

const domain = `https://${process.env.SHOPIFY_STORE_DOMAIN!}`;
const storefrontEndpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const adminEndpoint = `${domain}${SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT}`;

const key = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

export async function shopifyFetch<T>({
  cache = 'force-cache',
  headers,
  query,
  tags,
  variables,
  isAdmin = false
}: {
  cache?: RequestCache;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
  isAdmin?: boolean;
}): Promise<{ status: number; body: T } | never> {
  try {
    const result = await fetch(isAdmin ? adminEndpoint : storefrontEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [isAdmin ? 'X-Shopify-Access-Token' : 'X-Shopify-Storefront-Access-Token']: isAdmin
          ? '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'
          : key,
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

    // console.log(JSON.stringify(body, null, 2));

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body
    };
  } catch (e) {
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

const removeEdgesAndNodes = (array: Connection<any>) => {
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
    path: `/collection/${collection.handle}`
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
    products: removeEdgesAndNodes(collection.products)
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
  sortKey
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query,
      reverse,
      sortKey
    },
    cache: 'no-store'
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProductSkus() {
  const res = await shopifyFetch<ShopifyGetProductSkus>({
    isAdmin: true,
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
    isAdmin: true,
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

export async function getGenericFile(id: string) {
  const res = await shopifyFetch<ShopifyGenericFileOperation>({
    query: getGenericFileQuery,
    variables: {
      id
    }
  });

  return res.body.data.node.url;
}
