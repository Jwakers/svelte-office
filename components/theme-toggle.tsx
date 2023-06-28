'use client';

import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // TODO: save preference in cookies
    if (enabled) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [enabled]);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={clsx(
        'relative inline-flex h-6 w-11 items-center rounded-full bg-orange-200 dark:bg-gray-600',
        enabled ? '' : ''
      )}
    >
      {({ checked }) => (
        <>
          <span className="sr-only">{`Dark mode ${checked ? 'enabled' : 'disabled'}`}</span>
          <span
            className={clsx(
              'inline-block h-4 w-4 transform rounded-full bg-orange-800 transition dark:bg-black',
              checked ? 'translate-x-6' : 'translate-x-1'
            )}
          />
        </>
      )}
    </Switch>
  );
};
