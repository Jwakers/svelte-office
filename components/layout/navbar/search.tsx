'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';

import CloseIcon from 'components/icons/close';
import SearchIcon from 'components/icons/search';
import { FADE_ANIMATION } from 'lib/constants';
import { createUrl } from 'lib/utils';
import { useState } from 'react';

export default function Search() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, set_isOpen] = useState(false);
  const toggleOpen = () => set_isOpen(!isOpen);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(e.target);
    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
    set_isOpen(false);
    val.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center justify-end">
      <AnimatePresence>
        {isOpen && (
          <motion.input
            key="search-input"
            initial={{ width: 0 }}
            animate={{ width: '140px' }}
            exit={{ width: 0 }}
            type="text"
            name="search"
            placeholder="Search..."
            autoComplete="off"
            defaultValue={searchParams?.get('q') || ''}
            className="bg-transparent text-black placeholder:text-black/40"
          />
        )}
        <button
          onClick={toggleOpen}
          type="button"
          title={isOpen ? 'Close' : 'Search'}
          className="cursor-pointer"
        >
          {isOpen ? (
            <motion.div {...FADE_ANIMATION} key="search-close">
              <CloseIcon className="h-6" />
            </motion.div>
          ) : (
            <motion.div {...FADE_ANIMATION} key="search-icon">
              <SearchIcon className="h-6" />
            </motion.div>
          )}
        </button>
      </AnimatePresence>
    </form>
  );
}
