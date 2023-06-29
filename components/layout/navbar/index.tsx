import Link from 'next/link';

import { Icon } from 'components/Icon';
import Cart from 'components/cart';
import { getMenu } from 'lib/shopify';
import { Menu } from 'lib/shopify/types';
import 'material-symbols';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search from './search';

export default async function Navbar() {
  const menu = await getMenu('main-menu');

  return (
    <nav className="fixed bottom-0 left-0 grid w-full grid-cols-[1fr_auto] items-center justify-between border-t border-black bg-stone-50 px-4 md:static md:border-b">
      <Link href="/" aria-label="Go back home" className="py-2">
        <span className="font-serif font-bold">Logo</span>
      </Link>
      <div className="flex h-full gap-4">
        {!!menu.length && (
          <ul className="hidden uppercase md:flex md:items-center md:gap-4">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <Link href={item.path}>{item.title}</Link>
              </li>
            ))}
          </ul>
        )}
        <div className="border-l border-black" />
        <div className="flex items-center gap-4">
          <Search className="hidden md:block" />
          <Suspense fallback={<Icon name="shopping_bag" />}>
            <span>
              <Cart />
            </span>
          </Suspense>
          <div className="flex items-center md:hidden">
            <MobileMenu menu={menu} />
          </div>
        </div>
      </div>
    </nav>
  );
}
