import { parseHyphen, parseUnderscore } from 'lib/utils';
import { X } from 'react-feather';
import { useCurrentRefinements } from 'react-instantsearch';

export default function CurrentRefinements() {
  const { items } = useCurrentRefinements();
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => {
        let label = parseUnderscore(item.label);
        const isPrice = item.label === 'min_price';

        if (isPrice) label = 'price';

        return (
          <li key={[item.indexName, item.label].join('/')} className="flex items-center gap-1">
            <span className="hidden text-xs capitalize text-secondary md:block">{label}:</span>
            {item.refinements.map((refinement) => {
              let refinementLabel = parseHyphen(refinement.label);

              if (isPrice) {
                const [symbol, value] = refinement.label.split(' ');
                refinementLabel = `${symbol} £${value}`;
              }

              return (
                <button
                  key={refinement.label}
                  type="button"
                  className="flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs text-white"
                  onClick={() => {
                    item.refine(refinement);
                  }}
                >
                  <span>{refinementLabel}</span>
                  <X size={14} />
                </button>
              );
            })}
          </li>
        );
      })}
    </ul>
  );
}
