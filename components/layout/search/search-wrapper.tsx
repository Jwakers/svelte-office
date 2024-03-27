'use client';

import { singleIndex } from 'instantsearch.js/es/lib/stateMappings';
import { getAlgoliaClient } from 'lib/algolia';
import { ALGOLIA } from 'lib/constants';
import { InstantSearch } from 'react-instantsearch';

const client = getAlgoliaClient();

export default function SearchWrapper({ children }: { children: React.ReactNode }) {
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
