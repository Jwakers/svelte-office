import { Image } from 'lib/shopify/types';

export type Record = {
  objectID: string;
  title: string;
  handle: string;
  tags: string[] | [];
  brand: string;
  price_range: string;
  min_price: number;
  max_price: number;
  currency_code: string;
  image: Pick<Image, 'url' | 'altText'>;
  width?: number;
  length?: number;
  height?: number;
  weight?: number;
  collections: string[] | [];
  options: { name: string; values: string[] }[];
  desk_type: string[];
};
