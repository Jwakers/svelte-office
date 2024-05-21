import { ROUTES } from 'lib/constants';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import image from 'public/zero-desk-lifestyle.jpg';

export default function DeliveryBanner() {
  return (
    <section className="border-b border-brand">
      <div className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-10 px-4 py-10 md:flex-row md:py-16">
        <div className="relative aspect-video h-full w-full md:aspect-auto ">
          <Image
            alt="Man at standing desk with a digital camera"
            src={image}
            sizes={getImageSizes({ sm: '100vw', md: '50vw', lg: '33vw', xl: '25vw' })}
            className="object-cover"
          />
        </div>
        <div className="max-w-3xl space-y-2 ">
          <h2 className="font-serif text-3xl md:text-4xl">Free next day delivery</h2>
          <p>
            Need it fast? We've got you covered! With our next day delivery service, you can have
            your order at your doorstep in no time. Simply place your order before 2 PM, and we'll
            ensure it arrives the very next day. Don't wait—shop now and enjoy the speed and
            convenience of our express delivery!
          </p>
          <p>
            Some of our product require 2 person deliver and will be aranged for a date and time
            that suits you.
          </p>
          <p>
            Find out more on our{' '}
            <Link href={`/${ROUTES.delivery}`} className="underline">
              delivery details page
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
