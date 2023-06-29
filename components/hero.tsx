import Image from 'next/image';
import Link from 'next/link';

export const Hero = function () {
  // TODO: Create collection in shopify and link
  return (
    <section className="grid h-[calc(100vh_-_42px)] grid-cols-[auto_1fr] border-b border-black">
      <div className="flex max-w-xl flex-col justify-end gap-4 px-3 pb-4">
        <h1 className="font-serif uppercase leading-none md:text-5xl">
          Premium furniture collection
        </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum urna felis, interdum
          nec arcu non, euismod hendrerit nulla. Phasellus finibus sem ornare, molestie sem nec,
          pharetra metus. Integer vitae venenatis odio, at sollicitudin tortor. Duis ac tortor quis
          ex elementum semper.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="border border-black px-4 py-2 text-sm uppercase transition-colors hover:bg-black hover:text-white"
          >
            All collections
          </Link>
          <Link
            href="/"
            className="border border-black px-4 py-2 text-sm uppercase transition-colors hover:bg-black hover:text-white"
          >
            View collection
          </Link>
        </div>
      </div>
      <div className="relative">
        <Image
          src="/hero-image.webp"
          alt="Hero image"
          className="object-cover mix-blend-multiply"
          priority
          fill
        />
      </div>
    </section>
  );
};
