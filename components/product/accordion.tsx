'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

export default function Accordion({
  heading,
  children
}: {
  heading: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = () => setOpen(!open);

  return (
    <div>
      <button
        className="flex w-full items-center justify-between border-b border-black py-3 text-left"
        onClick={toggle}
      >
        <span className="text-sm font-medium uppercase">{heading}</span>
        <ChevronDown className={clsx('transition-transform', { '-scale-y-100': open })} />
      </button>
      <div
        ref={ref}
        className="flex flex-col gap-2 overflow-hidden transition-[height]"
        style={{ height: open && ref.current ? `${ref.current.scrollHeight}px` : '0px' }}
      >
        {children}
      </div>
    </div>
  );
}
