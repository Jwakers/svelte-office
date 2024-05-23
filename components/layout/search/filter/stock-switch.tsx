import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { useState } from 'react';
import { Configure } from 'react-instantsearch';

export default function StockSwitch() {
  const [hideOutOfStock, setHideOutOfStock] = useState(false);

  return (
    <>
      <Configure filters={hideOutOfStock ? 'availableForSale:true' : undefined} />
      <div className="flex flex-wrap items-center justify-between gap-1 md:gap-2">
        <p className="text-lg">Hide out of stock</p>
        <Switch
          checked={hideOutOfStock}
          onChange={setHideOutOfStock}
          className="flex h-6 w-11 cursor-pointer items-center border border-brand bg-brand/10"
        >
          {({ checked }) => (
            <span
              className={clsx(
                'h-4 w-4 border border-brand bg-brand  transition',
                checked ? 'translate-x-6 bg-brand' : 'translate-x-1 bg-transparent'
              )}
            />
          )}
        </Switch>
      </div>
    </>
  );
}
