import LoadingDots from 'components/loading-dots';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Search } from 'react-feather';
import {
  ClearRefinements,
  useCurrentRefinements,
  useInstantSearch,
  useSearchBox,
  useStats
} from 'react-instantsearch';
import CurrentRefinements from './filter/current-refinements';
import Sort from './sort';

export default function SearchBar() {
  const { query, refine } = useSearchBox();
  const { nbHits } = useStats();
  const { status } = useInstantSearch();
  const searchParams = useSearchParams();
  const [inputValue, setInputValue] = useState(query);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query'));
  const inputRef = useRef<HTMLInputElement>(null);
  const currentRefinements = useCurrentRefinements();

  useEffect(() => {
    const query = searchParams.get('query');
    if (!query) return;
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery === null) return;
    setQuery(searchQuery);
  }, [searchQuery]);

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
      <Sort />
    </div>
  );
}
