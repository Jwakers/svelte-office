import Price from 'components/price';
import { getCollectionWithProducts } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'react-feather';

export const CollectionPreview = async function () {
  const collection = await getCollectionWithProducts({
    handle: 'desks',
    limit: 3
  });

  if (!collection) return;
  const collectionTitle = collection.metafield?.value || collection.title;
  return (
    <section className="relative grid border-b border-black md:grid-cols-[repeat(3,_1fr),_40%]">
      <Link
        href={`/category/${collection.handle}`}
        className="sticky top-0 z-10 flex items-center gap-1 self-end border-b border-black bg-white px-4 py-2 transition-all group-hover:gap-4 md:hidden"
      >
        <h2 className="font-serif text-2xl">{collectionTitle}</h2>
        <ChevronRight strokeWidth={1} />
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
              className="transition-transform duration-[400ms] group-hover:-translate-x-2 md:h-full md:object-cover"
            />
            <div className="flex flex-col-reverse border-t border-black bg-white p-4 md:absolute md:bottom-0 md:right-0 md:h-full md:translate-x-[calc(100%_+_1px)] md:-rotate-180 md:flex-col md:border-r md:border-t-0 md:transition-transform md:duration-[200ms] md:ease-in md:[writing-mode:vertical-rl] md:group-hover:translate-x-0">
              <Price amount={amount} currencyCode={currencyCode} />
              <span className="text-md font-serif">{title}</span>
            </div>
          </Link>
        );
      })}
      <Link
        href={`/category/${collection.handle}`}
        className="group flex h-full w-full content-end p-4"
      >
        <div className="hidden items-center gap-1 self-end transition-all group-hover:gap-4 md:flex">
          <h2 className="font-serif text-3xl">{collectionTitle}</h2>
          <ChevronRight strokeWidth={1} />
        </div>
      </Link>
    </section>
  );
};
