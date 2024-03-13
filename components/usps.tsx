'use client';
import { useGSAP } from '@gsap/react';
import clsx, { ClassValue } from 'clsx';
import gsap from 'gsap';
import { useIsBreakpoint } from 'lib/hooks';
import { useRef } from 'react';
import { ThumbsUp, Truck, Umbrella } from 'react-feather';

const usps = [
  {
    id: 1,
    title: 'Next day delivery',
    copy: 'We offer next day delivery on most of our products. Or two person, named day delivery.',
    icon: <Truck className="h-20 w-20 md:h-40 md:w-40" />
  },
  {
    id: 3,
    title: 'Price match',
    copy: 'If you find one of our products cheaper elsewhere, we will match the price and give a discount on your next order.',
    icon: <ThumbsUp className="h-20 w-20 md:h-40 md:w-40" />
  },
  {
    id: 2,
    title: 'Based in the UK',
    copy: 'All of our products are sourced, and delivered from the UK',
    icon: <Umbrella className="h-20 w-20 md:h-40 md:w-40" />
  }
];

export default function USPs() {
  const ref = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const isMd = useIsBreakpoint();

  useGSAP(() => {
    if (!ref.current) return;
    tl.current.to(ref.current, {
      xPercent: -(usps.length * 100),
      duration: 4 * usps.length,
      repeat: -1,
      ease: 'none'
    });
  }, [ref]);

  useGSAP(() => {
    if (isMd) {
      tl.current.progress(0);
      tl.current.pause();
    } else {
      tl.current.play();
    }
  }, [isMd]);

  const ListItem = ({ item, className }: { item: (typeof usps)[0]; className?: ClassValue }) => (
    <li
      className={clsx(
        'last:border-b-none relative w-full shrink-0 overflow-hidden border-b border-white/40 bg-slate-900 p-3 text-white md:border-r md:py-4 md:last:border-none',
        className
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <h4 className="font-serif text-lg md:text-xl">{item.title}</h4>
          <p className="hidden max-h-[0px] overflow-hidden transition-[max-height] group-hover:max-h-[140px] group-hover:pt-2 md:block">
            {item.copy}
          </p>
        </div>
        <div className="absolute bottom-0 right-0 -translate-x-2 translate-y-2 opacity-5 md:translate-x-6 md:translate-y-6">
          {item.icon}
        </div>
      </div>
    </li>
  );

  return (
    <ul className="group flex md:grid md:grid-cols-3" ref={ref}>
      {usps.map((item) => (
        <ListItem item={item} key={`usp-${item.id}`} />
      ))}
      {/* Duplicate list for infinite ticker effect */}
      {usps.map((item) => (
        <ListItem item={item} className="md:hidden" key={`usp-${item.id + 10}`} />
      ))}
    </ul>
  );
}
