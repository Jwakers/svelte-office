'use client';

import clsx from 'clsx';
import Price from 'components/price';
import { Record } from 'lib/algolia/types';
import { ROUTES } from 'lib/constants';
import { useIsBreakpoint } from 'lib/hooks';
import { getImageSizes } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import algoliaLogo from 'public/algolia-logo.svg';
import { ArrowRight } from 'react-feather';
import { Hits, InfiniteHits, useStats } from 'react-instantsearch';
import Filters from './filter/filters';
import SearchMenu from './filter/menu';
import Pagination from './pagination';
import SearchBar from './search-bar';

type ResultProps = {
  hit: Record;
};

function Result({ hit }: ResultProps) {
  const hasVariants = hit.options.length > 1;

  return (
    <Link
      href={`/${ROUTES.products}/${hit.handle}`}
      className="group flex h-full flex-col outline outline-1 outline-black"
    >
      <Image
        src={hit.image.url}
        width={hit.image.width}
        height={hit.image.height}
        alt={hit.image.altText}
        sizes={getImageSizes({ sm: '100vw', md: '50vw', lg: '33vw', xl: '25vw' })}
        className="aspect-square w-full object-cover"
      />
      <div className="flex h-full flex-col border-t border-brand bg-white p-3">
        <h2 className="font-serif text-lg uppercase md:text-xl">{hit.title}</h2>
        {hasVariants && <span className="text-sm text-secondary">Multiple options</span>}
        <div className="mt-auto flex justify-between">
          <div>
            {hasVariants && <span>from &nbsp;</span>}
            <Price amount={String(Math.min(...hit.price))} currencyCode={hit.currency_code} />
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

export default function Results() {
  const isMd = useIsBreakpoint('md');
  const { nbPages } = useStats();

  return (
    <>
      <div className="relative grid animate-fadeIn md:grid-cols-[14rem_1fr]">
        {!isMd && (
          <SearchMenu>
            <SearchBar />
            <Filters />
          </SearchMenu>
        )}
        <div className="md:border-r md:border-brand">
          {isMd && <Filters className="min-w-[1px]" />}
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
                loadMore: 'button my-4',
                loadPrevious: 'button my-4',
                disabledLoadPrevious: 'hidden',
                disabledLoadMore: 'hidden'
              }}
            />
          )}
          <div className="flex items-center justify-between">
            {
              <div className={clsx((nbPages <= 1 || !isMd) && 'hidden')}>
                <Pagination />
              </div>
            }
            <div className="mx-auto flex flex-col items-center gap-2 p-3 md:ml-auto md:mr-0 md:items-end">
              <span className="text-sm text-secondary">Search powered by</span>
              <Image src={algoliaLogo} alt="Algolia logo" className="max-w-[6rem]" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
