'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { ClassValue } from 'clsx';
import { useOutsideClick } from 'lib/hooks';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Search as SearchIcon } from 'react-feather';

export default function Search({ className }: { className?: ClassValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const toggleOpen = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);
  useOutsideClick(formRef, close);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }

    router.push(createUrl('/search', newParams));
    close();
  }

  return (
    // <form onSubmit={onSubmit} className={clsx('flex h-6 items-center', className)} ref={formRef}>
    //   <input
    //     ref={inputRef}
    //     key="search-input"
    //     type="text"
    //     name="search"
    //     placeholder="Search"
    //     autoComplete="off"
    //     defaultValue={searchParams?.get('q') || ''}
    //     className={clsx(
    //       'bg-transparent uppercase text-black transition-[width] placeholder:text-black/40 focus-visible:outline-none',
    //       isOpen ? 'w-full md:w-40' : 'w-0'
    //     )}
    //   />
    //   <button
    //     onClick={toggleOpen}
    //     type="button"
    //     title={isOpen ? 'Close' : 'Search'}
    //     className="h-full cursor-pointer"
    //   >
    //     {isOpen ? <X strokeWidth={1} /> : <SearchIcon strokeWidth={1} />}
    //   </button>
    // </form>
    <Link href="/search">
      <SearchIcon strokeWidth={1} />
    </Link>
  );
}
