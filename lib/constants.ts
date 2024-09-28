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

export const SHOPIFY_TAGS = {
  hide: 'hide',
  canonicalParent: 'canonical-parent',
  noindexAlgolia: 'noindex-algolia',
  noindexGoogle: 'noindex-google'
};

export const HIDDEN_PRODUCT_TAG = 'hide';
export const DEFAULT_OPTION = 'Default Title';
export const SHOPIFY_GRAPHQL_API_ENDPOINT = '/api/2024-07/graphql.json';
export const SHOPIFY_GRAPHQL_ADMIN_API_ENDPOINT = '/admin/api/2024-07/graphql.json';

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

export const vendors: { [key: string]: ShopifyVendors } = {
  teknik: 'Teknik',
  hillInteriors: 'Hill Interiors',
  lavoro: 'Lavoro',
  dams: 'Dams'
};

export const WARRANTY = {
  default:
    'All products have a two year mechanical parts replacement warranty (subject to fair use).',
  [vendors.teknik!]:
    'All products have a two year mechanical parts replacement warranty (subject to fair use).',
  [vendors.hillInteriors!]:
    'All products have a two year mechanical parts replacement warranty (subject to fair use).',
  [vendors.lavoro!]: 'All products have a 5 year guarantee.',
  [vendors.dams!]: 'All products have a 5 year warranty'
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

export const CONTAIN_IMAGE_BRANDS = [vendors.teknik];

export const CONTAIN_IMAGE_COLLECTIONS = ['office-chairs'];
