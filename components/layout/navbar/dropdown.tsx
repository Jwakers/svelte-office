'use client';

import { Popover } from '@headlessui/react';
import { getAlgoliaClient } from 'lib/algolia';
import { ALGOLIA } from 'lib/constants';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'react-feather';
import { InstantSearch, useRefinementList } from 'react-instantsearch';

// TODO
// Add some widths options to the menu
// Mobile menu

function List({
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
        {refinementList.items.map((item, i) => {
          console.log(refinementList.createURL(item.value));
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

const client = getAlgoliaClient();

export async function Dropdown() {
  return (
    <InstantSearch indexName={ALGOLIA.index.products} searchClient={client}>
      <Popover>
        <Popover.Button className="hidden uppercase md:flex md:items-center md:gap-1">
          <span>Desks</span>
          <ChevronDown />
        </Popover.Button>
        <Popover.Panel className="absolute bottom-0 left-0 grid w-full translate-y-full grid-cols-2 border-b border-brand bg-white">
          {({ close }) => (
            <>
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
                </div>
                <Link href="/categories/office-desks" className="button">
                  View all desks
                </Link>
              </div>
            </>
          )}
        </Popover.Panel>
      </Popover>
    </InstantSearch>
  );
}
