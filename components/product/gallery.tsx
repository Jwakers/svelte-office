'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Image as TImage } from 'lib/shopify/types';
import Image from 'next/image';
import { useRef } from 'react';

export function Gallery({ images }: { images: TImage[] }) {
  const pagination = useRef(null);

  return (
    <>
      <div className="md:hidden">
        <Swiper
          modules={[Pagination]}
          autoHeight
          pagination={{
            clickable: true,
            bulletClass: 'rounded w-2 h-2 block border border-brand',
            bulletActiveClass: 'bg-brand',
            el: pagination.current
          }}
        >
          {images.map(({ url, width, height, altText }, i) => (
            <SwiperSlide key={`slide-${url}`}>
              <Image
                src={url}
                width={width}
                height={height}
                alt={altText || ''}
                priority={i < 2}
                layout="responsive"
                className="h-full w-full animate-fadeIn object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex gap-1 px-3 pt-4" ref={pagination}></div>
      </div>
      <div className="hidden md:block">
        {images.map(({ url, width, height, altText }, i) => (
          <Image
            src={url}
            width={width}
            height={height}
            alt={altText || ''}
            priority={i < 2}
            layout="responsive"
            className="h-full w-full animate-fadeIn border-b border-brand object-cover"
          />
        ))}
      </div>
    </>
  );
}
