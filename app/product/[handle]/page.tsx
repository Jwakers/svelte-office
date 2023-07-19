import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import { GridTileImage } from 'components/grid/tile';
import Price from 'components/price';
import Accordion from 'components/product/accordion';
import { Gallery } from 'components/product/gallery';
import { VariantSelector } from 'components/product/variant-selector';
import Prose from 'components/prose';
import { DELIVERY_OPTIONS, DeliveryTypes, HIDDEN_PRODUCT_TAG, Vendors } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import Link from 'next/link';
import { Suspense } from 'react';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const hide = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: hide,
      follow: hide,
      googleBot: {
        index: hide,
        follow: hide
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

function DeliverySection({
  vendor,
  deliveryType
}: {
  vendor: Vendors;
  deliveryType: keyof DeliveryTypes;
}) {
  return (
    <Accordion heading="Delivery and Returns">
      <div className="flex flex-col gap-2">
        <div className="py-2">
          <h3 className="font-medium">Delivery</h3>
          <p>{DELIVERY_OPTIONS[vendor][deliveryType]}</p>
          <p>
            For more information see our{' '}
            <Link href="/delivery" className="underline">
              Delivery page.
            </Link>
          </p>
        </div>
        <div>
          <h3 className="font-medium">Returns</h3>
          <p>
            For more information see our{' '}
            <Link href="/returns" className="underline">
              Returns page.
            </Link>
          </p>
        </div>
      </div>
    </Accordion>
  );
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product?.featuredImage?.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <section className="-mt-[50px] md:mt-0 md:grid md:grid-cols-2">
        <div className="flex flex-col border-black md:border-r">
          <Gallery images={product.images.map(({ url, altText }) => ({ src: url, altText }))} />
        </div>
        <div className="relative">
          <div className="sticky top-0 flex h-screen min-h-screen flex-col gap-4 overflow-auto p-3">
            <div className="flex flex-wrap justify-between gap-2 md:items-start md:gap-4">
              <h1 className="font-serif text-lg md:text-3xl">{product.title}</h1>
              {/* TODO: have price update depeding on variant select. Can get variant from URL. */}
              <div className="flex items-end gap-1">
                <span className="text-xs leading-none opacity-80">
                  {product.variants.length > 1 && 'from'}
                </span>
                <Price
                  amount={product.priceRange.minVariantPrice.amount}
                  currencyCode={product.priceRange.minVariantPrice.currencyCode}
                  className="leading-none"
                />
              </div>
            </div>
            <VariantSelector options={product.options} variants={product.variants} />
            {product.descriptionHtml ? <Prose className="" html={product.descriptionHtml} /> : null}
            <div>
              <DeliverySection
                vendor={product.vendor as Vendors}
                deliveryType={product.metafield.value as keyof DeliveryTypes}
              />
              <Accordion heading="Warranty">
                <p className="py-2">
                  All products have a two year mechanical parts replacement warranty, (subject to
                  fair use).
                </p>
              </Accordion>
            </div>
            <AddToCart
              variants={product.variants}
              availableForSale={product.availableForSale}
              className={clsx({ 'sticky bottom-12': product.availableForSale })}
            />
          </div>
        </div>
      </section>
      <Suspense>
        <RelatedProducts id={product.id} />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <div className="mb-4 px-3 font-serif text-3xl">Related Products</div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-4">
        {relatedProducts.map((product) => (
          <li
            className="relative overflow-hidden outline outline-1 outline-black transition-opacity"
            key={`related-${product.id}`}
          >
            <Link className="block h-full w-full" href={`/product/${product.handle}`}>
              <GridTileImage
                alt={product.title}
                labels={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode
                }}
                src={product.featuredImage?.url}
                width={600}
                height={600}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
