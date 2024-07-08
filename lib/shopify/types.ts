export type Maybe<T> = T | null;

export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Cart = Omit<ShopifyCart, 'lines'> & {
  lines: CartItem[];
};

export type CartItem = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: Product;
  };
};

export type Collection = ShopifyCollection;

export type CollectionWithProducts = ShopifyCollection & {
  products: Product[];
  path: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Metafield = {
  value: string;
  key: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type Article = {
  excerpt?: string;
  handle: string;
  title: string;
  image?: Image;
  publishedAt: string;
  contentHtml: string;
  seo: SEO;
  authorV2: {
    name: string;
  };
};

export type Product = Omit<ShopifyProduct, 'variants' | 'images'> & {
  variants: ProductVariant[];
  images: Image[];
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
  compareAtPrice: Money;
};

export type ProductAlgolia = Pick<
  Product,
  | 'id'
  | 'handle'
  | 'description'
  | 'featuredImage'
  | 'priceRange'
  | 'tags'
  | 'title'
  | 'vendor'
  | 'options'
  | 'availableForSale'
> & {
  collections: { handle: string; title: string }[];
  width: { value: string };
  depth: { value: string };
  height: { value: string };
  weight: { value: string };
  variants: {
    price: Money;
    compareAtPrice: Money;
  }[];
};

export type SEO = {
  title: string;
  description: string;
};

export type ShopifyVendors = 'Teknik' | 'Hill Interiors' | 'Lavoro';

export type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

export type ShopifyCollection = {
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  seo: SEO;
  updatedAt: string;
  image?: Image;
};

export type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
  vendor: ShopifyVendors;
  specification: Metafield[];
  specificationSheet: Metafield;
  deliveryType: Metafield;
};

export type ShopifyCartOperation = {
  data: {
    cart: ShopifyCart;
  };
  variables: {
    cartId: string;
  };
};

export type ShopifyCreateCartOperation = {
  data: { cartCreate: { cart: ShopifyCart } };
};

export type ShopifyAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type ShopifyUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: ShopifyCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type ShopifyCollectionOperation = {
  data: {
    collectionByHandle: ShopifyCollection;
  };
  variables: {
    handle: string;
  };
};

export type ShopifyCollectionProductsOperation = {
  data: {
    collectionByHandle: {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type ShopifyCollectionWithProductsOperation = {
  data: {
    collectionByHandle: ShopifyCollection & {
      products: Connection<ShopifyProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
    limit?: number;
  };
};

export type ShopifyCollectionsOperation = {
  data: {
    collections: Connection<
      ShopifyCollection & {
        products: Connection<ShopifyProduct>;
      }
    >;
  };
};

export type ShopifyMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type ShopifyPageOperation = {
  data: { pageByHandle: Page };
  variables: { handle: string };
};

export type ShopifyPagesOperation = {
  data: {
    pages: Connection<Page>;
  };
};

export type ShopifyArticlesOperation = {
  data: {
    articles: Connection<Article>;
  };
};

export type ShopifyArticleOperation = {
  data: {
    articles: Connection<Article>;
  };
  variables: { handle: string };
};

export type ShopifyProductOperation = {
  data: { product: ShopifyProduct };
  variables: {
    handle: string;
  };
};

export type ShopifyProductRecommendationsOperation = {
  data: {
    productRecommendations: ShopifyProduct[];
  };
  variables: {
    productId: string;
  };
};

export type ShopifyProductsOperation = {
  data: {
    products: Connection<ShopifyProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
    limit: number;
  };
};

export type ShopifyGenericFileOperation = {
  data: {
    node: {
      url: string;
    };
  };
  variables: {
    id: string;
  };
};

export type ShopifyGetProductSkus = {
  data: {
    productVariants: Connection<{
      sku: string;
      id: string;
      inventoryQuantity: number;
      inventoryItem: {
        id: string;
      };
    }>;
  };
  variables: {
    query?: string;
  };
};

export type ShopifyGetProductTags = {
  data: {
    productTags: Connection<
      {
        node: string;
      }[]
    >;
  };
};

export type ShopifyGetProductsForAlgolia = {
  data: {
    products: Connection<
      Omit<ProductAlgolia, 'collections'> & {
        collections: Connection<ProductAlgolia['collections']>;
        variants: Connection<ProductAlgolia['variants']>;
      }
    >;
  };
};

export type ShopifyGetProductForAlgolia = {
  data: {
    product: Omit<ProductAlgolia, 'collections' | 'variants'> & {
      collections: Connection<ProductAlgolia['collections']>;
      variants: Connection<ProductAlgolia['variants']>;
    };
  };
  variables: { id: string };
};

export type ShopifyUpdateStockOperation = {
  data: any;
  variables: {
    input: {
      reason: 'cycle_count_available';
      setQuantities: {
        inventoryItemId: string;
        locationId: string;
        quantity: number;
      }[];
    };
  };
};

export type ShopifyUpdateProductImageAltOperation = {
  data: any;
  variables: {
    productId: string;
    image: {
      id: string;
      altText: string;
    };
  };
};

export type ShopifyGetProductimagesOperation = {
  data: {
    products: Connection<{
      id: string;
      title: string;
      images: Connection<{
        url: string;
        id: string;
        altText: string | null;
      }>;
    }>;
  };
};

export type ShopifyBulkOperationRunQueryOperation = {
  data: {
    bulkOperationRunQuery: {
      bulkOperation: {
        id: string;
        status: string;
      };
      userErrors: string[];
    };
  };
};

export type ShopifyGetBulkOperationOperation = {
  data: {
    node: {
      url: string;
    };
  };
};

export type WebhookTopics =
  | 'APP_SUBSCRIPTIONS_APPROACHING_CAPPED_AMOUNT'
  | 'APP_SUBSCRIPTIONS_UPDATE'
  | 'APP_UNINSTALLED'
  | 'ATTRIBUTED_SESSIONS_FIRST'
  | 'ATTRIBUTED_SESSIONS_LAST'
  | 'AUDIT_EVENTS_ADMIN_API_ACTIVITY'
  | 'BULK_OPERATIONS_FINISH'
  | 'CARTS_CREATE'
  | 'CARTS_UPDATE'
  | 'CHANNELS_DELETE'
  | 'CHECKOUTS_CREATE'
  | 'CHECKOUTS_DELETE'
  | 'CHECKOUTS_UPDATE'
  | 'COLLECTIONS_CREATE'
  | 'COLLECTIONS_DELETE'
  | 'COLLECTIONS_UPDATE'
  | 'COLLECTION_LISTINGS_ADD'
  | 'COLLECTION_LISTINGS_REMOVE'
  | 'COLLECTION_LISTINGS_UPDATE'
  | 'COLLECTION_PUBLICATIONS_CREATE'
  | 'COLLECTION_PUBLICATIONS_DELETE'
  | 'COLLECTION_PUBLICATIONS_UPDATE'
  | 'CUSTOMERS_CREATE'
  | 'CUSTOMERS_DELETE'
  | 'CUSTOMERS_DISABLE'
  | 'CUSTOMERS_ENABLE'
  | 'CUSTOMERS_MARKETING_CONSENT_UPDATE'
  | 'CUSTOMERS_UPDATE'
  | 'CUSTOMER_GROUPS_CREATE'
  | 'CUSTOMER_GROUPS_DELETE'
  | 'CUSTOMER_GROUPS_UPDATE'
  | 'CUSTOMER_PAYMENT_METHODS_CREATE'
  | 'CUSTOMER_PAYMENT_METHODS_REVOKE'
  | 'CUSTOMER_PAYMENT_METHODS_UPDATE'
  | 'DISPUTES_CREATE'
  | 'DISPUTES_UPDATE'
  | 'DOMAINS_CREATE'
  | 'DOMAINS_DESTROY'
  | 'DOMAINS_UPDATE'
  | 'DRAFT_ORDERS_CREATE'
  | 'DRAFT_ORDERS_DELETE'
  | 'DRAFT_ORDERS_UPDATE'
  | 'FULFILLMENTS_CREATE'
  | 'FULFILLMENTS_UPDATE'
  | 'FULFILLMENT_EVENTS_CREATE'
  | 'FULFILLMENT_EVENTS_DELETE'
  | 'FULFILLMENT_ORDERS_CANCELLATION_REQUEST_ACCEPTED'
  | 'FULFILLMENT_ORDERS_CANCELLATION_REQUEST_REJECTED'
  | 'FULFILLMENT_ORDERS_CANCELLATION_REQUEST_SUBMITTED'
  | 'FULFILLMENT_ORDERS_CANCELLED'
  | 'FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_ACCEPTED'
  | 'FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_REJECTED'
  | 'FULFILLMENT_ORDERS_FULFILLMENT_REQUEST_SUBMITTED'
  | 'FULFILLMENT_ORDERS_HOLD_RELEASED'
  | 'FLFILLMENT_ORDERS_MOVED'
  | 'FULFILLMENT_ORDERS_ORDER_ROUTING_COMPLETE'
  | 'FULFILLMENT_ORDERS_PLACED_ON_HOLD'
  | 'FULFILLMENT_ORDERS_RESCHEDULED'
  | 'FULFILLMENT_ORDERS_SCHEDULED_FULFILLMENT_ORDER_READY'
  | 'INVENTORY_ITEMS_CREATE'
  | 'INVENTORY_ITEMS_DELETE'
  | 'INVENTORY_ITEMS_UPDATE'
  | 'INVENTORY_LEVELS_CONNECT'
  | 'INVENTORY_LEVELS_DISCONNECT'
  | 'INVENTORY_LEVELS_UPDATE'
  | 'LOCALES_CREATE'
  | 'LOCALES_UPDATE'
  | 'LOCATIONS_ACTIVATE'
  | 'LOCATIONS_CREATE'
  | 'LOCATIONS_DEACTIVATE'
  | 'LOCATIONS_DELETE'
  | 'LOCATIONS_UPDATE'
  | 'MARKETS_CREATE'
  | 'MARKETS_DELETE'
  | 'MARKETS_UPDATE'
  | 'ORDERS_CANCELLED'
  | 'ORDERS_CREATE'
  | 'ORDERS_DELETE'
  | 'ORDERS_EDITED'
  | 'ORDERS_FULFILLED'
  | 'ORDERS_PAID'
  | 'ORDERS_PARTIALLY_FULFILLED'
  | 'ORDERS_UPDATED'
  | 'ORDER_TRANSACTIONS_CREATE'
  | 'PAYMENT_SCHEDULES_DUE'
  | 'PAYMENT_TERMS_CREATE'
  | 'PAYMENT_TERMS_DELETE'
  | 'PAYMENT_TERMS_UPDATE'
  | 'PRODUCTS_CREATE'
  | 'PRODUCTS_DELETE'
  | 'PRODUCTS_UPDATE'
  | 'PRODUCT_LISTINGS_ADD'
  | 'PRODUCT_LISTINGS_REMOVE'
  | 'PRODUCT_LISTINGS_UPDATE'
  | 'PRODUCT_PUBLICATIONS_CREATE'
  | 'PRODUCT_PUBLICATIONS_DELETE'
  | 'PRODUCT_PUBLICATIONS_UPDATE'
  | 'PROFILES_CREATE'
  | 'PROFILES_DELETE'
  | 'PROFILES_UPDATE'
  | 'REFUNDS_CREATE'
  | 'RETURNS_APPROVE'
  | 'RETURNS_CANCEL'
  | 'RETURNS_CLOSE'
  | 'RETURNS_DECLINE'
  | 'RETURNS_REOPEN'
  | 'RETURNS_REQUEST'
  | 'REVERSE_DELIVERIES_ATTACH_DELIVERABLE'
  | 'REVERSE_FULFILLMENT_ORDERS_DISPOSE'
  | 'SCHEDULED_PRODUCT_LISTINGS_ADD'
  | 'SCHEDULED_PRODUCT_LISTINGS_REMOVE'
  | 'SCHEDULED_PRODUCT_LISTINGS_UPDATE'
  | 'SEGMENTS_CREATE'
  | 'SEGMENTS_DELETE'
  | 'SEGMENTS_UPDATE'
  | 'SELLING_PLAN_GROUPS_CREATE'
  | 'SELLING_PLAN_GROUPS_DELETE'
  | 'SELLING_PLAN_GROUPS_UPDATE'
  | 'SHIPPING_ADDRESSES_CREATE'
  | 'SHIPPING_ADDRESSES_UPDATE'
  | 'SHOP_UPDATE'
  | 'SUBSCRIPTION_BILLING_ATTEMPTS_CHALLENGED'
  | 'SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE'
  | 'SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS'
  | 'SUBSCRIPTION_BILLING_CYCLE_EDITS_CREATE'
  | 'SUBSCRIPTION_BILLING_CYCLE_EDITS_DELETE'
  | 'SUBSCRIPTION_BILLING_CYCLE_EDITS_UPDATE'
  | 'SUBSCRIPTION_CONTRACTS_CREATE'
  | 'SUBSCRIPTION_CONTRACTS_UPDATE'
  | 'TAX_SERVICES_CREATE'
  | 'TAX_SERVICES_UPDATE'
  | 'TENDER_TRANSACTIONS_CREATE'
  | 'THEMES_CREATE'
  | 'THEMES_DELETE'
  | 'THEMES_PUBLISH'
  | 'THEMES_UPDATE'
  | 'VARIANTS_IN_STOCK'
  | 'VARIANTS_OUT_OF_STOCK';
