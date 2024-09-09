'use client';

import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { ProductOption, ProductVariant, Image as TImage } from 'lib/shopify/types';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'react-feather';
import type { Swiper as TSwiper } from 'swiper';

type ParamsMap = Record<string, string>;

type OptimizedVariant = {
  id: string;
  image: ProductVariant['image'];
  [key: string]: string | ProductVariant['image'];
};

export function Gallery({
  images,
  variants,
  options
}: {
  images: TImage[];
  variants: ProductVariant[];
  options: ProductOption[];
}) {
  const [swiper, setSwiper] = useState<TSwiper | undefined>(undefined);
  const params = useSearchParams();

  // Discard any unexpected options or values from url and create params map.
  const paramsMap: ParamsMap = Object.fromEntries(
    Array.from(params.entries()).filter(([key, value]) =>
      options.find((option) => option.name.toLowerCase() === key && option.values.includes(value))
    )
  );

  const optimizedVariants: OptimizedVariant[] = variants.map((variant) => {
    const optimized: OptimizedVariant = {
      id: variant.id,
      image: variant.image
    };

    variant.selectedOptions.forEach((selectedOption) => {
      const name = selectedOption.name.toLowerCase();
      const value = selectedOption.value;

      optimized[name] = value;
    });

    return optimized;
  });

  const selectedVariant = optimizedVariants.find((variant) => {
    return Object.entries(paramsMap).every(([key, value]) => {
      return variant[key] === value;
    });
  });

  useEffect(() => {
    if (!swiper || !selectedVariant) return;
    const imageIndex = images.findIndex((image) => image.url === selectedVariant.image.url);

    if (imageIndex === -1) return;
    swiper.slideTo(imageIndex, 0);
  }, [params]);

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
