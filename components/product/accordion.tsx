'use client';

import { Disclosure, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { ChevronDown } from 'react-feather';

export default function Accordion({
  heading,
  children
}: {
  heading: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className="group flex w-full items-center justify-between border-b border-slate-900 py-3 text-left">
            <span className="text-sm font-medium uppercase group-hover:underline">{heading}</span>
            <ChevronDown className={clsx('transition-transform', { '-scale-y-100': open })} />
          </Disclosure.Button>

          <Transition leave="duration-75">
            <Disclosure.Panel
              className="flex flex-col gap-2 overflow-hidden transition-[height]"
              ref={ref}
              style={{ height: open && ref.current ? `${ref.current.scrollHeight}px` : '0px' }}
            >
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
