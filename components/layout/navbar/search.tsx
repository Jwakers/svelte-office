'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import clsx, { ClassValue } from 'clsx';
import { ROUTES } from 'lib/constants';
import { useOutsideClick } from 'lib/hooks';
import { createUrl } from 'lib/utils';
import { Search as SearchIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Search({ className }: { className?: ClassValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(!isOpen);
  useOutsideClick(formRef, close);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('query', search.value);
    } else {
      newParams.delete('query');
    }

    router.push(createUrl(`/${ROUTES.search}`, newParams));
    close();
  }

  useEffect(() => {
    if (!isOpen || !inputRef.current) return;
    inputRef.current.focus();
  }, [isOpen]);

  return (
    <form onSubmit={onSubmit} className={clsx('flex h-6 items-center', className)} ref={formRef}>
      <input
        ref={inputRef}
        key="search-input"
        type="text"
        name="search"
        placeholder="Search"
        autoComplete="off"
        defaultValue={searchParams?.get('q') || ''}
        onFocus={open}
        onBlur={close}
        className={clsx(
          'bg-transparent uppercase text-black transition-[width] placeholder:text-black/40 focus-visible:outline-none',
          isOpen ? 'w-full md:w-40' : 'w-0'
        )}
      />
      <button
        onClick={toggle}
        type="button"
        title={isOpen ? 'Close' : 'Search'}
        className="h-full cursor-pointer"
      >
        {isOpen ? <X strokeWidth={1} /> : <SearchIcon strokeWidth={1} />}
      </button>
    </form>
  );
}
