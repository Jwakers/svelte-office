import { Icon } from 'components/icon';
import Price from 'components/price';
import { getCollectionWithProducts } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export const CollectionPreview = async function () {
  const collection = await getCollectionWithProducts({
    handle: 'hidden-homepage-featured-items',
    limit: 3
  });

  if (!collection) return;
  const collectionTitle = `${collection.metafield?.value} collection`;
  return (
    <section className="relative grid border-b border-black md:grid-cols-[repeat(3,_1fr),_40%]">
      <Link
        href="/collection/collection-handle"
        className="sticky top-0 z-10 flex items-center gap-1 self-end border-b border-black px-4 py-2 transition-all group-hover:gap-4 md:hidden"
      >
        <h2 className="font-serif text-2xl">{collectionTitle}</h2>
        <Icon name="arrow_right_alt" />
      </Link>
      {collection.products.map((product) => {
        const {
          featuredImage,
          handle,
          priceRange: {
            minVariantPrice: { amount, currencyCode }
          },
          title
        } = product;

        return (
          <Link
            href={`/product/${handle}`}
            className="group relative overflow-hidden border-b border-black md:border-b-0 md:border-r"
            key={product.id}
          >
            <Image
              width={featuredImage.width}
              height={featuredImage.height}
              src={featuredImage.url}
              alt={featuredImage.altText}
              className="transition-transform duration-500 group-hover:-translate-x-2 md:h-full md:object-cover"
            />
            <div className="flex flex-col-reverse border-t border-black bg-white p-4 md:absolute md:bottom-0 md:right-0 md:h-full md:translate-x-[calc(100%_+_1px)] md:-rotate-180 md:flex-col md:border-r md:border-t-0 md:transition-transform md:[writing-mode:vertical-rl] md:group-hover:translate-x-0">
              <Price amount={amount} currencyCode={currencyCode} />
              <span className="text-md font-serif">{title}</span>
            </div>
          </Link>
        );
      })}
      <Link
        href="/collection/collection-handle"
        className="group flex h-full w-full content-end p-4"
      >
        <div className="hidden items-center gap-1 self-end transition-all group-hover:gap-4 md:flex">
          <h2 className="font-serif text-3xl">{collectionTitle}</h2>
          <Icon name="arrow_right_alt" />
        </div>
      </Link>
    </section>
  );
};
