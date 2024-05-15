'use client';

import { Dialog, Transition } from '@headlessui/react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

import { Logo } from 'components/logo';
import { getURIComponent } from 'lib/algolia';
import { MENU_ITEMS, ROUTES } from 'lib/constants';
import { Menu } from 'lib/shopify/types';
import Link from 'next/link';
import { Menu as MenuIcon, X } from 'react-feather';
import SearchWrapper from '../search/search-wrapper';
import { List } from './dropdown';
import Search from './search';

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex md:hidden"
        data-testid="open-mobile-menu"
      >
        <MenuIcon strokeWidth={1} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-brand/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-brand">
                  <Logo className="ml-3 translate-y-[2px] text-xl leading-none" />
                  <button
                    className="border-l border-brand p-3"
                    onClick={closeMobileMenu}
                    aria-label="Close mobile menu"
                    data-testid="close-mobile-menu"
                  >
                    <X strokeWidth={1} />
                  </button>
                </div>
                <SearchWrapper>
                  <div className="flex flex-col gap-4 p-3">
                    <List attribute="desk_type" title="Desk type" close={closeMobileMenu} />
                    <Link
                      href={`/${ROUTES.search}?${getURIComponent(
                        'refinementList',
                        'collections',
                        'office-desks'
                      )}`}
                      className="button"
                      onClick={() => close()}
                    >
                      View all desks
                    </Link>
                    <ul className="space-y-4 font-serif text-lg">
                      {MENU_ITEMS.map((item) => (
                        <li key={item.title}>
                          <Link href={item.path} className="hover:underline">
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </SearchWrapper>
                <Search className="mt-auto h-auto justify-end justify-self-end border-t border-brand p-3" />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
