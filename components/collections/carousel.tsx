'use client';

import type { Swiper as TSwiper } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

export default function Carousel({ images }: { images: { src: string; altText: string }[] }) {
  const [swiper, setSwiper] = useState<TSwiper | undefined>(undefined);
  const previous = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);

  const buttonClass = `flex h-12 w-12 items-center justify-center bg-white disabled:opacity-40`;

  return (
    <div className="group relative animate-fadeIn border-r border-brand">
      <Swiper
        modules={[Pagination, Navigation]}
        navigation={{
          prevEl: previous.current,
          nextEl: next.current
        }}
        onSwiper={(swiper: TSwiper) => setSwiper(swiper)}
      >
        {images.map(({ src, altText }, i) => (
          <SwiperSlide key={`slide-${src}`} className="aspect-square md:aspect-auto">
            <Image
              src={src}
              height={320}
              width={320}
              alt={altText}
              className="aspect-square w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 ? (
        <div className="absolute bottom-0 right-0 z-10 flex content-end justify-between border border-b-0 border-r-0 border-brand transition-opacity md:opacity-0 md:group-hover:opacity-100">
          <button ref={previous} className={buttonClass} type="button" title="Previous">
            <ChevronLeft />
          </button>
          <button ref={next} className={buttonClass} type="button" title="Next">
            <ChevronRight />
          </button>
        </div>
      ) : null}
    </div>
  );
}
