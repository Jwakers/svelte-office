import { ROUTES } from 'lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import lavoroHero from 'public/lavoro-hero.jpg';
import manhattanDeskHero from 'public/manhattan-desk-hero.jpeg';
import { Button } from './ui/button';

export const Hero = function () {
  return (
    <section className="flex h-[calc(100dvh_-_77px)] max-h-[56rem] flex-col-reverse border-b md:mt-0 md:grid md:grid-cols-[370px_1fr]">
      <div className="flex max-w-xl flex-col justify-end gap-4 px-3 py-4">
        <h1 className="font-serif text-2xl uppercase leading-none md:text-5xl">
          Let your office reflect your ambitions.
        </h1>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <Button asChild>
            <Link href={`/${ROUTES.categories}/office-desks`}>Shop desks</Link>
          </Button>
          <Button asChild>
            <Link href={`/${ROUTES.categories}/office-chairs`}>Shop chairs</Link>
          </Button>
        </div>
      </div>
      <div className="relative min-h-[180px] grow border-b md:border-b-0 md:border-l">
        <Image
          src={manhattanDeskHero}
          alt="Large l-shaped desk in a studio apartment office"
          className="object-cover mix-blend-multiply"
          priority
          fill
        />
      </div>
    </section>
  );
};

export const FeaturedHero = function () {
  return (
    <section className="relative h-[calc(100vh-78px)] border-b border-b-brand md:h-[calc(100vh-32px)] md:max-h-[757px] md:min-h-[600px]">
      <Image
        src={lavoroHero}
        alt="Desk in a light green room with a green backed chair"
        className="max-h-full -scale-x-100 object-cover md:object-right-bottom"
        fill
        priority
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,_rgba(255,255,255,1)_40%,_transparent_60%)] md:bg-[linear-gradient(135deg,_rgba(255,255,255,1)_20%,_transparent_50%)]" />
      <div className="absolute inset-0 p-3 pt-16 md:p-4 md:pt-24">
        <div className="flex h-full flex-col gap-6">
          <div className="space-y-2">
            <h1 className="font-serif text-2xl leading-none md:text-6xl">Introducing</h1>
            <img
              src="/lavoro-logo.svg"
              alt="Lavoro logo"
              className="ml-1 w-32 md:w-auto"
              width={260}
              height={40}
            />
          </div>
          <div className="max-h-[550px] space-y-4">
            <p className="max-w-sm">
              Refined, clean and minimalist. Lavoro workstations are design-led yet ergonomic, built
              to last using premium European materials, with a 5-year warranty on all parts.
            </p>
            <div className="flex flex-col gap-1 sm:flex-row">
              <Button asChild>
                <Link href={`/${ROUTES.search}?sortBy=products_price_dec&query=Lavoro`}>
                  View Lavoro products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
