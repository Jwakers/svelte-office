import LoadingDots from 'components/loading-dots';
import { Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ClearRefinements,
  useCurrentRefinements,
  useInstantSearch,
  useSearchBox,
  useStats
} from 'react-instantsearch';
import CurrentRefinements from './filter/current-refinements';
import Sort from './sort';

function queryHook(query: string, search: (query: string) => void) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => search(query), timeout);
}

let timerId: undefined | NodeJS.Timeout = undefined;
let timeout = 500; // Query debounce in ms

export default function SearchBar() {
  const { query, refine } = useSearchBox({
    queryHook
  });
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

  const setQuery = useCallback(
    (newQuery: string) => {
      setInputValue(newQuery);

      refine(newQuery);
    },
    [refine]
  );

  const handleSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    inputRef.current?.blur();
  }, []);

  const handleReset = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setQuery('');
      inputRef.current?.focus();
    },
    [setQuery]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.currentTarget.value);
    },
    [setQuery]
  );

  return (
    <div className="m-3 flex flex-col flex-wrap gap-4 md:my-0 md:flex-row md:items-center">
      <form action="" role="search" noValidate onSubmit={handleSubmit} onReset={handleReset}>
        <div className="flex w-full md:w-auto">
          <input
            ref={inputRef}
            className="grow border border-r-0 p-2 md:text-xl"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            placeholder="Search for products"
            spellCheck={false}
            maxLength={512}
            type="search"
            value={inputValue}
            autoFocus
            onChange={handleInputChange}
            aria-label="Search for products"
          />
          <button type="submit" title="Submit" className="border px-3" aria-label="Submit search">
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
