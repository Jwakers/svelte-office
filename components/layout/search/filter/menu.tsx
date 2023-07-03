'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Icon } from 'components/Icon';
import { Fragment, useState } from 'react';

export default function SearchMenu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={openMenu}
        className="button sticky -bottom-40 top-4 z-10 mx-4 bg-white md:hidden"
      >
        Filter
      </button>

      <Transition show={isOpen}>
        <Dialog onClose={closeMenu} className="relative z-50 md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-[-100%]"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-[-100%]"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black">
              <div className="flex flex-col p-4">
                <button className="mb-4 ml-auto" onClick={closeMenu} aria-label="Close menu">
                  <Icon name="close" />
                </button>
                {children}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
