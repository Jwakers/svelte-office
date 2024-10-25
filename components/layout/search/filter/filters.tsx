import clsx, { ClassValue } from 'clsx';
import { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import RangeInput from './range-input';
import RefinementList from './refinement-list';

function transformItems(items: RefinementListItem[]) {
  return items.map((item) => ({ ...item, label: item.label.split('-').join(' ') }));
}

export default function Filters({
  className,
  children
}: React.PropsWithChildren<{ className?: ClassValue }>) {
  return (
    <div className={clsx('p-3', className)}>
      <div>
        <h2 className="mb-2 font-serif text-xl">Filtering</h2>
        <div className="space-y-5">
          <RefinementList
            attribute="collections"
            label="By category"
            transformItems={transformItems}
          />
          <RefinementList attribute="desk_type" label="By desk type" />
          <RangeInput attribute="width" label="By width" />
          <RangeInput attribute="height" label="By height" />
          <RangeInput attribute="price" label="By price" />
          {children}
        </div>
      </div>
    </div>
  );
}
