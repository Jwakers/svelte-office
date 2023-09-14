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
  sku: string;
  displayName: string;
  availableForSale: string;
  price: string;
  barcode: string;
  selectedOptions: {
    name: string;
    value: string;
  };
  image: {
    url: string;
  };
};

export type TypeNames = 'Image' | 'ProductVariant';
