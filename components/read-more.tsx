'use client';

import clsx from 'clsx';
import { useCallback, useState } from 'react';

type ReadMoreProps = {
  children: React.ReactNode;
};

export default function ReadMore({ children }: ReadMoreProps) {
  const [showMore, setShowMore] = useState(false);
  const [height, setHeight] = useState(0);

  const handleClick = () => setShowMore(!showMore);
  const handleRef = useCallback(
    (node: HTMLDivElement | null) => setHeight(node?.scrollHeight || 0),
    []
  );

  if (height && height < 200) return children;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={handleRef}
        className={clsx('relative overflow-hidden transition-[max-height]')}
        style={{ maxHeight: showMore ? `${height}px` : '9rem' }}
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
