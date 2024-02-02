import IndexString from 'components/index-string';
import ProductTile from 'components/product/product-tile';
import Prose from 'components/prose';
import { getCollection, getCollectionWithProducts } from 'lib/shopify';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const collection = await getCollection(params.handle);

  if (!collection) notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description || collection.description || `${collection.title} products`
  };
}

export default async function Collection({ params }: { params: { handle: string } }) {
  const collection = await getCollectionWithProducts({ handle: params.handle, limit: 100 });
  if (!collection) notFound();

  const { image, title, products, descriptionHtml } = collection;
  const productsCount = products.length;

  // TEMP CODE - Add padding to office chair images
  const headerList = headers();
  const activePath = headerList.get('x-invoke-path');
  const isOfficeChairsPage = activePath?.includes('office-chairs');
  // END OF TEMP CODE

  return (
    <section>
      <div className="border-b border-slate-900 md:flex md:h-[clamp(400px,_calc(100vh_-_44px),_700px)]">
        <div className="flex flex-col justify-end border-r border-slate-900 p-3 md:w-1/2">
          <h1 className="font-serif text-3xl uppercase">{title}</h1>
          <IndexString value={productsCount} text="products in this category" />
          <Prose html={descriptionHtml} />
        </div>
        {image && (
          <div className="hidden animate-fadeIn md:block md:w-1/2">
            <Image
              className="h-full w-full object-cover"
              src={image.url}
              width={736}
              height={384}
              alt={image.altText}
              priority
            />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-[1px] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductTile product={product} />
        ))}
      </div>
    </section>
  );
}
