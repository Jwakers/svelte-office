import { ALGOLIA } from 'lib/constants';
import { ChevronDown } from 'react-feather';
import { SortBy } from 'react-instantsearch';

export default function Sort() {
  return (
    <div className="relative ml-auto flex items-center gap-2">
      <div>Sort by</div>
      <SortBy
        classNames={{
          select: 'border border-brand p-2 pr-10 appearance-none'
        }}
        items={[
          { label: 'Default', value: ALGOLIA.index.products },
          { label: 'Price - Low to high', value: ALGOLIA.index.productsPriceAsc },
          { label: 'Price - High to low', value: ALGOLIA.index.productsPriceDec }
        ]}
      />
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
        size={20}
      />
    </div>
  );
}
