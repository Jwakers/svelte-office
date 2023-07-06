import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AddToCart } from 'components/cart/add-to-cart';
import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import Price from 'components/price';
import { Gallery } from 'components/product/gallery';
import { VariantSelector } from 'components/product/variant-selector';
import Prose from 'components/prose';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
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
      <section className="md:grid md:grid-cols-2">
        <div className="flex flex-col border-black md:border-r">
          <Gallery images={product.images.map(({ url, altText }) => ({ src: url, altText }))} />
        </div>
        <div className="relative">
          <div className="sticky top-0 flex flex-col gap-4 p-3 pb-0">
            <div className="flex flex-wrap items-end justify-between gap-4">
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
            <AddToCart
              variants={product.variants}
              availableForSale={product.availableForSale}
              className="sticky bottom-12"
            />
          </div>
        </div>
      </section>
      <Suspense>
        <RelatedProducts id={product.id} />
        <Suspense>
          <Footer />
        </Suspense>
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
