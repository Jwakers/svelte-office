import Share from 'components/share';
import { ROUTES } from 'lib/constants';
import { getArticle } from 'lib/shopify';
import { getPublicBaseUrl } from 'lib/utils';
import { Suspense } from 'react';

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { title, excerpt, seo, authorV2, publishedAt } = await getArticle(params.slug);
  const url = getPublicBaseUrl() + `/${ROUTES.blogs}/${params.slug}`;

  return (
    <Suspense>
      <div className="mx-auto grid gap-4 px-3 py-10 md:max-w-5xl md:grid-cols-[1fr_200px] md:gap-8">
        <div>
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
