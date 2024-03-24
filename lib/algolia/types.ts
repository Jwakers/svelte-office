import { Image } from 'lib/shopify/types';

export type Record = {
  objectID: string;
  title: string;
  handle: string;
  tags: string[] | [];
  brand: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  currencyCode: string;
  image: Pick<Image, 'url' | 'altText'>;
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
  collections: string[] | [];
  options: { name: string; values: string[] }[];
};
