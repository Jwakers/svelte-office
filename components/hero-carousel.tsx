'use client';

import { getURIComponent } from 'lib/algolia';
import { ROUTES } from 'lib/constants';
import { getImageSizes } from 'lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import advanceDeskHeroImage from 'public/advance-lifestyle.jpg';
import cityCenterHeroImage from 'public/city-center-coffee-table-lifestyle.jpg';
import cromoCornerHeroImage from 'public/cromo-corner-desk-lifestyle.jpg';
import crownDeskImage from 'public/crown-desk-lifestyle.jpg';
import forgeDeskHeroImage from 'public/forge-corner-lifestyle.jpg';
import hampsteadParkDeskHeroImage from 'public/hampstead-park-desk-lifestyle.jpg';
import hytheHelfBookcaseHeroImage from 'public/hythe-shelf-bookcase-lifestyle.jpg';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from './ui/button';

export default function HeroCarousel() {
  return (
    <div className="group relative h-dvh max-h-[calc(100dvh-77px)] w-full overflow-hidden md:max-h-[46rem] md:min-h-[38rem]">
      <Swiper
        modules={[Pagination, Navigation, Autoplay, EffectFade]}
        navigation={{
          nextEl: '.next',
          prevEl: '.prev'
        }}
        loop
        effect={'fade'}
        autoplay={{
          delay: 5000,
          pauseOnMouseEnter: true,
          disableOnInteraction: true
        }}
        pagination={{
          clickable: true,
          bulletClass: 'rounded w-2 h-2 block border border-brand',
          bulletActiveClass: 'bg-brand',
          type: 'bullets',
          el: '.pagination'
        }}
        className="size-full"
        wrapperClass="h-full"
      >
        {/* <SwiperSlide className="size-full">
          <StandingDeskPromoSlide />
        </SwiperSlide> */}
        <SwiperSlide className="size-full">
          <GradientSlide />
        </SwiperSlide>
        <SwiperSlide className="size-full">
          <FeaturedProductSlide />
        </SwiperSlide>
        <SwiperSlide className="size-full">
          <FourImageSlide />
        </SwiperSlide>
      </Swiper>
      <div className="pointer-events-none absolute bottom-4 right-0 z-20 mx-4 flex -translate-y-4 justify-between gap-4 opacity-0 transition-[opacity,transform] duration-500 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
        <Button className="prev" title="Previous slide">
          <ArrowLeft />
        </Button>
        <Button className="next" title="Next slide">
          <ArrowRight />
        </Button>
      </div>
      <div className="pagination absolute !bottom-0 z-10 flex gap-1 p-4" />
    </div>
  );
}

