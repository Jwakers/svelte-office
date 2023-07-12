import clsx from 'clsx';
import IndexString from 'components/index-string';
import Price from 'components/price';
import { getCollection, getCollectionWithProducts } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.handle);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function Collection({ params }: { params: { handle: string } }) {
  const collection = await getCollectionWithProducts({ handle: params.handle, limit: 100 });
  if (!collection) return notFound();

  const { image, description, title, products } = collection;
  const productsCount = products.length;
  return (
    <section>
      <div className="grid border-b border-black md:grid-cols-2">
        <div className="flex flex-col justify-end border-r border-black p-3">
          <h1 className="font-serif text-3xl uppercase">{title}</h1>
          <IndexString value={productsCount} text="products in this collection" />
          <p className="mt-1 max-w-lg">{description}</p>
        </div>
        {image && (
          <div className="max-h-96 animate-fadeIn">
            <Image
              className="h-full w-full object-cover"
              src={image.url}
              width={736}
              height={384}
              alt={image.altText}
            />
          </div>
        )}
      </div>
      <div className="grid 2xl:grid-cols-2">
        {products.map((product) => (
          <ColletionProduct product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}

const ColletionProduct = ({ product }: { product: Product }) => {
  const hasVariants = product.variants.length > 1;
  const previewImages = product.images.filter((_, i) => i >= 1 && i <= 3);

  return (
    <Link
      href={`/product/${product.handle}`}
      className="grid-cols-[auto_1fr] border-b border-black md:grid 2xl:border-r"
    >
      <div className="flex">
        <div className="max-h-80 w-full md:max-h-none md:w-auto">
          <Image
            src={product.featuredImage.url}
            height={320}
            width={320}
            alt={product.featuredImage.altText}
            className="md:border-b-none h-full w-full border-b border-black object-cover md:border-r"
          />
        </div>
        {previewImages.length >= 3 && (
          <div className="hidden flex-col border-r border-black md:flex">
            {previewImages.map((image, i) => (
              <div
                className={clsx('h-1/3', {
                  'border-b border-black': i < 2
                })}
                key={image.url}
              >
                <Image
                  src={image.url}
                  height={100}
                  width={100}
                  className="h-full object-cover"
                  alt={image.altText}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex max-w-2xl flex-col justify-end p-3 2xl:max-w-none">
        <h2 className="font-serif text-lg uppercase md:text-3xl">{product.title}</h2>
        {hasVariants && <IndexString value={product.variants.length} text="variations" />}
        <p>
          {hasVariants && <span>from &nbsp;</span>}
          <Price
            amount={product.priceRange.minVariantPrice.amount}
            currencyCode={product.priceRange.minVariantPrice.currencyCode}
          />
        </p>
        <p className="line-clamp-4">{product.description}</p>
      </div>
    </Link>
  );
};
