import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ConfigureProps, useHits } from 'react-instantsearch';

export default function StockSwitch({
  setConfig
}: {
  setConfig: Dispatch<SetStateAction<ConfigureProps>>;
}) {
  const [hideOutOfStock, setHideOutOfStock] = useState(false);
  const { hits } = useHits();

  useEffect(() => {
    setConfig((prev) => ({
      ...prev,
      filters: hideOutOfStock ? 'availableForSale:true' : undefined
    }));
  }, [hideOutOfStock]);

  if (!hits.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-1 md:gap-2">
      <p className="text-lg">Hide out of stock</p>
      <Switch
        checked={hideOutOfStock}
        onChange={setHideOutOfStock}
        className="flex h-6 w-11 cursor-pointer items-center border bg-brand/10"
      >
        {({ checked }) => (
          <span
            className={clsx(
              'h-4 w-4 border bg-brand  transition',
              checked ? 'translate-x-6 bg-brand' : 'translate-x-1 bg-transparent'
            )}
          />
        )}
      </Switch>
    </div>
  );
}
