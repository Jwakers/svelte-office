import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import clsx from 'clsx';
import { AddToCart } from 'components/cart/add-to-cart';
import Accordion from 'components/product/accordion';
import { Gallery } from 'components/product/gallery';
import ProductTile from 'components/product/product-tile';
import { ReviewStars } from 'components/product/review-stars';
import { SizeVariants } from 'components/product/size-variants';
import { VariantSelector } from 'components/product/variant-selector';
import Prose from 'components/prose';
import ReadMore from 'components/read-more';
import { ROUTES, SHOPIFY_TAGS, UNIT_MAP, WARRANTY } from 'lib/constants';
import {
  getGenericFile,
  getProductByHandle,
  getProductById,
  getProductRecommendations,
  getProducts
} from 'lib/shopify';
import { Metafield, Product } from 'lib/shopify/types';
import { getPublicBaseUrl } from 'lib/utils';
import { getReviews } from 'lib/yotpo';
import Link from 'next/link';
import Script from 'next/script';
import { Suspense } from 'react';
import { Download } from 'react-feather';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);

  if (!product) notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(SHOPIFY_TAGS.hide);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: {
      images: [
        {
          url,
          width,
          height,
          alt
        }
      ],
      description: product.seo.description || product.description
    }
  };
}

export async function generateStaticParams() {
  const products = await getProducts({});
  const handles = products.map((product) => ({ handle: product.handle }));

  return handles;
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProductByHandle(params.handle);

  if (!product) notFound();

  const specification = [product.width, product.depth, product.height, product.weight].filter(
    (spec): spec is Metafield => !!spec
  );

  const sizeVariantIds: string[] | undefined = product.sizeReferences?.value
    ? (() => {
        try {
          return JSON.parse(product.sizeReferences.value);
        } catch (error) {
          console.error('Failed to parse sizeReferences.value:', error);
          return null;
        }
      })()
    : null;

  const sizeVariants = sizeVariantIds
    ? await Promise.all(sizeVariantIds.map((id) => getProductById(id))).then((products) =>
        products.filter((product): product is Product => !!product)
      )
    : null;

  let specSheet: string | undefined;
  if (product.specificationSheet)
    specSheet = await getGenericFile(product.specificationSheet.value);

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

  // Redirect to first size variant if the product is tagged with canonical-parent
  if (product.tags.includes(SHOPIFY_TAGS.canonicalParent) && sizeVariants?.length) {
    const firstSizeVariant = sizeVariants[0];
    if (firstSizeVariant) {
      return redirect(`/${ROUTES.products}/${firstSizeVariant.handle}`);
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <section className="animate-fadeIn border-b md:grid md:grid-cols-2">
        <div className="relative flex flex-col md:border-r">
          <Gallery images={product.images} variants={product.variants} />
        </div>
        <div className="flex flex-col gap-4 p-3">
          <div className="flex flex-col">
            <div className="flex items-start justify-between">
              <h1 className="font-serif text-2xl md:text-3xl">{product.title}</h1>
              <ReviewsHead productId={product.id} />
            </div>

            <VariantSelector options={product.options} variants={product.variants}>
              {sizeVariants?.length ? <SizeVariants products={sizeVariants} /> : null}
            </VariantSelector>
          </div>
          {product.descriptionHtml ? (
            <ReadMore>
              <Prose className="" html={product.descriptionHtml} />
            </ReadMore>
          ) : null}
          <div>
            {specification.length || specSheet ? (
              <Accordion heading="Specification">
                {specification.length && (
                  <table className="py-2">
                    <tbody>
                      {specification.map((spec) => {
                        if (!spec) return null;
                        const value = JSON.parse(spec.value);
                        return (
                          <tr className="border-b border-brand/20" key={spec.key}>
                            <td className="py-2 capitalize">{spec.key}</td>
                            <td>
                              {value.value} {UNIT_MAP[value.unit as keyof typeof UNIT_MAP] || ''}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
                {specSheet ? (
                  <a
                    className="button mb-4 mt-2 flex items-center justify-center gap-2"
                    href={specSheet}
                    target="_black"
                  >
                    <span>Download full specification</span>
                    <Download width={18} />
                  </a>
                ) : null}
              </Accordion>
            ) : null}

            <DeliverySection />
            <Accordion heading="Warranty">
              <p className="py-2">{WARRANTY[product.vendor]}</p>
            </Accordion>
          </div>
          <AddToCart
            variants={product.variants}
            availableForSale={product.availableForSale}
            product={product}
            className={clsx({ 'sticky bottom-14 md:bottom-4': product.availableForSale })}
          />
        </div>
      </section>
      <ReviewSection product={product} />
      <Suspense>
        <RelatedProducts id={product.id} />
      </Suspense>
    </>
  );
}

function DeliverySection() {
  return (
    <Accordion heading="Delivery and Returns">
      <div className="flex flex-col gap-2">
        <div className="py-2">
          <h3 className="font-medium">Delivery</h3>
          <p>
            If this order is placed before 1pm it will be dispatched for next working day delivery.
            For more information see our{' '}
            <Link href="/delivery" className="underline">
              delivery details page.
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

async function ReviewsHead({ productId }: { productId: string }) {
  const id = productId.split('/').at(-1);
  if (!id) return;

  const {
    response: {
      bottomline: { average_score }
    }
  } = await getReviews(id);

  if (average_score <= 3) return null;

  return (
    <a className="group relative block" href="#reviews" title="Go to reviews">
      <ReviewStars productId={productId} />
      <div className="absolute bottom-0 right-0 hidden translate-y-full pt-1 text-sm text-secondary group-hover:block group-hover:text-brand group-hover:underline">
        Go to reviews
      </div>
    </a>
  );
}

function ReviewSection({ product }: { product: Product }) {
  const productId = product.id.split('/').at(-1);
  const yotpoId = process.env.YOTPO_STORE_ID;

  if (!productId || !yotpoId) {
    console.error(`Cannot render reviews for product ${product.id}`);
    return null;
  }

  return (
    <>
      <Script
        id="yotpo-widget"
        strategy="afterInteractive"
        src={`//staticw2.yotpo.com/${yotpoId}/widget.js`}
      />
      <div
        id="reviews"
        className="yotpo yotpo-main-widget scroll-smooth"
        data-product-id={productId}
        data-price={product.priceRange.minVariantPrice.amount}
        data-currency={product.priceRange.minVariantPrice.currencyCode}
        data-name={product.title}
        data-url={`${getPublicBaseUrl()}/${ROUTES.products}/${product.handle}`}
        data-image-url={product.images[0]?.url}
      ></div>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  const products = relatedProducts.slice(0, 4);

  return (
    <div className="py-8">
      <div className="mb-4 px-3 font-serif text-3xl">Related Products</div>
      <ul className="grid sm:grid-cols-2 md:grid-cols-4">
        {products.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </ul>
    </div>
  );
}
