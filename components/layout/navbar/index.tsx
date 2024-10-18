import Link from 'next/link';

import clsx, { ClassValue } from 'clsx';
import Cart from 'components/cart';
import { Logo } from 'components/logo';
import { MENU_ITEMS } from 'lib/constants';
import { getMenu } from 'lib/shopify';
import { ShoppingBag } from 'lucide-react';
import { Suspense } from 'react';
import MobileMenu from './mobile-menu';
import Search from './search';

export default async function Navbar({ className }: { className: ClassValue }) {
  const menu = await getMenu('main-menu');

  return (
    <header className={clsx('z-20', className)}>
      <Link href="/" aria-label="Go back home" className="relative z-50 block p-3 md:hidden">
        <Logo className="text-2xl" />
      </Link>
      <nav className="fixed bottom-0 left-0 z-20 grid w-full grid-cols-[1fr_auto] items-center justify-between border-t bg-white px-4 md:static md:border-b md:border-t-0 md:bg-transparent">
        <div className="flex">
          <Link href="/" aria-label="Go back home" className="py-2">
            <Logo className="text-xl md:text-3xl" />
          </Link>
        </div>
        <div className="flex h-full items-center gap-4">
          <ul className="hidden uppercase md:flex md:items-center md:gap-4">
            {MENU_ITEMS.map((item) => (
              <li key={item.title}>
                <Link href={item.path} className="hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="h-full border-l border-brand" />
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
