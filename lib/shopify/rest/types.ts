import { ShopifyVendors } from '../types';

export type Variant = {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: string | null;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: string;
  option3: string;
  updated_at: string;
  taxable: false;
  barcode: string;
  grams: number;
  image_id: string | null;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
};

export type Option = {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
};

export type Image = {
  id: number;
  alt: string;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  width: number;
  height: number;
  src: string;
  variant_ids: number[] | [];
};

export type Product = {
  id: number;
  title: string;
  body_html: string;
  vendor: ShopifyVendors;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  published_scope: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: Variant[];
  options: Option[];
  images: Image[];
};

export type InventoryItem = {
  cost: string;
  country_code_of_origin: string;
  country_harmonized_system_codes: CountryHarmonizedSystemCode[];
  created_at: string;
  harmonized_system_code: number;
  id: number;
  province_code_of_origin: string;
  sku: string;
  tracked: boolean;
  updated_at: string;
  requires_shipping: boolean;
};

export type Metafield = {
  id: number;
  namespace: string;
  key: string;
  value: string;
  description: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  owner_resource: string;
  type: string;
  admin_graphql_api_id: string;
};

export type CountryHarmonizedSystemCode = {
  harmonized_system_code: string;
  country_code: string;
};
