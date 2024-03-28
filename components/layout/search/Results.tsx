'use client';

import Price from 'components/price';
import { Record } from 'lib/algolia/types';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'react-feather';

// TODO
// Mobile main menu
// Add algolia logo to search page

import { useIsBreakpoint } from 'lib/hooks';
import { Configure, Hits, InfiniteHits, useStats } from 'react-instantsearch';
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
      href={`/products/${hit.handle}`}
      className="group flex h-full flex-col outline outline-1 outline-black"
    >
      <Image
        src={hit.image.url}
        width={640}
        height={320}
        alt={hit.image.altText}
        className="aspect-square w-full object-cover"
      />
      <div className="flex h-full flex-col border-t border-brand bg-white p-3">
        <h2 className="font-serif text-lg uppercase md:text-xl">{hit.title}</h2>
        {hasVariants && <span className="text-sm text-slate-700">Multiple options</span>}
        <div className="mt-auto flex justify-between">
          <div>
            {hasVariants && <span>from &nbsp;</span>}
            <Price amount={String(hit.min_price)} currencyCode={hit.currency_code} />
          </div>
          <ArrowRight className="transition-all md:-translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100" />
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
      <div className="relative grid md:grid-cols-[14rem_1fr]">
        <Configure hitsPerPage={12} />
        <SearchMenu>
          {!isMd && (
            <>
              <SearchBar />
              <Filters />
            </>
          )}
        </SearchMenu>
        {isMd && <Filters className="hidden md:block" />}
        <div>
          {isMd && <SearchBar />}
          <div className="grid grid-cols-[auto_1fr]">
            {isMd ? (
              <Hits
                hitComponent={Result}
                classNames={{ list: 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }}
              />
            ) : (
              <InfiniteHits
                hitComponent={Result}
                classNames={{
                  root: 'flex flex-col items-center',
                  list: 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                  loadMore: 'button my-4',
                  loadPrevious: 'button my-4',
                  disabledLoadPrevious: 'hidden',
                  disabledLoadMore: 'hidden'
                }}
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            {nbPages > 1 && isMd && <Pagination />}
            <div className="mx-auto flex flex-col items-center gap-2 p-3 md:ml-auto md:mr-0 md:items-end">
              <span className="text-sm text-secondary">Search powered by</span>
              <Image src="/algolia-logo.svg" alt="Algolia logo" width={100} height={22} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
