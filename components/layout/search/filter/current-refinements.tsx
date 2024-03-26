import { parseHyphen, parseUnderscore } from 'lib/utils';
import { X } from 'react-feather';
import { useCurrentRefinements } from 'react-instantsearch';

export default function CurrentRefinements() {
  const { items } = useCurrentRefinements();
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <li key={[item.indexName, item.label].join('/')} className="flex items-center gap-1">
          <span className="hidden text-xs capitalize text-secondary md:block">
            {parseUnderscore(item.label)}:{' '}
          </span>
          {item.refinements.map((refinement) => (
            <button
              key={refinement.label}
              type="button"
              className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs text-white"
              onClick={() => {
                item.refine(refinement);
              }}
            >
              <span>{parseHyphen(refinement.label)}</span>
              <X size={14} />
            </button>
          ))}
        </li>
      ))}
    </ul>
  );
}
