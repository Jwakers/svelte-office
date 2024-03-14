import { useEffect, useState } from 'react';
import { BREAKPOINTS } from './constants';

export function useOutsideClick(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}

export function useIsBreakpoint(breakpoint: keyof typeof BREAKPOINTS = 'md') {
  const [isBreakpoint, setIsBreakpoint] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${BREAKPOINTS[breakpoint]}px)`);
    setIsBreakpoint(media.matches);

    media.addEventListener('change', (media) => setIsBreakpoint(media.matches));
  }, []);

  return isBreakpoint;
}
