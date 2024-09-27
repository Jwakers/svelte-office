'use client';

import clsx from 'clsx';
import ImageModal from 'components/image-modal';
import Price from 'components/price';
import { Money, ProductOption, ProductOptionValue, ProductVariant } from 'lib/shopify/types';
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
  [key: string]: ProductOptionValue | string | boolean | URLSearchParams | Money | undefined;
};

type PriceSectionProps = {
  selectedVariant?: OptimizedVariant;
  fromPrice: ProductVariant;
};

type OptionSwatchesProps = {
  options: ProductOption[];
  selectedVariant?: OptimizedVariant;
};

type VariantSelectorProps = {
  options: ProductOption[];
  variants: ProductVariant[];
};

export function VariantSelector({ options, variants }: VariantSelectorProps) {
  const pathname = usePathname();
  const currentParams = useSearchParams();
  const router = useRouter();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.optionValues.length === 1);
  const fromPrice = variants.reduce((prev, curr) =>
    prev.price.amount < curr?.price.amount ? prev : curr
  );

  // Discard any unexpected options or values from url and create params map.
  const paramsMap: ParamsMap = Object.fromEntries(
    Array.from(currentParams.entries()).filter(([key, value]) =>
      options.find(
        (option) =>
          option.name.toLowerCase() === key && option.optionValues.some((op) => op.name === value)
      )
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
      const optionValue = options
        .find((o) => o.name === selectedOption.name)
        ?.optionValues.find((o) => o.name === selectedOption.value);

      optimized[name] = optionValue;
      optimized.params.set(name, optionValue?.name ?? '');
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
        Object.entries(paramsMap).every(
          ([key, value]) => (variant[key] as ProductOptionValue)?.name === value
        )
    ) || optimizedVariants.find((variant) => variant.availableForSale);

  const selectedVariantParams = new URLSearchParams(selectedVariant?.params);
  const currentUrl = createUrl(pathname, currentParams);
  const selectedVariantUrl = createUrl(pathname, selectedVariantParams);

  useEffect(() => {
    if (currentUrl !== selectedVariantUrl) {
      router.replace(selectedVariantUrl);
    }
  }, [currentUrl, selectedVariantUrl, router]);

  if (hasNoOptionsOrJustOneOption) {
    return <PriceSection selectedVariant={selectedVariant} fromPrice={fromPrice} />;
  }

  return (
    <>
      <PriceSection selectedVariant={selectedVariant} fromPrice={fromPrice} />
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <dl key={option.id}>
            <dt className="mb-2 text-sm uppercase">{option.name}</dt>
            <dd className="flex flex-wrap gap-2">
              {option.optionValues.map((value) => {
                // Base option params on selected variant params.
                const optionParams = new URLSearchParams(selectedVariantParams);
                // Update the params using the current option to reflect how the url would change.
                optionParams.set(option.name.toLowerCase(), value.name);

                const optionUrl = createUrl(pathname, optionParams);

                // The option is active if it is in the url params.
                const isActive =
                  selectedVariantParams.get(option.name.toLowerCase()) === value.name;

                // The option is available for sale if it fully matches the variant in the option's url params.
                // It's super important to note that this is the options params, *not* the selected variant's params.
                // This is the "magic" that will cross check possible future variant combinations and preemptively
                // disable combinations that are not possible.
                const isAvailableForSale = optimizedVariants.find((a) =>
                  Array.from(optionParams.entries()).every(
                    ([key, value]) => (a[key] as ProductOptionValue)?.name === value
                  )
                )?.availableForSale;

                const DynamicTag = isAvailableForSale ? Link : 'span';
                const [name] = value.name.split(' ('); // Remove any categorisation e.g. white (frame)

                return (
                  <DynamicTag
                    key={value.name}
                    href={optionUrl}
                    scroll={isAvailableForSale ? false : undefined}
                    title={`${option.name} ${name}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                    className={clsx('flex border text-xs', {
                      'cursor-pointer bg-brand text-white': isActive,
                      'cursor-not-allowed opacity-20': !isAvailableForSale
                    })}
                  >
                    {value.swatch?.color ? (
                      <div
                        className="aspect-square w-4 border-r"
                        style={{ backgroundColor: value.swatch?.color ?? undefined }}
                      />
                    ) : null}
                    <span className="px-2 py-1">{name}</span>
                  </DynamicTag>
                );
              })}
            </dd>
          </dl>
        ))}
      </div>
      <OptionSwatches options={options} selectedVariant={selectedVariant} />
    </>
  );
}

const PriceSection = ({ selectedVariant, fromPrice }: PriceSectionProps) => {
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

function OptionSwatches({ options, selectedVariant }: OptionSwatchesProps) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {options
        ? options.map((option) => {
            const value = selectedVariant?.[option.name.toLowerCase()] as ProductOptionValue;
            const image = value?.swatch?.image?.previewImage;

            if (!image) return null;

            return (
              <div key={option.id}>
                <h4 className="mb-2 text-sm font-semibold">{option.name.replace(' colour', '')}</h4>
                <ImageModal className="w-full" img={image} />
              </div>
            );
          })
        : null}
    </div>
  );
}
