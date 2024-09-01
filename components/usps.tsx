'use client';
import clsx, { ClassValue } from 'clsx';
import gsap from 'gsap';
import { ROUTES } from 'lib/constants';
import { useIsBreakpoint } from 'lib/hooks';
import Link from 'next/link';
import { Fragment, useRef } from 'react';
import { ThumbsUp, Truck, Umbrella } from 'react-feather';

const usps = [
  {
    id: 1,
    title: 'Next day delivery',
    copy: [
      "Need it fast? Order by 1PM for next day delivery! Shop now and get your items tomorrow. Don't wait—buy today. ",
      <Link href={`/${ROUTES.delivery}`} className="underline">
        Find out more.
      </Link>
    ],
    icon: <Truck />
  },
  {
    id: 3,
    title: 'Price match promise',
    copy: [
      "Find it cheaper elsewhere? We'll match it! Get the best price with our price match promise. Click here to save now. ",
      <Link href={`/${ROUTES.priceMatch}`} className="underline">
        Find out more.
      </Link>
    ],
    icon: <ThumbsUp />
  },
  {
    id: 2,
    title: 'Based in the UK',
    copy: [
      'Proudly based in the UK! Enjoy fast shipping and excellent service. Support local - shop with us today. '
    ],
    icon: <Umbrella />
  }
];

export default function USPs() {
  const ref = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const isMd = useIsBreakpoint();

  const ListItem = ({ item, className }: { item: (typeof usps)[0]; className?: ClassValue }) => (
    <li
      className={clsx(
        'last:border-b-none relative w-full shrink-0 overflow-hidden border-b border-white/10 bg-brand p-3 text-white md:border-r md:py-4 md:last:border-none',
        className
      )}
    >
      <div className="flex h-full flex-col justify-between">
        <div>
          <h4 className="flex justify-between gap-2 font-serif md:text-lg">
            <span>{item.title}</span>
            <div className="bottom-3 right-3">{item.icon}</div>
          </h4>
          <p className="hidden overflow-hidden pt-2 text-white/80 md:block">
            {item.copy.map((line) => (
              <Fragment key={`${item.id}${line}`}>{line}</Fragment>
            ))}
          </p>
        </div>
      </div>
    </li>
  );

  return (
    <div className="overflow-hidden">
      <ul className="group flex animate-ticker md:grid md:animate-none md:grid-cols-3" ref={ref}>
        {usps.map((item) => (
          <ListItem item={item} key={`usp-${item.id}`} />
        ))}
        {/* Duplicate list for infinite ticker effect */}
        {usps.map((item) => (
          <ListItem item={item} className="md:hidden" key={`usp-${item.id + 10}`} />
        ))}
      </ul>
    </div>
  );
}
