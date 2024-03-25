'use client';

import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { singleIndex } from 'instantsearch.js/es/lib/stateMappings';
import { getAlgoliaClient, parseHyphen, transformLabels } from 'lib/algolia';
import { Record } from 'lib/algolia/types';
import { ALGOLIA } from 'lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search } from 'react-feather';

// TODO
// Style price range
// currentRefinements to display titles correctly
// InfinitHits on mobile pagination on desktop
// Mobile filters
// Refactor code, move to sepearte files

import {
  ClearRefinements,
  CurrentRefinements,
  Hits,
  InstantSearch,
  Pagination,
  RangeInput,
  RefinementList,
  useCurrentRefinements,
  useInstantSearch,
  useSearchBox,
  useStats
} from 'react-instantsearch';

const client = getAlgoliaClient();

function Result({ hit }: { hit: Record }) {
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
      <CurrentRefinements
        classNames={{
          list: 'flex flex-col gap-2',
          label: 'text-secondary text-xs hidden md:block',
          item: 'flex gap-1 items-center',
          category: 'rounded-full text-xs bg-primary text-white px-2 py-1 flex gap-1'
        }}
        // transformItems={(items) => items.map((item) => ({ ...item, label: item.label }))} // CAUSES CRASH
      />

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
    </div>
  );
}

export default function Results() {
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
      <div className="relative grid md:grid-cols-[auto_200px]">
        <div>
          <SearchBar />
          <div className="grid grid-cols-[auto_1fr]">
            <Hits
              hitComponent={Result}
              classNames={{ list: 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }}
            />
          </div>
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
        </div>
        <div className="hidden p-3 md:block md:border-l md:border-brand">
          <div>
            <h2 className="font-serif text-lg">Filtering</h2>
            <div className="mb-2 text-lg">By category</div>
            <RefinementList
              attribute="collections"
              transformItems={(items) =>
                items.map((item) => ({
                  ...item,
                  label: parseHyphen(item.label)
                }))
              }
              classNames={{
                list: 'space-y-1',
                label: 'flex items-center gap-2',
                labelText: 'capitalize',
                count: 'border-brand/60 border-b text-xs text-brand/60'
              }}
            />
            <div className="mb-2 text-lg">By desk type</div>
            <RefinementList
              attribute="desk_type"
              transformItems={transformLabels}
              classNames={{
                list: 'space-y-1',
                label: 'flex items-center gap-2',
                labelText: 'capitalize',
                count: 'border-brand/60 border-b text-xs text-brand/60'
              }}
            />
            <div className="mb-2 text-lg">By width</div>
            <RefinementList
              attribute="width"
              limit={5}
              showMore
              transformItems={(items) =>
                items
                  .map((item) => ({ ...item, label: `${item.label}mm` }))
                  .sort((a, b) => {
                    if (parseInt(a.value) > parseInt(b.value)) return 1;
                    else if (parseInt(a.value) < parseInt(b.value)) return -1;
                    return 0;
                  })
              }
              classNames={{
                list: 'space-y-1',
                label: 'flex items-center gap-2',
                count: 'border-brand/60 border-b text-xs text-brand/60',
                showMore: 'button'
              }}
            />
            <div className="mb-2 text-lg">By price</div>
            <RangeInput attribute="min_price" />
          </div>
        </div>
      </div>
    </InstantSearch>
  );
}
