import Carousel from 'components/collections/carousel';
import IndexString from 'components/index-string';
import Price from 'components/price';
import Prose from 'components/prose';
import { getCollection, getCollectionWithProducts } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'react-feather';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.handle);

  if (!collection) notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function Collection({ params }: { params: { handle: string } }) {
  const collection = await getCollectionWithProducts({ handle: params.handle, limit: 100 });
  if (!collection) notFound();

  const { image, title, products, descriptionHtml } = collection;
  const productsCount = products.length;
  return (
    <section>
      <div className="border-b border-black md:flex md:h-[clamp(400px,_calc(100vh_-_44px),_700px)]">
        <div className="flex flex-col justify-end border-r border-black p-3 md:w-1/2">
          <h1 className="font-serif text-3xl uppercase">{title}</h1>
          <IndexString value={productsCount} text="products in this category" />
          <Prose html={descriptionHtml} />
        </div>
        {image && (
          <div className="hidden animate-fadeIn md:block md:w-1/2">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ColletionProduct product={product} key={product.id} />
        ))}
      </div>
    </section>
  );
}

const ColletionProduct = ({ product }: { product: Product }) => {
  const hasVariants = product.variants.length > 1;

  return (
    <div className="flex flex-col outline outline-1 outline-black">
      <Carousel
        images={product.images.map((img) => ({ src: img.url, altText: img.altText }))}
      ></Carousel>
      <Link
        href={`/product/${product.handle}`}
        className="group flex h-full flex-col border-t border-black bg-white p-3"
      >
        <h2 className="font-serif text-lg uppercase md:text-xl">{product.title}</h2>
        {hasVariants && <IndexString value={product.variants.length} text="variations" />}
        <div className="mt-auto flex justify-between">
          <div>
            {hasVariants && <span>from &nbsp;</span>}
            <Price
              amount={product.priceRange.minVariantPrice.amount}
              currencyCode={product.priceRange.minVariantPrice.currencyCode}
            />
          </div>
          <ArrowRight className="transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
        </div>
      </Link>
    </div>
  );
};
