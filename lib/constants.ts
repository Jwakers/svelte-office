export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED' | 'PRICE';
  reverse: boolean;
};

export const defaultSort: SortFilterItem = {
  title: 'Relevance',
  slug: null,
  sortKey: 'RELEVANCE',
  reverse: false
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  { title: 'Trending', slug: 'trending-desc', sortKey: 'BEST_SELLING', reverse: false }, // asc
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED', reverse: true },
  { title: 'Price: Low to high', slug: 'price-asc', sortKey: 'PRICE', reverse: false }, // asc
  { title: 'Price: High to low', slug: 'price-desc', sortKey: 'PRICE', reverse: true }
];

export const TAGS = {
  collections: 'collections',
  products: 'products'
};

export const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-07/graphql.json';
export const SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT = '/admin/api/2023-07/graphql.json';

export const FADE_ANIMATION = {
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export type Vendors = 'Teknik';

export type DeliveryTypes = {
  ND: string;
  '2M': string;
  SP: string;
};

export const DELIVERY_OPTIONS: { [key in Vendors]: DeliveryTypes } = {
  Teknik: {
    ND: 'If this order is placed before 1pm it will be dispatched for next working day delivery.',
    '2M': 'This product is delivered by a two person team. You will be contacted to discuss a delivery date and time, typically deliveryed within 10 working days.',
    SP: 'The delivery of this product varies, you will be contacted about delivery.'
  }
};

export const UNIT_MAP = {
  CENTIMETERS: 'cm',
  KILOGRAMS: 'kg'
};
