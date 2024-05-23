'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Image as TImage } from 'lib/shopify/types';
import { getImageSizes } from 'lib/utils';
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
                priority={i === 0}
                sizes={getImageSizes({ sm: '100vw' })}
                className="h-full w-full object-cover"
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
            priority={i === 0}
            sizes={getImageSizes({ sm: '50vw' })}
            className="w-full border-b border-brand object-cover"
          />
        ))}
      </div>
    </>
  );
}
