import { getAlgoliaIndex } from 'lib/algolia';
import { getProductsForAlgolia } from 'lib/shopify';
import { NextResponse } from 'next/server';

const client = getAlgoliaIndex(true);

function getNamedTags(tags: string[]) {
  const namedTags: { [key: string]: string[] } = {};
  tags.forEach((tag) => {
    const [key, val] = tag.split(':');
    if (!key || !val) return;

    const keyName = key.split(' ').join('_').toLowerCase();

    if (Array.isArray(namedTags[keyName])) namedTags[keyName]?.push(val);
    else namedTags[keyName] = [val];
  });
  return namedTags;
}

function parseDimention(value?: string) {
  if (!value) return null;
  const props = JSON.parse(value);

  return props.value ? parseFloat(props.value) : null;
}

function getSizes(options: { name: string; values: string[] }[]) {
  const sizes = options.find((option) => option.name.toLowerCase() === 'size');
  if (!sizes) return null;

  const dimentions = sizes.values
    .map((size) => {
      const split = size.split('x');
      if (!split[0] || !split[1]) return null;

      return {
        width: parseInt(split[0]),
        depth: parseInt(split[1])
      };
    })
    .filter((item) => item !== null);

  return dimentions as { width: number; depth: number }[];
}

export async function GET() {
  try {
    const products = await getProductsForAlgolia();

    const objectsToIndex = products.map((product) => {
      const sizes = getSizes(product.options);
      const widths = sizes?.map((size) => size.width);
      const depths = sizes?.map((size) => size.depth);
      const prices = Array.from(
        new Set(product.variants.map((variant) => parseFloat(variant.price.amount)))
      );

      const record = {
        objectID: product.id.split('/').at(-1),
        title: product.title,
        handle: product.handle,
        tags: product.tags,
        brand: product.vendor,
        price: prices,
        currency_code: product.priceRange.minVariantPrice.currencyCode,
        image: { ...product.featuredImage },
        width: widths,
        depth: depths,
        height: parseDimention(product.height?.value),
        weight: parseDimention(product.weight?.value),
        collections: product.collections.map((collection) => collection.handle),
        options: product.options
      };

      const namedTags = getNamedTags(product.tags);

      return { ...record, ...namedTags };
    });

    client.saveObjects(objectsToIndex);

    if (products.length >= 250)
      console.warn('Reached product fetch limit of 250. Not all products will be indexed.');

    return NextResponse.json({ message: 'Algolia reindex started' }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'There was an error', error: err }, { status: 500 });
  }
}
