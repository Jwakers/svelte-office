'use client';

import clsx, { ClassValue } from 'clsx';
import { addItem } from 'components/cart/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import LoadingDots from 'components/loading-dots';
import { ProductVariant } from 'lib/shopify/types';

export function AddToCart({
  variants,
  availableForSale,
  className
}: {
  variants: ProductVariant[];
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
      disabled={isPending}
      onClick={() => {
        if (!availableForSale) return;
        startTransition(async () => {
          const error = await addItem(selectedVariantId);

          if (error) {
            alert(error);
            return;
          }

          router.refresh();
        });
      }}
      className={clsx(
        'flex w-full items-center justify-center border border-slate-900 bg-slate-900 p-4 text-sm uppercase text-white',
        {
          'cursor-not-allowed opacity-60': !availableForSale,
          'transition-colors hover:bg-white hover:text-slate-900': availableForSale,
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
