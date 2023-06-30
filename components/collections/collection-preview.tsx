import { Icon } from 'components/Icon';
import { getCollectionProducts } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export const CollectionPreview = async function () {
  const homepageItems = await getCollectionProducts({
    id: 'gid://shopify/Collection/450908258605'
  });

  // TODO - Refactor fetch to use getCollectionBy Handle (include a limit number ot variables to only fetch three items)
  // Get collection name too

  if (!homepageItems.length) return;
  return (
    <section className="relative grid border-b border-black md:grid-cols-[repeat(3,_1fr),_40%]">
      <Link
        href="/collection/collection-handle"
        className="sticky top-0 z-10 flex items-center gap-1 self-end border-b border-black bg-stone-100 px-4 py-2 transition-all group-hover:gap-4 md:hidden"
      >
        <h2 className="font-serif text-2xl">Example collection</h2>
        <Icon name="arrow_right_alt" />
      </Link>
      {homepageItems.map((product) => {
        const {
          featuredImage,
          handle,
          priceRange: {
            minVariantPrice: { amount, currencyCode }
          },
          title
        } = product;

        const GBPound = new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: currencyCode
        });
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
              className="transition-transform group-hover:scale-105 md:h-full md:object-cover"
            />
            <div className="flex flex-col-reverse border-t border-black bg-stone-100 p-4 md:absolute md:bottom-0 md:right-0 md:h-full md:translate-x-[calc(100%_+_1px)] md:-rotate-180 md:flex-col md:border-r md:transition-transform md:[writing-mode:vertical-rl] md:group-hover:translate-x-0">
              <span>{GBPound.format(Number(amount))}</span>
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
          <h2 className="font-serif text-3xl">Example collection</h2>
          <Icon name="arrow_right_alt" />
        </div>
      </Link>
    </section>
  );
};
