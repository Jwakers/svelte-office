import { transformLabels } from 'lib/algolia';
import { RefinementList as AlgoliaRefinementList } from 'react-instantsearch';

export default function RefinementList({ attribute, label }: { attribute: string; label: string }) {
  return (
    <div>
      <div className="mb-2 text-lg">{label}</div>
      <AlgoliaRefinementList
        attribute={attribute}
        transformItems={transformLabels}
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
