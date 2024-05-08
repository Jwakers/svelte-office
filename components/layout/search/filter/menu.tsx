'use client';

import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import algoliaLogo from 'public/algolia-logo.svg';
import { Fragment, useEffect, useState } from 'react';
import { ArrowRight, X } from 'react-feather';

export default function SearchMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isOpen) return;
    setShowResults(false);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowResults(true);
    }

    return () => {
      setShowResults(false);
    };
  }, [searchParams]);

  return (
    <>
      <button
        onClick={openMenu}
        className="button sticky -bottom-40 top-4 z-10 mx-4 mb-4 flex justify-center gap-2 bg-white md:my-0 md:hidden"
      >
        <span>Filter & Sort</span>
      </button>

      <Transition show={isOpen} unmount={false}>
        <Transition.Child
          as={Fragment}
          enter="transition-all ease-in-out duration-300"
          enterFrom="translate-x-[-100%]"
          enterTo="translate-x-0"
          leave="transition-all ease-in-out duration-200"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-[-100%]"
          unmount={false}
        >
          <div className="fixed bottom-0 left-0 right-0 top-0 z-20 flex h-full w-full flex-col bg-white dark:bg-brand">
            <div className="flex flex-col overflow-auto">
              <div className="flex items-center justify-between border-b border-brand">
                <span className="ml-3 translate-y-[2px] font-serif text-xl font-bold leading-none tracking-tight">
                  SvelteOffice
                </span>
                <button
                  className="border-l border-brand p-3"
                  aria-label="Close menu"
                  onClick={closeMenu}
                >
                  <X strokeWidth={1} />
                </button>
              </div>
              {children}

              <div className="mx-auto my-2 flex flex-col items-center gap-2">
                <span className="text-sm text-secondary">Search powered by</span>
                <Image src={algoliaLogo} alt="Algolia logo" className="max-w-[6rem]" />
              </div>
              <button
                className={clsx(
                  'button sticky bottom-0 flex items-center justify-between gap-2 bg-brand text-white transition-transform',
                  showResults ? 'translate-y-0' : 'translate-y-full'
                )}
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <span>Show results</span>
                <ArrowRight strokeWidth={1} />
              </button>
            </div>
          </div>
        </Transition.Child>
      </Transition>
    </>
  );
}
