import Prose from 'components/prose';
import { getArticle } from 'lib/shopify';
import Image from 'next/image';

// export async function generateMetadata({
//     params
//   }: {
//     params: { page: string };
//   }): Promise<Metadata> {
//     const page = await getBlogs(params.page);

//     if (!page) notFound();

//     return {
//       title: page.seo?.title || page.title,
//       description: page.seo?.description || page.bodySummary,
//       openGraph: {
//         images: [
//           {
//             url: `/api/og?title=${encodeURIComponent(page.title)}`,
//             width: 1200,
//             height: 630
//           }
//         ],
//         publishedTime: page.createdAt,
//         modifiedTime: page.updatedAt,
//         type: 'article'
//       }
//     };
//   }

// TODO - Move the graphQL query to the correct file
// TODO - Meta data and open graph
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
