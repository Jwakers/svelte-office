import { getCollection } from 'lib/shopify';
import Image from 'next/image';
import Link from 'next/link';

export const Hero = async function () {
  const heroCollection = await getCollection('desks');

  if (!heroCollection) return;
  const { metafield, handle, image } = heroCollection;

  return (
    <section className="-mt-[50px] flex min-h-[calc(100vh_-_42px)] flex-col-reverse border-b border-black md:mt-0 md:grid md:grid-cols-[auto_1fr]">
      <div className="flex max-w-xl flex-col justify-end gap-4 px-3 py-4">
        {!!metafield && (
          <h1 className="font-serif text-3xl uppercase leading-none md:text-5xl">
            {metafield.value}
          </h1>
        )}
        <p>{heroCollection.description}</p>
        <div className="flex gap-4">
          <Link href="/collection/" className="button grow">
            All categories
          </Link>
          <Link href={`/collection/${handle}`} className="button grow">
            View category
          </Link>
        </div>
      </div>
      {!!image && (
        <div className="relative min-h-[120px] grow animate-fadeIn border-b border-black md:border-b-0 md:border-l">
          <Image
            src={image.url}
            alt={image.altText}
            className="object-cover mix-blend-multiply"
            priority
            fill
          />
        </div>
      )}
    </section>
  );
};
