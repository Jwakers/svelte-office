import { RangeInput as AlgoliaRangeInput } from 'react-instantsearch';

export default function RangeInput({ attribute, label }: { attribute: string; label: string }) {
  return (
    <div>
      <div className="mb-2 text-lg">{label}</div>
      <AlgoliaRangeInput
        attribute={attribute}
        translations={{
          submitButtonText: 'Search'
        }}
        classNames={{
          form: 'flex flex-wrap gap-1 items-center',
          label: 'grow',
          input: 'p-1 border border-brand w-full',
          submit: 'w-full button'
        }}
      />
    </div>
  );
}
