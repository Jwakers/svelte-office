'use client';

import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings';
import { getAlgoliaClient } from 'lib/algolia';
import { Record } from 'lib/algolia/types';
import { ALGOLIA } from 'lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronDown, Search } from 'react-feather';

// TODO
// Refactor code, move to sepearte files
// Loading skeleton
// Add algolia logo to search page

import clsx, { ClassValue } from 'clsx';
import { useIsBreakpoint } from 'lib/hooks';
import {
  ClearRefinements,
  Configure,
  Hits,
  InfiniteHits,
  InstantSearch,
  Pagination,
  SortBy,
  useCurrentRefinements,
  useInstantSearch,
  useSearchBox,
  useStats
} from 'react-instantsearch';
import CurrentRefinements from './filter/current-refinements';
import SearchMenu from './filter/menu';
import RangeInput from './filter/range-input';
import RefinementList from './filter/refinement-list';

const client = getAlgoliaClient();

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

function SearchBar() {
  const { query, refine } = useSearchBox();
  const { nbHits } = useStats();
  const { status } = useInstantSearch();
  const [inputValue, setInputValue] = useState(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const currentRefinements = useCurrentRefinements();

  useEffect(() => {
    const query = searchParams.get('query');
    if (!query) return;

    refine(query);
  }, [searchParams]);

  const isSearchStalled = status === 'stalled';

  function setQuery(newQuery: string) {
    setInputValue(newQuery);

    refine(newQuery);
  }

  return (
    <div className="m-3 flex flex-col gap-4 md:flex-row md:items-center">
      <form
        action=""
        role="search"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();

          if (inputRef.current) {
            inputRef.current.blur();
          }
        }}
        onReset={(event) => {
          event.preventDefault();
          event.stopPropagation();

          setQuery('');

          if (inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <div className="flex w-full md:w-auto">
          <input
            ref={inputRef}
            className="grow border border-r-0 border-brand p-2 md:text-xl"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Search for products"
            spellCheck={false}
            maxLength={512}
            type="search"
            value={inputValue}
            autoFocus
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
          />
          <button type="submit" title="Submit" className="border border-brand px-3">
            {isSearchStalled ? <LoadingDots /> : <Search strokeWidth={1} />}
          </button>
        </div>
      </form>
      <div>
        {nbHits ? <span>{nbHits} Results</span> : null}
        {query ? (
          <span>
            {' '}
            for <em>{query}</em>
          </span>
        ) : null}
      </div>
      <CurrentRefinements />
      {currentRefinements.canRefine ? (
        <ClearRefinements
          classNames={{
            button: 'underline cursor-pointer text-xs'
          }}
          translations={{
            resetButtonText: 'Clear filters'
          }}
        />
      ) : null}
      <div className="relative ml-auto flex items-center gap-2">
        <div>Sort by</div>
        <SortBy
          classNames={{
            select: 'border border-brand p-2 pr-10 appearance-none'
          }}
          items={[
            { label: 'Default', value: ALGOLIA.index.products },
            { label: 'Price (asc)', value: ALGOLIA.index.productsPriceAsc },
            { label: 'Price (desc)', value: ALGOLIA.index.productsPriceDec }
          ]}
        />
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
          size={20}
        />
      </div>
    </div>
  );
}

function Filtering({ className }: { className?: ClassValue }) {
  return (
    <div className={clsx('p-3 md:block md:border-r md:border-brand', className)}>
      <div>
        <h2 className="mb-2 font-serif text-xl">Filtering</h2>
        <div className="space-y-5">
          <RefinementList attribute="collections" label="By category" />
          <RefinementList attribute="desk_type" label="By desk type" />
          <RangeInput attribute="width" label="By width" />
          <RangeInput attribute="height" label="By height" />
          <RangeInput attribute="min_price" label="By price" />
        </div>
      </div>
    </div>
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
          <SearchBar />
          <Filtering />
        </SearchMenu>
        <Filtering className="hidden md:block" />
        <div>
          <SearchBar />
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
          {nbPages > 1 && isMd && (
            <Pagination
              classNames={{
                root: 'p-3',
                list: 'flex gap-2 items-center',
                pageItem: 'text-lg p-2',
                selectedItem: 'underline',
                firstPageItem: '[&>a]:button cursor-pointer',
                lastPageItem: '[&>a]:button cursor-pointer',
                previousPageItem: '[&>a]:button cursor-pointer',
                nextPageItem: '[&>a]:button cursor-pointer'
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export function ResultsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <InstantSearch
      indexName={ALGOLIA.index.products}
      searchClient={client}
      future={{
        preserveSharedStateOnUnmount: true
      }}
      routing={{
        stateMapping: singleIndex(ALGOLIA.index.products)
      }}
    >
      {children}
    </InstantSearch>
  );
}
