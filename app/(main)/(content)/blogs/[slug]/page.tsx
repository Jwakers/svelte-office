import Prose from 'components/prose';
import { getArticle } from 'lib/shopify';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) notFound();

  return {
    title: article.seo?.title || article.title,
    description: article.excerpt || article.seo?.description,
    openGraph: {
      images: article.image
        ? [
            {
              url: article.image.url,
              width: article.image.width,
              height: article.image.height,
              alt: article.image.altText
            }
          ]
        : undefined,
      publishedTime: article.publishedAt,
      type: 'article'
    }
  };
}

// TODO - Create all blogs page

export default async function Page({ params }: { params: { slug: string } }) {
  const { title, contentHtml, image } = await getArticle(params.slug);

  return (
    <>
      <h1 className="mb-8 font-serif text-5xl font-bold">{title}</h1>
      {image ? (
        <Image
          alt={image.altText}
          width={image.width}
          height={image.height}
          className="max-h-96 w-full object-cover"
          src={image.url}
        />
      ) : null}
      <Prose className="mb-8" html={contentHtml} />
    </>
  );
}
