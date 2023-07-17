import clsx from 'clsx';
import { Suspense } from 'react';

import { getCollections } from 'lib/shopify';
import FilterList, { PathFilterItem } from './filter';

async function CollectionList() {
  const collections = await getCollections();

  const collectionsList: PathFilterItem[] = collections.map((collection) => ({
    title: collection.title,
    path: `/search/${collection.handle}`
  }));
  collectionsList.unshift({ title: 'All', path: '/search' });

  return <FilterList list={collectionsList} title="Collections" />;
}

const skeleton = 'mb-3 h-4 w-5/6 animate-pulse rounded';
const activeAndTitles = 'bg-gray-800 dark:bg-gray-300';
const items = 'bg-gray-400 dark:bg-gray-700';

export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 pl-10 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
