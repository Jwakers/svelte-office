import Breadcrumbs from '@/components/breadcrumbs';
import { getPage } from '@/lib/shopify';
import { Suspense } from 'react';

export default async function Layout({
  children,
  params
}: React.PropsWithChildren<{ params: { page: string } }>) {
  const { title } = await getPage(params.page);

  return (
    <Suspense>
      <Breadcrumbs current={title} />
      <div className="w-full">
        <div className="mx-8 max-w-2xl py-10 sm:mx-auto">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </Suspense>
  );
}
