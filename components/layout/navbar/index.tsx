import Link from 'next/link';

import Cart from 'components/cart';
import { Logo } from 'components/logo';
import { getURIComponent } from 'lib/algolia';
import { getMenu } from 'lib/shopify';
import { Menu as MenuType } from 'lib/shopify/types';
import { Suspense } from 'react';
import { ShoppingBag } from 'react-feather';
import { Dropdown } from './dropdown';
import MobileMenu from './mobile-menu';
import Search from './search';

const MENU_ITEMS = [
  {
    title: 'Chairs',
    path: `/search?${getURIComponent('refinementList', 'collections', 'office-chairs')}`
  },
  {
    title: 'All categories',
    path: `/categories`
  },
  {
    title: 'Contact us',
    path: `/contact`
  }
];

export default async function Navbar() {
  const menu = await getMenu('main-menu');

  return (
    <header className="relative z-10">
      <Link href="/" aria-label="Go back home" className="relative z-50 block p-3 md:hidden">
        <Logo className="text-2xl" />
      </Link>
      <nav className="fixed bottom-0 left-0 z-20 grid w-full grid-cols-[1fr_auto] items-center justify-between border-t border-brand bg-white px-4 md:static md:border-b md:border-t-0 md:bg-transparent">
        <div className="flex">
          <Link href="/" aria-label="Go back home" className="py-2">
            <Logo className="text-xl md:text-3xl" />
          </Link>
        </div>
        <div className="flex h-full items-center gap-4">
          <Dropdown />
          <ul className="hidden uppercase md:flex md:items-center md:gap-4">
            {MENU_ITEMS.map((item: MenuType) => (
              <li key={item.title}>
                <Link href={item.path} className="hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-l border-brand" />
          <div className="flex items-center gap-4">
            <Search className="hidden md:flex" />
            <Suspense fallback={<ShoppingBag strokeWidth={1} />}>
              <span>
                <Cart />
              </span>
            </Suspense>
            <div className="flex items-center md:hidden">
              <Suspense>
                <MobileMenu menu={menu} />
              </Suspense>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
