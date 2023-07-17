export type SortFilterItem = {
  title: string;
  slug: string | null;
  sortKey: 'RELEVANCE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRICE';
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
  { title: 'Latest arrivals', slug: 'latest-desc', sortKey: 'CREATED_AT', reverse: true },
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

export const FADE_ANIMATION = {
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const DELIVERY_OPTIONS: { [key: string]: string } = {
  default: `
  Standard Delivery: We offer standard delivery service, which usually takes 3-5 business days for your order to be delivered.
  Express Delivery: With express delivery, you can expect your order to arrive within 1-2 business days, ensuring a speedy delivery.
  `
};

export const RETURN_OPTIONS: { [key: string]: string } = {
  default: `
  We offer a standard return option. Once your return request is approved, it usually takes 7-10 business days for the returned item to reach our warehouse and for the refund or exchange process to be completed.
  `
};
