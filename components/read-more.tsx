'use client';

import clsx from 'clsx';
import { useCallback, useState } from 'react';

type ReadMoreProps = {
  children: React.ReactNode;
};

export default function ReadMore({ children }: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);

  const handleClick = () => setIsExpanded(!isExpanded);
  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    setHeight(node.scrollHeight);
  }, []);

  if (height && height < 200) return children;

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={handleRef}
        className={clsx('relative overflow-hidden transition-[max-height]')}
        style={{ maxHeight: isExpanded ? `${height}px` : '8.5rem' }}
      >
        {children}
        {!isExpanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white to-transparent" />
        )}
      </div>
      <div className="prose">
        {/* Set button in prose to maintain the same max-width as the prose used in product descriptions */}
        <button
          className="ml-auto block text-slate-700 underline transition-colors hover:text-slate-900"
          type="button"
          onClick={handleClick}
          aria-label={isExpanded ? 'Show less content' : 'Show more content'}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      </div>
    </div>
  );
}
