import { Suspense } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <div className="w-full bg-white dark:bg-brand">
        <div className="mx-8 max-w-2xl py-10 sm:mx-auto">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </Suspense>
  );
}