import { getURIComponent } from 'lib/algolia';
import { ROUTES } from 'lib/constants';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import crownDeskImage from 'public/crown-desk-lifestyle.jpg';
import { Button } from './ui/button';

export default function PromotionBanner() {
  return (
    <section className="grid gap-6 bg-brand md:grid-cols-2 md:border-b md:border-brand">
      <Image
        src={crownDeskImage}
        alt="Crown standing desk in large modern grey office"
        priority
        placeholder="blur"
        sizes={getImageSizes({ sm: '100vw', md: '50vw' })}
        className="h-full object-cover md:order-2"
      />
      <div className="flex flex-col items-center gap-2 px-3 pb-6 text-center text-white md:py-8 lg:gap-4">
        <h2 className="text-balance font-serif text-4xl capitalize lg:text-6xl">
          Limited offer{' '}
          <span className="block text-2xl lg:text-4xl">15% off all standing desks</span>
        </h2>
        <p>
          Transform your workspace with our sit/stand desks and enjoy a healthier, more productive
          workday. For a limited time, get 15% off on all sit/stand desks. Don't miss out, upgrade
          your desk today.
        </p>
        <p className="mb-4 text-sm md:mb-0">Offer ends July 31st</p>
        <Button asChild variant="outlineLight" className="mt-auto">
          <Link
            href={`/${ROUTES.search}?${getURIComponent(
              'refinementList',
              'desk_type',
              'sit/stand'
            )}`}
          >
            View all sit/stand desks
          </Link>
        </Button>
      </div>
    </section>
  );
}
