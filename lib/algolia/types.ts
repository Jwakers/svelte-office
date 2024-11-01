import { Image } from 'lib/shopify/types';

export type Record = {
  objectID: string;
  title: string;
  handle: string;
  tags: string[] | [];
  brand: string;
  price: number[];
  compareAtPrice: number[] | [];
  currencyCode: string;
  image: Image;
  width?: number[];
  depth?: number;
  height?: number[];
  weight?: number;
  collections?: string[];
  options: { name: string; values: string[] }[];
  desk_type: string[];
};
