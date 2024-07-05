import Results from 'components/layout/search/results';
import SearchWrapper from 'components/layout/search/search-wrapper';
import { getAlgoliaIndex } from 'lib/algolia';

export const dynamic = 'force-dynamic';

const index = getAlgoliaIndex();

export const metadata = {
  title: 'Search Results',
  description:
    'Explore search results at Svelte Office. Find the perfect office furniture to enhance your home workspace, including ergonomic chairs, stylish desks, and more.'
};

export default async function SearchPage() {
  return (
    <SearchWrapper>
      <Results />
    </SearchWrapper>
  );
}
