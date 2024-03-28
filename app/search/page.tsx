import Results from 'components/layout/search/results';
import SearchWrapper from 'components/layout/search/search-wrapper';
import { getAlgoliaIndex } from 'lib/algolia';

export const dynamic = 'force-dynamic';

const index = getAlgoliaIndex();

export const metadata = {
  title: 'Search',
  description: 'Search for products.'
};

export default async function SearchPage() {
  return (
    <SearchWrapper>
      <Results />
    </SearchWrapper>
  );
}
