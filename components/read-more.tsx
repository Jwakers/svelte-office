'use client';

import clsx from 'clsx';
import { useRef, useState } from 'react';

type ReadMoreProps = {
  children: React.ReactNode;
};

export default function ReadMore({ children }: ReadMoreProps) {
  const [showMore, setShowMore] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const handleClick = () => setShowMore(!showMore);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={ref}
        className={clsx('relative overflow-hidden transition-[max-height]')}
        style={{ maxHeight: showMore ? `${ref.current?.scrollHeight}px` : '5rem' }}
      >
        {children}
        {showMore && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <div className="prose">
        {/* Set button in prose to maintain the same max-width as the prose used in product descriptions */}
        <button
          className="ml-auto block text-slate-500 underline transition-colors hover:text-slate-900"
          type="button"
          onClick={handleClick}
        >
          {showMore ? 'Show less' : 'Read more'}
        </button>
      </div>
    </div>
  );
}
