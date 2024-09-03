'use client';

import clsx from 'clsx';
import Price from 'components/price';
import { Money, ProductOption, ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type ParamsMap = {
  [key: string]: string; // ie. { color: 'Red', size: 'Large', ... }
};

type OptimizedVariant = {
  id: string;
  availableForSale: boolean;
  params: URLSearchParams;
  price: Money;
  compareAtPrice: Money;
  [key: string]: string | boolean | URLSearchParams | Money; // ie. { color: 'Red', size: 'Large', ... }
};

type PriceSectionProps = {
  selectedVariant?: OptimizedVariant;
  fromPrice: ProductVariant;
  hasVariants: boolean;
};

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const router = useRouter();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);
  const fromPrice = variants.reduce((prev, curr) =>
    prev.price.amount < curr?.price.amount ? prev : curr
  );

  // Discard any unexpected options or values from url and create params map.
  const paramsMap: ParamsMap = Object.fromEntries(
    Array.from(currentParams.entries()).filter(([key, value]) =>
      options.find((option) => option.name.toLowerCase() === key && option.values.includes(value))
    )
  );

  // Optimize variants for easier lookups.
  const optimizedVariants: OptimizedVariant[] = variants.map((variant) => {
    const optimized: OptimizedVariant = {
      id: variant.id,
      availableForSale: variant.availableForSale,
      params: new URLSearchParams(),
      price: variant.price,
      compareAtPrice: variant.compareAtPrice
    };

    variant.selectedOptions.forEach((selectedOption) => {
      const name = selectedOption.name.toLowerCase();
      const value = selectedOption.value;

      optimized[name] = value;
      optimized.params.set(name, value);
    });

    return optimized;
  });

  // Find the first variant that is:
  //
  // 1. Available for sale
  // 2. Matches all options specified in the url (note that this
  //    could be a partial match if some options are missing from the url).
  //
  // If no match (full or partial) is found, use the first variant that is
  // available for sale.
  const selectedVariant: OptimizedVariant | undefined =
    optimizedVariants.find(
      (variant) =>
        variant.availableForSale &&
        Object.entries(paramsMap).every(([key, value]) => variant[key] === value)
    ) || optimizedVariants.find((variant) => variant.availableForSale);

  const selectedVariantParams = new URLSearchParams(selectedVariant?.params);
  const currentUrl = createUrl(pathname, currentParams);
  const selectedVariantUrl = createUrl(pathname, selectedVariantParams);

  useEffect(() => {
    if (currentUrl !== selectedVariantUrl) {
      router.replace(selectedVariantUrl);
    }
  }, []);

  if (hasNoOptionsOrJustOneOption) {
    return (
      <PriceSection
        selectedVariant={selectedVariant}
        fromPrice={fromPrice}
        hasVariants={!hasNoOptionsOrJustOneOption}
      />
    );
  }

  return (
    <>
      <PriceSection
        selectedVariant={selectedVariant}
        fromPrice={fromPrice}
        hasVariants={!hasNoOptionsOrJustOneOption}
      />
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <dl key={option.id}>
            <dt className="mb-2 text-sm uppercase">{option.name}</dt>
            <dd className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                // Base option params on selected variant params.
                const optionParams = new URLSearchParams(selectedVariantParams);
                // Update the params using the current option to reflect how the url would change.
                optionParams.set(option.name.toLowerCase(), value);

                const optionUrl = createUrl(pathname, optionParams);

                // The option is active if it is in the url params.
                const isActive = selectedVariantParams.get(option.name.toLowerCase()) === value;

                // The option is available for sale if it fully matches the variant in the option's url params.
                // It's super important to note that this is the options params, *not* the selected variant's params.
                // This is the "magic" that will cross check possible future variant combinations and preemptively
                // disable combinations that are not possible.
                const isAvailableForSale = optimizedVariants.find((a) =>
                  Array.from(optionParams.entries()).every(([key, value]) => a[key] === value)
                )?.availableForSale;

                const DynamicTag = isAvailableForSale ? Link : 'span';

                return (
                  <DynamicTag
                    key={value}
                    href={optionUrl}
                    scroll={isAvailableForSale ? false : undefined}
                    title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                    className={clsx('border px-2 py-1 text-xs', {
                      'cursor-pointer bg-brand text-white': isActive,
                      'cursor-not-allowed opacity-20': !isAvailableForSale
                    })}
                  >
                    {value}
                  </DynamicTag>
                );
              })}
            </dd>
          </dl>
        ))}
      </div>
    </>
  );
}

const PriceSection = ({ selectedVariant, fromPrice, hasVariants }: PriceSectionProps) => {
  const priceItem = selectedVariant || fromPrice;
  const compareAtPrice = priceItem.compareAtPrice;
  const showCompareAtPrice =
    compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(priceItem.price.amount);

  return (
    <div className="mb-4 flex flex-col gap-1">
      <div className="flex gap-2">
        <Price
          amount={priceItem.price.amount || '0'}
          currencyCode={priceItem.price.currencyCode || 'GBP'}
          className="leading-none"
        />
        {showCompareAtPrice ? (
          <Price
            amount={priceItem.compareAtPrice.amount || '0'}
            currencyCode={priceItem.compareAtPrice.currencyCode || 'GBP'}
            className="text-sm leading-none line-through opacity-80"
          />
        ) : null}
      </div>
    </div>
  );
};
