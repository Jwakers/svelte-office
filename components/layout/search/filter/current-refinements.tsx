import { Button } from '@/components/ui/button';
import { parseHyphen, parseUnderscore } from 'lib/utils';
import { X } from 'lucide-react';
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
                <Button
                  key={refinement.label}
                  variant="pill"
                  className="flex items-center"
                  onClick={() => {
                    item.refine(refinement);
                  }}
                  size="xs"
                >
                  <span>{refinementLabel}</span>
                  <X size={14} />
                </Button>
              );
            })}
          </li>
        );
      })}
    </ul>
  );
}
