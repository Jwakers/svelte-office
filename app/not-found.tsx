'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getURIComponent } from '@/lib/algolia';
import { ROUTES } from '@/lib/constants';
import { ChevronRight, HomeIcon, Search, ShoppingBagIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const POPULAR_PAGES = [
  {
    title: 'Desks',
    path: `/${ROUTES.search}?${getURIComponent('refinementList', 'collections', 'office-desks')}`
  },
  {
    title: 'Chairs',
    path: `/${ROUTES.search}?${getURIComponent('refinementList', 'collections', 'office-chairs')}`
  },
  {
    title: 'Accessories',
    path: `/${ROUTES.search}?${getURIComponent(
      'refinementList',
      'collections',
      'office-accessories'
    )}`
  },
  {
    title: 'All categories',
    path: `/${ROUTES.categories}`
  },
  {
    title: 'Blog',
    path: `/${ROUTES.blog}`
  },
  {
    title: 'Contact us',
    path: `/${ROUTES.contact}`
  }
];

export default function NotFound() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchQuery = formData.get('query') as string;
    if (!searchQuery) return;

    router.push(`/${ROUTES.search}?query=${searchQuery}`);
  };

  return (
    <div className="relative flex min-h-[calc(100dvh-74px)] flex-col items-center justify-center overflow-hidden bg-background py-20 text-foreground">
      {/* Content */}
      <div className="z-10 w-full max-w-3xl px-4 text-center">
        <h1 className="mb-4 text-9xl font-bold">404</h1>
        <h2 className="mb-4 text-3xl font-semibold">Oops! This page is on a coffee break</h2>
        <p className="mb-8 text-xl">
          Don't worry, our other pages are still hard at work. Let's find what you're looking for.
        </p>

        {/* Search bar */}
        <form className="mx-auto mb-8 flex w-full max-w-sm" onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Search our range"
            className="rounded-r-none"
            name="query"
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        {/* Navigation buttons */}
        <div className="mb-8 flex flex-col justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <Button asChild size="lg">
            <Link href="/">
              <HomeIcon className="w-5" />
              Return to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href={`/${ROUTES.search}`}>
              <ShoppingBagIcon className="w-5" />
              Browse All Products
            </Link>
          </Button>
        </div>

        {/* Popular categories */}
        <div className="text-left">
          <h3 className="mb-4 text-xl font-semibold">Popular Categories:</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {POPULAR_PAGES.map(({ title, path }) => (
              <li key={path}>
                <Link href={path} className="flex items-center hover:underline">
                  <ChevronRight className="mr-2 h-4 w-4" />
                  {title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
