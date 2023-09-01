export type Product = {
  id: string;
  title: string;
  description: string;
  handle: string;
  vendor: string;
  updatedAt: string;
  featuredImage: FeaturedImage;
  width: Measurement;
  length: Measurement;
  height: Measurement;
  weight: Measurement;
  productCategory: ProductCategory;
  Image?: ImageEntity[] | null;
  ProductVariant: ProductVariantEntity[];
  priceRangeV2: {
    maxVariantPrice: PriceEntity;
    minVariantPrice: PriceEntity;
  };
};

export type PriceEntity = {
  amount: string;
  currencyCode: string;
};

export type FeaturedImage = {
  url: string;
};

export type Measurement = {
  value: string;
};

export type ProductCategory = {
  productTaxonomyNode: ProductTaxonomyNode;
};

export type ProductTaxonomyNode = {
  fullName: string;
};

export type ImageEntity = {
  __typename: TypeNames;
  __parentId: string;
  url: string;
};

export type ProductVariantEntity = {
  __typename: TypeNames;
  __parentId: string;
  price: string;
  weight: number;
  weightUnit: string;
  availableForSale: boolean;
  inventoryQuantity: number;
};

export type TypeNames = 'Image' | 'ProductVariant';
