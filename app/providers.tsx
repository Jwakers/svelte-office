'use client';
import { ToastIcon, Toaster, resolveValue } from 'react-hot-toast';

import { Transition } from '@headlessui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
    <Toaster>
      {(t) => (
        <Transition
          appear
          show={t.visible}
          className="flex transform rounded-none bg-green-500 px-3 py-2 text-white shadow-sm transition-all"
          enter="transition-all duration-150"
          enterFrom="opacity-0 scale-50"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-75"
        >
          <p className="">{resolveValue(t.message, t)}</p>
          <ToastIcon toast={t} />
        </Transition>
      )}
    </Toaster>
  </QueryClientProvider>
);

export default Providers;
