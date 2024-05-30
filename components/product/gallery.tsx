'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Image as TImage } from 'lib/shopify/types';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';

export function Gallery({ images }: { images: TImage[] }) {
  const paginationRef = useRef(null);
  const nextRef = useRef(null);
  const prevRef = useRef(null);

  return (
    <div className="sticky top-0">
      <Swiper
        modules={[Pagination, Navigation]}
        autoHeight
        navigation={{
          nextEl: '.next',
          prevEl: '.prev'
        }}
        pagination={{
          clickable: true,
          bulletClass: 'rounded w-2 h-2 block border border-brand',
          bulletActiveClass: 'bg-brand',
          type: 'bullets',
          el: '.pagination'
        }}
      >
        {images.map(({ url, width, height, altText }, i) => (
          <SwiperSlide key={`slide-${url}`}>
            <Image
              src={url}
              width={width}
              height={height}
              alt={altText || ''}
              priority={i === 0}
              sizes={getImageSizes({ sm: '100vw', md: '50vw' })}
              className="h-full w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex items-center justify-between gap-2 border-t border-brand px-4 py-4 md:items-start">
        <div className="pagination flex gap-1" />
        <div className="hidden gap-1 md:flex">
          <button
            type="button"
            title="Previous slide"
            className="prev border border-brand p-2 disabled:opacity-20"
          >
            <ArrowLeft />
          </button>
          <button
            type="button"
            title="Next slide"
            className="next border border-brand p-2 disabled:opacity-20"
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
