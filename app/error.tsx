'use client';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { MonitorX, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function GeneralError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[calc(100dvh-74px)] flex-col items-center justify-center px-4">
      <div className="text-center">
        <MonitorX className="mx-auto mb-4 h-16 w-16" />
        <h1 className="mb-2 text-4xl font-bold">Oops! Something went wrong</h1>
        <p className="mb-6 text-lg text-secondary">
          We apologize for the inconvenience. It seems there was an error while loading this page.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button onClick={reset} variant="outline">
            <RefreshCcw className="w-4" />
            Try again
          </Button>
          <Button asChild>
            <Link href="/">Return to homepage</Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-secondary">
          If the problem persists, please{' '}
          <Link className="underline" href={`/${ROUTES.contact}`}>
            contact
          </Link>{' '}
          our customer support.
        </p>
      </div>
    </div>
  );
}
