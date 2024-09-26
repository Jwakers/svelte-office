import algoliasearch from 'algoliasearch';
import { ALGOLIA } from 'lib/constants';
import { ProductAlgolia, ProductOption } from 'lib/shopify/types';

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

export function parseDimention(value?: string) {
  if (!value) return null;
  const props = JSON.parse(value);

  return props.value ? parseFloat(props.value) : null;
}

export function getSizes(options: ProductOption[]) {
  const sizes = options.find((option) => option.name.toLowerCase() === 'size');
  if (!sizes) return null;

  const dimentions = sizes.optionValues
    .map(({ name }) => {
      const split = name.split('x');
      if (!split[0] || !split[1]) return null;

      return {
        width: parseInt(split[0]),
        depth: parseInt(split[1])
      };
    })
    .filter((item) => item !== null);

  return dimentions as { width: number; depth: number }[];
}

export function getRecord(product: ProductAlgolia) {
  const sizes = getSizes(product.options);
  const widths = sizes?.map((size) => size.width);
  const depths = sizes?.map((size) => size.depth);
  const prices = Array.from(
    new Set(product.variants.map((variant) => parseFloat(variant.price.amount)))
  );
  const compareAtPrices = Array.from(
    new Set(
      product.variants
        .filter((v) => v.compareAtPrice)
        .map((variant) => parseFloat(variant.compareAtPrice.amount))
    )
  );

  const record = {
    objectID: product.id.split('/').at(-1),
    title: product.title,
    handle: product.handle,
    tags: product.tags,
    brand: product.vendor,
    price: prices,
    compareAtPrice: compareAtPrices,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    image: { ...product.featuredImage },
    width: widths,
    depth: depths,
    height: parseDimention(product.height?.value),
    weight: parseDimention(product.weight?.value),
    collections: product.collections.map((collection) => collection.handle),
    options: product.options,
    availableForSale: product.availableForSale
  };

  const namedTags = getNamedTags(product.tags);

  return { ...record, ...namedTags };
}
