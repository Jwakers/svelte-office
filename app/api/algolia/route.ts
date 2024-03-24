import { getAlgoliaIndex } from 'lib/algolia';
import { getProductsForAlgolia } from 'lib/shopify';
import { NextResponse } from 'next/server';

const client = getAlgoliaIndex(true);

function getNamedTags(tags: string[]) {
  const namedTags = tags.map((tag) => {
    const split = tag.split(':');
    if (!split[0] || !split[1]) return;
    return { [split[0]]: split[1].trim() };
  });
  return namedTags;
}

function parseDimention(value?: string, multiplyer: number = 10) {
  if (!value) return null;
  const props = JSON.parse(value);

  return props.value ? parseFloat(props.value) * multiplyer : null;
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
        length: parseInt(split[1])
      };
    })
    .filter((item) => item !== null);

  return dimentions as { width: number; length: number }[];
}

function getSmallest(parentSize: number | null, sizes?: number[]) {
  if (sizes) {
    if (parentSize) sizes.push(parentSize);
    return Math.min(...sizes);
  }
  return parentSize;
}

function getPriceRange(min: number, max: number) {
  return `${Math.floor(min / 100) * 100}:${Math.ceil(max / 100) * 100}`;
}

export async function GET() {
  try {
    const products = await getProductsForAlgolia();

    const objectsToIndex = products.map((product) => {
      const sizes = getSizes(product.options);
      const widths = sizes?.map((size) => size.width);
      const lengths = sizes?.map((size) => size.length);

      // TODO: Variant widths and option.size
      const record = {
        objectID: product.id.split('/').at(-1),
        title: product.title,
        handle: product.handle,
        tags: product.tags,
        brand: product.vendor,
        priceRange: getPriceRange(
          parseFloat(product.priceRange.minVariantPrice.amount),
          parseFloat(product.priceRange.maxVariantPrice.amount)
        ), // Note same with specs, e.g. widthRange?
        minPrice: product.priceRange.minVariantPrice.amount,
        maxPrice: product.priceRange.maxVariantPrice.amount,
        currencyCode: product.priceRange.minVariantPrice.currencyCode,
        image: { ...product.featuredImage },
        width: getSmallest(parseDimention(product.width?.value), widths),
        length: getSmallest(parseDimention(product.length?.value), lengths),
        height: parseDimention(product.height?.value),
        weight: parseDimention(product.weight?.value, 1),
        collections: product.collections.map((collection) => collection.handle),
        options: product.options
      };

      const namedTags = getNamedTags(product.tags);
      const recordWithTags = Object.assign({}, record, ...namedTags);

      return recordWithTags;
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
