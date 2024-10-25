import Breadcrumbs from '@/components/breadcrumbs';
import Listing from 'components/layout/search/listing';
import { getAlgoliaIndex } from 'lib/algolia';
import Head from 'next/head';

export const dynamic = 'force-dynamic';

const index = getAlgoliaIndex();

export const metadata = {
  title: 'Search Results',
  description:
    'Explore search results at Svelte Office. Find the perfect office furniture to enhance your home workspace, including ergonomic chairs, stylish desks, and more.'
};

export default async function SearchPage() {
  return (
    <>
      <Head>
        {/* Preconnect to Algolia to speed up initial user interaction */}
        <link
          crossOrigin="anonymous"
          href={`https://${process.env.NEXT_PUBLIC_ALGOLIA_APP_ID}-dsn.algolia.net`}
          rel="preconnect"
        />
      </Head>
      <Breadcrumbs current="Search" className="md:absolute" />
      <Listing />
    </>
  );
}
