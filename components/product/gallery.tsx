'use client';

import type { Swiper as TSwiper } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function Gallery({ images }: { images: { src: string; altText: string }[] }) {
  const [swiper, setSwiper] = useState<TSwiper | undefined>(undefined);
  const pagination = useRef(null);

  useEffect(() => {
    const handleResize = ({ matches }: { matches: MediaQueryListEvent['matches'] }) => {
      if (!matches) swiper?.disable();
      else if (swiper) swiper?.enable();
    };

    const media = matchMedia('(max-width: 767px)');
    media.addEventListener('change', handleResize);

    if (swiper && !swiper.destroyed && pagination.current) {
      swiper.pagination.el = pagination.current;
      handleResize(media);
    }
  }, [swiper, pagination]);

  return (
    <div>
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
          bulletClass: 'rounded w-2 h-2 block border border-black',
          bulletActiveClass: 'bg-black',
          el: pagination.current
        }}
        wrapperClass="md:!block"
        onSwiper={(swiper: TSwiper) => setSwiper(swiper)}
      >
        {images.map(({ src, altText }, i) => (
          <SwiperSlide key={`slide-${src}`} className="aspect-square">
            <Image
              src={src}
              width={750}
              height={750}
              alt={altText || ''}
              priority={i === 0}
              className="h-full w-full border-black object-cover md:border-b"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="flex gap-1 px-3 pt-4 md:hidden" ref={pagination}></div>
    </div>
  );
}
