'use client';

import { sendGTMEvent } from '@next/third-parties/google';
import { addItem } from 'components/cart/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

import { cn } from '@/lib/utils';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { Product, ProductVariant } from 'lib/shopify/types';
import { Button } from '../ui/button';

export function AddToCart({
  variants,
  product,
  availableForSale
}: {
  variants: ProductVariant[];
  product: Product;
  availableForSale: boolean;
}) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
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
      setSelectedVariant(variant);
    }
  }, [searchParams, variants, setSelectedVariant]);

  return (
    <Button
      aria-label="Add item to cart"
      disabled={isPending || !availableForSale}
      onClick={() => {
        if (!availableForSale || isPending) return;
        startTransition(async () => {
          const error = await addItem(selectedVariant?.id);

          if (error) {
            alert(error);
            return;
          }

          sendGTMEvent({
            event: 'conversion_event_add_to_cart',
            product_name: product.title,
            variant_title: selectedVariant?.title
          });

          router.refresh();
        });
      }}
      className={cn(availableForSale && 'sticky bottom-14 md:bottom-4')}
      size="lg"
    >
      <span>
        {availableForSale ? (
          <div className="flex items-center gap-2">
            <span className="uppercase">Add To Cart</span>
            <span>-</span>
            <Price
              amount={selectedVariant?.price.amount || '0'}
              currencyCode={selectedVariant?.price.currencyCode || 'GBP'}
              className="leading-none"
            />
          </div>
        ) : (
          'Out Of Stock'
        )}
      </span>
      {isPending ? <LoadingDots /> : null}
    </Button>
  );
}
