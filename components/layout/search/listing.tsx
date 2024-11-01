'use client';

import clsx from 'clsx';
import Price from 'components/price';
import { Record } from 'lib/algolia/types';
import { CONTAIN_IMAGE_BRANDS, CONTAIN_IMAGE_COLLECTIONS, ROUTES } from 'lib/constants';
import { useIsBreakpoint } from 'lib/hooks';
import { ShopifyVendors } from 'lib/shopify/types';
import { getImageSizes } from 'lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import algoliaLogo from 'public/algolia-logo.svg';
import { useState } from 'react';
import { Configure, ConfigureProps, Hits, InfiniteHits } from 'react-instantsearch';
import Filters from './filter/filters';
import SearchMenu from './filter/menu';
import StockSwitch from './filter/stock-switch';
import Pagination from './pagination';
import SearchBar from './search-bar';
import SearchWrapper from './search-wrapper';

type ResultProps = {
  hit: Record;
};

function shouldUseContainedImage(hit: Record) {
  return (
    CONTAIN_IMAGE_BRANDS.includes(hit.brand as ShopifyVendors) &&
    CONTAIN_IMAGE_COLLECTIONS.some((collection) => hit.collections?.includes(collection))
  );
}

function Result({ hit }: ResultProps) {
  const hasVariants = hit.options.length > 1;
  const minPrice = Math.min(...hit.price);
  const minComparePrice = hit.compareAtPrice.length ? Math.min(...hit.compareAtPrice) : null;
  const showComparePrice = minComparePrice && minPrice < minComparePrice;
  // Special styling for certain brands and collections that require contained images
  const containImage = shouldUseContainedImage(hit);

  return (
    <Link
      href={`/${ROUTES.products}/${hit.handle}`}
      className="group relative flex h-full flex-col shadow-border"
    >
      {showComparePrice ? (
        <span className="absolute right-2 top-2 block bg-brand p-1 text-xs text-white">
          Discount
        </span>
      ) : null}
      <Image
        src={hit.image.url}
        width={hit.image.width}
        height={hit.image.height}
        alt={hit.image.altText}
        sizes={getImageSizes({ sm: '100vw', md: '50vw', lg: '33vw', xl: '25vw' })}
        className={clsx(
          'aspect-square w-full bg-white',
          containImage ? 'object-contain py-4' : 'object-cover'
        )}
      />
      <div className="flex h-full flex-col border-t bg-white p-3">
        <h2 className="font-serif text-lg uppercase md:text-xl">{hit.title}</h2>
        {hasVariants && <span className="text-sm text-secondary">Multiple options</span>}
        <div className="mt-auto flex justify-between">
          <div className="flex items-end">
            {hasVariants && <span>from &nbsp;</span>}
            <div className="flex flex-col">
              {showComparePrice ? (
                <Price
                  amount={String(minComparePrice)}
                  currencyCode={hit.currencyCode}
                  className="text-sm line-through opacity-80"
                />
              ) : null}
              <Price amount={String(minPrice)} currencyCode={hit.currencyCode} />
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100">
            <span className="font-medium">View product</span>
            <ArrowRight />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Listing() {
  const isMd = useIsBreakpoint('md');
  const [config, setConfig] = useState<ConfigureProps>({
    // @ts-ignore: Incorrect types in algolia package
    optionalFilters: 'collections:office-desks'
  });

  return (
    <SearchWrapper>
      <Configure {...config} />
      <div className="relative grid animate-fadeIn md:grid-cols-[14rem_1fr]">
        {!isMd && (
          <SearchMenu>
            <SearchBar />
            <Filters>
              <StockSwitch setConfig={setConfig} />
            </Filters>
          </SearchMenu>
        )}
        <div className="md:border-r md:border-brand">
          <Filters className="mt-8 min-w-[1px] max-md:hidden">
            <StockSwitch setConfig={setConfig} />
          </Filters>
        </div>
        <div>
          <div className="my-3 hidden min-h-[46px] md:block">{isMd && <SearchBar />}</div>
          {isMd ? (
            <Hits
              hitComponent={Result}
              classNames={{ list: 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }}
            />
          ) : (
            <InfiniteHits
              hitComponent={Result}
              classNames={{
                root: 'flex flex-col items-center w-screen',
                list: 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full',
                loadMore: 'my-4',
                loadPrevious: 'my-4',
                disabledLoadPrevious: 'hidden',
                disabledLoadMore: 'hidden'
              }}
            />
          )}
          <div className="flex items-center justify-between">
            <Pagination />

            <div className="mx-auto flex flex-col items-center gap-2 p-3 md:ml-auto md:mr-0 md:items-end">
              <span className="text-sm text-secondary">Search powered by</span>
              <Image src={algoliaLogo} alt="Algolia logo" className="max-w-[6rem]" />
            </div>
          </div>
        </div>
      </div>
    </SearchWrapper>
  );
}