function StandingDeskPromoSlide() {
  return (
    <div className="grid-stack relative size-full">
      <div className="z-10 h-32 w-full self-start bg-gradient-to-b from-white/60"></div>
      <Image
        src={crownDeskImage}
        alt="Crown standing desk in large modern grey office"
        priority
        placeholder="blur"
        fill
        sizes={getImageSizes({ sm: '100vw' })}
        className="size-full -scale-x-100 object-cover"
      />
      <div className="md:l-10 z-10 ml-4 self-center justify-self-start bg-gradient-to-r from-brand p-6 text-white md:min-w-[44rem] md:p-10">
        <div className="flex h-full max-w-[32rem] flex-col gap-4">
          <h1 className="font-serif text-4xl capitalize md:text-6xl">
            15% Off all sit/stand desks
            <br />
            <span className="text-3xl md:text-5xl">Ends July 31st</span>
          </h1>

          <p className="mb-6 md:mb-20">
            Transform your workspace with our sit/stand desks and enjoy a healthier, more productive
            workday. For a limited time, get 15% off on all sit/stand desks. Don't miss out, upgrade
            your desk today.
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            <Button asChild variant="defaultLight">
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
            <Button asChild variant="outlineLight">
              <Link href={`/${ROUTES.products}/crown`}>View Crown desk</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GradientSlide() {
  return (
    <div className="grid-stack relative size-full">
      <div className="z-10 h-32 w-full self-start bg-gradient-to-b from-white/60"></div>
      <Image
        src={forgeDeskHeroImage}
        alt="Corner desk infront of large window on a sunny day"
        priority
        placeholder="blur"
        fill
        sizes={getImageSizes({ sm: '100vw' })}
        className="size-full object-cover"
      />
      <div className="md:l-10 z-10 ml-4 self-center justify-self-start bg-gradient-to-r from-brand p-6 text-white md:min-w-[44rem] md:p-10">
        <div className="flex h-full max-w-[32rem] flex-col gap-4">
          <h2 className="font-serif text-4xl md:text-6xl">
            Your office should reflect your ambitions.
          </h2>
          <p className="mb-20">
            Transform your workspace with our stylish, functional office furniture. Our collections
            elevate your home office, inspiring success and productivity every day.
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            <Button asChild variant="defaultLight">
              <Link href={`/${ROUTES.search}`}>View all products</Link>
            </Button>
            <Button asChild variant="outlineLight">
              <Link href={`/${ROUTES.categories}`}>View all categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturedProductSlide() {
  return (
    <div className="relative flex size-full flex-col-reverse md:flex-row">
      <div className="absolute inset-x-0 top-0 h-32 w-full self-start bg-gradient-to-b from-white/60"></div>
      <div className="z-10 flex items-center border-r bg-white md:h-full md:max-w-[30rem]">
        <div className="space-y-4 p-4 pb-10 md:space-y-6 md:pb-4">
          <h2 className="font-serif text-3xl md:text-5xl">Advanced Sit/stand desk</h2>
          <p>
            The flagship dual motor height adjustable desk from Lavoro. The Advance is a sturdy and
            stylish, Swedish design desk with the impressive height adjustability. Featuring a quiet
            European electronic system by LogicData®, adjusting height is seamless.
          </p>
          <Button asChild>
            <Link href={`/${ROUTES.products}/advance-sit-stand-desk-1200-x-700mm`}>
              Find out more
            </Link>
          </Button>
        </div>
      </div>
      <div className="ml-auto size-full">
        <Image
          src={advanceDeskHeroImage}
          alt="Corner desk infront of large window on a sunny day"
          placeholder="blur"
          sizes={getImageSizes({ sm: '100vw', md: '70vw' })}
          className="size-full object-cover"
        />
      </div>
    </div>
  );
}

function FourImageSlide() {
  return (
    <div className="relative grid size-full grid-cols-2 grid-rows-2">
      <div className="absolute inset-x-0 top-0 h-32 w-full self-start bg-gradient-to-b from-white/60"></div>
      <Image
        src={hampsteadParkDeskHeroImage}
        alt="Corner desk infront of large window on a sunny day"
        sizes={getImageSizes({ sm: '50vw' })}
        className="size-full object-cover shadow-border"
        placeholder="blur"
      />
      <Image
        src={cityCenterHeroImage}
        alt="Corner desk infront of large window on a sunny day"
        sizes={getImageSizes({ sm: '50vw' })}
        className="size-full object-cover shadow-border"
        placeholder="blur"
      />
      <Image
        src={hytheHelfBookcaseHeroImage}
        alt="Corner desk infront of large window on a sunny day"
        sizes={getImageSizes({ sm: '50vw' })}
        className="size-full object-cover shadow-border"
        placeholder="blur"
      />
      <Image
        src={cromoCornerHeroImage}
        alt="Corner desk infront of large window on a sunny day"
        sizes={getImageSizes({ sm: '50vw' })}
        className="size-full object-cover shadow-border"
        placeholder="blur"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-[calc(100%-32px)] space-y-2 bg-brand p-6 text-center text-white md:max-w-[40rem] md:space-y-4 md:p-10">
          <h2 className="font-serif text-3xl md:text-5xl">
            Create your dream
            <br />
            home office
          </h2>
          <p>
            Our product range can help tailor every part of your home office. With premium office
            desks, ergonomic chairs, stylish coffee tables, versatile shelving units and much more.
            Transform your office into a haven of productivity and elegance. Experience refined
            workspace living.
          </p>
          <div className="flex flex-col justify-center gap-2 md:flex-row">
            <Button asChild variant="defaultLight">
              <Link
                href={`/${ROUTES.search}?${getURIComponent(
                  'refinementList',
                  'collections',
                  'office-desks'
                )}`}
              >
                Find your perfect desk
              </Link>
            </Button>
            <Button asChild variant="outlineLight">
              <Link href={`/${ROUTES.categories}`}>Explore product categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
