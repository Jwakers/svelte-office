'use client';

import clsx from 'clsx';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useState } from 'react';
import { Button } from './ui/button';

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
        <Button
          variant="link"
          className="px-0"
          onClick={handleClick}
          aria-label={isExpanded ? 'Show less content' : 'Show more content'}
        >
          <span>{isExpanded ? 'Show less' : 'Read more'}</span>
          {isExpanded ? <ArrowUp className="w-4" /> : <ArrowDown className="w-4" />}
        </Button>
      </div>
    </div>
  );
}
