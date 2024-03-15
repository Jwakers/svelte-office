import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import SearchMenu from 'components/layout/search/filter/menu';
import { sorting } from 'lib/constants';
import { Suspense } from 'react';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="relative grid md:grid-cols-[auto_200px]">
        <SearchMenu>
          <div className="flex flex-col gap-4">
            <FilterList list={sorting} title="Sort by" />
            <Collections />
          </div>
        </SearchMenu>
        <div>{children}</div>
        <div className="hidden md:block md:border-l md:border-brand">
          <div className="border-b border-brand p-4">
            <FilterList list={sorting} title="Sort by" />
          </div>
          <div className="p-4">
            <Collections />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
