import Link from 'next/link';

import Cart from 'components/cart';
import CartIcon from 'components/icons/cart';
import LogoIcon from 'components/icons/logo';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search from './search';

export default async function Navbar() {
  const menu = await getMenu('main-menu');

  return (
    <nav className="flex w-full items-center justify-between px-6 py-4">
      <Link href="/" aria-label="Go back home">
        <LogoIcon className="h-8 transition-transform hover:scale-110" />
      </Link>
      <div className="fixed bottom-2 right-2 z-10 flex gap-6 rounded bg-orange-300 p-4 dark:bg-gray-800 md:static">
        {!!menu.length && (
          <ul className="mr-20 hidden md:flex md:items-center md:gap-6">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link
                  href={item.path}
                  className="rounded-lg text-gray-800 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
        <Search />
        <div className="flex items-center">
          <Suspense fallback={<CartIcon className="h-6" />}>
            <Cart />
          </Suspense>
        </div>
        <div className="flex items-center">
          <MobileMenu menu={menu} />
        </div>
      </div>
    </nav>
  );
}
