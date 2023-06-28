import Link from 'next/link';

export const Hero = function () {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center md:-mt-[5.5rem]">
      <div className="grid h-screen gap-8 md:grid-cols-2 md:gap-40">
        <div className="z-10 mx-auto max-w-md space-y-6 self-center justify-self-end px-4 md:mx-0 md:mt-32 md:px-0">
          <h1 className="heading-large whitespace-nowrap">New arrivals</h1>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vero, dolorem.</p>
          <Link href="/products" className="button inline-flex gap-4">
            Go to products
          </Link>
        </div>
        <img
          src="/hero-placeholder.jpg"
          alt="Hero image"
          className="h-full w-full object-cover opacity-10 md:[clip-path:polygon(6%_0%,_100%_0%,_100%_100%,_0%_100%)]"
        />
      </div>
    </div>
  );
};
