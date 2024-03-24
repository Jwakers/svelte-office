'use client';

import { Popover } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'react-feather';

function List({ tags, close }: { tags: string[]; close: () => void }) {
  const tagTitle = tags[0]?.split(': ')[0];

  // TODO: Refactor code to display new tags

  return (
    <div>
      <div className="mb-2 font-serif text-2xl capitalize">{tagTitle}</div>
      <ul className="space-y-2">
        {tags.map((tag) => {
          const name = tag.split(':')[1];
          return (
            <li key={tag}>
              <Link
                href={`/search?tag=${tag}`}
                onClick={() => close()}
                className="capitalize hover:underline"
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function Dropdown({ tags }: { tags: any }) {
  return (
    <Popover>
      <Popover.Button className="hidden uppercase md:flex md:items-center md:gap-1">
        <span>Desks</span>
        <ChevronDown />
      </Popover.Button>
      <Popover.Panel className="absolute bottom-0 left-0 grid w-full translate-y-full grid-cols-2 border-b border-t border-brand bg-white">
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
                <List tags={tags} close={close} />
              </div>
              <Link href="/categories/office-desks" className="button">
                View all desks
              </Link>
            </div>
          </>
        )}
      </Popover.Panel>
    </Popover>
  );
}
