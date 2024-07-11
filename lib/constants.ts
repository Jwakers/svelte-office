import { getURIComponent } from './algolia';
import { ShopifyVendors } from './shopify/types';

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
  products: 'products',
  blogs: 'blogs'
};

export const HIDDEN_PRODUCT_TAG = 'hide';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2023-07/graphql.json';
export const SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT = '/admin/api/2023-07/graphql.json';

export const FADE_ANIMATION = {
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export type DeliveryTypes = {
  ND: string;
  '2M': string;
};

export const vendors: { [key: string]: ShopifyVendors } = {
  teknik: 'Teknik',
  hillInteriors: 'Hill Interiors',
  lavoro: 'Lavoro'
};

export const DELIVERY_OPTIONS = {
  [vendors.teknik!]: {
    ND: 'If this order is placed before 1pm it will be dispatched for next working day delivery.',
    '2M': 'This product is delivered by a two person team. You will be contacted to discuss a delivery date and time, typically delivered within 10 working days.'
  },
  [vendors.hillInteriors!]: {
    ND: 'If this order is placed before 1pm it will be dispatched for next working day delivery.',
    '2M': 'This product is delivered by a two person team. You will be contacted to discuss a delivery date and time, typically delivered within 10 working days.'
  },
  [vendors.lavoro!]: {
    ND: 'If this order is placed before 1pm it will be dispatched for next working day delivery.',
    '2M': 'This product is delivered by a two person team. You will be contacted to discuss a delivery date and time, typically delivered within 10 working days.'
  }
} as { [key in ShopifyVendors]: DeliveryTypes };

export const WARRANTY = {
  default:
    'All products have a two year mechanical parts replacement warranty (subject to fair use).',
  [vendors.teknik!]:
    'All products have a two year mechanical parts replacement warranty (subject to fair use).',
  [vendors.hillInteriors!]:
    'All products have a two year mechanical parts replacement warranty (subject to fair use).',
  [vendors.lavoro!]: '5 year guarantee.'
} as { [key in ShopifyVendors | 'default']: string };

export const UNIT_MAP = {
  CENTIMETERS: 'cm',
  MILLIMETERS: 'mm',
  KILOGRAMS: 'kg'
};

export const ALGOLIA = {
  index: {
    products: 'products',
    productsPriceAsc: 'products_price_asc',
    productsPriceDesc: 'products_price_desc'
  }
};

export const ROUTES = {
  products: 'products',
  categories: 'categories',
  search: 'search',
  blog: 'blog',
  contact: 'contact',
  policies: 'policies',
  delivery: 'delivery',
  priceMatch: 'price-match-promise'
};

export const MENU_ITEMS = [
  {
    title: 'Desks',
    path: `/${ROUTES.search}?${getURIComponent('refinementList', 'collections', 'office-desks')}`
  },
  {
    title: 'Chairs',
    path: `/${ROUTES.search}?${getURIComponent('refinementList', 'collections', 'office-chairs')}`
  },
  {
    title: 'All categories',
    path: `/${ROUTES.categories}`
  },
  {
    title: 'Blog',
    path: `/${ROUTES.blog}`
  },
  {
    title: 'Contact us',
    path: `/${ROUTES.contact}`
  }
];
