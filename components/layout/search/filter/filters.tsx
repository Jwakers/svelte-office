import clsx, { ClassValue } from 'clsx';
import RangeInput from './range-input';
import RefinementList from './refinement-list';
import StockSwitch from './stock-switch';

export default function Filters({ className }: { className?: ClassValue }) {
  return (
    <div className={clsx('p-3', className)}>
      <div>
        <h2 className="mb-2 font-serif text-xl">Filtering</h2>
        <div className="space-y-5">
          <RefinementList attribute="collections" label="By category" />
          <RefinementList attribute="desk_type" label="By desk type" />
          <RangeInput attribute="width" label="By width" />
          <RangeInput attribute="height" label="By height" />
          <RangeInput attribute="price" label="By price" />
          <StockSwitch />
        </div>
      </div>
    </div>
  );
}
