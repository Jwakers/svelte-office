'use client';

import { Popover } from '@headlessui/react';
import { getURIComponent } from 'lib/algolia';
import { PRICE_LINKS, WIDTH_LINKS } from 'lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'react-feather';
import { useRefinementList } from 'react-instantsearch';
import SearchWrapper from '../search/search-wrapper';

export function List({
  attribute,
  title,
  close
}: {
  attribute: string;
  title: string;
  close: () => void;
}) {
  const refinementList = useRefinementList({ attribute });

  return (
    <div>
      <div className="mb-2 font-serif text-2xl capitalize">{title}</div>
      <ul className="space-y-2">
        {refinementList.items.map((item) => {
          return (
            <li key={item.value}>
              <Link
                href={`/search?${encodeURIComponent(`refinementList[${attribute}][0]`)}=${
                  item.value
                }`}
                onClick={() => close()}
                className="capitalize hover:underline"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RangeList({
  items,
  label,
  attribute,
  close
}: {
  items: typeof WIDTH_LINKS;
  label: string;
  attribute: string;
  close: () => void;
}) {
  return (
    <div>
      <div className="mb-2 font-serif text-2xl capitalize">{label}</div>
      <ul className="space-y-2">
        {items.map((item) => {
          return (
            <li key={item.value}>
              <Link
                href={`/search?${getURIComponent(
                  'refinementList',
                  'collections',
                  'office-desks'
                )}&${getURIComponent('range', attribute, item.value)}`}
                onClick={close}
                className="capitalize hover:underline"
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function Dropdown() {
  return (
    <Popover>
      <Popover.Button className="hidden uppercase md:flex md:items-center md:gap-1">
        <span>Desks</span>
        <ChevronDown />
      </Popover.Button>
      <Popover.Panel className="absolute bottom-0 left-0 grid w-full translate-y-full grid-cols-2 border-b border-brand bg-white">
        {({ close }) => (
          <SearchWrapper>
            <div className="relative m-3 hidden xl:block">
              <Image
                src="https://cdn.shopify.com/s/files/1/0784/9138/6157/files/ForgeDeskLifestyle.jpg?v=1706731389"
                layout="fill"
                className="h-full w-full border border-brand object-cover"
                alt="Sit/stand desk against light brown wall"
              />
            </div>
            <div className="flex flex-col gap-10 p-3">
              <div className="flex gap-16">
                <List attribute="desk_type" title="Desk type" close={close} />
                <RangeList items={WIDTH_LINKS} label="Width" attribute="width" close={close} />
                <RangeList items={PRICE_LINKS} label="Price" attribute="min_price" close={close} />
              </div>
              <Link
                href={`/search?${getURIComponent('refinementList', 'collections', 'office-desks')}`}
                className="button"
                onClick={() => close()}
              >
                View all desks
              </Link>
            </div>
          </SearchWrapper>
        )}
      </Popover.Panel>
    </Popover>
  );
}
