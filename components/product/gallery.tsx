'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ProductVariant, Image as TImage } from 'lib/shopify/types';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import type { Swiper as TSwiper } from 'swiper';
import { Button } from '../ui/button';

export function Gallery({ images, variants }: { images: TImage[]; variants: ProductVariant[] }) {
  const [swiper, setSwiper] = useState<TSwiper | undefined>(undefined);
  const params = useSearchParams();

  const handleSlideTo = useCallback(() => {
    const variant = variants.find((variant: ProductVariant) =>
      variant.selectedOptions.every(
        (option) => option.value === params.get(option.name.toLowerCase())
      )
    );

    if (!swiper || !variant) return;
    const imageIndex = images.findIndex((image) => image.url === variant.image.url);

    if (imageIndex === -1) return;
    swiper.slideTo(imageIndex, 0);
  }, [variants, params, images, swiper]);

  useEffect(() => {
    handleSlideTo();
  }, [params, handleSlideTo]);

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
          type: images.length < 12 ? 'bullets' : 'fraction',
          el: '.pagination'
        }}
        onInit={(instance) => setSwiper(instance)}
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
      <div className="flex items-center justify-between gap-2 border-t px-4 py-4 md:items-start">
        <div className="pagination flex gap-1" />
        <div className="hidden gap-1 md:flex">
          <Button size="icon" variant="outline" title="Previous slide" className="prev">
            <ArrowLeft className="w-4" />
          </Button>
          <Button size="icon" variant="outline" title="Next slide" className="next">
            <ArrowRight className="w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
