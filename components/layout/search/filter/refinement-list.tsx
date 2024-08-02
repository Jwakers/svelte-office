import { TransformItems } from 'instantsearch.js';
import { RefinementListItem } from 'instantsearch.js/es/connectors/refinement-list/connectRefinementList';
import { RefinementList as AlgoliaRefinementList, useRefinementList } from 'react-instantsearch';

export default function RefinementList({
  attribute,
  label,
  transformItems
}: {
  attribute: string;
  label: string;
  transformItems?: TransformItems<RefinementListItem>;
}) {
  const { items } = useRefinementList({ attribute });

  if (!items.length) return null;
  return (
    <div>
      <div className="mb-2 text-lg">{label}</div>
      <AlgoliaRefinementList
        attribute={attribute}
        transformItems={transformItems}
        classNames={{
          list: 'space-y-1',
          label: 'flex items-center gap-2',
          labelText: 'capitalize',
          count: 'border-brand/60 border-b text-xs text-brand/60'
        }}
      />
    </div>
  );
}
