'use client';

import clsx from 'clsx';
import { DELIVERY_OPTIONS, RETURN_OPTIONS } from 'lib/constants';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { ChevronDown } from 'react-feather';

export default function DeliverySection({ vendor }: { vendor: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggle = () => setOpen(!open);

  return (
    <div>
      <button
        className="flex w-full items-center justify-between border-b border-black py-3 text-left"
        onClick={toggle}
      >
        <span>Delivery and Returns</span>
        <ChevronDown className={clsx('transition-transform', { '-scale-y-100': open })} />
      </button>
      <div
        ref={ref}
        className="flex flex-col gap-2 overflow-hidden transition-[height]"
        style={{ height: open && ref.current ? `${ref.current.scrollHeight}px` : '0px' }}
      >
        <div className="pt-2">
          <h3 className="font-medium">Delivery</h3>
          <p>{DELIVERY_OPTIONS[vendor] || DELIVERY_OPTIONS.default}</p>
          <p>
            For more information see our{' '}
            <Link href="/delivery" className="underline">
              Delivery page.
            </Link>
          </p>
        </div>
        <div>
          <h3 className="font-medium">Returns</h3>
          <p>{RETURN_OPTIONS[vendor] || RETURN_OPTIONS.default}</p>
          <p>
            For more information see our{' '}
            <Link href="/returns" className="underline">
              Returns page.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
