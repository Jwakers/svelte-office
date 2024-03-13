import { getCollection } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'react-feather';

export const CollectionPreview = async function ({ handle }: { handle: string }) {
  const collection = await getCollection(handle);

  if (!collection) return;
  return (
    <Link
      href={`/categories/${collection.handle}`}
      className="group relative grid border-b border-slate-900 md:flex"
    >
      <div className="sticky top-0 z-10 flex items-center gap-1 self-end border-b border-slate-900 bg-white px-4 py-2 transition-all group-hover:gap-4 md:hidden">
        <h2 className="font-serif text-2xl">{collection.title}</h2>
        <ArrowRight />
      </div>
      {collection.image ? (
        <div className="md:border-l md:border-r md:border-slate-900">
          <Image
            src={collection.image.url}
            alt={collection.image.altText}
            width={400}
            height={400}
            className="aspect-square w-full object-cover"
          />
        </div>
      ) : null}
      <div className="hidden h-full w-full content-end p-4 md:flex">
        <div className="flex w-full items-center gap-1 self-end">
          <h2 className="max-w-[90%] font-serif text-3xl">{collection.title}</h2>
          <ArrowRight className="transition-transform group-hover:translate-x-2" />
        </div>
      </div>
    </Link>
  );
};
