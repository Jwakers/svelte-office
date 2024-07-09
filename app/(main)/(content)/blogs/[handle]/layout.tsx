import Share from 'components/share';
import { ROUTES } from 'lib/constants';
import { getArticle } from 'lib/shopify';
import { getPublicBaseUrl } from 'lib/utils';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { handle: string };
}) {
  const { title, excerpt, seo, authorV2, publishedAt } = await getArticle(params.handle);
  const url = getPublicBaseUrl() + `/${ROUTES.blogs}/${params.handle}`;

  return (
    <Suspense>
      <div className="mx-auto gap-4 px-3 py-10 md:grid md:max-w-5xl md:grid-cols-[1fr_200px] md:gap-8">
        <div>
          <div className="mb-2 flex items-center gap-1 text-xs md:mb-4">
            <Link href={`/${ROUTES.blogs}`} className="underline">
              Blogs
            </Link>
            <span>/</span>
            <div className="max-w-60 truncate">{title}</div>
          </div>
          <Suspense>{children}</Suspense>
        </div>
        <div className="relative">
          <div className="sticky top-4 flex flex-col items-start gap-1">
            <div>
              <span className="font-medium">Author:</span> {authorV2.name}
            </div>
            <div>
              <span className="font-medium">Published:</span>{' '}
              {new Intl.DateTimeFormat(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }).format(new Date(publishedAt))}
            </div>
            <div className="mt-2">
              <Share text={excerpt ?? seo.description} title={title} url={url} />
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
