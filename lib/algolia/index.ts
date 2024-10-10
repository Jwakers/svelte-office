import algoliasearch from 'algoliasearch';
import { ALGOLIA } from 'lib/constants';
import { Product, ProductAlgolia, ProductOption } from 'lib/shopify/types';
import { getMetafieldValue } from '../utils';

export function getAlgoliaClient(isAdmin?: boolean) {
  const client = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
    isAdmin ? process.env.ALGOLIA_ADMIN_API_KEY! : process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY!
  );

  return client;
}

export function getAlgoliaIndex(isAdmin?: boolean, indexName: string = ALGOLIA.index.products) {
  const client = getAlgoliaClient(isAdmin);
  const index = client.initIndex(indexName);

  return index;
}

export function getURIComponent(type: 'range' | 'refinementList', facet: string, value: string) {
  return `${encodeURIComponent(`${type}[${facet}]${type === 'range' ? '' : '[0]'}`)}=${value}`;
}

export function getNamedTags(tags: string[]) {
  const namedTags: { [key: string]: string[] } = {};
  tags.forEach((tag) => {
    const [key, val] = tag.split(':');
    if (!key || !val) return;

    const keyName = key.split(' ').join('_').toLowerCase();

    if (Array.isArray(namedTags[keyName])) namedTags[keyName]?.push(val);
    else namedTags[keyName] = [val.trim()];
  });
  return namedTags;
}

export function parseDimension(value?: string) {
  if (!value) return null;
  const props = JSON.parse(value);

  return props.value ? parseFloat(props.value) : null;
}

export function getSizes(options: ProductOption[]) {
  const sizes = options.find((option) => option.name.toLowerCase() === 'size');
  if (!sizes) return null;

  const dimensions = sizes.optionValues
    .map(({ name }) => {
      const split = name.split('x');
      if (!split[0] || !split[1]) return null;

      return {
        width: parseInt(split[0]),
        depth: parseInt(split[1])
      };
    })
    .filter((item) => item !== null);

  return dimensions as { width: number; depth: number }[];
}

export async function getRecord(product: ProductAlgolia) {
  const sizes = getSizes(product.options);

  let sizeVariants: Product[] | null = null;

  if (product.sizeReferences) {
    const sizeVariantIds: string[] | undefined = product.sizeReferences?.value
      ? (() => {
          try {
            return JSON.parse(product.sizeReferences.value);
          } catch (error) {
            console.error('Failed to parse sizeReferences.value:', error);
            return null;
          }
        })()
      : null;
    if (sizeVariantIds) {
      // Import getProductById dynamically to avoid circular dependency
      const { getProductById } = await import('lib/shopify');
      sizeVariants = await Promise.all(sizeVariantIds.map((id) => getProductById(id))).then(
        (products) => products.filter((product) => !!product)
      );
    }
  }

  const namedTags = getNamedTags(product.tags);

  const record = {
    objectID: getObjectId(product),
    title: product.title,
    handle: product.handle,
    tags: product.tags,
    brand: product.vendor,
    price: getPrices(product),
    compareAtPrice: getCompareAtPrices(product),
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    image: { ...product.featuredImage },
    collections: getCollections(product),
    options: product.options,
    availableForSale: product.availableForSale,
    ...getDimensions(product, sizes, sizeVariants),
    ...namedTags
  };

  return record;
}

function getObjectId(product: ProductAlgolia): string {
  return product.id.split('/').at(-1) ?? '';
}

function getPrices(product: ProductAlgolia): number[] {
  return Array.from(new Set(product.variants.map((variant) => parseFloat(variant.price.amount))));
}

function getCompareAtPrices(product: ProductAlgolia): number[] {
  return Array.from(
    new Set(
      product.variants
        .filter((v) => v.compareAtPrice)
        .map((variant) => parseFloat(variant.compareAtPrice.amount))
    )
  );
}

function getDimensions(
  product: ProductAlgolia,
  sizes: ReturnType<typeof getSizes>,
  sizeVariants: Product[] | null
) {
  const widths = sizes?.map((size) => size.width) ?? [];
  const depths = sizes?.map((size) => size.depth) ?? [];
  const sizeVariantWidths = getSizeVariantDimensions(sizeVariants, 'width');
  const sizeVariantDepths = getSizeVariantDimensions(sizeVariants, 'depth');

  return {
    width: [...widths, ...sizeVariantWidths].filter((width): width is number => width !== null),
    depth: [...depths, ...sizeVariantDepths].filter((depth): depth is number => depth !== null),
    height: parseDimension(product.height?.value),
    weight: parseDimension(product.weight?.value)
  };
}

function getSizeVariantDimensions(
  sizeVariants: Product[] | null,
  dimension: 'width' | 'depth'
): number[] {
  return (
    sizeVariants
      ?.map((variant) => parseInt(getMetafieldValue(variant, dimension) ?? '0'))
      .filter((d): d is number => !isNaN(d)) ?? []
  );
}

function getCollections(product: ProductAlgolia): string[] {
  return product.collections.map((collection) => collection.handle);
}
