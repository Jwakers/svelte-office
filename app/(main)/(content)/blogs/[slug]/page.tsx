import Prose from 'components/prose';
import { getArticle } from 'lib/shopify';

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

// TODO - Meta data and open graph
// TODO - Add image to the blog
// TODO - Move the graphQL query to the correct file
// TODO - Create all blogs page

export default async function Page({ params }: { params: { slug: string } }) {
  // const page = await getPage(params.slug);
  const { title, contentHtml } = await getArticle(params.slug);

  return (
    <>
      <h1 className="mb-8 font-serif text-5xl font-bold">{title}</h1>
      <Prose className="mb-8" html={contentHtml} />
      {/* <p className="text-sm italic">
        {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(new Date(page.updatedAt))}.`}
      </p> */}
    </>
  );
}
