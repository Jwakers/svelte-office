import { ROUTES } from 'lib/constants';
import { getArticles } from 'lib/shopify';
import Link from 'next/link';

export const metadata = {
  title: 'All Blogs',
  description:
    'Explore the Svelte Office blog for expert tips, design inspiration, and the latest trends in premium office furniture. Enhance your home workspace with our insights.'
};

export default async function Page() {
  const articles = await getArticles();

  return (
    <div className="mx-auto px-3 py-10 md:max-w-5xl ">
      <h1 className="mb-8 font-serif text-5xl font-bold">Blogs</h1>

      <div>
        {articles.map((article) => {
          return (
            <Link
              href={`/${ROUTES.blogs}/${article.handle}`}
              className="block gap-3 border-b border-brand py-3 transition-transform hover:translate-x-4 md:grid md:grid-cols-[1fr_200px] md:py-6"
            >
              <div className="space-y-1 md:space-y-2">
                <h4 className="font-serif text-2xl md:text-3xl">{article.title}</h4>
                <p className="line-clamp-2">{article.excerpt}</p>
              </div>
              <div className="mt-4 flex flex-wrap justify-between gap-1 text-sm text-secondary md:mt-0 md:flex-col md:justify-start md:border-l md:px-3">
                <p>
                  <span className="font-medium">Author:</span> {article.authorV2.name}
                </p>
                <p>
                  <span className="font-medium">Published:</span>{' '}
                  {new Intl.DateTimeFormat(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }).format(new Date(article.publishedAt))}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
