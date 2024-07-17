'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import clsx, { ClassValue } from 'clsx';
import { addItem } from 'components/cart/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import LoadingDots from 'components/loading-dots';
import { Product, ProductVariant } from 'lib/shopify/types';

export function AddToCart({
  variants,
  product,
  availableForSale,
  className
}: {
  variants: ProductVariant[];
  product: Product;
  availableForSale: boolean;
  className: ClassValue;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const variant = variants.find((variant: ProductVariant) =>
      variant.selectedOptions.every(
        (option) => option.value === searchParams.get(option.name.toLowerCase())
      )
    );

    if (variant) {
      setSelectedVariantId(variant.id);
    }
  }, [searchParams, variants, setSelectedVariantId]);

  return (
    <button
      aria-label="Add item to cart"
      disabled={isPending || !availableForSale}
      onClick={() => {
        if (!availableForSale) return;
        startTransition(async () => {
          const error = await addItem(selectedVariantId);

          if (error) {
            alert(error);
            return;
          }

          sendGTMEvent({
            event: 'conversion_event_add_to_cart',
            product_name: product.title,
            variant_title: product.variants.find((v) => v.id === selectedVariantId)?.title
          });

          router.refresh();
        });
      }}
      className={clsx(
        'flex w-full items-center justify-center border border-primary bg-primary p-4 text-sm uppercase text-white hover:text-primary',
        {
          'cursor-not-allowed opacity-60 hover:text-white': !availableForSale,
          'transition-colors hover:bg-white hover:text-brand': availableForSale,
          'cursor-not-allowed': isPending
        },
        className
      )}
    >
      <span>{availableForSale ? 'Add To Cart' : 'Out Of Stock'}</span>
      {isPending ? <LoadingDots /> : null}
    </button>
  );
}
