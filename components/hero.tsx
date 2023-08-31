import Image from 'next/image';
import Link from 'next/link';

export const Hero = async function () {
  return (
    <section className="-mt-[52px] flex h-[calc(100dvh_-_77px)] max-h-[56rem] flex-col-reverse border-b border-black md:mt-0 md:grid md:grid-cols-[370px_1fr]">
      <div className="flex max-w-xl flex-col justify-end gap-4 px-3 py-4">
        <h1 className="font-serif text-2xl uppercase leading-none md:text-5xl">
          Let your office reflect your ambitions.
        </h1>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Link href="/categories/office-desks" className="button grow">
            Shop desks
          </Link>
          <Link href="/categories/office-chairs" className="button grow">
            Shop chairs
          </Link>
        </div>
      </div>
      <div className="relative min-h-[180px] grow animate-fadeIn border-b border-black md:border-b-0 md:border-l">
        <Image
          src="/manhattan-desk-hero.jpeg"
          alt="Large l-shaped desk in a studio apartment office"
          className="object-cover mix-blend-multiply"
          priority
          fill
        />
      </div>
    </section>
  );
};
